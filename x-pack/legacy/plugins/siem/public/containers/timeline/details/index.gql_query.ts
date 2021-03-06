/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { gql } from '@apollo/client';

export const timelineDetailsQuery = gql`
  query GetTimelineDetailsQuery(
    $sourceId: ID!
    $eventId: String!
    $indexName: String!
    $defaultIndex: [String!]!
  ) {
    source(id: $sourceId) {
      id
      TimelineDetails(eventId: $eventId, indexName: $indexName, defaultIndex: $defaultIndex) {
        data {
          field
          values
          originalValue
        }
      }
    }
  }
`;
