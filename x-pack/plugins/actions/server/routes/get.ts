/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { schema, TypeOf } from '@kbn/config-schema';
import {
  IRouter,
  RequestHandlerContext,
  KibanaRequest,
  IKibanaResponse,
  KibanaResponseFactory,
} from 'kibana/server';
import { LicenseState } from '../lib/license_state';
import { verifyApiAccess } from '../lib/license_api_access';

const paramSchema = schema.object({
  id: schema.string(),
});

export const getActionRoute = (router: IRouter, licenseState: LicenseState) => {
  router.get(
    {
      path: `/api/action/{id}`,
      validate: {
        params: paramSchema,
      },
      options: {
        tags: ['access:actions-read'],
      },
    },
    router.handleLegacyErrors(async function(
      context: RequestHandlerContext,
      req: KibanaRequest<TypeOf<typeof paramSchema>, any, any, any>,
      res: KibanaResponseFactory
    ): Promise<IKibanaResponse<any>> {
      verifyApiAccess(licenseState);
      const actionsClient = context.actions.getActionsClient();
      const { id } = req.params;
      return res.ok({
        body: await actionsClient.get({ id }),
      });
    })
  );
};
