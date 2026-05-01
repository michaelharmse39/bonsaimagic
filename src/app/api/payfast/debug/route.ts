import { NextResponse } from 'next/server'
import crypto from 'crypto'

export const runtime = 'nodejs'

function pfEncode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%20/g, '+')
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
}

export async function GET() {
  const data: Record<string, string> = {
    merchant_id: '10043594',
    merchant_key: 'u0rwnye7fpfrh',
    return_url: 'https://bonsaimagic.co.za/checkout/success?order=BM-TEST123',
    cancel_url: 'https://bonsaimagic.co.za/checkout/cancel',
    notify_url: 'https://bonsaimagic.co.za/api/payfast/notify',
    name_first: 'Test',
    name_last: 'User',
    email_address: 'test@test.com',
    m_payment_id: 'BM-TEST123',
    amount: '100.00',
    item_name: 'Bonsai Magic Order BM-TEST123',
  }

  const queryString = Object.entries(data)
    .filter(([, v]) => v !== '')
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${pfEncode(v.trim())}`)
    .join('&')

  const signature = crypto.createHash('md5').update(queryString).digest('hex')
  data.signature = signature

  const formFields = Object.entries(data)
    .map(([k, v]) => `<input type="hidden" name="${k}" value="${v}" />`)
    .join('\n    ')

  const html = `<!DOCTYPE html>
<html>
<head><title>PayFast Debug</title></head>
<body style="font-family:monospace;padding:20px;">
<h2>PayFast Debug</h2>
<h3>Query String (what we hash):</h3>
<textarea rows="6" style="width:100%;font-size:12px">${queryString}</textarea>
<h3>Signature (MD5):</h3>
<code style="font-size:14px;color:red">${signature}</code>
<h3>Test form — click Submit to test with PayFast sandbox:</h3>
<form action="https://sandbox.payfast.co.za/eng/process" method="POST">
  ${formFields}
  <button type="submit" style="padding:10px 20px;background:green;color:white;font-size:16px">Submit to PayFast Sandbox</button>
</form>
<h3>All fields:</h3>
<pre style="background:#eee;padding:10px">${JSON.stringify(data, null, 2)}</pre>
</body>
</html>`

  return new NextResponse(html, { headers: { 'Content-Type': 'text/html' } })
}
