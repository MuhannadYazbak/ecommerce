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