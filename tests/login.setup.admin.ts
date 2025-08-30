import { chromium } from '@playwright/test';
import { config } from 'dotenv';
import fs from 'fs';

// Dynamically choose env file
const envPath = fs.existsSync('.env.docker') && process.env.DOCKER_ENV === 'true'
  ? '.env.docker'
  : '.env.local';

config({ path: envPath });

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  const baseUrl = process.env.BASE_URL;
  if (!baseUrl) throw new Error('❌ BASE_URL is not defined');

  console.log(`🔗 Navigating to: ${baseUrl}`);
  await page.goto(baseUrl);

  await page.evaluate(() => {
    localStorage.setItem('token', 'mocked-token');
    localStorage.setItem('user', JSON.stringify({
      id: 1,
      name: 'Admin User',
      role: 'admin'
    }));
  });

  await page.context().storageState({ path: 'auth.admin.json' });
  await browser.close();
  console.log('✅ Admin auth state saved to auth.admin.json');
})();