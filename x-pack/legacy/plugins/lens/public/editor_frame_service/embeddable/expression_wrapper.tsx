/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import React from 'react';
import { I18nProvider } from '@kbn/i18n/react';
import { FormattedMessage } from '@kbn/i18n/react';
import { EuiFlexGroup, EuiFlexItem, EuiText, EuiIcon } from '@elastic/eui';
import { TimeRange, Filter, Query } from 'src/plugins/data/public';
import { ReactExpressionRendererType } from 'src/plugins/expressions/public';

export interface ExpressionWrapperProps {
  ExpressionRenderer: ReactExpressionRendererType;
  expression: string | null;
  context: {
    timeRange?: TimeRange;
    query?: Query;
    filters?: Filter[];
    lastReloadRequestTime?: number;
  };
}

export function ExpressionWrapper({
  ExpressionRenderer: ExpressionRendererComponent,
  expression,
  context,
}: ExpressionWrapperProps) {
  return (
    <I18nProvider>
      {expression === null || expression === '' ? (
        <EuiFlexGroup direction="column" alignItems="center" justifyContent="center">
          <EuiFlexItem>
            <EuiIcon type="alert" color="danger" />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiText size="s">
              <FormattedMessage
                id="xpack.lens.embeddable.failure"
                defaultMessage="Visualization couldn't be displayed"
              />
            </EuiText>
          </EuiFlexItem>
        </EuiFlexGroup>
      ) : (
        <div className="lnsExpressionRenderer">
          <ExpressionRendererComponent
            className="lnsExpressionRenderer__component"
            padding="m"
            expression={expression}
            searchContext={{ ...context }}
            renderError={error => <div data-test-subj="expression-renderer-error">{error}</div>}
          />
        </div>
      )}
    </I18nProvider>
  );
}
