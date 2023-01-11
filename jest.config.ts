// export default{
//     clearMocks: true,
//     collectCoverage:true,
//     coverageDirectory:'coverage',
//     coveragePathIgnorePatterns:['/node_modules/'],
//     coverageProvider:'v8',
//     root:['<roots>/src/'],
//     preset:"ts-jest",
//     testEnvironment:"jest-environment-node",
//     testMatch:['**/_test_/**/*.ts'],
// }

module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ["**/**/*.test.ts"],
    verbose: true,
    forceExit: true,
    // clearMocks: true
    collectCoverage:true
  };