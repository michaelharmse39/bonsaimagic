import { Resend } from 'resend'

// Once you verify bonsaimagic.co.za in Resend, change this to: orders@bonsaimagic.co.za
const FROM = 'Bonsai Magic <noreply@bonsaimagic.co.za>'

function getResend() {
  const key = process.env.RESEND_API_KEY
  if (!key) return null
  return new Resend(key)
}

export async function sendOtpEmail(to: string, otp: string, purpose: 'register' | 'reset') {
  // Always log so the code is visible in Vercel function logs while domain isn't verified
  console.log(`[OTP] ${purpose} code for ${to}: ${otp}`)

  const resend = getResend()
  if (!resend) {
    console.log(`[Email] RESEND_API_KEY not set — skipping OTP email`)
    return
  }
  const subject = purpose === 'register' ? 'Your Bonsai Magic verification code' : 'Reset your Bonsai Magic password'
  const heading = purpose === 'register' ? 'Verify your email' : 'Reset your password'
  const body = purpose === 'register'
    ? 'Enter this code to complete your registration. It expires in 10 minutes.'
    : 'Enter this code to reset your password. It expires in 10 minutes.'
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
          <h1 style="font-size:22px;margin-bottom:8px">${heading}</h1>
          <p style="color:#555;margin-bottom:24px">${body}</p>
          <div style="font-size:40px;font-weight:bold;letter-spacing:10px;padding:20px;background:#f5f5f5;border-radius:8px;text-align:center;color:#15803d;margin-bottom:24px">${otp}</div>
          <p style="color:#999;font-size:12px">If you didn't request this, you can safely ignore this email.</p>
        </div>
      `,
    })
  } catch (err: unknown) {
    const e = err as { statusCode?: number; message?: string; name?: string }
    console.error('[Email] Resend error:', JSON.stringify({ statusCode: e?.statusCode, message: e?.message, name: e?.name }))
  }
}

export async function sendWelcomeEmail(to: string, firstName: string) {
  const resend = getResend()
  if (!resend) {
    console.log('[Email] RESEND_API_KEY not set — skipping welcome email')
    return
  }
  try {
    await resend!.emails.send({
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
  const resend = getResend()
  if (!resend) {
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

    await resend!.emails.send({
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
