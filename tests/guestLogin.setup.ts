import { chromium } from '@playwright/test';
import { config } from 'dotenv';
import fs from 'fs';

// Load the correct env file
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
    localStorage.setItem('guest', JSON.stringify({
      id: 123,
      name: 'Guest User',
      role: 'guest'
    }));
  });

  await page.context().storageState({ path: 'auth.guest.json' });
  await browser.close();
  console.log('✅ User auth state saved to auth.json');
})();