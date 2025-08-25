import { test, expect } from '@playwright/test';
import { CheckoutPage } from './logic/CheckoutPage'
import { PaymentDetails } from '@/types/payment';
import { Address } from '@/types/address';
import { annotateTest } from './utils/annotate';

let checkoutPage: CheckoutPage;

const selectedItems = [101, 102];

const mockPayment: PaymentDetails = {
  name: 'Muhannad Tester',
  cardNumber: '4111111111111111',
  expiryMonth: '12',
  expiryYear: '2026',
  cvv: '123',
};

const mockAddress: Address = {
  city: 'Haifa',
  street: '123 Test Street',
  postalcode: '12345',
};

test.use({ storageState: 'auth.json' });
test.beforeEach(async ({ page })=>{
  checkoutPage = new CheckoutPage(page, selectedItems)
  await checkoutPage.navigate()
  await page.waitForLoadState('networkidle')
})

test('should navigate to checkout and display form fields', async ({ page }) => {
  annotateTest({ feature: 'CheckoutPage' })
  await expect(checkoutPage.nameInput).toBeVisible();
  await expect(checkoutPage.cardNumberInput).toBeVisible();
  await expect(checkoutPage.cityInput).toBeVisible();
  console.log('✅ Checkout form fields are visible');
});

test('should fill payment and address details', async ({ page }) => {
  annotateTest({ feature: 'CheckoutPage' })
  await checkoutPage.fillPaymentDetails(mockPayment);
  await checkoutPage.fillAddressDetails(mockAddress);
  await page.screenshot({ path: './test-screenshots/checkout-filled.png' });
  console.log('✅ Payment and address details filled');
});

test('should allow using location and submitting checkout', async ({ page }) => {
  annotateTest({ feature: 'CheckoutPage' })
  await checkoutPage.useMyLocation();
  await page.waitForTimeout(1000); // simulate location fetch delay
  await checkoutPage.fillPaymentDetails(mockPayment);
  await checkoutPage.fillAddressDetails(mockAddress);
  await checkoutPage.submitCheckout();
  await page.screenshot({ path: './test-screenshots/checkout-submitted.png' });
  console.log('✅ Checkout submitted');
});

test('should complete full checkout flow and verify payment success', async ({ page }) => {
  annotateTest({ feature: 'CheckoutPage' })

  // Intercept alert
  page.on('dialog', async dialog => {
    //await page.screenshot({ path: './test-screenshots/new/checkoutDialog.png' })
    expect(dialog.message()).toContain('Payment successful');
    await dialog.dismiss();
  });
  // Mock Cart response
  await page.route('**/api/cart/123', async route => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { item_id: 101, name: 'iPhone 15 Pro', price: 1199, quantity: 1 },
        { item_id: 102, name: 'Google Pixel 8 Pro', price: 2650, quantity: 1 }
      ])
    });
  });

  // Mock address submission
  await page.route('**/api/address', async route => {
    const addressPayload = await route.request().postDataJSON();
    console.log('📦 Address payload:', addressPayload);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ id: 'addr_12345' }),
    });
  });

  // Mock payment API
  await page.route(`${process.env.MOCKOON_URL}/pay`, async route => {
    let paymentPayload
    try {
      paymentPayload = await route.request().postDataJSON();
      console.log('💳 Payment payload:', paymentPayload)
    } catch (err) {
      console.error('❌ Failed to parse payment payload:', err);
      paymentPayload = {}; // fallback to empty object

    }
    console.log('💳 Payment payload:', paymentPayload);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true, // ✅ this triggers the redirect
        message: 'Payment successful',
        transactionId: 'txn_abc123',
        amount: paymentPayload.amount ?? paymentPayload.total ?? 0,
        date: new Date().toISOString(),
      }),

    });
  });

  // Mock place-order API
  await page.route('**/api/place-order', async route => {
    const orderPayload = await route.request().postDataJSON();
    console.log('🧾 Order payload:', orderPayload);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true }), // ✅ This is critical
    });
  });
  const selectedItems = [101, 102];
  const checkoutPage = new CheckoutPage(page, selectedItems);
  await checkoutPage.navigate();
  await page.waitForLoadState('networkidle')
  await checkoutPage.fillPaymentDetails(mockPayment);
  await checkoutPage.fillAddressDetails(mockAddress);
  //await checkoutPage.submitCheckout();
  await page.screenshot({ path: './test-screenshots/new/checkoutBeforeSubmit.png' })
  await checkoutPage.submitCheckout();
  //await page.waitForLoadState('networkidle')
  await page.screenshot({ path: './test-screenshots/new/checkoutAfterSubmit.png' })
  // Assert navigation to /home
  await expect(page).toHaveURL(`${process.env.BASE_URL}/home`, { timeout: 10000 });

  await page.screenshot({ path: './test-screenshots/checkout-complete.png' });
  console.log('✅ Full checkout flow completed and verified');

});