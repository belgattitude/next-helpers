import type { ZodError } from 'zod';
import type { RequestSchema, ZodIssueWithoutPath } from './types';

type RequestError<T extends RequestSchema> = {
  method: ZodIssueWithoutPath;
  query: {
    [k in keyof T['query']]: ZodIssueWithoutPath[];
  };
  headers: {
    [k in keyof T['headers']]: ZodIssueWithoutPath[];
  };
  cookies: {
    [k in keyof T['cookies']]: ZodIssueWithoutPath[];
  };
};

export class ZodRequestError<T extends RequestSchema> extends Error {
  public requestError: RequestError<T>;
  constructor(private zodError: ZodError) {
    super('Request validation error.');
    this.requestError = this.getError();
  }
  getTypes() {
    const { query, cookies, headers, method } = this.requestError;
    return [
      method ? 'method' : null,
      Object.keys(query).length > 0 ? 'query' : null,
      Object.keys(headers).length > 0 ? 'headers' : null,
      Object.keys(cookies).length > 0 ? 'cookies' : null,
    ].filter((v) => v);
  }
  getError = (): RequestError<T> => {
    const errMap: Record<string, unknown> = {};
    this.zodError.issues.forEach((err) => {
      const { path, ...errNoPath } = err;
      const root = path[0] as string;
      if (root === 'method') {
        errMap[root] = errNoPath;
      } else if (['query', 'headers', 'cookies'].includes(root)) {
        const param = path[1];
        errMap[root] ??= {};
        (errMap[root] as Record<string, unknown[]>)[param] ??= [];
        (errMap[root] as Record<string, unknown[]>)[param].push(errNoPath);
      }
    });
    return errMap as unknown as RequestError<T>;
  };
}
