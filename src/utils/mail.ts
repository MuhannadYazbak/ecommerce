import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export const sendCheckoutNotification = async (checkoutDetails: any) => {
  const orderDate = new Date(checkoutDetails.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });
  await resend.emails.send({
    from: 'Tech-Mart <onboarding@resend.dev>',
    to: ['yazbakm@gmail.com'],
    subject: '🛍️ New Order Received!',
    html: `
      <h2>New Checkout Completed</h2>
      <p><strong>Buyer:</strong> ${checkoutDetails.name}</p>
      <p><strong>Total:</strong> ₪${checkoutDetails.total}</p>
      <p><strong>Items:</strong></p>
      <ul>
        ${checkoutDetails.items
          .map((item: any) => `<li>${item.name} x ${item.quantity}</li>`)
          .join('')}
      </ul>
      <p>at:<strong>${orderDate}</strong></p>
    `,
  })
}

export const sendOrderShippedtNotification = async (checkoutDetails: any) => {
  const orderDate = new Date(checkoutDetails.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });
  const shippingDate = new Date().toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      });
  await resend.emails.send({
    from: 'Tech-Mart <onboarding@resend.dev>',
    to: ['yazbakm@gmail.com'],
    subject: '🛍️ Order Shipped!',
    html: `
      <h2>Order ${checkoutDetails.orderId} Shipped </h2>
      <p><strong>Buyer:</strong> ${checkoutDetails.fullname}</p>
      <p><strong>email:</strong>${checkoutDetails.email}</p>
      <p><strong>Total:</strong> ₪${checkoutDetails.total_amount}</p>
      <p><strong>Items:</strong></p>
      <ul>
        ${checkoutDetails.items_json
          .map((item: any) => `<li>${item.name} x ${item.quantity}</li>`)
          .join('')}
      </ul>
      <p>Order Creation date:<strong>${orderDate}</strong></p>
      <p>Order Shipping date:<strong>${shippingDate}</strong></p>
    `,
  })
}