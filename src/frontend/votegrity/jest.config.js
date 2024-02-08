module.exports = {
  moduleNameMapper: {
      "^axios$": "<rootDir>/src/__mocks__/mockAxios.js"
  },
  preset: '@vue/cli-plugin-unit-jest',
  setupFiles: ['./jest.setup.js'],
};
