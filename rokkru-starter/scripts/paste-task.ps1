param(
    [Parameter(Mandatory = $true)]
    [ValidateSet('bunhieng', 'sorint', 'sophy', 'sokhun', 'ratanak', 'somnang')]
    [string]$Member
)

$ErrorActionPreference = 'Stop'

$root = Split-Path $PSScriptRoot -Parent
$taskRoot = Join-Path $root "tasks\$Member"
$frontendSrc = Join-Path $root "frontend\src"

if (-not (Test-Path $taskRoot)) {
    throw "Task folder not found: $taskRoot"
}

if (-not (Test-Path $frontendSrc)) {
    throw "Frontend src not found: $frontendSrc"
}

$files = Get-ChildItem -Path $taskRoot -Recurse -File |
    Where-Object { $_.Name -ne 'README.md' }

if ($files.Count -eq 0) {
    Write-Warning "No files to paste in tasks/$Member/"
    exit 0
}

$copied = 0
foreach ($file in $files) {
    $relative = $file.FullName.Substring($taskRoot.Length + 1)
    $dest = Join-Path $frontendSrc $relative
    $destDir = Split-Path $dest -Parent

    if (-not (Test-Path $destDir)) {
        New-Item -ItemType Directory -Path $destDir -Force | Out-Null
    }

    Copy-Item -Path $file.FullName -Destination $dest -Force
    $copied++
}

Write-Host "Pasted $copied file(s): tasks/$Member/ -> frontend/src/"
