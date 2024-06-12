# @nextvalid/zod-request

Convenient request validation for nextjs api routes, getServerSideProps and
getStaticProps.

[![npm](https://img.shields.io/npm/v/@nextvalid/zod-request?style=for-the-badge&labelColor=222)](https://www.npmjs.com/package/@nextvalid/zod-request)
[![size](https://img.shields.io/bundlephobia/minzip/@nextvalid/zod-request@latest?label=MinGZIP&style=for-the-badge&labelColor=333&color=informational)](https://bundlephobia.com/package/@nextvalid/zod-request@latest)
[![node](https://img.shields.io/static/v1?label=Node&message=14%2b&logo=node.js&style=for-the-badge&labelColor=444&color=informational)](https://browserslist.dev/?q=PjAuMjUlLCBub3QgZGVhZA%3D%3D)
[![dist](https://img.shields.io/static/v1?label=&message=esm|treeshake&logo=webpack&style=for-the-badge&labelColor=444&color=informational)](https://github.com/belgattitude/nextvalid/blob/main/packages/nextvalid/.size-limit.cjs)
[![ci](https://img.shields.io/github/checks-status/belgattitude/nextvalid/main?label=CI&logo=github&style=for-the-badge&labelColor=444)](https://github.com/belgattitude/nextvalid/actions?query=branch%3Amain)
[![codecov](https://img.shields.io/codecov/c/github/belgattitude/nextvalid?logo=codecov&style=for-the-badge&labelColor=444)](https://codecov.io/gh/belgattitude/nextvalid)
[![techdebt](https://img.shields.io/codeclimate/tech-debt/belgattitude/nextvalid?label=TechDebt&logo=code-climate&style=for-the-badge&labelColor=444)](https://codeclimate.com/github/belgattitude/nextvalid)
[![maintainability](https://img.shields.io/codeclimate/maintainability/belgattitude/nextvalid?label=Maintainability&logo=code-climate&style=for-the-badge&labelColor=444)](https://codeclimate.com/github/belgattitude/nextvalid)
[![license](https://img.shields.io/npm/l/@nextvalid/zod-request?style=for-the-badge&labelColor=000000)](https://github.com/belgattitude/nextvalid/blob/main/LICENSE)

## Documentation

```bash
npm install @nextvalid/zod-request
yarn add @nextvalid/zod-request
```

## Quick start

### Api routes

Define a schema

```typescript
import type { NextApiHandler } from "next";
import { zodReq } from "@nextvalid/zod-request";
import { z } from "zod";

const zr = zodReq({
  method: "GET",
  query: {
    email: z.string().email("Invalid email").optional(),
  },
  headers: {
    // authorization: z.string().regex(/^bearer /i),
  },
});

const getHandler: NextApiHandler = async (req, res) => {
  const { query, headers } = zr.parse(req);

  const { email } = query; // email is typed to `string | undefined`
  res.json({
    email: email ? `Your email is ${email}` : `No email provided`,
  });
};

export default withApiErrorHandler({
  logger: new ConsoleLogger(),
})(getHandler);
```

### SSR pages

`getServerSideProps`, `getStaticProps`

## Support

Open [an issue](https://github.com/belgattitude/nextvalid/issues).

## Sponsors

If my OSS work brightens your day, let's take it to new heights together!
[Sponsor](<[sponsorship](https://github.com/sponsors/belgattitude)>), [coffee](<(https://ko-fi.com/belgattitude)>),
or star – any gesture of support fuels my passion to improve. Thanks for being awesome! 🙏❤️

## License

MIT © [belgattitude](https://github.com/belgattitude) and contributors.
