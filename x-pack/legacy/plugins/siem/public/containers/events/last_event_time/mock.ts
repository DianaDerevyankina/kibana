/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { MockedResponse } from '@apollo/client/testing';

import { defaultIndexPattern } from '../../../../default_index_pattern';
import { LastEventIndexKey } from '../../../graphql/types';

import { LastEventTimeGqlQuery } from './last_event_time.gql_query';

interface MockLastEventTimeQuery extends MockedResponse {
  result: {
    data?: {
      source: {
        id: string;
        LastEventTime: {
          lastSeen: string | null;
          errorMessage: string | null;
        };
      };
    };
  };
}

const getTimeTwelveMinutesAgo = () => {
  const d = new Date();
  const ts = d.getTime();
  const twelveMinutes = ts - 12 * 60 * 1000;
  return new Date(twelveMinutes).toISOString();
};

export const mockLastEventTimeQuery: MockLastEventTimeQuery[] = [
  {
    request: {
      query: LastEventTimeGqlQuery,
      variables: {
        sourceId: 'default',
        indexKey: LastEventIndexKey.hosts,
        details: {},
        defaultIndex: defaultIndexPattern,
      },
    },
    result: {
      data: {
        source: {
          id: 'default',
          LastEventTime: {
            lastSeen: getTimeTwelveMinutesAgo(),
            errorMessage: null,
          },
        },
      },
    },
  },
];
