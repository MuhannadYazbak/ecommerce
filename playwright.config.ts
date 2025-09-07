import { defineConfig, devices } from '@playwright/test';
// import dotenv from 'dotenv';
// dotenv.config({ path: '.env.docker' });
import dotenv from 'dotenv';
import fs from 'fs';

const envPath = fs.existsSync('.env.docker') && process.env.DOCKER_ENV === 'true'
  ? '.env.docker'
  : '.env.production';

dotenv.config({ path: envPath });

if(! process.env.BASE_URL) {
    throw new Error(`❌ BASE_URL is not defined in ${envPath}`);
}

console.log('🔧 Loaded env file:', envPath);
console.log('🌐 BASE_URL:', process.env.BASE_URL);

export default defineConfig({
  workers: 2,
  reporter: [['allure-playwright']],
  testDir: './tests',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  use: {
    baseURL: process.env.BASE_URL,
    // || 'http://localhost:3000',
    browserName: 'chromium',
    headless: true,
    trace: 'on',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
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
    name: 'forgotPassword',
    testDir: './tests/forgotPasswordSectionsTests',
  },
],
});