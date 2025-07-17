import { chromium } from '@playwright/test';
import fs from 'fs';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Simulate login by setting localStorage
  await page.goto('http://localhost:3000'); // or your dev URL
  await page.evaluate(() => {
    localStorage.setItem('token', 'mocked-token');
    localStorage.setItem('user', JSON.stringify({
      id: '123',
      name: 'Test User',
      role: 'user'
    }));
  });

  // Save storage state
  await page.context().storageState({ path: 'auth.json' });
  await browser.close();
})();