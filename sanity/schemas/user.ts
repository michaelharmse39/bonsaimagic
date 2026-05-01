import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'passwordHash', title: 'Password Hash', type: 'string', hidden: true }),
    defineField({ name: 'googleId', title: 'Google ID', type: 'string', hidden: true }),
    defineField({ name: 'firstName', title: 'First Name', type: 'string' }),
    defineField({ name: 'lastName', title: 'Last Name', type: 'string' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
  ],
  preview: {
    select: { title: 'email', firstName: 'firstName', lastName: 'lastName' },
    prepare({ title, firstName, lastName }) {
      return { title: `${firstName ?? ''} ${lastName ?? ''}`.trim() || title, subtitle: title }
    },
  },
})
