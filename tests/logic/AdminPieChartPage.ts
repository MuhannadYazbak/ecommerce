import { expect, Page, Locator } from '@playwright/test';
import { BasePage } from './BasePage'
import en from '@/locales/en/translation.json'
import ar from '@/locales/ar/translation.json'
import he from '@/locales/he/translation.json'
const translations = { en, ar, he}
type LangCode = keyof typeof translations;
const currentLang: LangCode = 'en'; // or 'ar', 'he'
const t = translations[currentLang]

export class AdminPieChartPage extends BasePage {
    readonly dateInput: Locator
    readonly chartWrapper: Locator
    readonly loadingText: Locator
    readonly tooltip: Locator
    constructor(page: Page) {
        super(page, '/admin/pieChart');
        this.dateInput = this.page.locator('input[type="date"]');
        this.chartWrapper = this.page.locator('[data-testid="pie-chart-wrapper"]');
        this.loadingText = this.page.locator(`p[role='loading']`);
        this.tooltip = this.page.locator('.chartjs-tooltip');

    }

    async selectDate(date: string) {
        await this.dateInput.fill(date);
    }

    async waitForChart() {
        await expect(this.loadingText).toBeHidden();
        await expect(this.chartWrapper).toBeVisible();
    }

    async clickSlice() {
        // Simulate click on chart slice (needs pixel targeting or plugin)
        await this.page.mouse.click(200, 200); // Adjust coordinates
        await expect(this.tooltip).toBeVisible();
    }
}