import crypto from 'crypto'

export interface PayFastData {
  merchant_id: string
  merchant_key: string
  return_url: string
  cancel_url: string
  notify_url: string
  name_first: string
  name_last: string
  email_address: string
  m_payment_id: string
  amount: string
  item_name: string
  item_description?: string
}

function pfEncode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%20/g, '+')
    .replace(/!/g, '%21')
    .replace(/'/g, '%27')
    .replace(/\(/g, '%28')
    .replace(/\)/g, '%29')
    .replace(/\*/g, '%2A')
}

export function generateSignature(data: Record<string, string>, passphrase?: string): string {
  const queryString = Object.entries(data)
    .filter(([, v]) => v !== '' && v !== undefined && v !== null)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${pfEncode(String(v).trim())}`)
    .join('&')

  const str = passphrase ? `${queryString}&passphrase=${pfEncode(passphrase.trim())}` : queryString

  console.log('[PayFast] Signature string:', str)

  return crypto.createHash('md5').update(str).digest('hex')
}

export function buildPayFastForm(orderData: {
  orderId: string
  amount: number
  itemName: string
  customer: { firstName: string; lastName: string; email: string }
}): { url: string; fields: Record<string, string>; _debug_sig_string: string } {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bonsaimagic.co.za'

  // Sandbox mode — change these three lines when going live
  const isSandbox = true
  const merchantId = '10043594'
  const merchantKey = 'u0rwnye7fpfrh'
  const passphrase = undefined

  const data: Record<string, string> = {
    merchant_id: merchantId,
    merchant_key: merchantKey,
    return_url: `${baseUrl}/checkout/success?order=${orderData.orderId}`,
    cancel_url: `${baseUrl}/checkout/cancel`,
    notify_url: `${baseUrl}/api/payfast/notify`,
    name_first: orderData.customer.firstName,
    name_last: orderData.customer.lastName,
    email_address: orderData.customer.email,
    m_payment_id: orderData.orderId,
    amount: orderData.amount.toFixed(2),
    item_name: orderData.itemName,
  }

  // Build the signature string exactly as we hash it so the API can return it for debugging
  const sigString = Object.entries(data)
    .filter(([, v]) => v !== '' && v !== undefined && v !== null)
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${pfEncode(String(v).trim())}`)
    .join('&')

  const signature = generateSignature(data, passphrase)
  data.signature = signature

  return {
    url: isSandbox
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process',
    fields: data,
    _debug_sig_string: sigString,
  }
}

export function verifyITN(params: Record<string, string>): boolean {
  const receivedSignature = params.signature
  const { signature: _, ...dataWithoutSignature } = params
  const calculatedSignature = generateSignature(dataWithoutSignature, process.env.PAYFAST_PASSPHRASE)
  return receivedSignature === calculatedSignature
}
