import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'order',
  title: 'Order',
  type: 'document',
  fields: [
    defineField({ name: 'orderId', title: 'Order ID', type: 'string' }),
    defineField({ name: 'payfastPaymentId', title: 'PayFast Payment ID', type: 'string' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: { list: ['pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled'] },
      initialValue: 'pending',
    }),
    defineField({
      name: 'customer',
      title: 'Customer',
      type: 'object',
      fields: [
        { name: 'firstName', type: 'string', title: 'First Name' },
        { name: 'lastName', type: 'string', title: 'Last Name' },
        { name: 'email', type: 'string', title: 'Email' },
        { name: 'phone', type: 'string', title: 'Phone' },
      ],
    }),
    defineField({
      name: 'shippingAddress',
      title: 'Shipping Address',
      type: 'object',
      fields: [
        { name: 'street', type: 'string', title: 'Street' },
        { name: 'suburb', type: 'string', title: 'Suburb' },
        { name: 'city', type: 'string', title: 'City' },
        { name: 'province', type: 'string', title: 'Province' },
        { name: 'postalCode', type: 'string', title: 'Postal Code' },
      ],
    }),
    defineField({
      name: 'items',
      title: 'Order Items',
      type: 'array',
      of: [{
        type: 'object',
        fields: [
          { name: 'productId', type: 'string', title: 'Product ID' },
          { name: 'name', type: 'string', title: 'Name' },
          { name: 'price', type: 'number', title: 'Price' },
          { name: 'quantity', type: 'number', title: 'Quantity' },
        ],
      }],
    }),
    defineField({ name: 'subtotal', title: 'Subtotal', type: 'number' }),
    defineField({ name: 'shippingCost', title: 'Shipping Cost', type: 'number' }),
    defineField({ name: 'total', title: 'Total', type: 'number' }),
    defineField({ name: 'courierGuyTrackingId', title: 'Courier Guy Tracking ID', type: 'string' }),
    defineField({ name: 'notes', title: 'Order Notes', type: 'text' }),
  ],
  preview: {
    select: { title: 'orderId', status: 'status', total: 'total' },
    prepare({ title, status, total }) {
      return { title: `Order ${title}`, subtitle: `${status} — R${total}` }
    },
  },
})
