import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import fs from 'fs';

const envPath = fs.existsSync('.env.docker') && process.env.DOCKER_ENV === 'true'
  ? '.env.docker'
  : '.env.production';

// Safely load env file if it physically exists
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

// 💡 THE CI RESILIENCY FIX: Fall back gracefully instead of throwing a hard blocking error thread
const baseUrl = process.env.BASE_URL || process.env.CI_BASE_URL || 'http://localhost:3000';

console.log('🔧 Environment Context:', process.env.NODE_ENV || 'development');
console.log('🌐 Resolved Target BASE_URL:', baseUrl);

export default defineConfig({
  workers: process.env.CI ? 1 : 3, // Reduce workers to 1 on CI to prevent database concurrency blocks
  reporter: [['allure-playwright']],
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: baseUrl, // Use the safely resolved string here
    browserName: 'chromium',
    headless: true,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'user',
      testDir: './tests/userSectionTests',
      use: {
        storageState: 'auth.json',
      },
    },
    {
      name: 'admin',
      testDir: './tests/adminSectionTests',
      use: {
        storageState: 'auth.admin.json',
      },
    },
    {
      name: 'guest',
      testDir: './tests/guestSectionTests',
      use: {
        storageState: 'auth.guest.json',
      },
    },
    {
      name: 'forgotPassword',
      testDir: './tests/forgotPasswordSectionsTests',
    },
  ],
  // Add this right under the projects: [...] array inside your defineConfig:
  webServer: process.env.CI ? {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: false,
    timeout: 120000, // Hard limit of 2 minutes to compile and listen
  } : undefined,
});