/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { mockCoreContext } from '../../core_context.mock';
import { httpServiceMock } from '../../http/http_service.mock';
import { pluginServiceMock } from '../../plugins/plugins_service.mock';
import { legacyServiceMock } from '../../legacy/legacy_service.mock';

const context = mockCoreContext.create();
const http = httpServiceMock.createSetupContract();
const plugins = pluginServiceMock.createSetupContract();
const legacyPlugins = legacyServiceMock.createDiscoverPlugins();

export const mockRenderingServiceParams = context;
export const mockRenderingSetupDeps = {
  http,
  legacyPlugins,
  plugins,
};
