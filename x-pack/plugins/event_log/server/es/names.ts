/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import xPackage from '../../../../package.json';

const EVENT_LOG_NAME_SUFFIX = `-event-log`;
const EVENT_LOG_VERSION_SUFFIX = `-${xPackage.version}`;

export interface EsNames {
  base: string;
  alias: string;
  ilmPolicy: string;
  indexPattern: string;
  indexPatternWithVersion: string;
  initialIndex: string;
  indexTemplate: string;
}

export function getEsNames(baseName: string): EsNames {
  const eventLogName = `${baseName}${EVENT_LOG_NAME_SUFFIX}`;
  const eventLogNameWithVersion = `${eventLogName}${EVENT_LOG_VERSION_SUFFIX}`;
  return {
    base: baseName,
    alias: eventLogNameWithVersion,
    ilmPolicy: `${eventLogName}-policy`,
    indexPattern: `${eventLogName}-*`,
    indexPatternWithVersion: `${eventLogNameWithVersion}-*`,
    initialIndex: `${eventLogNameWithVersion}-000001`,
    indexTemplate: `${eventLogNameWithVersion}-template`,
  };
}
