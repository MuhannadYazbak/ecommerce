import { test, expect } from '@playwright/test';
import { AdminPieChartPage } from './logic/AdminPieChartPage';
import { AdminItemsPage } from './logic/AdminDashboardPage';
import { annotateTest } from './utils/annotate';

test.describe('Admin Pie Chart Page', () => {
    let pieChartPage: AdminPieChartPage;

    test.beforeEach(async ({ page }) => {
        pieChartPage = new AdminPieChartPage(page);
        await pieChartPage.navigate();
        await pieChartPage.selectDate('2025-07-02')
        await pieChartPage.waitForChart();
    });

    test('should render pie chart after loading', async () => {
        annotateTest({ feature: 'AdminPieChartPage' })
        await expect(pieChartPage.chartWrapper).toBeVisible();
    });

    test('should update chart when date is changed', async () => {
        annotateTest({ feature: 'AdminPieChartPage' })
        const newDate = '2025-07-02';
        await pieChartPage.selectDate(newDate);
        await pieChartPage.waitForChart();
        await expect(pieChartPage.chartWrapper).toBeVisible();
    });

    test('should show tooltip when slice is clicked', async ({ page}) => {
        annotateTest({ feature: 'AdminPieChartPage' })
        await page.mouse.move(200, 200);
        await page.waitForTimeout(500); // give tooltip time to appear
        await page.screenshot({path: 'pieChart-tooltip.png'})
        //await pieChartPage.clickSlice();
    });

    test('should navigate back using BasePage back()', async ({ page }) => {
        annotateTest({ feature: 'AdminPieChartPage' })
        const adminDashboard = new AdminItemsPage(page)
        await adminDashboard.navigate()
        await adminDashboard.goToPieChart()
        pieChartPage = new AdminPieChartPage(page);
        await pieChartPage.navigate();
        await pieChartPage.selectDate('2025-07-02')
        await pieChartPage.waitForChart();

        await pieChartPage.back('/admin/items')
        expect(page.url()).not.toContain('/admin/pieChart');
    });

    test('should handle no orders for selected date', async ({ page }) => {
        annotateTest({ feature: 'AdminPieChartPage' })
        await pieChartPage.selectDate('2020-01-01'); // known empty date
        await expect(page.locator('text=No chart data available')).toBeHidden();
        await expect(page.locator('text=showing pie for $2020-01-01')).toBeVisible();
        await expect(page.locator('[data-testid="empty-chart-message"]')).toBeVisible();
    });
});