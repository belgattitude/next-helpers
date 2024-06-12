import type { z } from 'zod';
import type { IErrorHandler } from './error';
import type { ParsableRequest, RequestSchema } from './types';
import { mapRequestSchemaToZod } from './utils';
import { ZodRequestError } from './ZodRequestError';

const schemaDefaults = {
  method: ['GET', 'HEAD'],
  query: {},
  headers: {},
  cookies: {},
} as const;

export class ZodRequest<T extends RequestSchema> {
  constructor(
    public readonly schema: T,
    private errorHandler?: IErrorHandler
  ) {}

  /**
   *
   * @throws ZodRequestError in case of validation errors
   */
  parse = (
    req: ParsableRequest
  ): z.infer<ReturnType<typeof mapRequestSchemaToZod<T>>> => {
    const all = mapRequestSchemaToZod<T>(this.schema);
    const result = all.safeParse(req);
    if (result.success) {
      return result.data;
    }
    if (this.errorHandler) {
      throw this.errorHandler.process(result.error);
    }
    throw new ZodRequestError<typeof this.schema>(result.error);
  };
  static create = <S extends Partial<RequestSchema>>(params: {
    schema: S;
    errorHandler?: IErrorHandler;
    defaults?: RequestSchema;
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
