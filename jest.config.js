module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coveragePathIgnorePatterns: ['<rootDir>/config'],
  setupTestFrameworkScriptFile: '<rootDir>/config/setupTests.ts',
  testMatch: ['<rootDir>/src/**/?(*.)+(spec|test).ts?(x)'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
};
