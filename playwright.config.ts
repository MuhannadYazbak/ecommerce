import { defineConfig, devices } from '@playwright/test';
// import dotenv from 'dotenv';
// dotenv.config({ path: '.env.docker' });
import dotenv from 'dotenv';
import fs from 'fs';

const envPath = fs.existsSync('.env.docker') && process.env.DOCKER_ENV === 'true'
  ? '.env.docker'
  : '.env.local';

dotenv.config({ path: envPath });

console.log('🔧 Loaded env file:', envPath);
console.log('🌐 BASE_URL:', process.env.BASE_URL);

export default defineConfig({
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    browserName: 'chromium',
    headless: true,
    trace: 'on-first-retry',
    storageState: 'auth.json'
  },
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});