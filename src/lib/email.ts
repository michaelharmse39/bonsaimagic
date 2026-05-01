import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
// Once you verify bonsaimagic.co.za in Resend, change this to: orders@bonsaimagic.co.za
const FROM = 'Bonsai Magic <onboarding@resend.dev>'

export async function sendWelcomeEmail(to: string, firstName: string) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] RESEND_API_KEY not set — skipping welcome email')
    return
  }
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: 'Welcome to Bonsai Magic',
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h1 style="font-size:24px;margin-bottom:8px">Welcome, ${firstName}!</h1>
          <p style="color:#555">Thank you for creating an account with Bonsai Magic.</p>
          <p style="color:#555">You can now view your order history and manage your account at any time.</p>
          <a href="https://bonsaimagic.co.za/account"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#15803d;color:#fff;text-decoration:none;border-radius:4px">
            Go to My Account
          </a>
        </div>
      `,
    })
  } catch (err) {
    console.error('[Email] Failed to send welcome email:', err)
  }
}

export async function sendOrderConfirmationEmail(
  to: string,
  firstName: string,
  orderId: string,
  items: { name: string; quantity: number; price: number }[],
  total: number
) {
  if (!process.env.RESEND_API_KEY) {
    console.log('[Email] RESEND_API_KEY not set — skipping order confirmation')
    return
  }
  try {
    const rows = items
      .map(
        (i) =>
          `<tr>
            <td style="padding:8px 0;border-bottom:1px solid #eee">${i.name}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center">${i.quantity}</td>
            <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right">R${(i.price * i.quantity).toFixed(2)}</td>
          </tr>`
      )
      .join('')

    await resend.emails.send({
      from: FROM,
      to,
      subject: `Order Confirmed — ${orderId}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h1 style="font-size:24px;margin-bottom:8px">Thank you, ${firstName}!</h1>
          <p style="color:#555">Your order <strong>${orderId}</strong> has been received and payment confirmed.</p>
          <table style="width:100%;border-collapse:collapse;margin:24px 0">
            <thead>
              <tr style="border-bottom:2px solid #eee">
                <th style="text-align:left;padding-bottom:8px">Item</th>
                <th style="text-align:center;padding-bottom:8px">Qty</th>
                <th style="text-align:right;padding-bottom:8px">Price</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
          <p style="font-size:18px;font-weight:bold">Total: R${total.toFixed(2)}</p>
          <a href="https://bonsaimagic.co.za/track"
             style="display:inline-block;margin-top:16px;padding:12px 24px;background:#15803d;color:#fff;text-decoration:none;border-radius:4px">
            Track Your Order
          </a>
        </div>
      `,
    })
  } catch (err) {
    console.error('[Email] Failed to send order confirmation:', err)
  }
}
