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

import { PluginInitializerContext } from '../../../core/public';
import { UiActionsPlugin } from './plugin';
import { UiActionsService } from './service';

export function plugin(initializerContext: PluginInitializerContext) {
  return new UiActionsPlugin(initializerContext);
}

export { UiActionsSetup, UiActionsStart } from './plugin';
export { UiActionsServiceParams, UiActionsService } from './service';
export { Action, createAction, IncompatibleActionError } from './actions';
export { buildContextMenuForActions } from './context_menu';
export { Trigger, TriggerContext } from './triggers';
export { TriggerContextMapping } from './types';

/**
 * @deprecated
 *
 * Use `UiActionsStart['getTriggerCompatibleActions']` or
 * `UiActionsService['getTriggerCompatibleActions']` instead.
 */
export type GetActionsCompatibleWithTrigger = UiActionsService['getTriggerCompatibleActions'];

/**
 * @deprecated
 *
 * Use `UiActionsStart['executeTriggerActions']` or
 * `UiActionsService['executeTriggerActions']` instead.
 */
export type ExecuteTriggerActions = UiActionsService['executeTriggerActions'];
