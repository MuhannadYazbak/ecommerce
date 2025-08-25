import { test, expect } from '@playwright/test';
import { AdminBarChartPage } from './logic/AdminBarChartPage';
import { annotateTest } from './utils/annotate';
import { AdminItemsPage } from './logic/AdminDashboardPage';

let chartPage: AdminBarChartPage
test.use({storageState: 'auth.admin.json'})
test.beforeEach(async ({ page })=>{
  chartPage = new AdminBarChartPage(page);
  await chartPage.navigate();
})
test('Bar chart loads and displays correctly', async ({ page }) => {
  annotateTest({ feature: 'AdminBarChartPage' })
  await chartPage.waitForChart();
  await page.screenshot({path: './test-screenshots/barchart.png'})
  expect(await chartPage.heading.isVisible()).toBeTruthy();
  expect(await chartPage.isChartVisible()).toBeTruthy();

  const bars = await chartPage.getBarCount();
  expect(bars).toBeGreaterThan(0);
});

test('Tooltip appears on bar hover', async ({ page }) => {
  annotateTest({ feature: 'AdminBarChartPage'});
  await chartPage.waitForChart();
  const canvasBox = await chartPage.chartBars.boundingBox();
  if (!canvasBox) throw new Error('Canvas not found');

  // Simulate hover near center of canvas
  await page.mouse.move(canvasBox.x + canvasBox.width / 2, canvasBox.y + canvasBox.height / 2);
  await page.waitForTimeout(500); 

  await page.screenshot({ path: './test-screenshots/tooltip-hover.png' });
});

test('Chart is responsive to viewport changes', async ({ page }) => {
  annotateTest({ feature: 'AdminBarChartPage'});
  await page.setViewportSize({ width: 800, height: 600 });
  await chartPage.waitForChart();
  expect(await chartPage.isChartVisible()).toBeTruthy();
});

test('Back button navigates correctly', async ({ page }) => {
  annotateTest({ feature: 'AdminBarChartPage'});
  const adminDashboard = new AdminItemsPage(page)
  await adminDashboard.navigate()
  //await page.waitForLoadState('networkidle')
  await adminDashboard.goToBarChart()
  chartPage = new AdminBarChartPage(page);
  await chartPage.navigate();
  await chartPage.waitForChart();
  await chartPage.back('/admin/items')
  //expect(page.url()).not.toContain('/admin/chart');
  await expect(page).toHaveURL(/\/admin\/items/);
});
