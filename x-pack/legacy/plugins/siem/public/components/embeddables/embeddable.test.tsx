/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { shallow } from 'enzyme';
import React from 'react';

import { Embeddable } from './embeddable';

describe('Embeddable', () => {
  test('it renders', () => {
    const wrapper = shallow(
      <Embeddable>
        <p>{'Test content'}</p>
      </Embeddable>
    );

    expect(wrapper).toMatchSnapshot();
  });
});
