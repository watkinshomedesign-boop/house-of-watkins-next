import fs from "node:fs/promises";
import path from "node:path";

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-");
}

async function pathExists(p) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function ensureDir(p) {
  await fs.mkdir(p, { recursive: true });
}

function isImageFile(name) {
  return /\.(jpg|jpeg|png|webp)$/i.test(name);
}

function pickHero(images) {
  const re = /(front-view-product-image|image-of-front|front-view|front-image|front\-view)/i;
  const matches = images.filter((f) => re.test(path.basename(f)));
  const sorted = (matches.length ? matches : images).slice().sort((a, b) => {
    // Prefer bigger filenames as a crude proxy for resolution (actual size requires stat)
    return path.basename(b).length - path.basename(a).length;
  });
  return sorted[0] ?? null;
}

function pickFloorplans(images) {
  const re = /(floor\-plan|floor plan|main-level-floor-plan|upper-level-floor-plan|fp)/i;
  const notElevation = !/elevation/i;
  return images
    .filter((f) => re.test(path.basename(f)) && !/elevation/i.test(path.basename(f)))
    .slice()
    .sort((a, b) => path.basename(b).length - path.basename(a).length);
}

async function listFilesRecursive(dir) {
  const out = [];
  async function walk(current) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const e of entries) {
      const full = path.join(current, e.name);
      if (e.isDirectory()) await walk(full);
      else if (e.isFile()) out.push(full);
    }
  }
  await walk(dir);
  return out;
}

async function copy(src, dest) {
  await ensureDir(path.dirname(dest));
  await fs.copyFile(src, dest);
}

function format2(n) {
  return String(n).padStart(2, "0");
}

async function main() {
  const [sourceRoot, repoRoot] = process.argv.slice(2);
  if (!sourceRoot || !repoRoot) {
    console.error("Usage: node scripts/importPlanAssets.mjs <SourceRoot> <RepoRoot>");
    process.exit(1);
  }

  const destRoot = path.join(repoRoot, "public", "plans");
  await ensureDir(destRoot);

  const dirEntries = await fs.readdir(sourceRoot, { withFileTypes: true });
  const planDirs = dirEntries.filter((d) => d.isDirectory()).map((d) => d.name).sort();

  const report = [];

  for (const folderName of planDirs) {
    const folderPath = path.join(sourceRoot, folderName);
    const slug = slugify(folderName);

    const dest = path.join(destRoot, slug);
    const thumbs = path.join(dest, "thumbs");
    const hover = path.join(dest, "hover");
    const gallery = path.join(dest, "gallery");
    const floorplansDir = path.join(dest, "floorplans");
    const originals = path.join(dest, "originals");

    await Promise.all([ensureDir(thumbs), ensureDir(hover), ensureDir(gallery), ensureDir(floorplansDir), ensureDir(originals)]);

    const allFiles = await listFilesRecursive(folderPath);
    const images = allFiles.filter((f) => isImageFile(f));

    // Preserve originals (flat)
    for (const f of images) {
      const base = path.basename(f);
      await copy(f, path.join(originals, base));
    }

    // Choose hero + hover
    const heroFile = pickHero(images);
    const floorplans = pickFloorplans(images);
    const hoverFile = floorplans[0] ?? null;

    // Thumbs
    let heroThumbExt = null;
    if (heroFile) {
      heroThumbExt = path.extname(heroFile).toLowerCase();
      await copy(heroFile, path.join(thumbs, `desktop${heroThumbExt}`));
      await copy(heroFile, path.join(thumbs, `mobile${heroThumbExt}`));
    }

    // Hover
    let hoverExt = null;
    if (hoverFile) {
      hoverExt = path.extname(hoverFile).toLowerCase();
      await copy(hoverFile, path.join(hover, `floorplan${hoverExt}`));
    }

    // Gallery (everything except hero + hover)
    const exclude = new Set([heroFile, hoverFile].filter(Boolean));
    const galleryFiles = images.filter((f) => !exclude.has(f));
    let g = 1;
    for (const f of galleryFiles) {
      const ext = path.extname(f).toLowerCase();
      await copy(f, path.join(gallery, `${format2(g)}${ext}`));
      g++;
    }

    // Floorplans
    let fp = 1;
    for (const f of floorplans) {
      const ext = path.extname(f).toLowerCase();
      await copy(f, path.join(floorplansDir, `fp-${format2(fp)}${ext}`));
      fp++;
    }

    report.push({
      folder: folderName,
      slug,
      counts: {
        images_total: images.length,
        gallery: galleryFiles.length,
        floorplans: floorplans.length,
      },
      selected: {
        hero: heroFile ? path.basename(heroFile) : null,
        hover_floorplan: hoverFile ? path.basename(hoverFile) : null,
      },
      output: {
        thumbs_desktop: heroFile ? `/plans/${slug}/thumbs/desktop${heroThumbExt}` : null,
        thumbs_mobile: heroFile ? `/plans/${slug}/thumbs/mobile${heroThumbExt}` : null,
        hover: hoverFile ? `/plans/${slug}/hover/floorplan${hoverExt}` : null,
      },
    });
  }

  process.stdout.write(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
