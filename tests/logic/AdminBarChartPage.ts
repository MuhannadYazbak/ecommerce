import { Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage';
import en from '@/locales/en/translation.json'
import ar from '@/locales/ar/translation.json'
import he from '@/locales/he/translation.json'
const translations = { en, ar, he}
type LangCode = keyof typeof translations;
const currentLang: LangCode = 'en'; // or 'ar', 'he'
const t = translations[currentLang]


export class AdminBarChartPage extends BasePage {
    readonly heading: Locator;
    readonly backButton: Locator;
    readonly chartBars: Locator;
    readonly loadingText: Locator;

    constructor(page: Page) {
        super(page, '/admin/chart')
        this.heading = page.locator('h1', { hasText: t.adminBarChartTitle });
        this.backButton = page.locator('button', { hasText: en.back });
        this.chartBars = page.locator('canvas');
        this.loadingText = page.locator(`text=${t.loading}`);
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