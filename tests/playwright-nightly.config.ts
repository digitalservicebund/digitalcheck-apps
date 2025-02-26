import { PlaywrightTestConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import configDefault from "./playwright.config";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../", ".env.test") });

const config: PlaywrightTestConfig = {
  ...configDefault,
  fullyParallel: false,
  workers: 1,
  retries: 3, // retry more often to allow flaky tests to succeed
};

export default config;
