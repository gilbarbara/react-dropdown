module.exports = {
  collectCoverage: false,
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  globals: {
    'ts-jest': {
      tsconfig: 'test/tsconfig.json',
      diagnostics: {
        ignoreCodes: ['TS151001'],
      },
    },
  },
  moduleDirectories: ['node_modules', 'src'],
  moduleFileExtensions: ['js', 'json', 'jsx', 'ts', 'tsx'],
  preset: 'ts-jest',
  setupFilesAfterEnv: ['<rootDir>/test/__setup__/setupFilesAfterEnv.ts'],
  snapshotSerializers: ['jest-serializer-html', '@emotion/jest/serializer'],
  testEnvironment: 'jsdom',
  testEnvironmentOptions: {
    url: 'http://localhost:3000/',
  },
  testMatch: null,
  testRegex: '/test/.*?\\.(test|spec)\\.tsx?$',
  transform: {
    '\\.[jt]sx?$': 'esbuild-jest',
  },
  verbose: false,
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
};
