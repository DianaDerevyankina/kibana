/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { SourceStatusResolvers } from '../../graphql/types';
import { IndexFields } from '../../lib/index_fields';
import { SourceStatus } from '../../lib/source_status';

export const createSourceStatusResolvers = (libs: {
  sourceStatus: SourceStatus;
  fields: IndexFields;
}): {
  SourceStatus: {
    indicesExist: SourceStatusResolvers['indicesExist'];
    indexFields: SourceStatusResolvers['indexFields'];
  };
} => ({
  SourceStatus: {
    async indicesExist(source, args, { req }) {
      if (
        args.defaultIndex.length === 1 &&
        (args.defaultIndex[0] === '' || args.defaultIndex[0] === '_all')
      ) {
        return false;
      }
      return libs.sourceStatus.hasIndices(req, args.defaultIndex);
    },
    async indexFields(source, args, { req }) {
      if (
        args.defaultIndex.length === 1 &&
        (args.defaultIndex[0] === '' || args.defaultIndex[0] === '_all')
      ) {
        return [];
      }
      return libs.fields.getFields(req, args.defaultIndex);
    },
  },
});
