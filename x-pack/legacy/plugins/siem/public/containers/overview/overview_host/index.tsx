/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { getOr } from 'lodash/fp';
import React from 'react';
import { connect, ConnectedProps } from 'react-redux';

import { DEFAULT_INDEX_KEY } from '../../../../common/constants';
import { GetOverviewHostQueryComponent, OverviewHostData } from '../../../graphql/types';
import { useUiSetting } from '../../../lib/kibana';
import { inputsModel, inputsSelectors } from '../../../store/inputs';
import { State } from '../../../store';
import { createFilter, getDefaultFetchPolicy } from '../../helpers';
import { QueryTemplateProps } from '../../query_template';

export const ID = 'overviewHostQuery';

export interface OverviewHostArgs {
  id: string;
  inspect: inputsModel.InspectQuery;
  loading: boolean;
  overviewHost: OverviewHostData;
  refetch: inputsModel.Refetch;
}

export interface OverviewHostProps extends QueryTemplateProps {
  children: (args: OverviewHostArgs) => React.ReactElement;
  sourceId: string;
  endDate: number;
  startDate: number;
}

const OverviewHostComponentQuery = React.memo<OverviewHostProps & PropsFromRedux>(
  ({ id = ID, children, filterQuery, isInspected, sourceId, startDate, endDate }) => (
    <GetOverviewHostQueryComponent
      fetchPolicy={getDefaultFetchPolicy()}
      variables={{
        sourceId,
        timerange: {
          interval: '12h',
          from: startDate,
          to: endDate,
        },
        filterQuery: createFilter(filterQuery),
        defaultIndex: useUiSetting<string[]>(DEFAULT_INDEX_KEY),
        inspect: isInspected,
      }}
    >
      {({ data, loading, refetch }) => {
        const overviewHost = getOr({}, `source.OverviewHost`, data);
        return children({
          id,
          inspect: getOr(null, 'source.OverviewHost.inspect', data),
          overviewHost,
          loading,
          refetch,
        });
      }}
    </GetOverviewHostQueryComponent>
  )
);

OverviewHostComponentQuery.displayName = 'OverviewHostComponentQuery';

const makeMapStateToProps = () => {
  const getQuery = inputsSelectors.globalQueryByIdSelector();
  const mapStateToProps = (state: State, { id = ID }: OverviewHostProps) => {
    const { isInspected } = getQuery(state, id);
    return {
      isInspected,
    };
  };
  return mapStateToProps;
};

const connector = connect(makeMapStateToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const OverviewHostQuery = connector(OverviewHostComponentQuery);
