/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { gql } from '@apollo/client';

export const usersQuery = gql`
  query GetUsersQuery(
    $sourceId: ID!
    $filterQuery: String
    $flowTarget: FlowTarget!
    $ip: String!
    $pagination: PaginationInputPaginated!
    $sort: UsersSortField!
    $timerange: TimerangeInput!
    $defaultIndex: [String!]!
    $inspect: Boolean!
  ) {
    source(id: $sourceId) {
      id
      Users(
        filterQuery: $filterQuery
        flowTarget: $flowTarget
        ip: $ip
        pagination: $pagination
        sort: $sort
        timerange: $timerange
        defaultIndex: $defaultIndex
      ) {
        totalCount
        edges {
          node {
            user {
              name
              id
              groupId
              groupName
              count
            }
          }
          cursor {
            value
          }
        }
        pageInfo {
          activePage
          fakeTotalCount
          showMorePagesIndicator
        }
        inspect @include(if: $inspect) {
          dsl
          response
        }
      }
    }
  }
`;
