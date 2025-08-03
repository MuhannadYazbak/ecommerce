import { Page, Locator } from "@playwright/test";
import { BasePage } from "./BasePage";


export class OrdersHistoryPage extends BasePage{
    constructor(page: Page){
        super(page, '/orders')
    }

    // waitforHeader(): Locator {
    //     const mainHeader = this.page.locator('h1')
    //     //console.log('h1 = ', mainHeader)
    //     return mainHeader
    // }

    waitforHeaderEmpty(): Locator {
        return this.page.locator('h2#no-orders-heading')
    }

    waitforHeaderNotEmpty() {
        return this.page.locator('h2#orders-list-heading')
    }

    getOrders() : Locator {
        const orders =  this.page.locator('article')
        return orders

        // const ordersCount = 0
        // if (heading.textContent.toString() == 'No orders found.' || heading.textContent.toString() == 'List of previous orders'){
        //     return heading
        // } else {
        //     throw new Error
        // }
    }
}