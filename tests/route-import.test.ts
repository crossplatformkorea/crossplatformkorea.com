import { describe, expect, test } from 'bun:test';
import { RouteImportError, loadRouteModule } from '../apps/web/src/lib/routeImport.ts';
import { ErrorBoundary } from '../apps/web/src/components/uis/ErrorBoundary.tsx';

describe('route import recovery', () => {
  test('loads the original module unchanged', async () => {
    const module = { default: () => null };
    expect(await loadRouteModule(() => Promise.resolve(module))).toBe(module);
  });

  test('marks network failures for reload without depending on browser error wording', async () => {
    const networkError = new TypeError('Failed to fetch dynamically imported module');
    const caught: unknown = await loadRouteModule(() => Promise.reject(networkError)).catch(
      (error: unknown) => error,
    );
    expect(caught).toBeInstanceOf(RouteImportError);
    expect((caught as RouteImportError).cause).toBe(networkError);
    expect(ErrorBoundary.getDerivedStateFromError(caught)).toEqual({
      hasError: true,
      reloadOnRetry: true,
    });
  });

  test('marks synchronous module evaluation failures for reload', async () => {
    const evaluationError = new Error('Module initialization failed');
    const caught: unknown = await loadRouteModule(() => {
      throw evaluationError;
    }).catch((error: unknown) => error);
    expect(caught).toBeInstanceOf(RouteImportError);
    expect((caught as RouteImportError).cause).toBe(evaluationError);
  });

  test('a fresh explicit load can succeed after the network recovers', async () => {
    const module = { default: () => null };
    let available = false;
    const load = () =>
      available ? Promise.resolve(module) : Promise.reject(new TypeError('Network error'));
    await expect(loadRouteModule(load)).rejects.toBeInstanceOf(RouteImportError);
    available = true;
    expect(await loadRouteModule(load)).toBe(module);
  });

  test('keeps ordinary render errors on the existing local reset path', () => {
    expect(ErrorBoundary.getDerivedStateFromError(new Error('A component failed'))).toEqual({
      hasError: true,
      reloadOnRetry: false,
    });
  });
});
