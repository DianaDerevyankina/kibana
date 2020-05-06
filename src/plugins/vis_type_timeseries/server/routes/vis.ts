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

import { IRouter, KibanaRequest } from 'kibana/server';
import { getVisData, GetVisDataOptions } from '../lib/get_vis_data';
import { visPayloadSchema } from './post_vis_schema';
import { Framework } from '../index';

export const visDataRoutes = (router: IRouter, framework: Framework) => {
  router.post(
    {
      path: '/api/metrics/vis/data',
      validate: {
        body: visPayloadSchema,
      },
    },
    async (requestContext, request, response) => {
      try {
        const results = await getVisData(
          requestContext,
          request as KibanaRequest<{}, {}, GetVisDataOptions>,
          framework
        );
        return response.ok({ body: results });
      } catch (error) {
        return response.internalError({
          body: error.message,
        });
      }
    }
  );
};
