/** Distinguish a failed route module from an error thrown while rendering it. */
export class RouteImportError extends Error {
  readonly cause: unknown;

  constructor(cause: unknown) {
    super('The route module could not be loaded');
    this.name = 'RouteImportError';
    this.cause = cause;
  }
}

export async function loadRouteModule<T>(load: () => Promise<T>): Promise<T> {
  try {
    return await load();
  } catch (error) {
    // React.lazy caches rejected imports. Explicit Retry must reload the URL
    // to create a fresh lazy instance, including after a deployment changes hashes.
    throw new RouteImportError(error);
  }
}
