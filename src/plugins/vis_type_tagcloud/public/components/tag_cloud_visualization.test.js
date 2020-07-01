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

import 'jest-canvas-mock';

import { ExprVis } from '../../../visualizations/public/expressions/vis';

// Replace with mock when converting to jest tests
import { seedColors } from '../../../charts/public/services/colors/seed_colors';
import { BaseVisType } from '../../../visualizations/public/vis_types/base_vis_type';
import { createTagCloudVisTypeDefinition } from '../tag_cloud_type';
import { createTagCloudVisualization } from './tag_cloud_visualization';
import { setFormatService } from '../services';
import { fieldFormatsServiceMock } from '../../../data/public/field_formats/mocks';
import { setHTMLElementOffset, setSVGElementGetBBox } from '../../../../test_utils/public/helpers';

describe('TagCloudVisualizationTest', () => {
  let domNode;
  let vis;
  let SVGElementGetBBoxSpyInstance;
  let HTMLElementOffsetMockInstance;

  const dummyTableGroup = {
    columns: [
      {
        id: 'col-0',
        title: 'geo.dest: Descending',
      },
      {
        id: 'col-1',
        title: 'Count',
      },
    ],
    rows: [
      { 'col-0': 'CN', 'col-1': 26 },
      { 'col-0': 'IN', 'col-1': 17 },
      { 'col-0': 'US', 'col-1': 6 },
      { 'col-0': 'DE', 'col-1': 4 },
      { 'col-0': 'BR', 'col-1': 3 },
    ],
  };
  const TagCloudVisualization = createTagCloudVisualization({
    colors: {
      seedColors,
    },
  });

  const originTransformSVGElement = window.SVGElement.prototype.transform;

  beforeAll(() => {
    setFormatService(fieldFormatsServiceMock.createStartContract());
    Object.defineProperties(window.SVGElement.prototype, {
      transform: {
        get: () => ({
          baseVal: {
            consolidate: () => {},
          },
        }),
        configurable: true,
      },
    });
  });

  afterAll(() => {
    SVGElementGetBBoxSpyInstance.mockRestore();
    HTMLElementOffsetMockInstance.mockRestore();
    window.SVGElement.prototype.transform = originTransformSVGElement;
  });

  describe('TagCloudVisualization - basics', () => {
    beforeEach(async () => {
      const visType = new BaseVisType(createTagCloudVisTypeDefinition({ colors: seedColors }));
      setupDOM(512, 512);

      vis = new ExprVis({
        type: visType,
        params: {
          bucket: { accessor: 0, format: {} },
          metric: { accessor: 0, format: {} },
        },
        data: {},
      });
    });

    test('simple draw', async () => {
      const tagcloudVisualization = new TagCloudVisualization(domNode, vis);

      await tagcloudVisualization.render(dummyTableGroup, vis.params, {
        resize: false,
        params: true,
        aggs: true,
        data: true,
        uiState: false,
      });

      const svgNode = domNode.querySelector('svg');
      expect(svgNode.outerHTML).toMatchSnapshot();
    });

    test('with resize', async () => {
      const tagcloudVisualization = new TagCloudVisualization(domNode, vis);
      await tagcloudVisualization.render(dummyTableGroup, vis.params, {
        resize: false,
        params: true,
        aggs: true,
        data: true,
        uiState: false,
      });

      domNode.style.width = '256px';
      domNode.style.height = '368px';
      await tagcloudVisualization.render(dummyTableGroup, vis.params, {
        resize: true,
        params: false,
        aggs: false,
        data: false,
        uiState: false,
      });

      const svgNode = domNode.querySelector('svg');
      expect(svgNode.outerHTML).toMatchSnapshot();
    });

    test('with param change', async function () {
      const tagcloudVisualization = new TagCloudVisualization(domNode, vis);
      await tagcloudVisualization.render(dummyTableGroup, vis.params, {
        resize: false,
        params: true,
        aggs: true,
        data: true,
        uiState: false,
      });

      SVGElementGetBBoxSpyInstance.mockRestore();
      SVGElementGetBBoxSpyInstance = setSVGElementGetBBox(256, 368);

      HTMLElementOffsetMockInstance.mockRestore();
      HTMLElementOffsetMockInstance = setHTMLElementOffset(256, 386);

      vis.params.orientation = 'right angled';
      vis.params.minFontSize = 70;
      await tagcloudVisualization.render(dummyTableGroup, vis.params, {
        resize: true,
        params: true,
        aggs: false,
        data: false,
        uiState: false,
      });

      const svgNode = domNode.querySelector('svg');
      expect(svgNode.outerHTML).toMatchSnapshot();
    });
  });

  function setupDOM(width, height) {
    domNode = document.createElement('div');

    HTMLElementOffsetMockInstance = setHTMLElementOffset(width, height);
    SVGElementGetBBoxSpyInstance = setSVGElementGetBBox(width, height);

    document.body.appendChild(domNode);
  }
});
