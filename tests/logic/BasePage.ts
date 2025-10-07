import { Page, expect, Locator } from "@playwright/test";

export class BasePage {
    protected readonly page: Page;
    protected readonly url: string
    protected readonly backButton: Locator
    constructor(page: Page, url: string) {
        this.page = page;
        this.url = url;
        this.backButton = this.page.getByRole('button',{name:'backButton'});
    }
    async translatePage(lang: string){
        await this.page.setExtraHTTPHeaders({
            'Accept-Language': lang
        });
    }
    async navigate() {
        await this.page.goto(this.url);
    }

    async back(former: string): Promise<void> {
        await this.backButton.waitFor({ state: 'visible' });
        await expect(this.backButton).toBeAttached();
        await this.backButton.click();
        //await this.page.waitForTimeout(500)
    }


    async getTitle(): Promise<string> {
        return this.page.title();
    }

    async waitForSelector(selector: string): Promise<void> {
        await this.page.waitForSelector(selector);
    }

    async refresh(): Promise<void> {
        await this.page.reload(); // uses Playwright's reload for current page
    }

    async logout(): Promise<void> {
        await this.page.getByText('Logout').click()
    }

    async getCurrentURL(): Promise<string> {
        return this.page.url();
    }
    async waitForLoad(): Promise<void> {
        await this.page.waitForLoadState('networkidle');
    }

}