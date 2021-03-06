/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { SavedObjectAttributes } from '../../../../../../../src/core/server';
import { createApmTelementry, storeApmServicesTelemetry } from '../index';
import {
  APM_SERVICES_TELEMETRY_SAVED_OBJECT_TYPE,
  APM_SERVICES_TELEMETRY_SAVED_OBJECT_ID
} from '../../../../common/apm_saved_object_constants';

describe('apm_telemetry', () => {
  describe('createApmTelementry', () => {
    it('should create a ApmTelemetry object with boolean flag and frequency map of the given list of AgentNames', () => {
      const apmTelemetry = createApmTelementry([
        'go',
        'nodejs',
        'go',
        'js-base'
      ]);
      expect(apmTelemetry.has_any_services).toBe(true);
      expect(apmTelemetry.services_per_agent).toMatchObject({
        go: 2,
        nodejs: 1,
        'js-base': 1
      });
    });
    it('should ignore undefined or unknown AgentName values', () => {
      const apmTelemetry = createApmTelementry([
        'go',
        'nodejs',
        'go',
        'js-base',
        'example-platform' as any,
        undefined as any
      ]);
      expect(apmTelemetry.services_per_agent).toMatchObject({
        go: 2,
        nodejs: 1,
        'js-base': 1
      });
    });
  });

  describe('storeApmServicesTelemetry', () => {
    let apmTelemetry: SavedObjectAttributes;
    let savedObjectsClient: any;

    beforeEach(() => {
      apmTelemetry = {
        has_any_services: true,
        services_per_agent: {
          go: 2,
          nodejs: 1,
          'js-base': 1
        }
      };
      savedObjectsClient = { create: jest.fn() };
    });

    it('should call savedObjectsClient create with the given ApmTelemetry object', () => {
      storeApmServicesTelemetry(savedObjectsClient, apmTelemetry);
      expect(savedObjectsClient.create.mock.calls[0][1]).toBe(apmTelemetry);
    });

    it('should call savedObjectsClient create with the apm-telemetry document type and ID', () => {
      storeApmServicesTelemetry(savedObjectsClient, apmTelemetry);
      expect(savedObjectsClient.create.mock.calls[0][0]).toBe(
        APM_SERVICES_TELEMETRY_SAVED_OBJECT_TYPE
      );
      expect(savedObjectsClient.create.mock.calls[0][2].id).toBe(
        APM_SERVICES_TELEMETRY_SAVED_OBJECT_ID
      );
    });

    it('should call savedObjectsClient create with overwrite: true', () => {
      storeApmServicesTelemetry(savedObjectsClient, apmTelemetry);
      expect(savedObjectsClient.create.mock.calls[0][2].overwrite).toBe(true);
    });
  });
});
