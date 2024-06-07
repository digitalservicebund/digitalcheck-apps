import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  moduleDirectories: ["node_modules", "<rootDir>"],
  setupFilesAfterEnv: ["<rootDir>/tests/jest.setup.ts"],
  collectCoverageFrom: [
    "components/**/*.{ts,tsx,js,jsx}",
    "services/**/*.{ts,tsx,js,jsx}",
    "!**/*.d.ts",
  ],
};

export default config;
