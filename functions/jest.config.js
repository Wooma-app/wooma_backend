module.exports = {
    preset: 'ts-jest',               // Use ts-jest preset for TypeScript support
    testEnvironment: 'node',         // Set the test environment to node (common for backend tests)
    transform: {
      '^.+\\.tsx?$': 'ts-jest',      // Use ts-jest to transform TypeScript files
    },
    moduleFileExtensions: ['ts', 'js'], // Ensure that Jest recognizes .ts and .js files
    transformIgnorePatterns: ['node_modules/(?!(some-package)/)'],  // Optionally add packages you want to transform
    moduleNameMapper: {
        '^firebase-admin$': '<rootDir>/__mocks__/firebase-admin.js',
    },
};