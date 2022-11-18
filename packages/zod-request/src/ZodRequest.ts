import type { z } from 'zod';
import type { IErrorHandler } from './error';
import { HttpExceptionHandler } from './error';
import type { ParsableApiRequest, ApiRequestSchema } from './types';
import { mapRequestSchemaToZod } from './utils';

const schemaDefaults = {
  method: 'GET',
  headers: {},
  query: {},
  cookies: {},
} as const;

export class ZodRequest<T extends ApiRequestSchema> {
  constructor(
    public readonly schema: T,
    private errorHandler?: IErrorHandler
  ) {}
  parse = (
    req: ParsableApiRequest
  ): z.infer<ReturnType<typeof mapRequestSchemaToZod<T>>> => {
    const all = mapRequestSchemaToZod<T>(this.schema);
    const result = all.safeParse(req);
    if (result.success) {
      return result.data;
    }
    if (!this.errorHandler) {
      new HttpExceptionHandler().process(result.error);
    }
    throw result.error;
  };
  static create = <S extends Partial<ApiRequestSchema>>(params: {
    schema: S;
    errorHandler?: IErrorHandler;
    defaults?: ApiRequestSchema;
  }) => {
    const { schema, errorHandler, defaults } = params;
    return new ZodRequest(
      {
        ...(defaults ?? schemaDefaults),
        ...schema,
      },
      errorHandler
    );
  };
}
