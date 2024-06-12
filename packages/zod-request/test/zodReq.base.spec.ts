import { z } from 'zod';
import { zodReq, ZodRequestError } from '../src';
import { createNextRequest } from './_helpers';

describe('zodReq tests', () => {
  describe('when empty schema is given', () => {
    it('should default to GET method', () => {
      const req = createNextRequest({
        method: 'GET',
      });
      const { method } = zodReq({}).parse(req);
      expect(method).toStrictEqual('GET');
    });
    it('should throw HttpMethodNotAllowed is not default GET', () => {
      const req = createNextRequest({
        method: 'POST',
      });
      expect(() => zodReq({}).parse(req)).toThrow(ZodRequestError);
    });
  });

  describe('when request payload is valid', () => {
    it('should parse without error and return data', () => {
      const req = createNextRequest({
        method: 'GET',
        query: {
          name: 'belgattitude',
          email: 'test@example.com',
        },
        headers: {
          authorization: 'Bearer <my_token>',
        },
      });
      const schema = {
        method: 'GET',
        query: {
          name: z.string(),
          email: z.string().email(),
        },
        headers: {
          authorization: z.string().startsWith('Bearer'),
        },
      } as const;

      const { query, headers, cookies, method } = zodReq(schema).parse(req);
      expect(method).toStrictEqual(req.method);
      expect(query).toStrictEqual(req.query);
      expect(typeof query.email).toStrictEqual('string');
      expect(headers.authorization).toStrictEqual(req.headers.authorization);
      expect(cookies).toStrictEqual({});
    });
  });

  describe('when method is not within allowed ones', () => {
    it('should throw HttpMethodNotAllowed', () => {
      expect(() => {
        zodReq({
          method: ['GET', 'POST'],
        }).parse(
          createNextRequest({
            method: 'PATCH',
          })
        );
      }).toThrow(ZodRequestError);
    });
  });

  describe('when method is invalid', () => {
    it('should throw HttpMethodNotAllowed', () => {
      expect(() =>
        zodReq({
          method: 'GET',
        }).parse(
          createNextRequest({
            method: 'POST',
          })
        )
      ).toThrow(ZodRequestError);
    });
  });

  describe('when query params are invalid', () => {
    it('should throw HttpBadRequest', () => {
      const req = createNextRequest({
        method: 'GET',
        query: {
          email: 'invalid-email.com',
        },
      });
      expect(() =>
        zodReq({
          method: 'GET',
          query: {
            email: z.string().email('Invalid email'),
          },
        }).parse(req)
      ).toThrow(ZodRequestError);
    });
  });
});
