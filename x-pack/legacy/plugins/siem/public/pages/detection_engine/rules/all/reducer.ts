/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { EuiBasicTable } from '@elastic/eui';
import {
  FilterOptions,
  PaginationOptions,
  Rule,
} from '../../../../containers/detection_engine/rules';

type LoadingRuleAction = 'duplicate' | 'enable' | 'disable' | 'export' | 'delete' | null;
export interface State {
  exportRuleIds: string[];
  filterOptions: FilterOptions;
  loadingRuleIds: string[];
  loadingRulesAction: LoadingRuleAction;
  pagination: PaginationOptions;
  rules: Rule[];
  selectedRuleIds: string[];
}

export type Action =
  | { type: 'exportRuleIds'; ids: string[] }
  | { type: 'loadingRuleIds'; ids: string[]; actionType: LoadingRuleAction }
  | { type: 'selectedRuleIds'; ids: string[] }
  | { type: 'setRules'; rules: Rule[] }
  | { type: 'updateRules'; rules: Rule[] }
  | { type: 'updatePagination'; pagination: Partial<PaginationOptions> }
  | {
      type: 'updateFilterOptions';
      filterOptions: Partial<FilterOptions>;
      pagination: Partial<PaginationOptions>;
    }
  | { type: 'failure' };

export const allRulesReducer = (
  tableRef: React.MutableRefObject<EuiBasicTable<unknown> | undefined>
) => (state: State, action: Action): State => {
  switch (action.type) {
    case 'exportRuleIds': {
      return {
        ...state,
        loadingRuleIds: action.ids,
        loadingRulesAction: 'export',
        exportRuleIds: action.ids,
      };
    }
    case 'loadingRuleIds': {
      return {
        ...state,
        loadingRuleIds: action.actionType == null ? [] : [...state.loadingRuleIds, ...action.ids],
        loadingRulesAction: action.actionType,
      };
    }
    case 'selectedRuleIds': {
      return {
        ...state,
        selectedRuleIds: action.ids,
      };
    }
    case 'setRules': {
      if (
        tableRef != null &&
        tableRef.current != null &&
        tableRef.current.changeSelection != null
      ) {
        tableRef.current.changeSelection([]);
      }

      return {
        ...state,
        rules: action.rules,
        selectedRuleIds: [],
        loadingRuleIds: [],
        loadingRulesAction: null,
      };
    }
    case 'updateRules': {
      if (state.rules != null) {
        const ruleIds = state.rules.map(r => r.id);
        const updatedRules = action.rules.reduce((rules, updatedRule) => {
          let newRules = rules;
          if (ruleIds.includes(updatedRule.id)) {
            newRules = newRules.map(r => (updatedRule.id === r.id ? updatedRule : r));
          } else {
            newRules = [...newRules, updatedRule];
          }
          return newRules;
        }, state.rules);
        const updatedRuleIds = action.rules.map(r => r.id);
        const newLoadingRuleIds = state.loadingRuleIds.filter(id => !updatedRuleIds.includes(id));
        return {
          ...state,
          rules: updatedRules,
          loadingRuleIds: newLoadingRuleIds,
          loadingRulesAction: newLoadingRuleIds.length === 0 ? null : state.loadingRulesAction,
        };
      }
      return state;
    }
    case 'updatePagination': {
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.pagination,
        },
      };
    }
    case 'updateFilterOptions': {
      return {
        ...state,
        filterOptions: {
          ...state.filterOptions,
          ...action.filterOptions,
        },
        pagination: {
          ...state.pagination,
          ...action.pagination,
        },
      };
    }
    case 'failure': {
      return {
        ...state,
        rules: [],
      };
    }
    default:
      return state;
  }
};
