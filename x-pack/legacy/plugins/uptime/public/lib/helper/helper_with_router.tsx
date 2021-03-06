/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React, { ReactElement } from 'react';

import { Router } from 'react-router-dom';
import { MemoryHistory } from 'history/createMemoryHistory';
import { createMemoryHistory } from 'history';
import { mountWithIntl, renderWithIntl, shallowWithIntl } from 'test_utils/enzyme_helpers';

const helperWithRouter: <R>(
  helper: (node: ReactElement) => R,
  component: ReactElement,
  customHistory?: MemoryHistory
) => R = (helper, component, customHistory) => {
  if (customHistory) {
    customHistory.location.key = 'TestKeyForTesting';
    return helper(<Router history={customHistory}>{component}</Router>);
  }
  const history = createMemoryHistory();
  history.location.key = 'TestKeyForTesting';

  return helper(<Router history={history}>{component}</Router>);
};

export const renderWithRouter = (component: ReactElement, customHistory?: MemoryHistory) => {
  return helperWithRouter(renderWithIntl, component, customHistory);
};

export const shallowWithRouter = (component: ReactElement, customHistory?: MemoryHistory) => {
  return helperWithRouter(shallowWithIntl, component, customHistory);
};

export const mountWithRouter = (component: ReactElement, customHistory?: MemoryHistory) => {
  return helperWithRouter(mountWithIntl, component, customHistory);
};
