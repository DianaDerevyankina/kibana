/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import expect from '@kbn/expect';
import { ES_INDEX_NAME } from './constants';

export default function({ getService }) {
  const supertest = getService('supertest');
  const esArchiver = getService('esArchiver');
  const es = getService('legacyEs');
  const randomness = getService('randomness');

  describe('assign_tags_to_beats', () => {
    const archive = 'beats/list';

    beforeEach('load beats archive', () => esArchiver.load(archive));
    afterEach('unload beats archive', () => esArchiver.unload(archive));

    it('should add a single tag to a single beat', async () => {
      const { body: apiResponse } = await supertest
        .post('/api/beats/agents_tags/assignments')
        .set('kbn-xsrf', 'xxx')
        .send({
          assignments: [{ beatId: 'bar', tag: 'production' }],
        })
        .expect(200);

      expect(apiResponse.results).to.eql([{ success: true, result: { message: 'updated' } }]);

      const esResponse = await es.get({
        index: ES_INDEX_NAME,
        id: `beat:bar`,
      });

      const beat = esResponse._source.beat;
      expect(beat.tags).to.eql(['production']);
    });

    it('should not re-add an existing tag to a beat', async () => {
      const tags = ['production'];

      let esResponse;
      let beat;

      // Before adding the existing tag
      esResponse = await es.get({
        index: ES_INDEX_NAME,
        id: `beat:foo`,
      });

      beat = esResponse._source.beat;
      expect(beat.tags).to.eql([...tags, 'qa']);

      // Adding the existing tag
      const { body: apiResponse } = await supertest
        .post('/api/beats/agents_tags/assignments')
        .set('kbn-xsrf', 'xxx')
        .send({
          assignments: [{ beatId: 'foo', tag: 'production' }],
        })
        .expect(200);

      expect(apiResponse.results).to.eql([{ success: true, result: { message: 'updated' } }]);

      // After adding the existing tag
      esResponse = await es.get({
        index: ES_INDEX_NAME,
        id: `beat:foo`,
      });

      beat = esResponse._source.beat;
      expect(beat.tags).to.eql([...tags, 'qa']);
    });

    it('should add a single tag to a multiple beats', async () => {
      const { body: apiResponse } = await supertest
        .post('/api/beats/agents_tags/assignments')
        .set('kbn-xsrf', 'xxx')
        .send({
          assignments: [
            { beatId: 'foo', tag: 'development' },
            { beatId: 'bar', tag: 'development' },
          ],
        })
        .expect(200);

      expect(apiResponse.results).to.eql([
        { success: true, result: { message: 'updated' } },
        { success: true, result: { message: 'updated' } },
      ]);

      let esResponse;
      let beat;

      // Beat foo
      esResponse = await es.get({
        index: ES_INDEX_NAME,
        id: `beat:foo`,
      });

      beat = esResponse._source.beat;
      expect(beat.tags).to.eql(['production', 'qa', 'development']); // as beat 'foo' already had 'production' and 'qa' tags attached to it

      // Beat bar
      esResponse = await es.get({
        index: ES_INDEX_NAME,
        id: `beat:bar`,
      });

      beat = esResponse._source.beat;
      expect(beat.tags).to.eql(['development']);
    });

    it('should add multiple tags to a single beat', async () => {
      const { body: apiResponse } = await supertest
        .post('/api/beats/agents_tags/assignments')
        .set('kbn-xsrf', 'xxx')
        .send({
          assignments: [
            { beatId: 'bar', tag: 'development' },
            { beatId: 'bar', tag: 'production' },
          ],
        })
        .expect(200);

      expect(apiResponse.results).to.eql([
        { success: true, result: { message: 'updated' } },
        { success: true, result: { message: 'updated' } },
      ]);

      const esResponse = await es.get({
        index: ES_INDEX_NAME,
        id: `beat:bar`,
      });

      const beat = esResponse._source.beat;
      expect(beat.tags).to.eql(['development', 'production']);
    });

    it('should add multiple tags to a multiple beats', async () => {
      const { body: apiResponse } = await supertest
        .post('/api/beats/agents_tags/assignments')
        .set('kbn-xsrf', 'xxx')
        .send({
          assignments: [
            { beatId: 'foo', tag: 'development' },
            { beatId: 'bar', tag: 'production' },
          ],
        })
        .expect(200);

      expect(apiResponse.results).to.eql([
        { success: true, result: { message: 'updated' } },
        { success: true, result: { message: 'updated' } },
      ]);

      let esResponse;
      let beat;

      // Beat foo
      esResponse = await es.get({
        index: ES_INDEX_NAME,
        id: `beat:foo`,
      });

      beat = esResponse._source.beat;
      expect(beat.tags).to.eql(['production', 'qa', 'development']); // as beat 'foo' already had 'production' and 'qa' tags attached to it

      // Beat bar
      esResponse = await es.get({
        index: ES_INDEX_NAME,
        id: `beat:bar`,
      });

      beat = esResponse._source.beat;
      expect(beat.tags).to.eql(['production']);
    });

    it('should return errors for non-existent beats', async () => {
      const nonExistentBeatId = randomness.word();

      const { body: apiResponse } = await supertest
        .post('/api/beats/agents_tags/assignments')
        .set('kbn-xsrf', 'xxx')
        .send({
          assignments: [{ beatId: nonExistentBeatId, tag: 'production' }],
        })
        .expect(200);

      expect(apiResponse.results).to.eql([
        { success: false, error: { code: 404, message: `Beat ${nonExistentBeatId} not found` } },
      ]);
    });

    it('should return errors for non-existent tags', async () => {
      const nonExistentTag = randomness.word();

      const { body: apiResponse } = await supertest
        .post('/api/beats/agents_tags/assignments')
        .set('kbn-xsrf', 'xxx')
        .send({
          assignments: [{ beatId: 'bar', tag: nonExistentTag }],
        })
        .expect(200);

      expect(apiResponse.results).to.eql([
        { success: false, error: { code: 404, message: `Tag ${nonExistentTag} not found` } },
      ]);

      const esResponse = await es.get({
        index: ES_INDEX_NAME,
        id: `beat:bar`,
      });

      const beat = esResponse._source.beat;
      expect(beat).to.not.have.property('tags');
    });

    it('should return errors for non-existent beats and tags', async () => {
      const nonExistentBeatId = randomness.word();
      const nonExistentTag = randomness.word();

      const { body: apiResponse } = await supertest
        .post('/api/beats/agents_tags/assignments')
        .set('kbn-xsrf', 'xxx')
        .send({
          assignments: [{ beatId: nonExistentBeatId, tag: nonExistentTag }],
        })
        .expect(200);

      expect(apiResponse.results).to.eql([
        {
          success: false,
          error: {
            code: 404,
            message: `Beat ${nonExistentBeatId} and tag ${nonExistentTag} not found`,
          },
        },
      ]);

      const esResponse = await es.get({
        index: ES_INDEX_NAME,
        id: `beat:bar`,
      });

      const beat = esResponse._source.beat;
      expect(beat).to.not.have.property('tags');
    });
  });
}
