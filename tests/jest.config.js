module.exports = {
  testEnvironment: 'jsdom',
  rootDir: '../',
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],
  testMatch: [
    '<rootDir>/tests/unit/**/*.test.js',
    '<rootDir>/tests/integration/**/*.test.js'
  ],
  collectCoverageFrom: [
    'src/**/*.js',
    'script.js',
    '!src/**/*.test.js',
    '!src/templates/**',
    '!node_modules/**',
    '!coverage/**',
    '!tests/**'
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'lcov', 'html', 'json'],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    },
    './src/': {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  moduleNameMapping: {
    '^@/(.*)
: '<rootDir>/src/$1'
  },
  transform: {
    '^.+\\.js
: 'babel-jest'
  },
  testTimeout: 10000
};
