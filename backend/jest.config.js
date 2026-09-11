/** @type {import('jest').Config} */
const config = {
  testEnvironment: "node",
  globalSetup: "./tests/setup.js",
  globalTeardown: "./tests/teardown.js",
  testTimeout: 30000,
};

module.exports = config;
