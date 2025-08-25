import { OrdersHistoryPage } from "./logic/OrdersHistory";
import { test, expect } from '@playwright/test'
import { Order } from "@/types/order";
import { annotateTest } from "./utils/annotate";

let ordersHistoryPage: OrdersHistoryPage
test.use({storageState: 'auth.json'})

test.beforeEach(async ({ page })=>{
    ordersHistoryPage = new OrdersHistoryPage(page)
    await ordersHistoryPage.navigate()
    await page.waitForLoadState('networkidle')
})

test('Orders history initial test', async ({ page }) => {
    annotateTest({ feature: 'OrdersHistoryPage' })
    await page.route('**/api/orders?userId=123', async route => {
        const mockOrders: Order[] = [
            {
                order_id: 101,
                user_id: 1,
                total_amount: 299.99,
                items_json: [
                    {
                        id: 1,
                        name: 'Wireless Keyboard',
                        quantity: 1,
                        price: 99.99,
                        photo: '/images/keyboard.jpg'
                    },
                    {
                        id: 2,
                        name: 'Gaming Mouse',
                        quantity: 1,
                        price: 200.00,
                        photo: '/images/mouse.jpg'
                    }
                ],
                created_at: '2025-08-01T10:30:00Z',
                status: 'Shipped',
                address_id: 5
            },
            {
                order_id: 102,
                user_id: 1,
                total_amount: 89.99,
                items_json: [
                    {
                        id: 3,
                        name: 'USB-C Hub',
                        quantity: 1,
                        price: 89.99,
                        photo: '/images/hub.jpg'
                    }
                ],
                created_at: '2025-08-02T14:45:00Z',
                status: 'Delivered',
                address_id: 5
            }
        ]

        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(mockOrders)
        })
    })


    ordersHistoryPage = new OrdersHistoryPage(page)
    await ordersHistoryPage.navigate()
    page.on('request', request => {
        if (request.url().includes('/api/orders')) {
            console.log('Intercepted orders API:', request.url());
        }
    });
    await expect(ordersHistoryPage.waitforHeaderNotEmpty()).toHaveText('List of previous orders')

    const orders = await ordersHistoryPage.getOrders()
    await expect(orders).toHaveCount(2)
})

test('Orders history shows empty state when no orders exist', async ({ page }) => {
    annotateTest({ feature: 'OrdersHistoryPage' })
    ordersHistoryPage = new OrdersHistoryPage(page)
    await ordersHistoryPage.navigate()

    // Confirm header is present
    await expect(ordersHistoryPage.waitforHeaderEmpty()).toHaveText('Order History')

    // Confirm empty message is shown
    await expect(page.locator('text=No orders found.')).toBeVisible()

    // Confirm BackButton is rendered
    await expect(page.getByRole('navigation', { name: 'Go-Back' })).toBeVisible()
})