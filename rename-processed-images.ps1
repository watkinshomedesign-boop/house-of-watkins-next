param(
  [string]$processedRoot = "D:\New Website Assets\Website Images_Processed",
  [switch]$DryRun,
  [int]$SamplePerFolder = 10,
  [string]$LogPath = "rename-log.txt"
)

function Convert-ToLongPath([string]$p) {
  if ([string]::IsNullOrWhiteSpace($p)) { return $p }
  if ($p.StartsWith('\\?\')) { return $p }
  if ($p.StartsWith('\\')) { return "\\?\UNC\" + $p.Substring(2) }
  return "\\?\" + $p
}

function Rename-LongPath([string]$oldPath, [string]$newPath) {
  $oldLong = Convert-ToLongPath $oldPath
  $newLong = Convert-ToLongPath $newPath
  [System.IO.File]::Move($oldLong, $newLong)
}

$folderSuffixMap = [ordered]@{
  "Products-desktop"   = "-desktop"
  "products-mobile"    = "-mobile"
  "products-thumb"     = "-thumb"
  "site-avif"           = "-desktop"
  "site-avif-desktop"   = "-desktop"
  "site-avif-mobile"    = "-mobile"
}

$extensions = @("*.jpg", "*.jpeg", "*.avif", "*.png")

$results = @()

foreach ($folder in $folderSuffixMap.Keys) {
  $suffix = $folderSuffixMap[$folder]
  $folderPath = Join-Path $processedRoot $folder

  $renamedCount = 0
  $skippedCount = 0
  $errorCount = 0
  $sample = New-Object System.Collections.Generic.List[string]

  if (-not (Test-Path $folderPath)) {
    $results += [pscustomobject]@{
      Folder = $folder
      FolderPath = $folderPath
      Exists = $false
      Renamed = 0
      Skipped = 0
      Errors = 0
      Sample = @()
    }
    continue
  }

  Get-ChildItem -Path $folderPath -Recurse -File -Include $extensions -ErrorAction SilentlyContinue | ForEach-Object {
    $file = $_
    try {
      $baseName = [System.IO.Path]::GetFileNameWithoutExtension($file.Name)
      $extension = $file.Extension

      if ($baseName.EndsWith($suffix)) {
        $skippedCount++
        return
      }

      $newName = $baseName + $suffix + $extension
      $newPath = Join-Path $file.DirectoryName $newName

      if ($sample.Count -lt $SamplePerFolder) {
        $sample.Add("$($file.FullName) -> $newPath")
      }

      if ($DryRun) {
        $renamedCount++
        return
      }

      Rename-LongPath -oldPath $file.FullName -newPath $newPath
      $renamedCount++

      "$($file.FullName) -> $newPath" | Out-File -Append -FilePath $LogPath -Encoding utf8
    } catch {
      $errorCount++
      if (-not $DryRun) {
        "ERROR: $($file.FullName) :: $($_.Exception.Message)" | Out-File -Append -FilePath $LogPath -Encoding utf8
      }
    }
  }

  $results += [pscustomobject]@{
    Folder = $folder
    FolderPath = $folderPath
    Exists = $true
    Renamed = $renamedCount
    Skipped = $skippedCount
    Errors = $errorCount
    Sample = $sample.ToArray()
  }
}

$results | Format-List
