#!/usr/bin/env node
/**
 * Seed home page banners into Sanity CMS with AI-generated images.
 * Run: node scripts/seed-banners.mjs
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

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

const BANNERS = [
  {
    title: 'Living Art',
    subtitle: 'Each bonsai is a living sculpture — patiently shaped over years, rooted in the ancient art of Japan.',
    ctaText: 'Explore Collection',
    ctaLink: '/shop',
    active: true,
    order: 0,
    imagePrompt: 'ancient japanese bonsai tree dramatic cinematic lighting dark moody atmosphere mist fog fine art photography wide angle',
    seed: 2001,
    width: 1920,
    height: 1080,
  },
  {
    title: 'Nourish & Thrive',
    subtitle: 'Premium organic fertilisers — blood meal, bone meal, fish meal and more.',
    ctaText: 'Shop Fertilisers',
    ctaLink: '/shop?category=fertilizers',
    active: true,
    order: 1,
    imagePrompt: 'hands holding rich dark soil organic fertilizer lush green bonsai garden nature lifestyle photography warm light bokeh',
    seed: 2002,
    width: 900,
    height: 500,
  },
  {
    title: 'Complete Your Display',
    subtitle: 'Stands, scrolls, pots and accessories to frame your bonsai perfectly.',
    ctaText: 'Shop Accessories',
    ctaLink: '/shop?category=accessories',
    active: true,
    order: 2,
    imagePrompt: 'elegant bonsai tree wooden display stand japanese scroll ceramic pot zen interior design minimal studio photography',
    seed: 2003,
    width: 900,
    height: 500,
  },
]

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchImageBuffer(prompt, seed, width, height, retries = 3) {
  const encoded = encodeURIComponent(prompt)
  const url = `https://image.pollinations.ai/prompt/${encoded}?width=${width}&height=${height}&nologo=true&seed=${seed}&model=flux`
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`    Generating image (attempt ${attempt})…`)
      const res = await fetch(url, { signal: AbortSignal.timeout(90_000) })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const buffer = Buffer.from(await res.arrayBuffer())
      if (buffer.length < 5000) throw new Error('Response too small')
      return buffer
    } catch (err) {
      console.warn(`    Attempt ${attempt} failed: ${err.message}`)
      if (attempt < retries) await sleep(3000)
    }
  }
  throw new Error(`Failed to generate image after ${retries} attempts`)
}

async function bannerExists(title) {
  return client.fetch(`*[_type == "banner" && title == $title][0]._id`, { title })
}

async function main() {
  console.log('\n🏮 Bonsai Magic — Banner Seeder\n')

  for (const b of BANNERS) {
    console.log(`▸ "${b.title}" (order ${b.order})`)

    const existing = await bannerExists(b.title)
    if (existing) {
      console.log(`  Already exists (${existing}), skipping.\n`)
      continue
    }

    let imageRef
    try {
      const buffer = await fetchImageBuffer(b.imagePrompt, b.seed, b.width, b.height)
      console.log(`  Uploading to Sanity…`)
      const asset = await client.assets.upload('image', buffer, {
        filename: `banner-${b.order}.jpg`,
        contentType: 'image/jpeg',
      })
      imageRef = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }
      console.log(`  Image uploaded (${asset._id})`)
    } catch (err) {
      console.error(`  ERROR: ${err.message} — skipping.\n`)
      continue
    }

    const doc = await client.create({
      _type: 'banner',
      title: b.title,
      subtitle: b.subtitle,
      ctaText: b.ctaText,
      ctaLink: b.ctaLink,
      image: imageRef,
      active: b.active,
      order: b.order,
    })

    console.log(`  ✓ Created banner "${b.title}" (${doc._id})\n`)
    await sleep(1500)
  }

  console.log('✅ Banner seeding complete!\n')
}

main().catch((err) => {
  console.error('\n❌ Fatal error:', err)
  process.exit(1)
})
