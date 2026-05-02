#!/usr/bin/env node
/**
 * Seed Bonsai Magic products into Sanity CMS.
 * Uses Pollinations.ai for AI-generated product images (no API key required).
 *
 * Run: node scripts/seed-products.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── Load .env.local ──────────────────────────────────────────────────────────
function loadEnv(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const env = {}
  for (const line of content.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const idx = t.indexOf('=')
    if (idx === -1) continue
    env[t.slice(0, idx).trim()] = t.slice(idx + 1).trim()
  }
  return env
}

const env = loadEnv(resolve(__dirname, '../.env.local'))

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: env.SANITY_API_TOKEN,
  useCdn: false,
})

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  {
    name: 'Fertilizers',
    slug: 'fertilizers',
    description: 'Organic fertilizers and soil amendments for healthy bonsai growth.',
  },
  {
    name: 'Pots & Containers',
    slug: 'pots-containers',
    description: 'Quality pots and containers for displaying your bonsai.',
  },
  {
    name: 'Accessories',
    slug: 'accessories',
    description: 'Decorative accessories and display items for bonsai enthusiasts.',
  },
  {
    name: 'Tools',
    slug: 'tools',
    description: 'Professional tools and equipment for bonsai cultivation.',
  },
]

// ─── Products ─────────────────────────────────────────────────────────────────
const PRODUCTS = [
  {
    name: 'Blood Meal',
    slug: 'blood-meal',
    price: 45,
    stock: 50,
    category: 'fertilizers',
    weight: 0.2,
    featured: false,
    shortDescription: 'High-nitrogen organic fertiliser for promoting lush foliage growth.',
    description: 'Blood meal is a dry powder made from dried animal blood — one of the fastest-acting organic nitrogen sources available. Perfect during the active growing season, it encourages strong, vibrant foliage without the risk of chemical burn. Apply sparingly every 3–4 weeks.',
    imagePrompt: 'dark red blood meal fertilizer powder organic gardening bonsai product shot white background studio lighting professional',
    seed: 1001,
  },
  {
    name: 'Organic Fertiliser Blend',
    slug: 'organic-fertiliser-blend',
    price: 89,
    stock: 40,
    category: 'fertilizers',
    weight: 0.5,
    featured: true,
    shortDescription: 'Bone meal, blood meal, fish meal & chicken compost — balanced nutrition in one mix.',
    description: 'Our signature blend combines four powerful organic amendments: bone meal for phosphorus and calcium, blood meal for nitrogen, fish meal for trace minerals, and composted chicken manure for a rich base of macro and micronutrients. A balanced slow-release formula that feeds bonsai for weeks. Suitable for all species.',
    imagePrompt: 'organic fertilizer granules blend natural brown powder bag bonsai gardening product photography white background',
    seed: 1002,
  },
  {
    name: 'Basic Moon Pot',
    slug: 'basic-moon-pot',
    price: 120,
    stock: 30,
    category: 'pots-containers',
    weight: 0.8,
    featured: false,
    shortDescription: 'Clean, round stoneware pot — perfect for any bonsai style.',
    description: 'Inspired by Japanese minimalism, the Basic Moon Pot features a perfectly round form that lets the tree take centre stage. High-fired stoneware with a matte glaze makes these pots frost-resistant and well-draining. The neutral colour palette complements all species. Available in 15 cm, 20 cm, and 25 cm diameter.',
    imagePrompt: 'minimalist round white ceramic japanese bonsai moon pot matte glaze clean elegant product photography white background',
    seed: 1003,
  },
  {
    name: 'Diamond Decorative Stones',
    slug: 'diamond-decorative-stones',
    price: 65,
    stock: 60,
    category: 'accessories',
    weight: 0.5,
    featured: false,
    shortDescription: 'Faceted diamond-cut stones for top-dressing bonsai soil.',
    description: 'Add elegance to your bonsai display with our diamond-cut decorative stones. Their faceted surfaces catch and reflect light beautifully, enhancing the visual appeal of any composition. Suitable for top-dressing soil in display and training pots, or for accent in suiseki arrangements. Sold in 500 g bags.',
    imagePrompt: 'small faceted diamond cut decorative stones crystal gravel shiny bonsai soil top dressing product photography white background',
    seed: 1004,
  },
  {
    name: 'Bonsai Mug',
    slug: 'bonsai-mug',
    price: 185,
    stock: 25,
    category: 'accessories',
    weight: 0.35,
    featured: false,
    shortDescription: 'Hand-painted ceramic mug with original bonsai artwork.',
    description: 'Start your morning with a moment of zen. Each mug is hand-painted with an original bonsai scene, fired at high temperature for dishwasher-safe durability. A beautiful and thoughtful gift for any bonsai lover in your life. 350 ml capacity.',
    imagePrompt: 'ceramic tea mug hand painted japanese bonsai tree ink illustration artwork elegant product photography white background',
    seed: 1005,
  },
  {
    name: 'Bonsai Scroll',
    slug: 'bonsai-scroll',
    price: 250,
    stock: 20,
    category: 'accessories',
    weight: 0.3,
    featured: true,
    shortDescription: 'Traditional hanging scroll with hand-brushed bonsai ink painting.',
    description: 'Authentic hanging scroll featuring a hand-brushed sumi-e style ink painting of a bonsai tree in full character. Mounted on silk brocade with bamboo rods, these scrolls bring genuine Japanese aesthetic to your display space. Each piece is unique. Dimensions: 30 × 90 cm unrolled.',
    imagePrompt: 'japanese hanging scroll ink painting bonsai tree calligraphy sumi-e silk brocade bamboo traditional art product photography white background',
    seed: 1006,
  },
  {
    name: 'Bonsai Display Stand',
    slug: 'bonsai-display-stand',
    price: 350,
    stock: 15,
    category: 'accessories',
    weight: 1.5,
    featured: true,
    shortDescription: 'Hand-carved hardwood stand to elevate your bonsai presentation.',
    description: 'Elevate your bonsai to gallery-worthy display with our hand-carved wooden stands. Crafted from sustainably sourced hardwood, each stand is finished with a natural oil to bring out the grain. The raised profile improves air circulation beneath the pot and protects display surfaces. Available in small (up to 15 cm pot) and medium (up to 25 cm pot).',
    imagePrompt: 'hand carved wooden bonsai display stand dark mahogany japanese style elegant craftsmanship product photography white background',
    seed: 1007,
  },
  {
    name: 'Wire Caddy',
    slug: 'wire-caddy',
    price: 280,
    stock: 20,
    category: 'tools',
    weight: 0.6,
    featured: false,
    shortDescription: 'Compact organiser for up to 8 spools of bonsai training wire.',
    description: 'Keep your training wire organised and tangle-free with our purpose-built Wire Caddy. Designed to hold up to 8 spools of aluminium or copper wire simultaneously, with a central handle for portability. The open design lets you pull wire freely while working, with no snags or tangles. Compatible with all standard spool sizes.',
    imagePrompt: 'bonsai wire caddy organizer holder multiple aluminum copper wire spools storage tool bonsai styling product photography white background',
    seed: 1008,
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchImageBuffer(prompt, seed, retries = 3) {
  const encoded = encodeURIComponent(prompt)
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=800&height=800&nologo=true&seed=${seed}&model=flux`
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`    Generating image (attempt ${attempt})…`)
      const res = await fetch(url, { signal: AbortSignal.timeout(60_000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      if (buffer.length < 5000) throw new Error('Response too small — likely not an image')
      return buffer
    } catch (err) {
      console.warn(`    Image attempt ${attempt} failed: ${err.message}`)
      if (attempt < retries) await sleep(3000)
    }
  }
  throw new Error(`Failed to generate image after ${retries} attempts`)
}

async function uploadImage(buffer, filename) {
  return client.assets.upload('image', buffer, {
    filename,
    contentType: 'image/jpeg',
  })
}

async function upsertCategory(cat) {
  const existing = await client.fetch(
    `*[_type == "category" && slug.current == $slug][0]._id`,
    { slug: cat.slug }
  )
  if (existing) {
    console.log(`  Category "${cat.name}" already exists, skipping.`)
    return existing
  }
  const doc = await client.create({
    _type: 'category',
    name: cat.name,
    slug: { _type: 'slug', current: cat.slug },
    description: cat.description,
  })
  console.log(`  Created category "${cat.name}" (${doc._id})`)
  return doc._id
}

async function productExists(slug) {
  return client.fetch(
    `*[_type == "product" && slug.current == $slug][0]._id`,
    { slug }
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🌿 Bonsai Magic — Product Seeder\n')

  // 1. Create categories
  console.log('── Categories ──────────────────────────')
  const categoryIds = {}
  for (const cat of CATEGORIES) {
    categoryIds[cat.slug] = await upsertCategory(cat)
  }

  // 2. Seed products
  console.log('\n── Products ────────────────────────────')
  for (const p of PRODUCTS) {
    console.log(`\n▸ ${p.name}`)

    const existingId = await productExists(p.slug)
    if (existingId) {
      console.log(`  Already exists (${existingId}), skipping.`)
      continue
    }

    // Generate + upload image
    let imageRef
    try {
      const buffer = await fetchImageBuffer(p.imagePrompt, p.seed)
      console.log(`  Uploading image to Sanity…`)
      const asset = await uploadImage(buffer, `${p.slug}.jpg`)
      imageRef = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
      console.log(`  Image uploaded (${asset._id})`)
    } catch (err) {
      console.error(`  ERROR generating image: ${err.message}`)
      console.error('  Skipping product.')
      continue
    }

    // Create product document
    const doc = await client.create({
      _type: 'product',
      name: p.name,
      slug: { _type: 'slug', current: p.slug },
      price: p.price,
      stock: p.stock,
      weight: p.weight,
      featured: p.featured,
      shortDescription: p.shortDescription,
      description: [
        {
          _type: 'block',
          _key: 'desc0',
          style: 'normal',
          markDefs: [],
          children: [{ _type: 'span', _key: 'span0', text: p.description, marks: [] }],
        },
      ],
      images: [imageRef],
      category: {
        _type: 'reference',
        _ref: categoryIds[p.category],
      },
    })

    console.log(`  ✓ Created "${p.name}" — R${p.price} (${doc._id})`)

    // Be polite to Pollinations.ai
    await sleep(1500)
  }

  console.log('\n✅ Seeding complete!\n')
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})
