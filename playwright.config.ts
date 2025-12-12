import { defineConfig, devices } from "@playwright/test";
import * as dotenv from "dotenv";

dotenv.config();

/**
 * Client-specific base URLs from .env
 */

const demoClientBaseURL = process.env.DEMO_CREDIT_UNION_BASE_URL;

if (!demoClientBaseURL) {
  throw new Error(
    "Missing DEMO_CLIENT_BASE_URL. Add it to your .env or your environment.",
  );
}

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [["html", { open: "never" }]],

  // Shared defaults for all projects
  use: {
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    permissions: [],
    launchOptions: {
      args: [
        "--use-fake-device-for-media-stream=none",
        "--use-fake-ui-for-media-stream",
      ],
    },
  },

  projects: [
    {
      name: "demoClient",
      testDir: "./tests/demoClient",
      use: {
        browserName: "chromium",
        channel: "chrome",
        baseURL: demoClientBaseURL,
        headless: true,
      },
    },
  ],
});
