module.exports = {
  testEnvironment: 'node',
  verbose: true,
  // Automatically clear mock calls and instances between every test
  clearMocks: true,
  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',
  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/chama-bot/src/config/', // Typically ignore config files from coverage
  ],
  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,
  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/tests/**/*.test.js', // Standard location for tests
    '**/?(*.)+(spec|test).js', // Also common spec/test naming
  ],
  // An array of directory names to be searched recursively up from the requiring module's location
  moduleDirectories: ['node_modules', 'src'],
};
