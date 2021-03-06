/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import './styles/_index.scss';
import { PluginInitializerContext } from 'src/core/public';
import { SearchProfilerUIPlugin } from './plugin';

export function plugin(ctx: PluginInitializerContext) {
  return new SearchProfilerUIPlugin(ctx);
}
