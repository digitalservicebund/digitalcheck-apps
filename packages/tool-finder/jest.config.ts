import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "<rootDir>/src"],
  testPathIgnorePatterns: ["<rootDir>/test/e2e", "<rootDir>/test/a11y"],
  setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
  collectCoverageFrom: ["src/**/*.{ts,tsx,js,jsx}", "!**/*.d.ts"],
};

export default config;
