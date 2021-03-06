/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { Readable } from 'stream';

/**
 * Log a message if the DEBUG environment variable is set
 */
export function log(...args: any[]) {
  if (process.env.DEBUG) {
    // allow console log since this is off by default and only for debugging
    // eslint-disable-next-line no-console
    console.log(...args);
  }
}

/**
 * Iterate an array asynchronously and in parallel
 */
export function asyncMap<T, T2>(array: T[], asyncFn: (x: T) => T2): Promise<T2[]> {
  return Promise.all(array.map(asyncFn));
}

/**
 * Wait for a readable stream to end
 */
export function readableEnd(stream: Readable) {
  return new Promise((resolve, reject) => {
    stream.on('error', reject).on('end', resolve);
  });
}
