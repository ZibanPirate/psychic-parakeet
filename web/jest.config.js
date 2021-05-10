module.exports = {
  testEnvironment: "jsdom",
  collectCoverageFrom: ["src/**/*.{ts,tsx}"],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  transform: {
    "^.+\\.(ts|tsx|js|jsx)?$": "ts-jest",
  },
  transformIgnorePatterns: ["node_modules/(?!react-syntax-highlighter)"],
  coveragePathIgnorePatterns: ["node_modules", "dist", "src/entry"],
  modulePaths: ["<rootDir>"],
  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/__mocks__/file-mock.ts",
    "\\.(css|scss|less)$": "identity-obj-proxy",
  },
};
