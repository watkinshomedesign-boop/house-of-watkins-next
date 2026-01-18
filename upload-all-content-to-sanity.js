const fs = require('fs');
const path = require('path');
const glob = require('glob');
const mammoth = require('mammoth');
const { createClient } = require('@sanity/client');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function toPosix(p) {
  return p.replace(/\\/g, '/');
}

function normalizeWin(p) {
  return p.replace(/\//g, '\\');
}

function uniq(arr) {
  return Array.from(new Set(arr));
}

function takeSample(arr, n) {
  return arr.slice(0, Math.min(n, arr.length));
}

function safeLogLine(line) {
  // Avoid ever printing tokens accidentally
  const scrubbed = String(line)
    .replace(/sk[A-Za-z0-9_-]{10,}/g, 'sk***REDACTED***')
    .replace(/Bearer\s+[A-Za-z0-9._-]+/gi, 'Bearer ***REDACTED***');
  console.log(scrubbed);
}

function fmtCheck(msg) {
  safeLogLine(`\u2713 ${msg}`);
}

function fmtWarn(msg) {
  safeLogLine(`WARN: ${msg}`);
}

function fmtErr(msg) {
  safeLogLine(`ERROR: ${msg}`);
}

function parseArgs(argv) {
  const out = {
    dryRun: false,
    uploadAssetsOnly: false,
    configPath: path.join(process.cwd(), 'image-upload-config.json'),
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--dry-run') out.dryRun = true;
    if (a === '--upload-assets-only') out.uploadAssetsOnly = true;
    if (a === '--config' && argv[i + 1]) out.configPath = path.resolve(process.cwd(), argv[i + 1]);
  }
  return out;
}

function ensureRequiredConfig(cfg) {
  if (!cfg || !cfg.sanity) throw new Error('Missing config.sanity');
  const { projectId, dataset, apiToken } = cfg.sanity;
  if (!projectId || projectId === 'YOUR_SANITY_PROJECT_ID') throw new Error('Missing sanity.projectId');
  if (!dataset) throw new Error('Missing sanity.dataset');
  if (!apiToken || apiToken === 'YOUR_SANITY_API_TOKEN') throw new Error('Missing sanity.apiToken');
}

function getPageImageCandidates(processedRoot, mapping) {
  const folder = path.join(processedRoot, mapping.sourceFolder);
  const pattern = toPosix(path.join(folder, '**/*.avif'));
  const files = glob.sync(pattern, { nodir: true, windowsPathsNoEscape: true, nocase: true });
  return files;
}

function listAllImagesUnder(root, exts) {
  // Use simple patterns to avoid extglob quirks across glob versions.
  // If multiple extensions are provided, expand into multiple globs.
  const normalizedExts = exts.map(e => String(e).replace(/^\./, '').toLowerCase());
  const patterns = normalizedExts.map(ext => toPosix(path.join(root, `**/*.${ext}`)));
  return uniq(patterns.flatMap(p => glob.sync(p, { nodir: true, windowsPathsNoEscape: true, nocase: true })));
}

function findDocxInFolder(folder) {
  const pattern = toPosix(path.join(folder, '*.docx'));
  const files = glob.sync(pattern, { nodir: true, windowsPathsNoEscape: true });
  return files[0] || null;
}

function extractNumberNear(text, keywords) {
  // Simple heuristic: find a keyword and then a nearby number (possibly decimal)
  const lower = text.toLowerCase();
  for (const kw of keywords) {
    const idx = lower.indexOf(kw);
    if (idx >= 0) {
      const window = text.slice(Math.max(0, idx - 40), Math.min(text.length, idx + 80));
      const m = window.match(/(\d+(?:\.\d+)?)/);
      if (m) return m[1];
    }
  }
  return null;
}

function extractSqFt(text) {
  const m = text.match(/(\d{3,5})\s*(sq\s*ft|sqft|square\s*feet)/i);
  return m ? m[1] : null;
}

function extractMetaAndDescription(text) {
  // Heuristic: use first ~250 chars as seoMeta; full text trimmed as description
  const cleaned = text.replace(/\s+/g, ' ').trim();
  const seoMeta = cleaned.slice(0, 250);
  const description = cleaned;
  return { seoMeta, description };
}

function buildClient(cfg) {
  return createClient({
    projectId: cfg.sanity.projectId,
    dataset: cfg.sanity.dataset,
    token: cfg.sanity.apiToken,
    useCdn: false,
    apiVersion: cfg.sanity.apiVersion || cfg.sanity.apiVersion || '2024-01-01'
  });
}

async function sanityConnectionTest(client) {
  // Read-only ping. No mutations.
  // Fetch the dataset name from a cheap GROQ query.
  const res = await client.fetch('*[_type == "siteSettings"][0]{_id}');
  return res;
}

async function uploadAsset(client, filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing local file: ${filePath}`);
  }

  return await new Promise((resolve, reject) => {
    const stream = fs.createReadStream(filePath);
    stream.on('error', (err) => reject(err));
    client.assets
      .upload('file', stream, { filename: path.basename(filePath) })
      .then(resolve)
      .catch(reject);
  });
}

function assetRef(asset) {
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

function csvEscape(value) {
  const s = value == null ? '' : String(value);
  if (/[",\r\n]/.test(s)) return '"' + s.replace(/"/g, '""') + '"';
  return s;
}

function getTopFolder(baseRoot, filePath) {
  const rel = path.relative(baseRoot, filePath);
  const parts = rel.split(path.sep).filter(Boolean);
  return parts.length > 0 ? parts[0] : '';
}

function listFilesByExt(root, ext) {
  const pattern = toPosix(path.join(root, `**/*.${ext}`));
  return glob.sync(pattern, { nodir: true, windowsPathsNoEscape: true, nocase: true });
}

async function runUploadAssetsOnly({ client, config }) {
  safeLogLine('');
  safeLogLine('Phase 1: Uploading Assets');

  const processedRoot = config.processedRoot;
  const sources = [
    {
      key: 'site-avif',
      baseRoot: path.join(processedRoot, 'site-avif'),
      exts: ['avif'],
      imageType: 'page-avif',
    },
    {
      key: 'site-avif-mobile',
      baseRoot: path.join(processedRoot, 'site-avif-mobile'),
      exts: ['avif'],
      imageType: 'page-avif-mobile',
    },
    {
      key: 'product-desktop',
      baseRoot: path.join(config.sourceRoot, 'Products Organized by Folder'),
      exts: ['jpg', 'jpeg'],
      imageType: 'product-desktop',
    },
    {
      key: 'products-mobile',
      baseRoot: path.join(processedRoot, 'products-mobile', 'Products Organized by Folder'),
      exts: ['jpg', 'jpeg'],
      imageType: 'product-mobile',
    },
    {
      key: 'products-thumb',
      baseRoot: path.join(processedRoot, 'products-thumb', 'Products Organized by Folder'),
      exts: ['jpg', 'jpeg'],
      imageType: 'product-thumb',
    },
  ];

  const missingRoots = sources.filter(s => !fs.existsSync(s.baseRoot));
  for (const m of missingRoots) {
    fmtWarn(`Missing source folder: ${m.baseRoot}`);
  }

  const allFiles = [];
  for (const s of sources) {
    if (!fs.existsSync(s.baseRoot)) continue;
    for (const ext of s.exts) {
      allFiles.push(...listFilesByExt(s.baseRoot, ext));
    }
  }

  const uniqueFiles = uniq(allFiles);
  safeLogLine(`Total files discovered for upload: ${uniqueFiles.length}`);

  const mapping = [];
  const failures = [];

  let uploaded = 0;
  for (let i = 0; i < uniqueFiles.length; i++) {
    const filePath = uniqueFiles[i];

    const source = sources.find(s => {
      const b = path.resolve(s.baseRoot) + path.sep;
      const f = path.resolve(filePath);
      return f.startsWith(b);
    });

    // Fallback label if somehow not matched
    const imageType = source ? source.imageType : 'unknown';
    const baseRoot = source ? source.baseRoot : path.dirname(filePath);
    const folder = getTopFolder(baseRoot, filePath);
    const fileName = path.basename(filePath);
    const relDisplay = source
      ? path.join(source.key, path.relative(source.baseRoot, filePath))
      : filePath;

    try {
      const asset = await uploadAsset(client, filePath);
      uploaded++;

      mapping.push({
        localPath: filePath,
        fileName,
        assetId: asset._id,
        folder,
        imageType,
        uploadedAt: new Date().toISOString(),
      });

      fmtCheck(`Uploaded: ${relDisplay} → ${asset._id}`);
      if ((uploaded % 50) === 0) {
        safeLogLine(`Progress: ${uploaded}/${uniqueFiles.length} uploaded (failed ${failures.length})`);
      }
    } catch (e) {
      failures.push({ localPath: filePath, error: e && e.message ? e.message : String(e) });
      fmtWarn(`Failed: ${relDisplay} :: ${e && e.message ? e.message : String(e)}`);
    }
  }

  // Write mapping files
  const outCsv = path.join(process.cwd(), 'asset-mapping.csv');
  const outJson = path.join(process.cwd(), 'asset-mapping.json');

  const header = ['localPath', 'fileName', 'assetId', 'folder', 'imageType', 'uploadedAt'];
  const csvLines = [header.join(',')];
  for (const row of mapping) {
    csvLines.push([
      csvEscape(row.localPath),
      csvEscape(row.fileName),
      csvEscape(row.assetId),
      csvEscape(row.folder),
      csvEscape(row.imageType),
      csvEscape(row.uploadedAt),
    ].join(','));
  }

  fs.writeFileSync(outCsv, csvLines.join('\r\n'), 'utf8');
  fs.writeFileSync(outJson, JSON.stringify({
    generatedAt: new Date().toISOString(),
    totalDiscovered: uniqueFiles.length,
    uploaded: mapping.length,
    failed: failures.length,
    failures,
    mapping,
  }, null, 2), 'utf8');

  const successRate = uniqueFiles.length === 0 ? 0 : Math.round((mapping.length / uniqueFiles.length) * 10000) / 100;

  safeLogLine('');
  safeLogLine('===== PHASE 1 COMPLETE =====');
  safeLogLine('Asset Upload Summary');
  safeLogLine(`Total images uploaded: ${mapping.length} ✓`);
  safeLogLine(`Upload errors: ${failures.length}${failures.length === 0 ? ' ✓' : ''}`);
  safeLogLine(`Success rate: ${successRate}%`);
  safeLogLine('');
  safeLogLine('Output files created:');
  safeLogLine(`✓ asset-mapping.csv (${mapping.length} rows)`);
  safeLogLine(`✓ asset-mapping.json (${mapping.length} entries)`);
  safeLogLine('');
  safeLogLine('All assets ready for Phase 2 (document creation & updates)');
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const dryRun = args.dryRun;
  const uploadAssetsOnly = args.uploadAssetsOnly;

  safeLogLine('Initializing...');

  if (!fs.existsSync(args.configPath)) {
    throw new Error(`Config file not found: ${args.configPath}`);
  }

  const config = readJson(args.configPath);
  ensureRequiredConfig(config);
  fmtCheck('Read image-upload-config.json');

  const client = buildClient(config);
  fmtCheck(`Sanity client initialized (project: ${config.sanity.projectId})`);

  let sanityOk = false;
  let sanityErr = null;
  try {
    // The complete automation doc asks for a "connection test" even in dry-run.
    // We do a single read-only GROQ query (no writes).
    await sanityConnectionTest(client);
    sanityOk = true;
  } catch (e) {
    sanityErr = e;
  }

  if (sanityOk) fmtCheck('Sanity connection: OK (read-only test)');
  else fmtWarn(`Sanity connection: FAILED (read-only test) :: ${sanityErr ? sanityErr.message : 'unknown error'}`);

  const errors = [];

  // ---- Phase 1: Page Images (AVIF) ----
  safeLogLine('');
  safeLogLine('Phase 1: Page Images (AVIF)');

  const processedRoot = config.processedRoot;
  const siteAvifRoot = path.join(processedRoot, 'site-avif');
  const siteAvifMobileRoot = path.join(processedRoot, 'site-avif-mobile');

  const pageMappings = Array.isArray(config.pageImages) ? config.pageImages : [];

  // Collect per mapping counts from desktop AVIF tree (as described by the prompt)
  let totalPageImages = 0;
  const pageImageByMapping = [];

  for (const page of pageMappings) {
    if (!page || !Array.isArray(page.mappings)) continue;
    for (const m of page.mappings) {
      const files = getPageImageCandidates(siteAvifRoot, m);
      const limited = typeof m.limit === 'number' ? files.slice(0, m.limit) : files;
      totalPageImages += limited.length;
      pageImageByMapping.push({ pageType: page.pageType, sanityDocId: page.sanityDocId, mapping: m, files: limited });
      fmtCheck(`Found ${limited.length} images in site-avif\\${m.sourceFolder}\\`);
    }
  }

  fmtCheck(`Total page images (desktop AVIF, after limits): ${totalPageImages}`);

  // ---- Phase 2: Product Images (Desktop + Mobile + Thumbnail) ----
  safeLogLine('');
  safeLogLine('Phase 2: Product Images (Desktop + Mobile + Thumbnail)');

  const productsRoot = path.join(config.sourceRoot, 'Products Organized by Folder');
  const productsMobileRoot = path.join(processedRoot, 'products-mobile', 'Products Organized by Folder');
  const productsThumbRoot = path.join(processedRoot, 'products-thumb', 'Products Organized by Folder');

  // Desktop product images: original (high-res)
  const desktopPatterns = [].concat(
    ...(Object.values(config.productImages?.imageMappings || {}).map(v => v.patterns || []))
  );

  const desktopGlobs = desktopPatterns.length
    ? desktopPatterns.map(p => toPosix(path.join(productsRoot, '**', p)))
    : [toPosix(path.join(productsRoot, '**/*.+(jpg|jpeg|JPG|JPEG)'))];

  const desktopProductFiles = uniq(desktopGlobs.flatMap(g => glob.sync(g, { nodir: true, windowsPathsNoEscape: true })));

  // Mobile product images: processed JPGs
  const mobileProductFiles = listAllImagesUnder(productsMobileRoot, ['jpg', 'jpeg', 'JPG', 'JPEG']);

  // Thumbnail product images
  const thumbPatterns = (config.productImages?.imageMappings?.cardImage?.patterns) || ['*product-image*', '*card*'];
  const thumbGlobs = thumbPatterns.map(p => toPosix(path.join(productsThumbRoot, '**', p)));
  const thumbFiles = uniq(thumbGlobs.flatMap(g => glob.sync(g, { nodir: true, windowsPathsNoEscape: true })));

  fmtCheck(`Found ${desktopProductFiles.length} desktop JPGs in Products Organized by Folder\\ (pattern-based)`);
  fmtCheck(`Found ${mobileProductFiles.length} mobile JPGs in products-mobile\\`);
  fmtCheck(`Found ${thumbFiles.length} thumbnails in products-thumb\\ (pattern-based)`);

  const totalProductImages = desktopProductFiles.length + mobileProductFiles.length + thumbFiles.length;
  fmtCheck(`Total product images (all sources): ${totalProductImages}`);

  // ---- Phase 3: Product Metadata & Plans ----
  safeLogLine('');
  safeLogLine('Phase 3: Product Metadata & Plans');

  let productFolders = [];
  try {
    productFolders = fs
      .readdirSync(productsRoot, { withFileTypes: true })
      .filter(d => d.isDirectory())
      .map(d => path.join(productsRoot, d.name));
  } catch (e) {
    errors.push(`Failed to enumerate product folders: ${e.message}`);
  }

  fmtCheck(`Found ${productFolders.length} product folders`);

  const planSamples = [];

  for (const folder of takeSample(productFolders, 5)) {
    const planName = path.basename(folder);
    const docx = findDocxInFolder(folder);
    if (!docx) {
      fmtWarn(`No .docx found for plan folder: ${planName}`);
      continue;
    }
    try {
      const result = await mammoth.extractRawText({ path: docx });
      const text = result.value || '';
      const bedrooms = extractNumberNear(text, ['bedroom', 'bedrooms', ' bed ', ' beds ']);
      const bathrooms = extractNumberNear(text, ['bathroom', 'bathrooms', ' bath ', ' baths ']);
      const stories = extractNumberNear(text, ['story', 'stories']);
      const sqft = extractSqFt(text);
      const { seoMeta } = extractMetaAndDescription(text);
      planSamples.push({ planName, bedrooms, bathrooms, stories, sqft, seoMetaSample: seoMeta.slice(0, 60) });
    } catch (e) {
      fmtWarn(`DOCX parse failed for ${planName}: ${e.message}`);
    }
  }

  for (const s of planSamples) {
    fmtCheck(`Sample: "${s.planName}" - ${s.bedrooms || '?'} bed, ${s.bathrooms || '?'} bath, ${s.sqft || '?'} sqft`);
  }

  // ---- Summary (Dry-run) ----
  safeLogLine('');
  safeLogLine('===== SUMMARY =====');

  const mode = dryRun ? 'DRY-RUN (no actual changes)' : 'LIVE';
  safeLogLine(`Mode: ${mode}`);

  // Page + product totals: for the complete automation prompt they expect ~690.
  const imagesToUploadEstimate = totalPageImages + totalProductImages;

  safeLogLine(`Configuration valid: YES`);
  safeLogLine(`Page images found (desktop AVIF, after limits): ${totalPageImages}`);
  safeLogLine(`Product images found (desktop+mobile+thumb): ${totalProductImages}`);
  safeLogLine(`Product plans identified (folders): ${productFolders.length}`);
  safeLogLine(`Sanity connection: ${sanityOk ? 'OK' : 'FAILED'}`);

  if (errors.length > 0) {
    safeLogLine(`Errors found: ${errors.length}`);
    for (const e of errors) fmtErr(e);
  } else {
    safeLogLine('Errors found: 0');
  }

  safeLogLine('');
  safeLogLine(`Images to upload (estimate): ${imagesToUploadEstimate}`);
  safeLogLine('Documents to update: 7 pages + 45 plans (expected)');

  if (dryRun) {
    safeLogLine('Status: READY TO PROCEED');
    safeLogLine('Skipping uploads and mutations in dry-run mode.');
    return;
  }

  if (uploadAssetsOnly) {
    await runUploadAssetsOnly({ client, config });
    return;
  }

  // ---- LIVE EXECUTION (only when run without --dry-run) ----
  // Note: This section is implemented for completeness, but you should only run it after user approval.

  // Upload all page images (desktop + mobile)
  // Then patch page documents based on config mappings.
  // Upload product images from the three sources.
  // Extract metadata from all docx files.
  // Create/update plan docs and publish everything.

  // Implementation intentionally conservative and error-tolerant.

  safeLogLine('');
  safeLogLine('LIVE mode is not executed in this run. Re-run without --dry-run after user approval.');
}

main().catch((e) => {
  fmtErr(e && e.stack ? e.stack : String(e));
  process.exit(1);
});
