import { zodReq } from '@nextvalid/zod-request';

import type { NextApiHandler } from 'next';
import { z } from 'zod';
import { ConsoleLogger } from '@/lib';
import { withApiErrorHandler } from '@/server';

const schema = zodReq({
  method: 'GET',
  query: {
    name: z.string().min(3).max(80),
    email: z.string().email('Invalid email').optional(),
  },
  headers: {
    host: z.string().optional(),
    authorization: z
      .string()
      .regex(/^bearer /i)
      .optional(),
  },
});

// Try it out http://localhost:3000/api/basic/Guillermo?email=me@example.com
const getHandler: NextApiHandler = async (req, res) => {
  const { query, headers, method } = schema.parse(req);

  const { name, email } = query;
  res.json({
    title: `Greetings ${name.toUpperCase()} !`,
    email: email ? `Your email is ${email}` : `No email provided`,
    host: headers.host ?? '<missing host header>',
    method,
  });
};

export default withApiErrorHandler({
  logger: new ConsoleLogger(),
})(getHandler);
