import { z } from 'zod';
import { zodReq, ZodRequestError, type InferReqSchema } from '../src';
import { createNextRequest } from './_helpers';

describe('zodReq error tests', () => {
  describe('when query params are invalid', () => {
    it('should throw HttpBadRequest', () => {
      const req = createNextRequest({
        method: 'POST',
        query: {
          name: 'bob',
          email: 'invalid-email.com',
        },
        headers: {
          authorization: 'invalid',
        },
        cookies: {
          userLocale: 'unsupported',
        },
      });
      const zr = zodReq({
        method: 'GET',
        query: {
          name: z.string().trim().min(8).regex(/^ABC/),
          email: z.string().email('Invalid email'),
        },
        headers: {
          authorization: z
            .string()
            .regex(/^bearer/i)
            .optional(),
        },
        cookies: {
          userLocale: z.enum(['fr', 'en']),
        },
      });
      type Cool = InferReqSchema<(typeof zr)['schema']>;
      const c: Cool = {
        method: 'GET',
        query: {
          name: 'cool',
          email: 'cool',
        },
        headers: {
          authorization: 'cool',
        },
        cookies: {
          userLocale: 'fr',
        },
      };

      let error: ZodRequestError<(typeof zr)['schema']> | null = null;
      try {
        zr.parse(req);
      } catch (e) {
        error = e as ZodRequestError<(typeof zr)['schema']>;
      }
      expect(error).toBeInstanceOf(ZodRequestError);

      const errors = error?.getError();
      expect(errors).toMatchSnapshot();
      expect(errors?.query?.name).toStrictEqual([
        {
          code: 'too_small',
          exact: false,
          inclusive: true,
          message: 'String must contain at least 8 character(s)',
          minimum: 8,
          type: 'string',
        },
        {
          code: 'invalid_string',
          message: 'Invalid',
          validation: 'regex',
        },
      ]);
    });
  });
});
