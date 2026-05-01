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
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${pfEncode(String(v).trim())}`)
    .join('&')

  const str = passphrase ? `${queryString}&passphrase=${pfEncode(passphrase.trim())}` : queryString

  return crypto.createHash('md5').update(str).digest('hex')
}

export function buildPayFastForm(orderData: {
  orderId: string
  amount: number
  itemName: string
  customer: { firstName: string; lastName: string; email: string }
}): { url: string; fields: Record<string, string> } {
  const isSandbox = process.env.PAYFAST_SANDBOX === 'true' || process.env.PAYFAST_MERCHANT_ID === '10000100'
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://bonsaimagic.co.za'

  // Sandbox uses PayFast test credentials — ignore env vars to avoid misconfiguration
  const merchantId = isSandbox ? '10000100' : (process.env.PAYFAST_MERCHANT_ID || '')
  const merchantKey = isSandbox ? '46f0cd694581a' : (process.env.PAYFAST_MERCHANT_KEY || '')
  const passphrase = isSandbox ? undefined : (process.env.PAYFAST_PASSPHRASE || undefined)

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

  const signature = generateSignature(data, passphrase)
  data.signature = signature

  return {
    url: isSandbox
      ? 'https://sandbox.payfast.co.za/eng/process'
      : 'https://www.payfast.co.za/eng/process',
    fields: data,
  }
}

export function verifyITN(params: Record<string, string>): boolean {
  const receivedSignature = params.signature
  const { signature: _, ...dataWithoutSignature } = params
  const calculatedSignature = generateSignature(dataWithoutSignature, process.env.PAYFAST_PASSPHRASE)
  return receivedSignature === calculatedSignature
}
