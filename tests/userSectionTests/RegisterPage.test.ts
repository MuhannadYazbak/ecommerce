import { test, expect } from '@playwright/test';
import { RegisterPage } from '../logic/RegisterPage';
import { annotateTest } from '../utils/annotate';
import { User } from '@/types/user';

let registerPage: RegisterPage

let user: User = {
  id: 123,
  fullname: 'Test User',
  email: 'user@newtest.com',
  dateOfBirth: new Date(1991,3,8),
  password: 'User-1234',
  role: 'user'
}

test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page)
    await registerPage.navigate()
    //await page.waitForLoadState('networkidle')
})

test('🔐 User can Register with valid credentials', async ({ page }) => {
    annotateTest({ feature: 'RegisterPage' })
    await page.route('**/api/register', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: '123',
                fullname: 'Test User',
                email: 'user@newtest.com',
                dateOfBirth: new Date(1991,8,3),
                password: 'user-1234',
                role: 'user',
                token: 'mocked-token'
            })
        });
    });
    await registerPage.registerAs('Automation Test', 'اختبار اتمتة','בדיקת אוטומציה', 'test@gmail.com', 'ABCdef1234', new Date("2012-08-13"))
    await page.waitForURL('**/home', { timeout: 5000 });
    await expect(page).toHaveURL('/home');
});

test('❌ Registration fails with already used email', async ({ page }) => {
    annotateTest({ feature: 'RegisterPage' })
    await page.route('**/api/register', async route => {
        const requestBody = JSON.parse(await route.request().postData() || '{}');

        if (requestBody.email === 'already@used.com') {
            await route.fulfill({
                status: 409,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Email already in use' })
            });
        } else {
            await route.fulfill({
                status: 200,
                contentType: 'application/json',
                body: JSON.stringify({
                    id: '456',
                    fullname: requestBody.fullname,
                    email: 'user@newtest.com',
                    dateOfBirth: new Date(1991,8,3),
                    password: 'user-1234',
                    role: 'user',
                    token: 'mocked-token'
                })
            });
        }
    });
    await registerPage.registerAs('Test User','مستخدم تجريبي','משתמש בדיקה', 'Notalready@used.com', 'SecureP@ssw0rd', new Date("2000-05-15"))

    page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('Something went wrong');
        await dialog.dismiss();
    });
});

test('❌ Future Date Failed Registration', async ({ page }) => {
    annotateTest({ feature: 'RegisterPage' })
    await page.route('**/api/register', async route => {
        const requestBody = JSON.parse(await route.request().postData() || '{}');
        await route.fulfill({
            status: 409,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Email already in use' })
        });
    });
    await registerPage.registerAs('Test User', 'مستخدم تجريبي', 'משתמש בדיקה', 'Notalready@used.com', 'SecureP@ssw0rd', new Date("2030-05-15"), false)
    page.once('dialog', async dialog => {
        expect(dialog.message()).toContain("Date can't be in the future.");
        await dialog.dismiss();
    });
});

test('🔙 Back button on Reigster page redirects to landing', async ({ page }) => {
    annotateTest({ feature: 'RegisterPage' })
    await page.goto('/');
    await page.click('text=register');

    await page.waitForURL('/register');
    await registerPage.back('/')
    console.log('After back, current URL:', page.url());
    await expect(page.url()).toBe('http://localhost:3000/');
});




