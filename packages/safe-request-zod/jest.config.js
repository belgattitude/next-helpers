// @ts-check
import { getTsconfig } from 'get-tsconfig';
import { pathsToModuleNameMapper } from 'ts-jest';
import { getJestCachePath } from '../../cache.config.mjs';

const tsConfigFile = new URL('./tsconfig.json', import.meta.url).pathname;

/**
 * Transform the tsconfig paths into jest compatible one (support extends)
 * @param {string} tsConfigFile
 */
const getTsConfigBasePaths = (tsConfigFile) => {
  const parsedTsConfig = getTsconfig(tsConfigFile);
  if (parsedTsConfig === null) {
    throw new Error(`Cannot find tsconfig file: ${tsConfigFile}`);
  }
  const tsPaths = parsedTsConfig.config.compilerOptions?.paths;
  return tsPaths
    ? pathsToModuleNameMapper(tsPaths, {
        prefix: '<rootDir>/',
      })
    : {};
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
const config = {
  cacheDirectory: getJestCachePath('safe-request-zod'),
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  verbose: true,
  rootDir: './',
  testMatch: ['<rootDir>/**/*.{spec,test}.{js,ts}'],
  moduleNameMapper: {
    ...getTsConfigBasePaths(tsConfigFile),
  },
  transform: {
    '^.+\\.m?[tj]sx?$': [
      'ts-jest',
      {
        tsconfig: tsConfigFile,
      },
    ],
  },

  // false by default, overrides in cli, ie: yarn test:unit --collect-coverage=true
  collectCoverage: false,
  coverageDirectory: '<rootDir>/../coverage',
  collectCoverageFrom: [
    '<rootDir>/**/*.{ts,tsx,js,jsx}',
    '!**/*.test.{js,ts}',
    '!**/__mock__/*',
  ],
};

export default config;
