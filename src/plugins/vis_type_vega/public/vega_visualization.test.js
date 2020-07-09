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

import $ from 'jquery';

import 'leaflet/dist/leaflet.js';
import 'leaflet-vega';
import { createVegaVisualization } from './vega_visualization';

import vegaliteGraph from './__test__/vegalite_graph.json';
import vegaGraph from './__test__/vega_graph.json';
import vegaMapGraph from './__test__/vega_map_test.json';

import { VegaParser } from './data_model/vega_parser';
import { SearchAPI } from './data_model/search_api';

import { createVegaTypeDefinition } from './vega_type';

import {
  setInjectedVars,
  setData,
  setSavedObjects,
  setNotifications,
  setKibanaMapFactory,
} from './services';
import { coreMock } from '../../../core/public/mocks';
import { dataPluginMock } from '../../data/public/mocks';
import { KibanaMap } from '../../maps_legacy/public/map/kibana_map';

jest.mock('./lib/vega', () => ({
  vega: jest.requireActual('vega'),
  vegaLite: jest.requireActual('vega-lite'),
}));

describe('VegaVisualizations', () => {
  let domNode;
  let VegaVisualization;
  let vis;
  let vegaVisualizationDependencies;
  let vegaVisType;
  let mockWidth;
  let mockHeight;

  const coreStart = coreMock.createStart();
  const dataPluginStart = dataPluginMock.createStartContract();

  setKibanaMapFactory((...args) => new KibanaMap(...args));
  setInjectedVars({
    emsTileLayerId: {},
    enableExternalUrls: true,
    esShardTimeout: 10000,
  });
  setData(dataPluginStart);
  setSavedObjects(coreStart.savedObjects);
  setNotifications(coreStart.notifications);

  beforeEach(() => {
    vegaVisualizationDependencies = {
      core: {
        uiSettings: coreStart.uiSettings,
      },
      plugins: {
        data: {
          query: {
            timefilter: {
              timefilter: {},
            },
          },
        },
      },
    };

    vegaVisType = createVegaTypeDefinition(vegaVisualizationDependencies);
    VegaVisualization = createVegaVisualization(vegaVisualizationDependencies);
  });

  describe('VegaVisualization - basics', () => {
    beforeEach(async () => {
      setupDOM(512, 512);

      vis = {
        type: vegaVisType,
      };
    });

    afterEach(() => {
      mockWidth.mockRestore();
      mockHeight.mockRestore();
    });

    test('should show vegalite graph and update on resize (may fail in dev env)', async () => {
      let vegaVis;
      try {
        vegaVis = new VegaVisualization(domNode, vis);

        const vegaParser = new VegaParser(
          JSON.stringify(vegaliteGraph),
          new SearchAPI({
            search: dataPluginStart.search,
            uiSettings: coreStart.uiSettings,
            injectedMetadata: coreStart.injectedMetadata,
          })
        );
        await vegaParser.parseAsync();
        await vegaVis.render(vegaParser);
        expect(domNode.innerHTML).toMatchSnapshot();

        mockWidth.mockRestore();
        mockWidth = jest.spyOn($.prototype, 'width').mockReturnValue(256);

        mockHeight.mockRestore();
        mockHeight = jest.spyOn($.prototype, 'height').mockReturnValue(256);

        vegaVis._vegaView.resize();
        await vegaVis.render(vegaParser);
        expect(domNode.innerHTML).toMatchSnapshot();
      } finally {
        vegaVis.destroy();
      }
    });

    test('should show vega graph (may fail in dev env)', async () => {
      let vegaVis;
      try {
        vegaVis = new VegaVisualization(domNode, vis);
        const vegaParser = new VegaParser(
          JSON.stringify(vegaGraph),
          new SearchAPI({
            search: dataPluginStart.search,
            uiSettings: coreStart.uiSettings,
            injectedMetadata: coreStart.injectedMetadata,
          })
        );
        await vegaParser.parseAsync();

        await vegaVis.render(vegaParser);
        expect(domNode.innerHTML).toMatchSnapshot();
      } finally {
        vegaVis.destroy();
      }
    });

    test('should show vega blank rectangle on top of a map (vegamap)', async () => {
      let vegaVis;
      try {
        vegaVis = new VegaVisualization(domNode, vis);
        const vegaParser = new VegaParser(
          JSON.stringify(vegaMapGraph),
          new SearchAPI({
            search: dataPluginStart.search,
            uiSettings: coreStart.uiSettings,
            injectedMetadata: coreStart.injectedMetadata,
          })
        );
        await vegaParser.parseAsync();

        mockWidth.mockRestore();
        mockWidth = jest.spyOn($.prototype, 'width').mockReturnValue(256);

        mockHeight.mockRestore();
        mockHeight = jest.spyOn($.prototype, 'height').mockReturnValue(256);

        await vegaVis.render(vegaParser);
        expect(domNode.innerHTML).toMatchSnapshot();
      } finally {
        vegaVis.destroy();
      }
    });

    test('should add a small subpixel value to the height of the canvas to avoid getting it set to 0', async () => {
      let vegaVis;
      try {
        vegaVis = new VegaVisualization(domNode, vis);
        const vegaParser = new VegaParser(
          `{
            "$schema": "https://vega.github.io/schema/vega/v5.json",
            "marks": [
              {
                "type": "text",
                "encode": {
                  "update": {
                    "text": {
                      "value": "Test"
                    },
                    "align": {"value": "center"},
                    "baseline": {"value": "middle"},
                    "xc": {"signal": "width/2"},
                    "yc": {"signal": "height/2"}
                    fontSize: {value: "14"}
                  }
                }
              }
            ]
          }`,
          new SearchAPI({
            search: dataPluginStart.search,
            uiSettings: coreStart.uiSettings,
            injectedMetadata: coreStart.injectedMetadata,
          })
        );
        await vegaParser.parseAsync();

        mockWidth.mockRestore();
        mockWidth = jest.spyOn($.prototype, 'width').mockReturnValue(256);

        mockHeight.mockRestore();
        mockHeight = jest.spyOn($.prototype, 'height').mockReturnValue(256);

        await vegaVis.render(vegaParser);
        const vegaView = vegaVis._vegaView._view;
        expect(vegaView.height()).toBe(250.00000001);
      } finally {
        vegaVis.destroy();
      }
    });
  });

  function setupDOM(width, height) {
    domNode = document.createElement('div');
    mockWidth = jest.spyOn($.prototype, 'width').mockReturnValue(width);
    mockHeight = jest.spyOn($.prototype, 'height').mockReturnValue(height);
  }
});
