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

import React from 'react';

import { EuiFlexGroup, EuiFlexItem, EuiText, EuiTextColor, EuiLoadingSpinner } from '@elastic/eui';

import { FormattedMessage } from '@kbn/i18n/react';

export const LoadingIndices = ({ ...rest }) => (
  <EuiFlexGroup justifyContent="center" alignItems="center" {...rest}>
    <EuiFlexItem grow={false}>
      <EuiLoadingSpinner size="m" />
    </EuiFlexItem>

    <EuiFlexItem grow={false}>
      <EuiText>
        <EuiTextColor color="subdued">
          <FormattedMessage
            id="kbn.management.createIndexPattern.step.loadingHeader"
            defaultMessage="Looking for matching indices…"
          />
        </EuiTextColor>
      </EuiText>

      <EuiText size="s" style={{ textAlign: 'center' }}>
        <EuiTextColor color="subdued">
          <FormattedMessage
            id="kbn.management.createIndexPattern.step.loadingLabel"
            defaultMessage="Just a sec…"
          />
        </EuiTextColor>
      </EuiText>
    </EuiFlexItem>
  </EuiFlexGroup>
);
