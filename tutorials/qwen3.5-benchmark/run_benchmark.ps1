<#
.SYNOPSIS
    One-click benchmark runner for the RTX 5090 (Windows 11) LLM bench repo.

.DESCRIPTION
    1. Checks python / pip / ollama are available.
    2. Creates .venv (if missing) and installs requests / matplotlib / numpy.
    3. Ensures the configured model is pulled in Ollama.
    4. Runs the context-size sweep, needle-in-a-haystack, and chart generation.
    5. Optionally runs the Ollama vs vLLM comparison (requires vLLM on :8000).

.PARAMETER Model
    Ollama model tag to benchmark. Default: qwen3.5:35b-a3b

.PARAMETER OllamaUrl
    Base URL of the Ollama server. Default: http://localhost:11434

.PARAMETER SkipPull
    Skip the "ollama pull" step (assume model is already present).

.PARAMETER SkipSweep
    Skip the context-size sweep.

.PARAMETER SkipNeedle
    Skip the needle-in-a-haystack test.

.PARAMETER SkipMaxCtx
    Skip the max-ctx binary search.

.PARAMETER SkipCharts
    Skip chart generation.

.PARAMETER RunVllmCompare
    Add an Ollama vs vLLM comparison prompt (requires vLLM at :8000).

.PARAMETER VenvDir
    Path to the Python virtualenv. Default: .\.venv

.EXAMPLE
    .\run_benchmark.ps1

.EXAMPLE
    .\run_benchmark.ps1 -SkipNeedle -Model "qwen3.5:35b-a3b"

.EXAMPLE
    .\run_benchmark.ps1 -RunVllmCompare
#>
[CmdletBinding()]
param(
    [string] $Model = "qwen3.5:35b-a3b",
    [string] $OllamaUrl = "http://localhost:11434",
    [switch] $SkipPull,
    [switch] $SkipSweep,
    [switch] $SkipNeedle,
    [switch] $SkipMaxCtx,
    [switch] $SkipCharts,
    [switch] $RunVllmCompare,
    [string] $VenvDir = ".venv"
)

$ErrorActionPreference = "Stop"
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$RepoRoot  = Resolve-Path $ScriptDir

function Write-Section($title) {
    Write-Host ""
    Write-Host "============================================================" -ForegroundColor Cyan
    Write-Host "  $title" -ForegroundColor Cyan
    Write-Host "============================================================" -ForegroundColor Cyan
}

function Test-Command($name) {
    $cmd = Get-Command $name -ErrorAction SilentlyContinue
    return [bool]$cmd
}

# ------------------------------------------------------------------
# 1. Pre-flight checks
# ------------------------------------------------------------------
Write-Section "Pre-flight checks"

if (-not (Test-Command python)) {
    Write-Error "python not found in PATH. Install Python 3.10+ from https://www.python.org/ and retry."
    exit 1
}
if (-not (Test-Command pip)) {
    Write-Error "pip not found. Try: python -m ensurepip --upgrade"
    exit 1
}
if (-not (Test-Command ollama)) {
    Write-Error "ollama not found. Install from https://ollama.com/download and retry."
    exit 1
}
Write-Host "[OK] python / pip / ollama all detected" -ForegroundColor Green

# ------------------------------------------------------------------
# 2. Virtualenv + dependencies
# ------------------------------------------------------------------
Write-Section "Setting up Python virtualenv at $VenvDir"
if (-not (Test-Path $VenvDir)) {
    python -m venv $VenvDir
    if ($LASTEXITCODE -ne 0) { Write-Error "venv creation failed"; exit 1 }
}
$pythonExe = Join-Path $VenvDir "Scripts\python.exe"
& $pythonExe -m pip install --upgrade pip | Out-Null
& $pythonExe -m pip install requests matplotlib numpy | Out-Null
if ($LASTEXITCODE -ne 0) { Write-Error "pip install failed"; exit 1 }
Write-Host "[OK] dependencies installed" -ForegroundColor Green

# ------------------------------------------------------------------
# 3. Ensure Ollama is serving and the model exists
# ------------------------------------------------------------------
Write-Section "Checking Ollama at $OllamaUrl"
try {
    $tags = Invoke-RestMethod -Uri "$OllamaUrl/api/tags" -TimeoutSec 5
    $haveModel = $tags.models | Where-Object { $_.name -eq $Model }
} catch {
    Write-Error "Ollama not reachable at $OllamaUrl. Start the Ollama app and retry."
    exit 1
}
if (-not $haveModel) {
    if ($SkipPull) {
        Write-Error "Model $Model not present and -SkipPull was specified."
        exit 1
    }
    Write-Host "Model $Model not found, pulling (this can take 30-60 minutes for 23 GB)..." -ForegroundColor Yellow
    & ollama pull $Model
    if ($LASTEXITCODE -ne 0) { Write-Error "ollama pull failed"; exit 1 }
} else {
    Write-Host "[OK] model $Model is present locally" -ForegroundColor Green
}

# ------------------------------------------------------------------
# 4. Run the benchmarks
# ------------------------------------------------------------------
$scriptsDir = Join-Path $RepoRoot "qwen3.5-35b-a3b\scripts"
$failed = @()
$results = @()

function Run-Step([string] $name, [string] $script) {
    Write-Section $name
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    & $pythonExe (Join-Path $scriptsDir $script)
    $rc = $LASTEXITCODE
    $sw.Stop()
    $script:results += [pscustomobject]@{ Step = $name; Status = $(if ($rc -eq 0) {"PASS"} else {"FAIL"}); Seconds = [int]$sw.Elapsed.TotalSeconds }
    if ($rc -ne 0) { $script:failed += $name }
}

if (-not $SkipSweep) { Run-Step "Context-size sweep"   "sweep_ctx.py" }
if (-not $SkipNeedle) { Run-Step "Needle-in-a-haystack" "needle_test.py" }
if (-not $SkipMaxCtx) { Run-Step "Max context search"   "find_max_ctx.py" }
if (-not $SkipCharts) { Run-Step "Generate charts"       "generate_charts.py" }

if ($RunVllmCompare) {
    Write-Section "Ollama vs vLLM comparison"
    try {
        $vllmOk = Invoke-WebRequest -Uri "http://localhost:8000/v1/models" -TimeoutSec 5 -UseBasicParsing
        if ($vllmOk.StatusCode -eq 200) {
            Write-Host "vLLM reachable. Run the comparison manually with the same prompt for both endpoints and update data/ollama_vs_vllm.csv" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "vLLM not reachable on :8000 - skipping comparison" -ForegroundColor Yellow
    }
}

# ------------------------------------------------------------------
# 5. Summary
# ------------------------------------------------------------------
Write-Section "Summary"
$results | Format-Table -AutoSize | Out-String | Write-Host
if ($failed.Count -gt 0) {
    Write-Host "FAILED steps: $($failed -join ', ')" -ForegroundColor Red
    exit 1
} else {
    Write-Host "All steps passed." -ForegroundColor Green
    exit 0
}
