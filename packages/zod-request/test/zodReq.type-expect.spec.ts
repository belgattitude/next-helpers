import { expectTypeOf } from 'vitest';
import { z } from 'zod';
import { zodReq, type InferReqSchema } from '../src';
import { createNextRequest } from './_helpers';

describe('zodReq type expectations', () => {
  const req = createNextRequest({
    query: {
      regexp: 'belgattitude',
      stringToInt: '100',
      partOfEnum: 'TO_BE',
    },
    headers: {
      host: 'https://something.be/fr',
    },
    cookies: {
      userLocale: 'en',
    },
  });

  const schema = {
    method: 'GET',
    query: {
      regexp: z.string().regex(/belg/i),
      stringToInt: z.preprocess((input) => {
        const processed = z
          .string()
          .regex(/^\d+$/)
          .transform(Number)
          .safeParse(input);
        return processed.success ? processed.data : input;
      }, z.number().min(0)),
      partOfEnum: z.enum(['TO_BE', 'TO_HAVE', 'TO_DO']),
    },
    headers: {
      host: z.string().url(),
    },
    cookies: {
      userLocale: z.string().optional(),
    },
  };

  const validated = zodReq(schema).parse(req);

  it('should match expected typescript types', () => {
    // Minimal typecheck
    // cause when an error occurs, it's hard to read
    // @link https://vitest.dev/guide/testing-types.html#reading-errors

    expectTypeOf(validated.query.stringToInt).toEqualTypeOf<number>();

    // Full schema typechecks
    expectTypeOf(validated).toMatchTypeOf<{
      method: string;
      query: {
        regexp: string;
        stringToInt: number;
        partOfEnum: string;
      };
      headers: {
        host: string;
      };
      cookies: {
        userLocale?: string;
      };
    }>();
  });

  it('should match InferReqSchema', () => {
    type Inferred = InferReqSchema<typeof schema>;
    expectTypeOf(validated).toMatchTypeOf<Inferred>();
  });

  it('should pass expected runtime types', () => {
    expect(validated.method).toStrictEqual('GET');

    const { regexp, stringToInt, partOfEnum } = validated.query;
    expect(typeof stringToInt).toStrictEqual('number');
    expect(typeof regexp).toStrictEqual('string');
    expect(typeof partOfEnum).toStrictEqual('string');

    const { userLocale } = validated.cookies;
    expect(typeof userLocale).toStrictEqual('string');

    const { host } = validated.headers;
    expect(typeof host).toStrictEqual('string');
  });
});
