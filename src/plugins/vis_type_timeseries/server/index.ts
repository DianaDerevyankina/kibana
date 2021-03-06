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

import { schema, TypeOf } from '@kbn/config-schema';
import { PluginInitializerContext } from 'src/core/server';
import { VisTypeTimeseriesPlugin } from './plugin';
export { VisTypeTimeseriesSetup, Framework } from './plugin';

export const config = {
  schema: schema.object({
    enabled: schema.boolean({ defaultValue: true }),
  }),
};

export type VisTypeTimeseriesConfig = TypeOf<typeof config.schema>;

export { ValidationTelemetryServiceSetup } from './validation_telemetry';

// @ts-ignore
export { AbstractSearchStrategy } from './lib/search_strategies/strategies/abstract_search_strategy';
// @ts-ignore
export { AbstractSearchRequest } from './lib/search_strategies/search_requests/abstract_request';
// @ts-ignore
export { DefaultSearchCapabilities } from './lib/search_strategies/default_search_capabilities';

export function plugin(initializerContext: PluginInitializerContext) {
  return new VisTypeTimeseriesPlugin(initializerContext);
}
