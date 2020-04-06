/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Legacy } from 'kibana';
import { PluginInitializerContext } from 'src/core/server';
import { SecurityPluginSetup } from '../../../../plugins/security/server';
import { ReportingPluginSpecOptions } from '../types';
import { buildConfig } from './config';
import { plugin } from './index';
import { LegacySetup, ReportingStartDeps } from './types';

const buildLegacyDependencies = (
  server: Legacy.Server,
  reportingPlugin: ReportingPluginSpecOptions
): LegacySetup => ({
  route: server.route.bind(server),
  config: server.config,
  plugins: {
    xpack_main: server.plugins.xpack_main,
    reporting: reportingPlugin,
  },
});

/*
 * Starts the New Platform instance of Reporting using legacy dependencies
 */
export const legacyInit = async (
  server: Legacy.Server,
  reportingLegacyPlugin: ReportingPluginSpecOptions
) => {
  const { core: coreSetup } = server.newPlatform.setup;
  const legacyConfig = server.config();
  const reportingConfig = buildConfig(coreSetup, server, legacyConfig.get('xpack.reporting'));

  const __LEGACY = buildLegacyDependencies(server, reportingLegacyPlugin);

  const pluginInstance = plugin(
    server.newPlatform.coreContext as PluginInitializerContext,
    reportingConfig
  );
  await pluginInstance.setup(coreSetup, {
    elasticsearch: coreSetup.elasticsearch,
    security: server.newPlatform.setup.plugins.security as SecurityPluginSetup,
    usageCollection: server.newPlatform.setup.plugins.usageCollection,
    __LEGACY,
  });

  // Schedule to call the "start" hook only after start dependencies are ready
  coreSetup.getStartServices().then(([core, plugins]) =>
    pluginInstance.start(core, {
      data: (plugins as ReportingStartDeps).data,
      __LEGACY,
    })
  );
};
