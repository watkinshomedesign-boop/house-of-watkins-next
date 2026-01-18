const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const { createClient } = require('@sanity/client')

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const PROCESSED_ROOT = 'D:\\New Website Assets\\Website Images_Processed'

const PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const API_VERSION = '2024-01-01'
const TOKEN = process.env.SANITY_API_TOKEN

if (!PROJECT_ID) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local')
if (!TOKEN) throw new Error('Missing SANITY_API_TOKEN in .env.local')

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: API_VERSION,
  token: TOKEN,
  useCdn: false,
})

const OUTPUT_MAPPING = path.join(process.cwd(), 'asset-mapping.json')
const OUTPUT_METADATA = path.join(process.cwd(), 'asset-metadata.json')
const OUTPUT_LOG = path.join(process.cwd(), 'upload-log.txt')

function parseArgs(argv) {
  const out = {
    connectionTest: false,
    dryRun: false,
    limit: null,
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--connection-test') out.connectionTest = true
    if (a === '--dry-run') out.dryRun = true
    if (a === '--limit' && argv[i + 1]) {
      const n = Number(argv[i + 1])
      if (Number.isFinite(n) && n > 0) out.limit = n
      i++
    }
  }
  return out
}

const folderConfigs = [
  { key: 'Products-desktop', suffixTag: 'desktop', categoryTag: 'product-images' },
  { key: 'products-mobile', suffixTag: 'mobile', categoryTag: 'product-images' },
  { key: 'products-thumb', suffixTag: 'thumb', categoryTag: 'product-images' },
  // Desktop page images can be either site-avif or site-avif-desktop
  { key: 'site-avif', suffixTag: 'desktop', categoryTag: 'page-images' },
  { key: 'site-avif-desktop', suffixTag: 'desktop', categoryTag: 'page-images' },
  { key: 'site-avif-mobile', suffixTag: 'mobile', categoryTag: 'page-images' },
]

const allowedExts = new Set(['.jpg', '.jpeg', '.png', '.avif'])

function safeLogLine(line) {
  const scrubbed = String(line)
    .replace(/sk[A-Za-z0-9_-]{10,}/g, 'sk***REDACTED***')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer ***REDACTED***')
  fs.appendFileSync(OUTPUT_LOG, scrubbed + '\n', 'utf8')
  console.log(scrubbed)
}

function slugify(input) {
  return String(input)
    .trim()
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-+/g, '-')
}

function normalizeRel(rel) {
  return rel.replace(/\\/g, '/')
}

function existsDir(p) {
  try {
    return fs.statSync(p).isDirectory()
  } catch {
    return false
  }
}

function walkFiles(dir) {
  const out = []
  const stack = [dir]
  while (stack.length) {
    const current = stack.pop()
    let entries
    try {
      entries = fs.readdirSync(current, { withFileTypes: true })
    } catch {
      continue
    }
    for (const ent of entries) {
      const full = path.join(current, ent.name)
      if (ent.isDirectory()) {
        stack.push(full)
      } else if (ent.isFile()) {
        const ext = path.extname(ent.name).toLowerCase()
        if (allowedExts.has(ext)) out.push(full)
      }
    }
  }
  return out
}

function planSlugFromPath(relParts) {
  // products-mobile/products-thumb tend to include "Products Organized by Folder" as first segment
  const idx = relParts.findIndex((p) => p.toLowerCase() === 'products organized by folder')
  const planName = idx >= 0 ? relParts[idx + 1] : relParts[0]
  return planName ? slugify(planName) : 'unknown-plan'
}

function pageSlugFromFolderName(folderName) {
  const m = {
    'about us page': 'about',
    'home page assets': 'home',
    'portfolio parent': 'portfolio-parent',
    'portfolio children': 'portfolio-children',
    'whats included page': 'whats-included',
    "what's included page": 'whats-included',
    'contractor page': 'contractors',
    'contractors': 'contractors',
    'contact us': 'contact',
  }
  const k = String(folderName).trim().toLowerCase()
  return m[k] || slugify(folderName)
}

