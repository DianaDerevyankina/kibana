/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * and the Server Side Public License, v 1; you may not use this file except in
 * compliance with, at your election, the Elastic License or the Server Side
 * Public License, v 1.
 */

// @ts-expect-error
import fetchMock from 'fetch-mock/es5/client';
import * as Rx from 'rxjs';
import { takeUntil, toArray } from 'rxjs/operators';

import { setup as httpSetup } from '../../test_helpers/http_test_setup';
import { UiSettingsApi } from './ui_settings_api';

function setup() {
  const { http } = httpSetup((injectedMetadata) => {
    injectedMetadata.getBasePath.mockReturnValue('/foo/bar');
  });

  const uiSettingsApi = new UiSettingsApi(http);

  return {
    http,
    uiSettingsApi,
  };
}

async function settlePromise<T>(promise: Promise<T>) {
  try {
    return {
      isResolved: true,
      result: await promise,
    };
  } catch (error) {
    return {
      isRejected: true,
      error,
    };
  }
}

afterEach(() => {
  fetchMock.restore();
});

describe('#batchSet', () => {
  it('sends a single change immediately', async () => {
    fetchMock.mock('*', {
      body: { settings: {} },
    });

    const { uiSettingsApi } = setup();
    await uiSettingsApi.batchSet('foo', 'bar');
    expect(fetchMock.calls()).toMatchSnapshot('single change');
  });

  it('buffers changes while first request is in progress, sends buffered changes after first request completes', async () => {
    fetchMock.mock('*', {
      body: { settings: {} },
    });

    const { uiSettingsApi } = setup();

    uiSettingsApi.batchSet('foo', 'bar');
    const finalPromise = uiSettingsApi.batchSet('box', 'bar');

    expect(uiSettingsApi.hasPendingChanges()).toBe(true);
    await finalPromise;
    expect(fetchMock.calls()).toMatchSnapshot('final, includes both requests');
  });

  it('Overwrites previously buffered values with new values for the same key', async () => {
    fetchMock.mock('*', {
      body: { settings: {} },
    });

    const { uiSettingsApi } = setup();

    uiSettingsApi.batchSet('foo', 'a');
    uiSettingsApi.batchSet('foo', 'b');
    uiSettingsApi.batchSet('foo', 'c');
    await uiSettingsApi.batchSet('foo', 'd');

    expect(fetchMock.calls()).toMatchSnapshot('two requests, foo=d in final');
  });

  it('Buffers are always clear of previously buffered changes', async () => {
    fetchMock.mock('*', {
      body: { settings: {} },
    });

    const { uiSettingsApi } = setup();
    uiSettingsApi.batchSet('foo', 'bar');
    uiSettingsApi.batchSet('bar', 'foo');
    await uiSettingsApi.batchSet('bar', 'box');

    expect(fetchMock.calls()).toMatchSnapshot('two requests, second only sends bar, not foo');
  });

  it('rejects on 404 response', async () => {
    fetchMock.mock('*', {
      status: 404,
      body: 'not found',
    });

    const { uiSettingsApi } = setup();
    await expect(uiSettingsApi.batchSet('foo', 'bar')).rejects.toThrowErrorMatchingSnapshot();
  });

  it('rejects on 301', async () => {
    fetchMock.mock('*', {
      status: 301,
      body: 'redirect',
    });

    const { uiSettingsApi } = setup();
    await expect(uiSettingsApi.batchSet('foo', 'bar')).rejects.toThrowErrorMatchingSnapshot();
  });

  it('rejects on 500', async () => {
    fetchMock.mock('*', {
      status: 500,
      body: 'redirect',
    });

    const { uiSettingsApi } = setup();
    await expect(uiSettingsApi.batchSet('foo', 'bar')).rejects.toThrowErrorMatchingSnapshot();
  });

  it('rejects all promises for batched requests that fail', async () => {
    fetchMock.once('*', {
      body: { settings: {} },
    });
    fetchMock.once(
      '*',
      {
        status: 400,
        body: { message: 'invalid' },
      },
      {
        overwriteRoutes: false,
      }
    );

    const { uiSettingsApi } = setup();
    // trigger the initial sync request, which enabled buffering
    uiSettingsApi.batchSet('foo', 'bar');

    // buffer some requests so they will be sent together
    await expect(
      Promise.all([
        settlePromise(uiSettingsApi.batchSet('foo', 'a')),
        settlePromise(uiSettingsApi.batchSet('bar', 'b')),
        settlePromise(uiSettingsApi.batchSet('baz', 'c')),
      ])
    ).resolves.toMatchSnapshot('promise rejections');

    // ensure only two requests were sent
    expect(fetchMock.calls()).toHaveLength(2);
  });
});

describe('#getLoadingCount$()', () => {
  it('emits the current number of active requests', async () => {
    fetchMock.once('*', {
      body: { settings: {} },
    });

    const { uiSettingsApi } = setup();
    const done$ = new Rx.Subject();
    const promise = uiSettingsApi.getLoadingCount$().pipe(takeUntil(done$), toArray()).toPromise();

    await uiSettingsApi.batchSet('foo', 'bar');
    done$.next();

    await expect(promise).resolves.toEqual([0, 1, 0]);
  });

  it('decrements loading count when requests fail', async () => {
    fetchMock.once('*', {
      body: { settings: {} },
    });
    fetchMock.once(
      '*',
      {
        status: 400,
        body: 'invalid',
      },
      {
        overwriteRoutes: false,
      }
    );

    const { uiSettingsApi } = setup();
    const done$ = new Rx.Subject();
    const promise = uiSettingsApi.getLoadingCount$().pipe(takeUntil(done$), toArray()).toPromise();

    await uiSettingsApi.batchSet('foo', 'bar');
    await expect(uiSettingsApi.batchSet('foo', 'bar')).rejects.toThrowError();

    done$.next();
    await expect(promise).resolves.toEqual([0, 1, 0, 1, 0]);
  });
});

describe('#stop', () => {
  it('completes any loading count observables', async () => {
    fetchMock.once('*', {
      body: { settings: {} },
    });

    const { uiSettingsApi } = setup();
    const promise = Promise.all([
      uiSettingsApi.getLoadingCount$().pipe(toArray()).toPromise(),
      uiSettingsApi.getLoadingCount$().pipe(toArray()).toPromise(),
    ]);

    const batchSetPromise = uiSettingsApi.batchSet('foo', 'bar');
    uiSettingsApi.stop();

    // both observables should emit the same values, and complete before the request is done loading
    await expect(promise).resolves.toEqual([
      [0, 1],
      [0, 1],
    ]);
    await batchSetPromise;
  });
});
