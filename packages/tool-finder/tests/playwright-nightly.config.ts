import { PlaywrightTestConfig } from "@playwright/test";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { allProjects } from "../../../playwright.config-base";
import configDefault from "./playwright.config";

// Get the directory name of the current module
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../", ".env.test") });

const config: PlaywrightTestConfig = {
  ...configDefault,
  fullyParallel: false,
  workers: 1,
  projects: allProjects,
};

export default config;
