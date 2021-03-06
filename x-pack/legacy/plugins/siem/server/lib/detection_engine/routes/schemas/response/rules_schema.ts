/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

/* eslint-disable @typescript-eslint/camelcase */
import * as t from 'io-ts';
import { isObject } from 'lodash/fp';
import { Either } from 'fp-ts/lib/Either';

import { checkTypeDependents } from './check_type_dependents';
import {
  description,
  enabled,
  false_positives,
  from,
  id,
  immutable,
  index,
  interval,
  rule_id,
  language,
  name,
  output_index,
  max_signals,
  query,
  references,
  severity,
  updated_by,
  tags,
  to,
  risk_score,
  created_at,
  created_by,
  updated_at,
  saved_id,
  timeline_id,
  timeline_title,
  type,
  threat,
  job_status,
  status_date,
  last_success_at,
  last_success_message,
  last_failure_at,
  last_failure_message,
  version,
  filters,
  meta,
} from './schemas';

/**
 * This is the required fields for the rules schema response. Put all required properties on
 * this base for schemas such as create_rules, update_rules, for the correct validation of the
 * output schema.
 */
export const requiredRulesSchema = t.type({
  description,
  enabled,
  false_positives,
  from,
  id,
  immutable,
  interval,
  rule_id,
  language,
  output_index,
  max_signals,
  risk_score,
  name,
  query,
  references,
  severity,
  updated_by,
  tags,
  to,
  type,
  threat,
  created_at,
  updated_at,
  created_by,
  version,
});

export type RequiredRulesSchema = t.TypeOf<typeof requiredRulesSchema>;

/**
 * If you have type dependents or exclusive or situations add them here AND update the
 * check_type_dependents file for whichever REST flow it is going through.
 */
export const dependentRulesSchema = t.partial({
  // when type = saved_query, saved_is is required
  saved_id,

  // These two are required together or not at all.
  timeline_id,
  timeline_title,
});

/**
 * This is the partial or optional fields for the rules schema. Put all optional
 * properties on this. DO NOT PUT type dependents such as xor relationships here.
 * Instead use dependentRulesSchema and check_type_dependents for how to do those.
 */
export const partialRulesSchema = t.partial({
  status: job_status,
  status_date,
  last_success_at,
  last_success_message,
  last_failure_at,
  last_failure_message,
  filters,
  meta,
  index,
});

/**
 * This is the rules schema WITHOUT typeDependents. You don't normally want to use this for a decode
 */
export const rulesWithoutTypeDependentsSchema = t.intersection([
  t.exact(dependentRulesSchema),
  t.exact(partialRulesSchema),
  t.exact(requiredRulesSchema),
]);
export type RulesWithoutTypeDependentsSchema = t.TypeOf<typeof rulesWithoutTypeDependentsSchema>;

/**
 * This is the rulesSchema you want to use for checking type dependents and all the properties
 * through: rulesSchema.decode(someJSONObject)
 */
export const rulesSchema = new t.Type<
  RulesWithoutTypeDependentsSchema,
  RulesWithoutTypeDependentsSchema,
  unknown
>(
  'RulesSchema',
  (input: unknown): input is RulesWithoutTypeDependentsSchema => isObject(input),
  (input): Either<t.Errors, RulesWithoutTypeDependentsSchema> => {
    return checkTypeDependents(input);
  },
  t.identity
);

/**
 * This is the correct type you want to use for Rules that are outputted from the
 * REST interface. This has all base and all optional properties merged together.
 */
export type RulesSchema = t.TypeOf<typeof rulesSchema>;
