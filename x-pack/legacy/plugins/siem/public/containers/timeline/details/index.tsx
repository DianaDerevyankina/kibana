/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { getOr } from 'lodash/fp';
import memoizeOne from 'memoize-one';
import React from 'react';

import { DEFAULT_INDEX_KEY } from '../../../../common/constants';
import {
  DetailItem,
  GetTimelineDetailsQuery,
  GetTimelineDetailsQueryComponent,
} from '../../../graphql/types';
import { useUiSetting } from '../../../lib/kibana';

export interface EventsArgs {
  detailsData: DetailItem[] | null;
  loading: boolean;
}

export interface TimelineDetailsProps {
  children?: (args: EventsArgs) => React.ReactElement;
  indexName: string;
  eventId: string;
  executeQuery: boolean;
  sourceId: string;
}

const getDetailsEvent = memoizeOne(
  (variables: string, detail: DetailItem[]): DetailItem[] => detail
);

const TimelineDetailsQueryComponent: React.FC<TimelineDetailsProps> = ({
  children,
  indexName,
  eventId,
  executeQuery,
  sourceId,
}) => {
  const variables: GetTimelineDetailsQuery.Variables = {
    sourceId,
    indexName,
    eventId,
    defaultIndex: useUiSetting<string[]>(DEFAULT_INDEX_KEY),
  };
  return executeQuery ? (
    <GetTimelineDetailsQueryComponent
      fetchPolicy="network-only"
      notifyOnNetworkStatusChange
      variables={variables}
    >
      {({ data, loading, refetch }) =>
        children!({
          loading,
          detailsData: getDetailsEvent(
            JSON.stringify(variables),
            getOr([], 'source.TimelineDetails.data', data)
          ),
        })
      }
    </GetTimelineDetailsQueryComponent>
  ) : (
    children!({ loading: false, detailsData: null })
  );
};

export const TimelineDetailsQuery = React.memo(TimelineDetailsQueryComponent);
