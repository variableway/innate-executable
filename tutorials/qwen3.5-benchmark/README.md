# RTX 5090 Windows 11 — Local LLM Benchmarks

Real-world benchmarks of local LLMs on an RTX 5090 (32 GB) running Windows 11.

> **New here?** Start with the step-by-step **[TUTORIAL.md](TUTORIAL.md)** — it walks you through environment setup, Ollama / vLLM deployment, and a one-click benchmark run.  
> **Just want the numbers?** Jump straight to the per-model reports below.  
> **Want to reproduce?** Run `./run_benchmark.sh` (Linux/macOS/WSL) or `run_benchmark.ps1` (Windows PowerShell) at the repo root.

## System

| Component | Details |
|---|---|
| **GPU** | NVIDIA RTX 5090 32 GB GDDR7 |
| **CPU** | AMD Ryzen 7 9800X3D |
| **RAM** | 64 GB DDR5 |
| **OS** | Windows 11 Pro |
| **Driver** | 591.86 / CUDA 13.1 |

## Models Tested

| Model | Quant | Size | Peak tk/s | Max Context | Report |
|---|---|---|---|---|---|
| Qwen 3.5 35B-A3B | Q4_K_M | 23 GB | 145.6 | 196k (131k practical) | [Full Report](qwen3.5-35b-a3b/) |

## What's Tested

Each model gets the same battery of tests:

- **Generation speed sweep** — tk/s at every context size from 2k to max
- **Needle-in-a-haystack** — retrieval accuracy at 5 positions across all context sizes
- **Backend comparison** — Ollama vs vLLM (where applicable)
- **VRAM limits** — max context with and without other apps running
- **Practical recommendations** — sweet spots for different use cases

## Quick Highlights

### Qwen 3.5 35B-A3B

![Summary](qwen3.5-35b-a3b/charts/00_summary.png)

- **145.6 tk/s peak** (2k-8k context)
- **120 tk/s at 131k context** — only 18% degradation across 64x more context
- **30/30 needle retrieval** — perfect accuracy at all sizes, no "lost in the middle"
- **Ollama is 2x faster than vLLM** for single-user inference
- **196k context works** but drops to 40 tk/s (VRAM cliff)

---

*More models coming. PRs welcome if you have an RTX 5090 and want to add results.*
