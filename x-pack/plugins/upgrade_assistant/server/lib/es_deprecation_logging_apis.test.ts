/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */
import { elasticsearchServiceMock } from 'src/core/server/mocks';
import {
  getDeprecationLoggingStatus,
  isDeprecationLoggingEnabled,
  setDeprecationLogging,
} from './es_deprecation_logging_apis';

describe('getDeprecationLoggingStatus', () => {
  it('calls cluster.getSettings', async () => {
    const dataClient = elasticsearchServiceMock.createScopedClusterClient();
    await getDeprecationLoggingStatus(dataClient);
    expect(dataClient.callAsCurrentUser).toHaveBeenCalledWith('cluster.getSettings', {
      includeDefaults: true,
    });
  });
});

describe('setDeprecationLogging', () => {
  describe('isEnabled = true', () => {
    it('calls cluster.putSettings with logger.deprecation = WARN', async () => {
      const dataClient = elasticsearchServiceMock.createScopedClusterClient();
      await setDeprecationLogging(dataClient, true);
      expect(dataClient.callAsCurrentUser).toHaveBeenCalledWith('cluster.putSettings', {
        body: { transient: { 'logger.deprecation': 'WARN' } },
      });
    });
  });

  describe('isEnabled = false', () => {
    it('calls cluster.putSettings with logger.deprecation = ERROR', async () => {
      const dataClient = elasticsearchServiceMock.createScopedClusterClient();
      await setDeprecationLogging(dataClient, false);
      expect(dataClient.callAsCurrentUser).toHaveBeenCalledWith('cluster.putSettings', {
        body: { transient: { 'logger.deprecation': 'ERROR' } },
      });
    });
  });
});

describe('isDeprecationLoggingEnabled', () => {
  ['default', 'persistent', 'transient'].forEach(tier => {
    ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ALL'].forEach(level => {
      it(`returns true when ${tier} is set to ${level}`, () => {
        expect(isDeprecationLoggingEnabled({ [tier]: { logger: { deprecation: level } } })).toBe(
          true
        );
      });
    });
  });

  ['default', 'persistent', 'transient'].forEach(tier => {
    ['ERROR', 'FATAL'].forEach(level => {
      it(`returns false when ${tier} is set to ${level}`, () => {
        expect(isDeprecationLoggingEnabled({ [tier]: { logger: { deprecation: level } } })).toBe(
          false
        );
      });
    });
  });

  it('allows transient to override persistent and default', () => {
    expect(
      isDeprecationLoggingEnabled({
        default: { logger: { deprecation: 'FATAL' } },
        persistent: { logger: { deprecation: 'FATAL' } },
        transient: { logger: { deprecation: 'WARN' } },
      })
    ).toBe(true);
  });

  it('allows persistent to override default', () => {
    expect(
      isDeprecationLoggingEnabled({
        default: { logger: { deprecation: 'FATAL' } },
        persistent: { logger: { deprecation: 'WARN' } },
      })
    ).toBe(true);
  });
});
