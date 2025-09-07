import { test, expect } from "@playwright/test";
import { LoginPage } from "../logic/LoginPage";
import { annotateTest } from "../utils/annotate";

let loginPage : LoginPage

test('should load forgot password page', async ({ page }) => {
  annotateTest({feature: 'LoginToForgotMyPassword'})
  loginPage = new LoginPage(page)
  await loginPage.navigate()
  const forgotLink = page.locator('text=Forgot Your Password');
  await expect(forgotLink).toBeVisible();
  await forgotLink.click();
  await expect(page).toHaveURL('/forgotPassword')
});