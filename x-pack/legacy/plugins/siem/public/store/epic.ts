/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { combineEpics } from 'redux-observable';
import { createTimelineEpic } from './timeline/epic';
import { createTimelineFavoriteEpic } from './timeline/epic_favorite';
import { createTimelineNoteEpic } from './timeline/epic_note';
import { createTimelinePinnedEventEpic } from './timeline/epic_pinned_event';

export const createRootEpic = <State>() =>
  combineEpics(
    createTimelineEpic<State>(),
    createTimelineFavoriteEpic<State>(),
    createTimelineNoteEpic<State>(),
    createTimelinePinnedEventEpic<State>()
  );
