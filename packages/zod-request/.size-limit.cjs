// @ts-check

/**
 * Will ensure esm tree-shakeability and total size are within expectations.
 *
 * @link https://github.com/ai/size-limit/
 * @type {{name: string, path: string[], limit: string, import?: string, webpack?: boolean}[]}
 */
module.exports = [
  // ###################################################
  // ESM full bundle and individual imports
  // ###################################################
  {
    name: "ESM (import everything without deps)",
    path: ["dist/esm/index.js"],
    import: "*",
    webpack: false,
    limit: "2KB",
  },
  {
    name: "ESM (import everything with deps)",
    path: ["dist/esm/index.js"],
    import: "*",
    webpack: true,
    limit: "13.5KB",
  },
];
