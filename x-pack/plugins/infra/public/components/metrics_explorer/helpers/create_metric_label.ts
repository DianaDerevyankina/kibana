/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { MetricsExplorerMetric } from '../../../../common/http_api/metrics_explorer';

export const createMetricLabel = (metric: MetricsExplorerMetric) => {
  return `${metric.aggregation}(${metric.field || ''})`;
};
