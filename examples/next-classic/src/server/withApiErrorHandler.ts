import {
  createHttpException,
  HttpBadRequest,
  HttpMethodNotAllowed,
  type HttpException,
} from '@httpx/exception';
import { convertToSerializable } from '@httpx/exception/serializer';
import { ZodRequestError } from '@nextvalid/zod-request';
import type { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { ConsoleLogger, type LoggerInterface } from '@/lib';

type Params = {
  logger?: LoggerInterface;
  defaultStatusCode?: number;
};

const defaultLogger = new ConsoleLogger();

/**
 * Basic example of a nextjs api centralized error handler.
 * @see https://github.com/belgattitude/http-exception
 */
export const withApiErrorHandler = (params?: Params) => {
  const { logger = defaultLogger, defaultStatusCode = 500 } = params ?? {};
  return (handler: NextApiHandler): NextApiHandler =>
    async (req: NextApiRequest, res: NextApiResponse): Promise<void> => {
      try {
        await handler(req, res);
      } catch (e) {
        // @see ./logger.ts
        logger.log(`[api-error] ${req.url}`, e);

        let err: HttpException;
        if (e instanceof ZodRequestError) {
          if (e.requestError.method) {
            err = new HttpMethodNotAllowed({
              message: e.message,
              url: req.url,
            });
          } else {
            err = new HttpBadRequest({
              message: e.message,
              url: req.url,
            });
          }
        } else {
          err = createHttpException(defaultStatusCode, {
            message: e instanceof Error ? e.message : 'Unknown error',
            url: req.url,
          });
        }

        const payload = {
          // add anything that can be useful from HttpException
          statusCode: err.statusCode,
          message: err.message,
          url: req.url,
          // Optionally
          debug: getDebug(err),
        };

        res.setHeader('content-type', 'application/json; charset: utf-8');
        res.status(payload.statusCode).send(
          JSON.stringify(
            {
              success: false,
              error: payload,
            },
            null,
            2
          )
        );
      }
    };
};

const getDebug = (e: HttpException) => {
  const maxStackLines = 5;
  return process.env.NODE_ENV === 'development'
    ? {
        ...convertToSerializable(e),
        stack: e.stack?.split('\n').splice(0, maxStackLines).join('\n'),
      }
    : undefined;
};
