import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/app"],
  moduleNameMapper: {
    "~/(.*)": "<rootDir>/app/$1",
  },
  testPathIgnorePatterns: ["<rootDir>/tests/e2e", "<rootDir>/tests/a11y"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  collectCoverageFrom: ["app/**/*.{ts,tsx,js,jsx}", "!**/*.d.ts"],
};

export default config;
