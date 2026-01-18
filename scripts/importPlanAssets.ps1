param(
  [Parameter(Mandatory = $true)]
  [string]$SourceRoot,

  [Parameter(Mandatory = $true)]
  [string]$RepoRoot
)

$ErrorActionPreference = "Stop"

function Slugify([string]$s) {
  $t = $s.ToLowerInvariant()
  $t = [regex]::Replace($t, "[^a-z0-9]+", "-")
  $t = $t.Trim("-")
  $t = [regex]::Replace($t, "-+", "-")
  return $t
}

function EnsureDir([string]$p) {
  if (!(Test-Path -LiteralPath $p)) {
    New-Item -ItemType Directory -Path $p | Out-Null
  }
}

$destRoot = Join-Path $RepoRoot "public\plans"
EnsureDir $destRoot

$planDirs = Get-ChildItem -LiteralPath $SourceRoot -Directory | Sort-Object Name
$report = @()

foreach ($dir in $planDirs) {
  $slug = Slugify $dir.Name
  $dest = Join-Path $destRoot $slug

  $thumbs = Join-Path $dest "thumbs"
  $hover = Join-Path $dest "hover"
  $gallery = Join-Path $dest "gallery"
  $floorplans = Join-Path $dest "floorplans"
  $originals = Join-Path $dest "originals"

  EnsureDir $thumbs
  EnsureDir $hover
  EnsureDir $gallery
  EnsureDir $floorplans
  EnsureDir $originals

  $files = Get-ChildItem -LiteralPath $dir.FullName -File -Recurse
  $images = $files | Where-Object { $_.Extension -match "^(\.jpg|\.jpeg|\.png|\.webp)$" }

  foreach ($f in $images) {
    Copy-Item -LiteralPath $f.FullName -Destination (Join-Path $originals $f.Name) -Force
  }

  $heroCandidates = $images |
    Where-Object { $_.Name -match "(front-view-product-image|image-of-front|front-view|front-image|front\-view)" } |
    Sort-Object Length -Descending

  if (!$heroCandidates -or $heroCandidates.Count -eq 0) {
    $heroCandidates = $images | Sort-Object Length -Descending
  }

  $heroFile = $heroCandidates | Select-Object -First 1
  $heroExt = if ($heroFile) { $heroFile.Extension.ToLowerInvariant() } else { "" }

  if ($heroFile) {
    Copy-Item -LiteralPath $heroFile.FullName -Destination (Join-Path $thumbs ("desktop" + $heroExt)) -Force
    Copy-Item -LiteralPath $heroFile.FullName -Destination (Join-Path $thumbs ("mobile" + $heroExt)) -Force
  }

  $floorplanCandidates = $images |
    Where-Object { $_.Name -match "(floor\-plan|floor plan|main-level-floor-plan|upper-level-floor-plan|fp)" -and $_.Name -notmatch "elevation" } |
    Sort-Object Length -Descending

  $hoverFile = $floorplanCandidates | Select-Object -First 1
  if ($hoverFile) {
    $hoverExt = $hoverFile.Extension.ToLowerInvariant()
    Copy-Item -LiteralPath $hoverFile.FullName -Destination (Join-Path $hover ("floorplan" + $hoverExt)) -Force
  }

  $galleryIndex = 1
  foreach ($f in $images) {
    if ($heroFile -and $f.FullName -eq $heroFile.FullName) { continue }
    if ($hoverFile -and $f.FullName -eq $hoverFile.FullName) { continue }

    $ext = $f.Extension.ToLowerInvariant()
    $name = ("{0:D2}" -f $galleryIndex) + $ext
    Copy-Item -LiteralPath $f.FullName -Destination (Join-Path $gallery $name) -Force
    $galleryIndex++
  }

  $fpIndex = 1
  foreach ($f in $floorplanCandidates) {
    $ext = $f.Extension.ToLowerInvariant()
    $name = ("fp-{0:D2}" -f $fpIndex) + $ext
    Copy-Item -LiteralPath $f.FullName -Destination (Join-Path $floorplans $name) -Force
    $fpIndex++
  }

  $report += [pscustomobject]@{
    folder = $dir.Name
    slug = $slug
    hero = if ($heroFile) { $heroFile.Name } else { $null }
    hover = if ($hoverFile) { $hoverFile.Name } else { $null }
    gallery_count = [Math]::Max(0, $images.Count - (if ($heroFile) { 1 } else { 0 }) - (if ($hoverFile) { 1 } else { 0 }))
    floorplan_count = $floorplanCandidates.Count
  }
}

$report | ConvertTo-Json -Depth 6
