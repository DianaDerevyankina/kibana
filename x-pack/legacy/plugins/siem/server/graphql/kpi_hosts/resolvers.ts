/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { SourceResolvers } from '../../graphql/types';
import { KpiHosts } from '../../lib/kpi_hosts';
import { createOptions } from '../../utils/build_query/create_options';

export interface KpiHostsResolversDeps {
  kpiHosts: KpiHosts;
}

export const createKpiHostsResolvers = (
  libs: KpiHostsResolversDeps
): {
  Source: {
    KpiHosts: SourceResolvers['KpiHosts'];
    KpiHostDetails: SourceResolvers['KpiHostDetails'];
  };
} => ({
  Source: {
    async KpiHosts(source, args, { req }, info) {
      const options = { ...createOptions(source, args, info) };
      return libs.kpiHosts.getKpiHosts(req, options);
    },
    async KpiHostDetails(source, args, { req }, info) {
      const options = { ...createOptions(source, args, info) };
      return libs.kpiHosts.getKpiHostDetails(req, options);
    },
  },
});
