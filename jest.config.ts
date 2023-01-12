/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    clearMocks: true,
    coverageProvider: "v8",
    moduleFileExtensions: ["js", "jsx", "ts", "tsx", "json","node"],
    roots: ["<rootDir>/src"],
    testMatch: ["**/__test__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"],
    transform: {
      "^.+\\.(ts|tsx)$": "ts-jest",
    },
    testEnvironment: 'node',
    preset: 'ts-jest',
    verbose: true,
    forceExit: true,
    // clearMocks: true
    collectCoverage:true
  };