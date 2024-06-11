import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testPathIgnorePatterns: ["<rootDir>/tests/e2e", "<rootDir>/tests/a11y"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!**/*.d.ts"],
};

export default config;
