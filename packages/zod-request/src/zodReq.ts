import type { IErrorHandler } from './error';
import type { RequestSchema } from './types';
import { ZodRequest } from './ZodRequest';

/**
 * Convenience helper for ZodRequest
 *
 * ```ts
 * import { zodReq } from '@nextvalid/zod-quest';
 * import { z } from 'zod';
 * import type { NextApiRequest, NextApiResponse } from 'next';
 *
 * const apiRoute: NextApiHandler = async (req, res) => {
 *   const schema = zodReq({
 *     method: 'GET',
 *     query: { email: z.string().email() },
 *     // headers, cookies...
 *  });
 *  // Will throw if `?=email=value` didn't pass validation
 *  const { query } = schema.parse(req);
 *  // Otherwise
 *  // -> query.email is string (validated as email)
 * }
 *
 * // Optionally enclose with an HOF/middleware that catches the exception
 * // ie: withExceptionHandler(apiRoute)
 * export default apiRoute;
 * ```
 */
export const zodReq = <S extends Partial<RequestSchema>>(
  schema: S,
  errorHandler?: IErrorHandler
) => {
  return ZodRequest.create({ schema, errorHandler });
};
