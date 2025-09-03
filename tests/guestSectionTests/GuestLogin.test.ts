import { test, expect} from '@playwright/test'
import { LandingPage } from '../logic/LandingPage'
import { annotateTest } from '../utils/annotate'

test('Guest can log in into /home', async ({ page }) => {
    annotateTest({feature: 'GuestLogin'})
    const landingPage = new LandingPage(page)
    await landingPage.navigate()
    await page.waitForTimeout(500)
    await landingPage.clickContinueAsGuest()
    await page.screenshot({path: 'test-screenshots/new/guestAtHome.png'})
    await expect(page).toHaveURL('/home');
})