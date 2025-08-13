import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';


export class AdminBarChartPage extends BasePage {
    readonly heading: Locator;
    readonly backButton: Locator;
    readonly chartBars: Locator;
    readonly loadingText: Locator;

    constructor(page: Page) {
        super(page, '/admin/chart')
        this.heading = page.locator('h1', { hasText: 'Orders by Date Bar Chart' });
        this.backButton = page.locator('button', { hasText: 'Back' });
        this.chartBars = page.locator('canvas');
        this.loadingText = page.locator('text=Loading chart...');
    }

    async waitForChart() {
        await this.loadingText.waitFor({ state: 'detached' });
    }

    async getBarCount(): Promise<number> {
        return await this.chartBars.count();
    }

    async clickBar(index: number) {
        await this.chartBars.nth(index).click();
    }

    async isChartVisible(): Promise<boolean> {
        return await this.chartBars.first().isVisible();
    }
}