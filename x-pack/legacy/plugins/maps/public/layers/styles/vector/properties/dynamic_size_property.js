/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { DynamicStyleProperty } from './dynamic_style_property';

import {
  HALF_LARGE_MAKI_ICON_SIZE,
  LARGE_MAKI_ICON_SIZE,
  SMALL_MAKI_ICON_SIZE,
} from '../symbol_utils';
import { VECTOR_STYLES } from '../vector_style_defaults';
import _ from 'lodash';
import { CircleIcon } from '../components/legend/circle_icon';
import React, { Fragment } from 'react';
import { EuiFlexGroup, EuiFlexItem, EuiHorizontalRule } from '@elastic/eui';

function getLineWidthIcons() {
  const defaultStyle = {
    stroke: 'grey',
    fill: 'none',
    width: '12px',
  };
  return [
    <CircleIcon style={{ ...defaultStyle, strokeWidth: '1px' }} />,
    <CircleIcon style={{ ...defaultStyle, strokeWidth: '2px' }} />,
    <CircleIcon style={{ ...defaultStyle, strokeWidth: '3px' }} />,
  ];
}

function getSymbolSizeIcons() {
  const defaultStyle = {
    stroke: 'grey',
    fill: 'grey',
  };
  return [
    <CircleIcon style={{ ...defaultStyle, width: '4px' }} />,
    <CircleIcon style={{ ...defaultStyle, width: '8px' }} />,
    <CircleIcon style={{ ...defaultStyle, width: '12px' }} />,
  ];
}

export class DynamicSizeProperty extends DynamicStyleProperty {
  constructor(options, styleName, field, getFieldMeta, getFieldFormatter, isSymbolizedAsIcon) {
    super(options, styleName, field, getFieldMeta, getFieldFormatter);
    this._isSymbolizedAsIcon = isSymbolizedAsIcon;
  }

  supportsFeatureState() {
    // mb style "icon-size" does not support feature state
    if (this.getStyleName() === VECTOR_STYLES.ICON_SIZE && this._isSymbolizedAsIcon) {
      return false;
    }

    // mb style "text-size" does not support feature state
    if (this.getStyleName() === VECTOR_STYLES.LABEL_SIZE) {
      return false;
    }

    return true;
  }

  syncHaloWidthWithMb(mbLayerId, mbMap) {
    const haloWidth = this.getMbSizeExpression();
    mbMap.setPaintProperty(mbLayerId, 'icon-halo-width', haloWidth);
  }

  getIconPixelSize() {
    return this._options.maxSize >= HALF_LARGE_MAKI_ICON_SIZE
      ? LARGE_MAKI_ICON_SIZE
      : SMALL_MAKI_ICON_SIZE;
  }

  syncIconSizeWithMb(symbolLayerId, mbMap) {
    if (this._isSizeDynamicConfigComplete(this._options)) {
      const halfIconPixels = this.getIconPixelSize() / 2;
      const targetName = this.getComputedFieldName();
      // Using property state instead of feature-state because layout properties do not support feature-state
      mbMap.setLayoutProperty(symbolLayerId, 'icon-size', [
        'interpolate',
        ['linear'],
        ['coalesce', ['get', targetName], 0],
        0,
        this._options.minSize / halfIconPixels,
        1,
        this._options.maxSize / halfIconPixels,
      ]);
    } else {
      mbMap.setLayoutProperty(symbolLayerId, 'icon-size', null);
    }
  }

  syncCircleStrokeWidthWithMb(mbLayerId, mbMap) {
    const lineWidth = this.getMbSizeExpression();
    mbMap.setPaintProperty(mbLayerId, 'circle-stroke-width', lineWidth);
  }

  syncCircleRadiusWithMb(mbLayerId, mbMap) {
    const circleRadius = this.getMbSizeExpression();
    mbMap.setPaintProperty(mbLayerId, 'circle-radius', circleRadius);
  }

  syncLineWidthWithMb(mbLayerId, mbMap) {
    const lineWidth = this.getMbSizeExpression();
    mbMap.setPaintProperty(mbLayerId, 'line-width', lineWidth);
  }

  syncLabelSizeWithMb(mbLayerId, mbMap) {
    const lineWidth = this.getMbSizeExpression();
    mbMap.setLayoutProperty(mbLayerId, 'text-size', lineWidth);
  }

  getMbSizeExpression() {
    if (this._isSizeDynamicConfigComplete(this._options)) {
      return this._getMbDataDrivenSize({
        targetName: this.getComputedFieldName(),
        minSize: this._options.minSize,
        maxSize: this._options.maxSize,
      });
    }
    return null;
  }

  _getMbDataDrivenSize({ targetName, minSize, maxSize }) {
    const lookup = this.supportsFeatureState() ? 'feature-state' : 'get';
    return [
      'interpolate',
      ['linear'],
      ['coalesce', [lookup, targetName], 0],
      0,
      minSize,
      1,
      maxSize,
    ];
  }

  _isSizeDynamicConfigComplete() {
    return (
      this._field &&
      this._field.isValid() &&
      _.has(this._options, 'minSize') &&
      _.has(this._options, 'maxSize')
    );
  }

  renderRangeLegendHeader() {
    let icons;
    if (this.getStyleName() === VECTOR_STYLES.LINE_WIDTH) {
      icons = getLineWidthIcons();
    } else if (this.getStyleName() === VECTOR_STYLES.ICON_SIZE) {
      icons = getSymbolSizeIcons();
    } else {
      return null;
    }

    return (
      <EuiFlexGroup gutterSize="xs" justifyContent="spaceBetween" alignItems="center">
        {icons.map((icon, index) => {
          const isLast = index === icons.length - 1;
          let spacer;
          if (!isLast) {
            spacer = (
              <EuiFlexItem>
                <EuiHorizontalRule margin="xs" />
              </EuiFlexItem>
            );
          }
          return (
            <Fragment key={index}>
              <EuiFlexItem grow={false}>{icon}</EuiFlexItem>
              {spacer}
            </Fragment>
          );
        })}
      </EuiFlexGroup>
    );
  }
}
