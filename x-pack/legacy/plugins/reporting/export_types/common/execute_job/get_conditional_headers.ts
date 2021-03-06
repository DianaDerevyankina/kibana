/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { ConditionalHeaders, ServerFacade } from '../../../types';

export const getConditionalHeaders = <JobDocPayloadType>({
  server,
  job,
  filteredHeaders,
}: {
  server: ServerFacade;
  job: JobDocPayloadType;
  filteredHeaders: Record<string, string>;
}) => {
  const config = server.config();
  const [hostname, port, basePath, protocol] = [
    config.get('xpack.reporting.kibanaServer.hostname') || config.get('server.host'),
    config.get('xpack.reporting.kibanaServer.port') || config.get('server.port'),
    config.get('server.basePath'),
    config.get('xpack.reporting.kibanaServer.protocol') || server.info.protocol,
  ] as [string, number, string, string];

  const conditionalHeaders: ConditionalHeaders = {
    headers: filteredHeaders,
    conditions: {
      hostname: hostname.toLowerCase(),
      port,
      basePath,
      protocol,
    },
  };

  return conditionalHeaders;
};
