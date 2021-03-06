/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import styled from 'styled-components';

import { HeaderPage } from '../../components/header_page';
import { StatefulOpenTimeline } from '../../components/open_timeline';
import { WrapperPage } from '../../components/wrapper_page';
import { SpyRoute } from '../../utils/route/spy_routes';
import * as i18n from './translations';

const TimelinesContainer = styled.div`
  width: 100%;
`;
TimelinesContainer.displayName = 'TimelinesContainer';

export const DEFAULT_SEARCH_RESULTS_PER_PAGE = 10;

export const TimelinesPage = () => (
  <>
    <WrapperPage>
      <HeaderPage border title={i18n.PAGE_TITLE} />

      <TimelinesContainer>
        <StatefulOpenTimeline
          defaultPageSize={DEFAULT_SEARCH_RESULTS_PER_PAGE}
          isModal={false}
          title={i18n.ALL_TIMELINES_PANEL_TITLE}
        />
      </TimelinesContainer>
    </WrapperPage>

    <SpyRoute />
  </>
);

TimelinesPage.displayName = 'TimelinesPage';

export const Timelines = React.memo(TimelinesPage);
