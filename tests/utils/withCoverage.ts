import fs from 'fs';

export async function withCoverage(page: any, testFn: () => Promise<void>, name: string) {
  await page.coverage.startJSCoverage();
  await testFn();
  const coverage = await page.coverage.stopJSCoverage();
  fs.writeFileSync(`coverage-${name}.json`, JSON.stringify(coverage));
}

// Then run it like :

// import { test } from '@playwright/test';
// import { withCoverage } from './utils/withCoverage';

// test('checkout flow', async ({ page }) => {
//   await withCoverage(page, async () => {
//     await page.goto('/checkout');
//     // Interactions...
//   }, 'checkout');
// });