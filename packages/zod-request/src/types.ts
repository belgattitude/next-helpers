import type { IncomingHttpHeaders, IncomingMessage } from 'node:http';
import type { GetServerSidePropsContext, NextApiRequest } from 'next';
import type { ZodType, z, ZodIssue } from 'zod';
import type { httpMethods } from './constants';
import type {
  mapRequestSchemaToZod,
  mapServerSidePropsSchemaToZod,
} from './utils';
import type { ZodRequest } from './ZodRequest';
import type { ZodServerSideProps } from './ZodServerSideProps';

export type HttpMethod = (typeof httpMethods)[number];
export type HttpMethods = typeof httpMethods;

export type TupleOfHttpMethods = [HttpMethod, ...HttpMethod[]];

/**
 * Well-known headers that aren't specifically covered by @types/node IncomingHttpHeaders
 */
type AdditionalRequestHeaders = {
  /**
   * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Authorization
   */
  authorization: string;
};

/**
 * @see https://developer.mozilla.org/en-US/docs/Glossary/Request_header
 */
export type IncomingHttpHeadersKeys = keyof (IncomingHttpHeaders &
  AdditionalRequestHeaders);

/**
 * Schema for validating api routes requests (a.k.a NextApiRequest)
 */
export type RequestSchema = {
  method: HttpMethod | HttpMethod[] | string;
  query: Record<string, ZodType>;
  headers: Record<IncomingHttpHeadersKeys | string, ZodType>;
  cookies: Record<string, ZodType>;
};

export type ParsableRequest = Pick<
  NextApiRequest,
  'query' | 'cookies' | 'headers'
> &
  Pick<IncomingMessage, 'url'> & { method?: HttpMethod | string | undefined };

export type InferReqSchema<T extends Partial<RequestSchema>> = z.infer<
  ReturnType<
    typeof mapRequestSchemaToZod<{
      method: RequestSchema['method'];
      query: T['query'] extends undefined
        ? Record<string, never>
        : NonNullable<T['query']>;
      cookies: T['cookies'] extends undefined
        ? Record<string, never>
        : NonNullable<T['cookies']>;
      headers: T['headers'] extends undefined
        ? Record<string, never>
        : NonNullable<T['headers']>;
    }>
  >
>;

export type InferServerSidePropsSchema<
  T extends Partial<ServerSidePropsSchema>,
> = z.infer<
  ReturnType<
    typeof mapServerSidePropsSchemaToZod<{
      method: RequestSchema['method'];
      query: T['query'] extends undefined
        ? Record<string, never>
        : NonNullable<T['query']>;
      cookies: T['cookies'] extends undefined
        ? Record<string, never>
        : NonNullable<T['cookies']>;
      headers: T['headers'] extends undefined
        ? Record<string, never>
        : NonNullable<T['headers']>;
    }>
  >
>;

export type InferZodRequest<
  ZR extends ZodRequest<RequestSchema>,
  T = ZR['schema'],
> = z.infer<
  ReturnType<
    typeof mapRequestSchemaToZod<{
      method: RequestSchema['method'];
      query: T['query'] extends undefined
        ? Record<string, never>
        : NonNullable<T['query']>;
      cookies: T['cookies'] extends undefined
        ? Record<string, never>
        : NonNullable<T['cookies']>;
      headers: T['headers'] extends undefined
        ? Record<string, never>
        : NonNullable<T['headers']>;
    }>
  >
>;

export type InferZodServerSideProps<
  ZR extends ZodServerSideProps<ServerSidePropsSchema>,
  T = ZR['schema'],
> = z.infer<
  ReturnType<
    typeof mapRequestSchemaToZod<{
      method: RequestSchema['method'];
      query: T['query'] extends undefined
        ? Record<string, never>
        : NonNullable<T['query']>;
      cookies: T['cookies'] extends undefined
        ? Record<string, never>
        : NonNullable<T['cookies']>;
      headers: T['headers'] extends undefined
        ? Record<string, never>
        : NonNullable<T['headers']>;
    }>
  >
>;

/**
 * Schema for validating GetServerSidePropsContext
 */
export type ServerSidePropsSchema = Pick<
  RequestSchema,
  'method' | 'headers' | 'cookies'
> & {
  query: Record<string, ZodType>;
};

export type ParsableGsspContext = {
  query: GetServerSidePropsContext['query'];
  req: Pick<GetServerSidePropsContext['req'], 'cookies' | 'headers'> & {
    method?: HttpMethod | string | undefined;
  };
  locale?: GetServerSidePropsContext['locale'];
};

export type ZodIssueWithoutPath = Omit<ZodIssue, 'path'>;
