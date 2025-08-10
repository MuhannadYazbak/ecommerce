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

test('should navigate to checkout and display form fields', async ({ page }) => {
  annotateTest({ feature: 'CheckoutPage' })
  checkoutPage = new CheckoutPage(page, selectedItems);
  await checkoutPage.navigate();

  await expect(checkoutPage.nameInput).toBeVisible();
  await expect(checkoutPage.cardNumberInput).toBeVisible();
  await expect(checkoutPage.cityInput).toBeVisible();

  console.log('✅ Checkout form fields are visible');
});

test('should fill payment and address details', async ({ page }) => {
  annotateTest({ feature: 'CheckoutPage' })
  checkoutPage = new CheckoutPage(page, selectedItems);
  await checkoutPage.navigate();

  await checkoutPage.fillPaymentDetails(mockPayment);
  await checkoutPage.fillAddressDetails(mockAddress);

  await page.screenshot({ path: 'checkout-filled.png' });

  console.log('✅ Payment and address details filled');
});

test('should allow using location and submitting checkout', async ({ page }) => {
  annotateTest({ feature: 'CheckoutPage' })
  checkoutPage = new CheckoutPage(page, selectedItems);
  await checkoutPage.navigate();

  await checkoutPage.useMyLocation();
  await page.waitForTimeout(1000); // simulate location fetch delay

  await checkoutPage.fillPaymentDetails(mockPayment);
  await checkoutPage.fillAddressDetails(mockAddress);
  await checkoutPage.submitCheckout();

  await page.screenshot({ path: 'checkout-submitted.png' });

  console.log('✅ Checkout submitted');
});

test('should complete full checkout flow and verify payment success', async ({ page }) => {
  annotateTest({ feature: 'CheckoutPage' })
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
    const paymentPayload = await route.request().postDataJSON();
    console.log('💳 Payment payload:', paymentPayload);

    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        message: 'Payment successful',
        transactionId: 'txn_abc123',
        amount: paymentPayload.total,
        date: new Date().toISOString(),
      }),
    });
  });

  // Mock place-order API
  await page.route('**/api/place-order', async route => {
    const orderPayload = await route.request().postDataJSON();
    console.log('🧾 Order payload:', orderPayload);

    await route.fulfill({ status: 200 });
  });

  const selectedItems = [101, 102];
  const checkoutPage = new CheckoutPage(page, selectedItems);
  await checkoutPage.navigate();

  await checkoutPage.fillPaymentDetails(mockPayment);
  await checkoutPage.fillAddressDetails(mockAddress);
  await checkoutPage.submitCheckout();


  // Intercept alert
  page.on('dialog', async dialog => {
    expect(dialog.message()).toContain('Payment successful');
    await dialog.dismiss();
  });

  await checkoutPage.submitCheckout();

  // Assert navigation to /home
  await expect(page).toHaveURL(`${process.env.BASE_URL}/home`);

  await page.screenshot({ path: 'checkout-complete.png' });
  console.log('✅ Full checkout flow completed and verified');

});