import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({ name: 'price', title: 'Price (ZAR)', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({ name: 'comparePrice', title: 'Compare Price (ZAR)', type: 'number' }),
    defineField({ name: 'stock', title: 'Stock Quantity', type: 'number', validation: (r) => r.required().min(0) }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'description', title: 'Description', type: 'array', of: [{ type: 'block' }] }),
    defineField({ name: 'shortDescription', title: 'Short Description', type: 'text', rows: 3 }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    defineField({
      name: 'details',
      title: 'Tree Details',
      type: 'object',
      fields: [
        { name: 'species', title: 'Species', type: 'string' },
        { name: 'age', title: 'Age (years)', type: 'number' },
        { name: 'height', title: 'Height (cm)', type: 'number' },
        { name: 'potSize', title: 'Pot Size', type: 'string' },
        { name: 'style', title: 'Style', type: 'string' },
      ],
    }),
    defineField({ name: 'featured', title: 'Featured Product', type: 'boolean', initialValue: false }),
    defineField({ name: 'weight', title: 'Weight for shipping (kg)', type: 'number', initialValue: 1 }),
  ],
  preview: {
    select: { title: 'name', media: 'images.0', price: 'price' },
    prepare({ title, media, price }) {
      return { title, media, subtitle: `R${price}` }
    },
  },
})
