/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { SearchResponse } from 'elasticsearch';
import { IScopedClusterClient } from 'kibana/server';
import { JsonObject } from '../../../../../../../src/plugins/kibana_utils/public';
import { esKuery, esQuery } from '../../../../../../../src/plugins/data/server';
import { AlertEvent, Direction, EndpointAppConstants } from '../../../../common/types';
import {
  AlertSearchQuery,
  AlertSearchRequest,
  AlertSearchRequestWrapper,
  AlertSort,
} from '../types';

export { Pagination } from './pagination';

function reverseSortDirection(order: Direction): Direction {
  if (order === Direction.asc) {
    return Direction.desc;
  }
  return Direction.asc;
}

function buildQuery(query: AlertSearchQuery): JsonObject {
  const queries: JsonObject[] = [];

  // only alerts
  queries.push({
    term: {
      'event.kind': {
        value: 'alert',
      },
    },
  });

  if (query.filters !== undefined && query.filters.length > 0) {
    const filtersQuery = esQuery.buildQueryFromFilters(query.filters, undefined);
    queries.push((filtersQuery.filter as unknown) as JsonObject);
  }

  if (query.query) {
    queries.push(esKuery.toElasticsearchQuery(esKuery.fromKueryExpression(query.query)));
  }

  if (query.dateRange) {
    const dateRangeFilter: JsonObject = {
      range: {
        ['@timestamp']: {
          gte: query.dateRange.from,
          lte: query.dateRange.to,
        },
      },
    };

    queries.push(dateRangeFilter);
  }

  // Optimize
  if (queries.length > 1) {
    return {
      bool: {
        must: queries,
      },
    };
  } else if (queries.length === 1) {
    return queries[0];
  }

  return {
    match_all: {},
  };
}

function buildSort(query: AlertSearchQuery): AlertSort {
  const sort: AlertSort = [
    // User-defined primary sort, with default to `@timestamp`
    {
      [query.sort]: {
        order: query.order,
      },
    },
    // Secondary sort for tie-breaking
    {
      'event.id': {
        order: query.order,
      },
    },
  ];

  if (query.searchBefore) {
    // Reverse sort order for search_before functionality
    const newDirection = reverseSortDirection(query.order);
    sort[0][query.sort].order = newDirection;
    sort[1]['event.id'].order = newDirection;
  }

  return sort;
}

/**
 * Builds a request body for Elasticsearch, given a set of query params.
 **/
const buildAlertSearchQuery = async (
  query: AlertSearchQuery
): Promise<AlertSearchRequestWrapper> => {
  let totalHitsMin: number = EndpointAppConstants.DEFAULT_TOTAL_HITS;

  // Calculate minimum total hits set to indicate there's a next page
  if (query.fromIndex) {
    totalHitsMin = Math.max(
      query.fromIndex + query.pageSize * 2,
      EndpointAppConstants.DEFAULT_TOTAL_HITS
    );
  }

  const reqBody: AlertSearchRequest = {
    track_total_hits: totalHitsMin,
    query: buildQuery(query),
    sort: buildSort(query),
  };

  if (query.searchAfter) {
    reqBody.search_after = query.searchAfter;
  }

  if (query.searchBefore) {
    reqBody.search_after = query.searchBefore;
  }

  const reqWrapper: AlertSearchRequestWrapper = {
    size: query.pageSize,
    index: EndpointAppConstants.ALERT_INDEX_NAME,
    body: reqBody,
  };

  if (query.fromIndex) {
    reqWrapper.from = query.fromIndex;
  }

  return reqWrapper;
};

/**
 * Makes a request to Elasticsearch, given an `AlertSearchRequestWrapper`.
 **/
export const searchESForAlerts = async (
  dataClient: IScopedClusterClient,
  query: AlertSearchQuery
): Promise<SearchResponse<AlertEvent>> => {
  const reqWrapper = await buildAlertSearchQuery(query);
  const response = (await dataClient.callAsCurrentUser('search', reqWrapper)) as SearchResponse<
    AlertEvent
  >;

  if (query.searchBefore !== undefined) {
    // Reverse the hits when using `search_before`.
    response.hits.hits.reverse();
  }

  return response;
};
