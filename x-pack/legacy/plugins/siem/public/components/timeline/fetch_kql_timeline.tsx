/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { memo, useEffect } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { IIndexPattern } from 'src/plugins/data/public';
import deepEqual from 'fast-deep-equal';

import { timelineSelectors, State } from '../../store';
import { inputsActions } from '../../store/actions';
import { InputsModelId } from '../../store/inputs/constants';
import { useUpdateKql } from '../../utils/kql/use_update_kql';

export interface TimelineKqlFetchProps {
  id: string;
  indexPattern: IIndexPattern;
  inputId: InputsModelId;
}

type OwnProps = TimelineKqlFetchProps & PropsFromRedux;

const TimelineKqlFetchComponent = memo<OwnProps>(
  ({ id, indexPattern, inputId, kueryFilterQuery, kueryFilterQueryDraft, setTimelineQuery }) => {
    useEffect(() => {
      setTimelineQuery({
        id: 'kql',
        inputId,
        inspect: null,
        loading: false,
        refetch: useUpdateKql({
          indexPattern,
          kueryFilterQuery,
          kueryFilterQueryDraft,
          storeType: 'timelineType',
          timelineId: id,
        }),
      });
    }, [kueryFilterQueryDraft, kueryFilterQuery, id]);
    return null;
  },
  (prevProps, nextProps) =>
    prevProps.id === nextProps.id &&
    deepEqual(prevProps.indexPattern, nextProps.indexPattern) &&
    prevProps.inputId === nextProps.inputId &&
    prevProps.kueryFilterQuery === nextProps.kueryFilterQuery &&
    prevProps.kueryFilterQueryDraft === nextProps.kueryFilterQueryDraft &&
    prevProps.setTimelineQuery === nextProps.setTimelineQuery
);

const makeMapStateToProps = () => {
  const getTimelineKueryFilterQueryDraft = timelineSelectors.getKqlFilterQueryDraftSelector();
  const getTimelineKueryFilterQuery = timelineSelectors.getKqlFilterKuerySelector();
  const mapStateToProps = (state: State, { id }: TimelineKqlFetchProps) => {
    return {
      kueryFilterQuery: getTimelineKueryFilterQuery(state, id),
      kueryFilterQueryDraft: getTimelineKueryFilterQueryDraft(state, id),
    };
  };
  return mapStateToProps;
};

const mapDispatchToProps = {
  setTimelineQuery: inputsActions.setQuery,
};

const connector = connect(makeMapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;

export const TimelineKqlFetch = connector(TimelineKqlFetchComponent);
