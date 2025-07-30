import { Page } from "@playwright/test";

export class BasePage {
    protected readonly page: Page;
    protected readonly url: string
    constructor(page: Page, url: string) {
        this.page = page;
        this.url = url;
    }
    async navigate() {
        await this.page.goto(this.url);
    }

    async back() {
        const backButton = this.page.locator('#backButton')
        await backButton.click()
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

    async logout() : Promise<void> {
        await this.page.getByText('Logout').click()
    }

}