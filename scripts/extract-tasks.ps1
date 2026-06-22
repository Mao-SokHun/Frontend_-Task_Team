param(
    [ValidateSet('bunhieng', 'sorint', 'sophy', 'sokhun', 'ratanak', 'somnang')]
    [string]$Member
)

$ErrorActionPreference = 'Stop'

$root = Split-Path $PSScriptRoot -Parent
$frontendSrc = Join-Path $root "frontend\src"
$allMembers = @('bunhieng', 'sorint', 'sophy', 'sokhun', 'ratanak', 'somnang')
$members = if ($Member) { @($Member) } else { $allMembers }

if (-not (Test-Path $frontendSrc)) {
    throw "Frontend src not found: $frontendSrc"
}

$totalCopied = 0
$missing = 0

foreach ($name in $members) {
    $taskRoot = Join-Path $root "tasks\$name"

    if (-not (Test-Path $taskRoot)) {
        Write-Warning "Skipping missing task folder: tasks/$name/"
        continue
    }

    $files = Get-ChildItem -Path $taskRoot -Recurse -File |
        Where-Object { $_.Name -ne 'README.md' }

    $memberCopied = 0

    foreach ($file in $files) {
        $relative = $file.FullName.Substring($taskRoot.Length + 1)
        $src = Join-Path $frontendSrc $relative

        if (-not (Test-Path $src)) {
            Write-Warning "Missing in frontend/src: $relative (tasks/$name/)"
            $missing++
            continue
        }

        $destDir = Split-Path $file.FullName -Parent
        if (-not (Test-Path $destDir)) {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        }

        Copy-Item -Path $src -Destination $file.FullName -Force
        $memberCopied++
        $totalCopied++
    }

    Write-Host "Extracted $memberCopied file(s): frontend/src/ -> tasks/$name/"
}

Write-Host "Done. $totalCopied file(s) copied, $missing missing in frontend."