function computeTags({ folderKey, categoryTag, suffixTag, relPath }) {
  const relParts = normalizeRel(relPath).split('/').filter(Boolean)
  const subParts = relParts.slice(1) // drop top folder

  const tags = [categoryTag, suffixTag]

  if (categoryTag === 'page-images') {
    const pageFolder = subParts[0] || ''
    if (pageFolder) tags.push(pageSlugFromFolderName(pageFolder))
    return tags
  }

  if (categoryTag === 'product-images') {
    const planSlug = planSlugFromPath(subParts)
    tags.push(planSlug)
    return tags
  }

  // fallback
  tags.push(slugify(folderKey))
  return tags
}

function readJsonIfExists(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback
    return JSON.parse(fs.readFileSync(filePath, 'utf8'))
  } catch {
    return fallback
  }
}

function writeJsonAtomic(filePath, obj) {
  const tmp = filePath + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2), 'utf8')
  fs.renameSync(tmp, filePath)
}

async function sanityConnectionTest() {
  // read-only test
  return await client.fetch('count(*[_type == "sanity.imageAsset"])')
}

async function uploadWithRetry({ filePath, relPath, tags, title, description, maxAttempts = 3 }) {
  let lastErr
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const stream = fs.createReadStream(filePath)
      const ext = path.extname(filePath).toLowerCase()
      const assetType = 'image'

      const asset = await client.assets.upload(assetType, stream, {
        filename: path.basename(filePath),
      })

      const url = asset && asset.url ? asset.url : null
      return { asset, url }
    } catch (e) {
      lastErr = e
      const msg = e && e.message ? e.message : String(e)
      const status = e && typeof e.statusCode === 'number' ? e.statusCode : null
      const body = e && e.responseBody ? JSON.stringify(e.responseBody) : null
      safeLogLine(
        `WARN: Upload failed (attempt ${attempt}/${maxAttempts}) :: ${relPath} :: ${status ? status + ' ' : ''}${msg}${body ? ' :: ' + body : ''}`,
      )
      if (attempt < maxAttempts) {
        const delayMs = Math.min(15000, 500 * Math.pow(2, attempt - 1))
        await new Promise((r) => setTimeout(r, delayMs))
      }
    }
  }
  throw lastErr
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  fs.writeFileSync(OUTPUT_LOG, '', 'utf8')

  safeLogLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  safeLogLine('SANITY ASSET UPLOAD - ORGANIZED')
  safeLogLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')

  const assetCount = await sanityConnectionTest()
  safeLogLine(`✓ Connected to Sanity (project: ${PROJECT_ID}, dataset: ${DATASET})`) 
  safeLogLine(`Current sanity.imageAsset count: ${assetCount}`)

  if (args.connectionTest) {
    safeLogLine('Connection test only (--connection-test). Exiting without scanning or uploading.')
    return
  }

  const mappingState = readJsonIfExists(OUTPUT_MAPPING, {
    generatedAt: new Date().toISOString(),
    processedRoot: PROCESSED_ROOT,
    uploaded: [],
    failures: [],
  })

  const uploadedByLocalPath = new Map(
    (mappingState.uploaded || []).map((r) => [String(r.localPath).toLowerCase(), r])
  )

  const metadataState = readJsonIfExists(OUTPUT_METADATA, {
    generatedAt: new Date().toISOString(),
    byAssetId: {},
  })

  const discovered = []

  for (const cfg of folderConfigs) {
    const folderPath = path.join(PROCESSED_ROOT, cfg.key)
    if (!existsDir(folderPath)) continue
    const files = walkFiles(folderPath)
    for (const f of files) {
      const rel = normalizeRel(path.relative(PROCESSED_ROOT, f))
      discovered.push({
        localPath: f,
        relPath: rel,
        folderKey: cfg.key,
        categoryTag: cfg.categoryTag,
        suffixTag: cfg.suffixTag,
      })
    }
  }

  safeLogLine(`✓ Found ${discovered.length} images across processed folders`) 

  discovered.sort((a, b) => a.relPath.localeCompare(b.relPath))

  const limitedDiscovered = Number.isFinite(args.limit) && args.limit > 0
    ? discovered.slice(0, args.limit)
    : discovered

  if (args.dryRun) {
    const preview = limitedDiscovered.slice(0, 50).map((item) => ({
      relPath: item.relPath,
      folderKey: item.folderKey,
      tags: computeTags(item),
    }))

    safeLogLine(`DRY RUN: would process ${limitedDiscovered.length}/${discovered.length} images`) 
    safeLogLine('DRY RUN: writing preview to asset-metadata.json (no uploads performed)')

    const dryMeta = {
      generatedAt: new Date().toISOString(),
      processedRoot: PROCESSED_ROOT,
      totalDiscovered: discovered.length,
      totalPreviewed: limitedDiscovered.length,
      preview,
    }
    writeJsonAtomic(OUTPUT_METADATA, dryMeta)
    safeLogLine(`✓ Metadata preview saved: ${path.basename(OUTPUT_METADATA)}`)
    return
  }

  const failures = []
  let uploadedCount = 0
  let skippedCount = 0

  for (let i = 0; i < limitedDiscovered.length; i++) {
    const item = limitedDiscovered[i]
    const key = item.localPath.toLowerCase()

    if (uploadedByLocalPath.has(key)) {
      skippedCount++
      continue
    }

    const tags = computeTags(item)
    const title = path.basename(item.localPath)
    const description = item.relPath

    try {
      const { asset, url } = await uploadWithRetry({
        filePath: item.localPath,
        relPath: item.relPath,
        tags,
        title,
        description,
      })

      const row = {
        localPath: item.localPath,
        relPath: item.relPath,
        assetId: asset._id,
        url: url,
        filename: path.basename(item.localPath),
        folderKey: item.folderKey,
        tags,
        uploadedAt: new Date().toISOString(),
      }

      mappingState.uploaded.push(row)
      uploadedByLocalPath.set(key, row)

      metadataState.byAssetId[asset._id] = {
        tags,
        originalPath: item.relPath,
        localPath: item.localPath,
        folderKey: item.folderKey,
        uploadedAt: row.uploadedAt,
      }

      uploadedCount++

      safeLogLine(`✓ Uploaded: ${item.relPath} → ${asset._id}`)

      if ((uploadedCount % 50) === 0) {
        safeLogLine(`Progress: uploaded ${uploadedCount}/${limitedDiscovered.length} (skipped ${skippedCount}, failed ${failures.length})`)
        writeJsonAtomic(OUTPUT_MAPPING, mappingState)
        writeJsonAtomic(OUTPUT_METADATA, metadataState)
      }
    } catch (e) {
      const msg = e && e.message ? e.message : String(e)
      failures.push({ localPath: item.localPath, relPath: item.relPath, error: msg })
      mappingState.failures = failures
      safeLogLine(`ERROR: Failed: ${item.relPath} :: ${msg}`)
      // persist after each failure so resume is safe
      writeJsonAtomic(OUTPUT_MAPPING, mappingState)
      writeJsonAtomic(OUTPUT_METADATA, metadataState)
    }
  }

  // final write
  mappingState.generatedAt = new Date().toISOString()
  mappingState.totalDiscovered = discovered.length
  mappingState.totalAttempted = limitedDiscovered.length
  mappingState.totalUploaded = (mappingState.uploaded || []).length
  mappingState.totalFailed = failures.length
  writeJsonAtomic(OUTPUT_MAPPING, mappingState)
  writeJsonAtomic(OUTPUT_METADATA, metadataState)

  safeLogLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  safeLogLine('UPLOAD COMPLETE')
  safeLogLine('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  safeLogLine(`✓ Uploaded this run: ${uploadedCount}`)
  safeLogLine(`✓ Skipped (already mapped): ${skippedCount}`)
  safeLogLine(`✗ Failed: ${failures.length}`)
  safeLogLine(`✓ Mapping saved: ${path.basename(OUTPUT_MAPPING)}`)
  safeLogLine(`✓ Metadata saved: ${path.basename(OUTPUT_METADATA)}`)
  safeLogLine(`✓ Log saved: ${path.basename(OUTPUT_LOG)}`)
}

main().catch((e) => {
  const msg = e && e.stack ? e.stack : String(e)
  try {
    fs.appendFileSync(OUTPUT_LOG, `FATAL: ${msg}\n`, 'utf8')
  } catch {}
  console.error(msg)
  process.exit(1)
})
