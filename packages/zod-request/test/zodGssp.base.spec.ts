import { z } from 'zod';
import { zodGssp } from '../src';
import { createGsspContext } from './_helpers';

describe('zodGssp tests', () => {
  describe('when gssp context is valid', () => {
    it('should parse without error and return data', () => {
      const context = createGsspContext({
        req: {
          method: 'GET',
          headers: {
            authorization: 'Bearer <my_token>',
          },
          cookies: {},
        },
        query: {
          orderBy: 'levels',
        },
      });
      const schema = {
        query: {
          orderBy: z.string(),
        },
        method: 'GET',
        headers: {
          authorization: z.string().startsWith('Bearer'),
        },
        cookies: {},
      } as const;

      const { query, method, headers, cookies } =
        zodGssp(schema).parse(context);

      expect(method).toStrictEqual(context.req.method);
      expect(query).toStrictEqual(context.query);
      expect(typeof query.orderBy).toStrictEqual('string');
      expect(headers).toStrictEqual(context.req.headers);

      expect(headers.authorization).toStrictEqual(
        context.req.headers.authorization
      );
      expect(cookies).toStrictEqual({});
    });
  });
});
