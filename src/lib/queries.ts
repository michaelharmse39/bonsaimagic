export const PRODUCTS_QUERY = `*[_type == "product"] | order(_createdAt desc) {
  _id, name, slug, price, comparePrice, stock, shortDescription, featured, weight,
  "image": images[0],
  category->{ name, slug }
}`

export const FEATURED_PRODUCTS_QUERY = `*[_type == "product" && featured == true][0..3] {
  _id, name, slug, price, comparePrice, stock, shortDescription, weight,
  "image": images[0],
  category->{ name, slug }
}`

export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && slug.current == $slug][0] {
  _id, name, slug, price, comparePrice, stock, description, shortDescription, featured, weight, details,
  images,
  category->{ name, slug }
}`

export const CATEGORIES_QUERY = `*[_type == "category"] { _id, name, slug, description, image }`

export const PRODUCTS_BY_CATEGORY_QUERY = `*[_type == "product" && category->slug.current == $category] | order(_createdAt desc) {
  _id, name, slug, price, comparePrice, stock, shortDescription, weight,
  "image": images[0]
}`
