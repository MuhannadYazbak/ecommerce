import { test, expect } from '@playwright/test';
import { RegisterPage } from './logic/RegisterPage';

let registerPage : RegisterPage

test.beforeEach(async ({ page })=>{
    registerPage = new RegisterPage(page)
    await registerPage.navigate()
})

test('🔐 User can Register with valid credentials', async ({ page }) => {
    await page.route('**/api/register', async route => {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify({
                id: '123',
                name: 'Test User',
                role: 'user',
                token: 'mocked-token'
            })
        });
    });

    // await page.goto('/register');
    // await page.waitForSelector('h1');
    // await page.fill('#register-name', 'Automation Test');
    // await page.fill('#register-email', 'test@gmail.com');
    // await page.fill('#register-password', 'ABCdef1234');
    // await page.fill('#register-dob', '2012-08-13');
    // await page.click('button[type="submit"]');
    await registerPage.registerAs('Automation Test', 'test@gmail.com', 'ABCdef1234', new Date("2012-08-13"))
    await page.waitForURL('**/home', { timeout: 5000 });
    await expect(page).toHaveURL('/home');
});

test('❌ Registration fails with already used email', async ({ page }) => {

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
                    name: requestBody.fullname,
                    role: 'user',
                    token: 'mocked-token'
                })
            });
        }
    });

    // await page.goto('/register');
    // await page.fill('#register-name', 'Test User');
    // await page.fill('#register-email', 'Notalready@used.com');
    // await page.fill('#register-password', 'SecureP@ssw0rd');
    // await page.fill('#register-dob', '2000-05-15');
    // await page.click('button[type="submit"]');
    await registerPage.registerAs('Test User', 'Notalready@used.com', 'SecureP@ssw0rd', new Date("2000-05-15"))

    page.once('dialog', async dialog => {
        expect(dialog.message()).toContain('Something went wrong');
        await dialog.dismiss();
    });

    
});

test('❌ Future Date Failed Registration', async ({ page }) => {

    await page.route('**/api/register', async route => {
        const requestBody = JSON.parse(await route.request().postData() || '{}');
            await route.fulfill({
                status: 409,
                contentType: 'application/json',
                body: JSON.stringify({ error: 'Email already in use' })
            });
    });

    // await page.goto('/register');
    // await page.fill('#register-name', 'Test User');
    // await page.fill('#register-email', 'Notalready@used.com');
    // await page.fill('#register-password', 'SecureP@ssw0rd');
    // await page.fill('#register-dob', '2030-05-15');
    // await page.click('button[type="submit"]');
    await registerPage.registerAs('Test User', 'Notalready@used.com', 'SecureP@ssw0rd', new Date("2030-05-15"))
    page.once('dialog', async dialog => {
        expect(dialog.message()).toContain("Date can't be in the future.");
        await dialog.dismiss();
    });
});

test('🔙 Back button on Reigster page redirects to landing', async ({ page }) => {
  await page.goto('/');
  await page.click('text=register'); // assuming this triggers real navigation

  await page.waitForURL('/register'); // confirm navigation to register
  //await page.click('text=Back'); // trigger router.back()
  await registerPage.back()
  console.log('After back, current URL:', page.url());

  //await page.waitForURL('/', { timeout: 5000 }); // wait for landing page
  //await page.waitForURL('/', { waitUntil: 'domcontentloaded', timeout: 5000 });
  await expect(page).not.toHaveURL('/reigster');
});



