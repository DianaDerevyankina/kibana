/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from '@kbn/expect';
import { SuperTest } from 'supertest';
import { DEFAULT_SPACE_ID } from '../../../../plugins/spaces/common/constants';
import { getIdPrefix, getUrlPrefix } from '../lib/space_test_utils';
import { DescribeFn, TestDefinitionAuthentication } from '../lib/types';

interface ImportTest {
  statusCode: number;
  response: (resp: { [key: string]: any }) => void;
}

interface ImportTests {
  default: ImportTest;
  hiddenType: ImportTest;
  unknownType: ImportTest;
}

interface ImportTestDefinition {
  user?: TestDefinitionAuthentication;
  spaceId?: string;
  tests: ImportTests;
}

const createImportData = (spaceId: string) => [
  {
    type: 'dashboard',
    id: `${getIdPrefix(spaceId)}a01b2f57-fcfd-4864-b735-09e28f0d815e`,
    attributes: {
      title: 'A great new dashboard',
    },
  },
  {
    type: 'globaltype',
    id: '05976c65-1145-4858-bbf0-d225cc78a06e',
    attributes: {
      name: 'A new globaltype object',
    },
  },
];

export function importTestSuiteFactory(es: any, esArchiver: any, supertest: SuperTest<any>) {
  const createExpectResults = (spaceId = DEFAULT_SPACE_ID) => async (resp: {
    [key: string]: any;
  }) => {
    expect(resp.body).to.eql({
      success: true,
      successCount: 2,
    });
  };

  const expectResultsWithUnsupportedHiddenType = async (resp: { [key: string]: any }) => {
    expect(resp.body).to.eql({
      success: false,
      successCount: 2,
      errors: [
        {
          error: {
            type: 'unsupported_type',
          },
          id: '1',
          type: 'hiddentype',
        },
      ],
    });
  };

  const expectUnknownTypeUnsupported = (resp: { [key: string]: any }) => {
    expect(resp.body).to.eql({
      success: false,
      successCount: 2,
      errors: [
        {
          id: '1',
          type: 'wigwags',
          title: 'Wigwags title',
          error: {
            type: 'unsupported_type',
          },
        },
      ],
    });
  };

  const expectHiddenTypeUnsupported = (resp: { [key: string]: any }) => {
    expect(resp.body).to.eql({
      success: false,
      successCount: 2,
      errors: [
        {
          id: '1',
          type: 'hiddentype',
          error: {
            type: 'unsupported_type',
          },
        },
      ],
    });
  };

  const expectRbacForbidden = (resp: { [key: string]: any }) => {
    expect(resp.body).to.eql({
      statusCode: 403,
      error: 'Forbidden',
      message: `Unable to bulk_create dashboard,globaltype`,
    });
  };

  const makeImportTest = (describeFn: DescribeFn) => (
    description: string,
    definition: ImportTestDefinition
  ) => {
    const { user = {}, spaceId = DEFAULT_SPACE_ID, tests } = definition;

    describeFn(description, () => {
      before(() => esArchiver.load('saved_objects/spaces'));
      after(() => esArchiver.unload('saved_objects/spaces'));

      it(`should return ${tests.default.statusCode}`, async () => {
        const data = createImportData(spaceId);
        await supertest
          .post(`${getUrlPrefix(spaceId)}/api/saved_objects/_import`)
          .auth(user.username, user.password)
          .attach(
            'file',
            Buffer.from(data.map(obj => JSON.stringify(obj)).join('\n'), 'utf8'),
            'export.ndjson'
          )
          .expect(tests.default.statusCode)
          .then(tests.default.response);
      });

      describe('hiddentype', () => {
        it(`should return ${tests.hiddenType.statusCode}`, async () => {
          const data = createImportData(spaceId);
          data.push({
            type: 'hiddentype',
            id: '1',
            attributes: {
              name: 'My Hidden Type',
            },
          });
          await supertest
            .post(`${getUrlPrefix(spaceId)}/api/saved_objects/_import`)
            .query({ overwrite: true })
            .auth(user.username, user.password)
            .attach(
              'file',
              Buffer.from(data.map(obj => JSON.stringify(obj)).join('\n'), 'utf8'),
              'export.ndjson'
            )
            .expect(tests.hiddenType.statusCode)
            .then(tests.hiddenType.response);
        });
      });

      describe('unknown type', () => {
        it(`should return ${tests.unknownType.statusCode}`, async () => {
          const data = createImportData(spaceId);
          data.push({
            type: 'wigwags',
            id: '1',
            attributes: {
              title: 'Wigwags title',
            },
          });
          await supertest
            .post(`${getUrlPrefix(spaceId)}/api/saved_objects/_import`)
            .query({ overwrite: true })
            .auth(user.username, user.password)
            .attach(
              'file',
              Buffer.from(data.map(obj => JSON.stringify(obj)).join('\n'), 'utf8'),
              'export.ndjson'
            )
            .expect(tests.unknownType.statusCode)
            .then(tests.unknownType.response);
        });
      });
    });
  };

  const importTest = makeImportTest(describe);
  // @ts-ignore
  importTest.only = makeImportTest(describe.only);

  return {
    importTest,
    createExpectResults,
    expectResultsWithUnsupportedHiddenType,
    expectRbacForbidden,
    expectUnknownTypeUnsupported,
    expectHiddenTypeUnsupported,
  };
}
