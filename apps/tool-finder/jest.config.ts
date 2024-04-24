import type { Config } from "@jest/types";

const config: Config.InitialOptions = {
  moduleFileExtensions: ["js", "ts", "tsx", "json"],
  transform: {
    "^.+\\.(j|)tsx?$": "ts-jest",
  },
  testEnvironment: "jsdom",
  testPathIgnorePatterns: ["<rootDir>/test/e2e", "<rootDir>/test/a11y"],
  collectCoverageFrom: ["src/**", "!**/*.d.ts"],
};

export default config;
