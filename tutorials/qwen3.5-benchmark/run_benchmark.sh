#!/usr/bin/env bash
# One-click benchmark runner for the RTX 5090 (Windows 11) LLM bench repo.
# Works on Linux / macOS / WSL. For native Windows use run_benchmark.ps1.
#
# Usage:
#   ./run_benchmark.sh                    # full run
#   ./run_benchmark.sh --skip-needle      # skip needle test
#   ./run_benchmark.sh --model qwen3.5:35b-a3b --ollama-url http://localhost:11434
#   ./run_benchmark.sh --vllm-compare
#
set -uo pipefail

# -------- defaults --------
MODEL="qwen3.5:35b-a3b"
OLLAMA_URL="http://localhost:11434"
VENV_DIR=".venv"
SKIP_PULL=0
SKIP_SWEEP=0
SKIP_NEEDLE=0
SKIP_MAXCTX=0
SKIP_CHARTS=0
VLLM_COMPARE=0

# -------- arg parsing --------
while [[ $# -gt 0 ]]; do
  case "$1" in
    --model)        MODEL="$2"; shift 2 ;;
    --ollama-url)   OLLAMA_URL="$2"; shift 2 ;;
    --venv)         VENV_DIR="$2"; shift 2 ;;
    --skip-pull)    SKIP_PULL=1; shift ;;
    --skip-sweep)   SKIP_SWEEP=1; shift ;;
    --skip-needle)  SKIP_NEEDLE=1; shift ;;
    --skip-maxctx)  SKIP_MAXCTX=1; shift ;;
    --skip-charts)  SKIP_CHARTS=1; shift ;;
    --vllm-compare) VLLM_COMPARE=1; shift ;;
    -h|--help)
      grep '^#' "$0" | sed 's/^# \?//'
      exit 0 ;;
    *) echo "Unknown argument: $1"; exit 1 ;;
  esac
done

# -------- locate repo root (where this script lives) --------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SCRIPTS_DIR="$SCRIPT_DIR/qwen3.5-35b-a3b/scripts"
cd "$SCRIPT_DIR"

section() {
  echo
  echo "============================================================"
  echo "  $*"
  echo "============================================================"
}

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "ERROR: required command '$1' not found in PATH" >&2
    exit 1
  fi
}

# -------- 1. pre-flight --------
section "Pre-flight checks"
require_cmd python3
require_cmd pip
require_cmd ollama
echo "[OK] python3 / pip / ollama all detected"

# -------- 2. virtualenv + deps --------
section "Setting up Python virtualenv at $VENV_DIR"
if [[ ! -d "$VENV_DIR" ]]; then
  python3 -m venv "$VENV_DIR"
fi
# shellcheck disable=SC1091
source "$VENV_DIR/bin/activate"
python -m pip install --upgrade pip >/dev/null
python -m pip install requests matplotlib numpy
echo "[OK] dependencies installed"

# -------- 3. ollama reachable + model present --------
section "Checking Ollama at $OLLAMA_URL"
if ! curl -sf --max-time 5 "$OLLAMA_URL/api/tags" >/dev/null; then
  echo "ERROR: Ollama not reachable at $OLLAMA_URL. Start the Ollama app and retry." >&2
  exit 1
fi

HAVE_MODEL=$(curl -sf --max-time 5 "$OLLAMA_URL/api/tags" \
  | python -c "import json,sys; d=json.load(sys.stdin); print(any(m['name']=='$MODEL' for m in d.get('models',[])))" 2>/dev/null || echo "False")

if [[ "$HAVE_MODEL" != "True" ]]; then
  if [[ "$SKIP_PULL" -eq 1 ]]; then
    echo "ERROR: model $MODEL not present and --skip-pull was specified" >&2
    exit 1
  fi
  echo "Model $MODEL not found, pulling (this can take 30-60 minutes for 23 GB)..."
  ollama pull "$MODEL"
else
  echo "[OK] model $MODEL is present locally"
fi

# -------- 4. run benchmarks --------
FAILED=()
RESULTS_TSV="$(mktemp)"
trap 'rm -f "$RESULTS_TSV"' EXIT

run_step() {
  local name="$1"
  local script="$2"
  section "$name"
  local start=$SECONDS
  if python "$SCRIPTS_DIR/$script"; then
    local elapsed=$((SECONDS - start))
    echo -e "PASS\t$name\t$elapsed" >> "$RESULTS_TSV"
  else
    local elapsed=$((SECONDS - start))
    echo -e "FAIL\t$name\t$elapsed" >> "$RESULTS_TSV"
    FAILED+=("$name")
  fi
}

[[ "$SKIP_SWEEP"  -eq 0 ]] && run_step "Context-size sweep"    "sweep_ctx.py"
[[ "$SKIP_NEEDLE" -eq 0 ]] && run_step "Needle-in-a-haystack"  "needle_test.py"
[[ "$SKIP_MAXCTX" -eq 0 ]] && run_step "Max context search"    "find_max_ctx.py"
[[ "$SKIP_CHARTS" -eq 0 ]] && run_step "Generate charts"       "generate_charts.py"

if [[ "$VLLM_COMPARE" -eq 1 ]]; then
  section "Ollama vs vLLM comparison"
  if curl -sf --max-time 5 http://localhost:8000/v1/models >/dev/null; then
    echo "vLLM reachable. Run the comparison manually with the same prompt for both endpoints and update data/ollama_vs_vllm.csv"
  else
    echo "vLLM not reachable on :8000 - skipping comparison"
  fi
fi

# -------- 5. summary --------
section "Summary"
printf "%-10s %-30s %s\n" "STATUS" "STEP" "SECONDS"
printf "%-10s %-30s %s\n" "-------" "------------------------------" "-------"
while IFS=$'\t' read -r status name seconds; do
  if [[ "$status" == "PASS" ]]; then
    printf "\033[32m%-10s\033[0m %-30s %s\n" "$status" "$name" "$seconds"
  else
    printf "\033[31m%-10s\033[0m %-30s %s\n" "$status" "$name" "$seconds"
  fi
done < "$RESULTS_TSV"

if [[ ${#FAILED[@]} -gt 0 ]]; then
  echo
  echo "FAILED steps: ${FAILED[*]}"
  exit 1
fi

echo
echo "All steps passed."
