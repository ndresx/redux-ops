module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  collectCoverageFrom: ['<rootDir>/src/**/*.{ts,tsx}'],
  setupFilesAfterEnv: ['<rootDir>/config/setupTests.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  globals: {
    'ts-jest': {
      diagnostics: false,
    },
  },
};
