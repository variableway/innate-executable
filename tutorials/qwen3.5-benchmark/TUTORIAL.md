# 教程：RTX 5090 (Windows 11) 本地大模型 Benchmark 一键复现

> 本教程基于本仓库的 [Qwen 3.5 35B-A3B Q4_K_M 基准报告](qwen3.5-35b-a3b/README.md)，把「怎么部署」+「怎么跑 benchmark」+「怎么看结果」整理成一步步可操作的手册。  
> 同时附带一键脚本：Windows 下双击即可启动；Linux/macOS/WSL 下运行 `bash` 脚本即可。

---

## 0. 5 分钟总览

| 步骤 | 你要做什么 | 大约耗时 |
|---|---|---|
| 1 | 准备硬件 / 驱动 / Python | 5 分钟 |
| 2 | 安装并启动 Ollama，拉取模型 | 30~60 分钟（下载 23 GB 模型为主） |
| 3 | （可选）安装 vLLM 跑对比 | 15 分钟 |
| 4 | 运行一键 Benchmark 脚本 | 1~3 小时（视上下文规模而定） |
| 5 | 生成图表、阅读结论 | 5 分钟 |

如果你只想跑一遍「已经验证过的那套基准」，**直接跳到第 5 节一键脚本**即可。

---

## 1. 环境准备

### 1.1 硬件（已验证）
- GPU：**NVIDIA RTX 5090 (32 GB GDDR7)**
- CPU：AMD Ryzen 7 9800X3D（或同级 CPU）
- 内存：≥ 64 GB DDR5
- 硬盘：≥ 60 GB 可用空间（模型 23 GB + vLLM 镜像 18 GB + 缓存/输出）
- OS：Windows 11 Pro（WSL2 或原生 PowerShell 都可）

> 其它 32 GB 显存的 RTX 5090 / RTX 4090 也可跑，tk/s 数字会按显存带宽比例缩放，仅供参考。

### 1.2 软件
- NVIDIA 驱动 **≥ 591.86**（自带 CUDA 13.1）
- [Ollama for Windows](https://ollama.com/download) ≥ 0.17.1
- Python **3.10+**
- Git（拉取本仓库）

### 1.3 安装 Python 依赖
```powershell
# Windows PowerShell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install requests matplotlib numpy
```
```bash
# macOS / Linux
python3 -m venv .venv
source .venv/bin/activate
pip install requests matplotlib numpy
```

> `vllm` 依赖很重，**仅在你要跑 Ollama vs vLLM 对比时**再装：`pip install vllm`。

---

## 2. 部署模型（Ollama）

### 2.1 安装并启动 Ollama
1. 从 <https://ollama.com/download> 下载 Windows 安装包，安装后 Ollama 会作为后台服务运行。
2. 验证：
   ```powershell
   ollama --version
   ollama list
   ```

### 2.2 拉取本仓库使用的 Q4_K_M 模型
```powershell
ollama pull qwen3.5:35b-a3b
```
模型约 23 GB，下载时间取决于网络。完成后会出现在 `ollama list` 输出中。

### 2.3 验证模型可用
```powershell
ollama run qwen3.5:35b-a3b "你好，用一句话介绍自己。"
```
能正常返回结果即部署成功。

### 2.4 关于 `num_ctx`
Ollama 默认上下文窗口是 **2 048 tokens**。要跑本仓库的 8k~196k 基准，必须在 API 调用里显式传入 `options.num_ctx`（仓库脚本里都已写好），或者创建一个自定义 Modelfile：

```powershell
notepad qwen35b-196k.modelfile
```
写入：
```
FROM qwen3.5:35b-a3b
PARAMETER num_ctx 131072
```
保存后：
```powershell
ollama create qwen35b-131k -f qwen35b-196k.modelfile
ollama run qwen35b-131k "Hello"
```

---

## 3. 部署模型（vLLM，可选）

vLLM 在**多用户并发**场景下比 Ollama 强，但**单用户**下比 Ollama 慢 2x（实测 70.2 vs 139.9 tk/s），所以 vLLM 仅供参考。

```powershell
# 建议用 conda 隔离环境，避免和 torch 主线冲突
conda create -n vllm python=3.10 -y
conda activate vllm
pip install vllm
```

拉取并启动 AWQ 4bit 量化模型（OpenAI 兼容 API，默认 8000 端口）：
```powershell
vllm serve cyankiwi/Qwen3.5-35B-A3B-AWQ-4bit ^
    --port 8000 ^
    --max-model-len 16384 ^
    --gpu-memory-utilization 0.92 ^
    --dtype float16
```
> `--max-model-len` 16 384 足够跑「Ollama vs vLLM」单对比测试；想测更长上下文请相应提高，并保证 32 GB 显存够用。

确认服务起来了：
```powershell
curl http://localhost:8000/v1/models
```

---

## 4. 跑 Benchmark（手动版）

> 所有脚本都在 `qwen3.5-35b-a3b/scripts/` 目录，假设你已经 `cd` 进仓库根目录并激活了 Python 虚拟环境。

### 4.1 上下文 vs 速度扫描
衡量不同 `num_ctx`（2k ~ 196k）下的生成速度。
```powershell
python qwen3.5-35b-a3b/scripts/sweep_ctx.py
```
**预期耗时**：每个 ctx 一轮请求，~12 个点，约 5~10 分钟。  
**输出**：终端实时打印「`num_ctx / prompt tk/s / gen tk/s / load`」表格；可重定向到 CSV 自行分析。

### 4.2 Needle-in-a-Haystack
验证模型在超长上下文里**是否真的能找到关键信息**（5 个位置 × 多个 ctx）。  
> 默认脚本里只测了 `196608` 一个尺寸，可在 `main()` 的 `CONTEXT_SIZES` 里加回其它尺寸做完整 6×5 矩阵。
```powershell
python qwen3.5-35b-a3b/scripts/needle_test.py
```
**预期耗时**：单点 30~120s（196k 时受 VRAM 限制变慢）。

### 4.3 最大可用上下文
二分搜索出带工具定义时还能装下的最大 `num_ctx`：
```powershell
python qwen3.5-35b-a3b/scripts/find_max_ctx.py
```

### 4.4 工具 + 浏览器 Agent 压测（可选）
需要先自行实现 `agent.py`（提供 `TOOLS: list[dict]` 与 `execute_tool(name, args)`），然后：
```powershell
python qwen3.5-35b-a3b/scripts/bench_ctx.py
```
仓库中已附带最小占位 `agent.py`（`TOOLS = []` + 空 `execute_tool`），可直接跑通，但工具场景的真实数据需要你自己填充。

### 4.5 Ollama vs vLLM 对比
先确认 vLLM 已在 8000 端口运行，再用同一个 prompt 跑两边的生成，记录：
- Ollama（Q4_K_M）：`POST http://localhost:11434/api/chat`
- vLLM（AWQ 4bit）：`POST http://localhost:8000/v1/chat/completions`

把两份数据填进 `qwen3.5-35b-a3b/data/ollama_vs_vllm.csv`，再用 4.6 节生成图表。

### 4.6 生成图表
```powershell
python qwen3.5-35b-a3b/scripts/generate_charts.py
```
**前置**：`pip install matplotlib numpy`  
**输出**：5 张 PNG（`00_summary.png`、`01_speed_vs_context.png`…`04_degradation.png`），写入脚本里 `OUT` 指定的目录（默认 `C:/Users/PC/Developer/qwen/charts`）。**Windows 之外的平台请先改 `OUT` 路径**（脚本顶部常量），例如：
```python
OUT = os.path.join(os.path.dirname(__file__), "..", "charts")
```

---

## 5. 一键脚本（推荐）

> 这是本教程的核心交付物：把 1~4 步串成一条命令。

### 5.1 Windows（PowerShell）
把仓库根目录里的 `run_benchmark.ps1` 加到 PATH，或在 PowerShell 中直接：
```powershell
cd C:\path\to\5090-windows11-benchmarks
.\run_benchmark.ps1
```
常用参数：
```powershell
# 只跑速度扫描 + 图表，跳过 needle
.\run_benchmark.ps1 -SkipNeedle

# 自定义 Ollama 地址 / 模型
.\run_benchmark.ps1 -OllamaUrl "http://localhost:11434" -Model "qwen3.5:35b-a3b"

# 跑完整流程并附加 Ollama vs vLLM 对比（需要 vLLM 已起在 :8000）
.\run_benchmark.ps1 -RunVllmCompare
```

### 5.2 Linux / macOS / WSL（bash）
```bash
cd /path/to/5090-windows11-benchmarks
./run_benchmark.sh
```
常用参数：
```bash
./run_benchmark.sh --skip-needle
./run_benchmark.sh --ollama-url http://localhost:11434 --model qwen3.5:35b-a3b
./run_benchmark.sh --vllm-compare
```

### 5.3 脚本会做什么
1. 检查 `python` / `pip` / `ollama` 是否就绪，缺则报错退出。
2. 创建 `.venv` 并安装 `requests matplotlib numpy`。
3. 激活 venv，调用 Ollama `/api/tags` 确认模型存在；缺失时尝试 `ollama pull`。
4. 依次跑：
   - `sweep_ctx.py`（速度扫描）
   - `needle_test.py`（检索测试，可 `--skip-needle` 跳过）
   - `find_max_ctx.py`（最大 ctx 二分）
   - `generate_charts.py`（画图）
5. 全部跑完打印 PASS/FAIL 汇总。

> 单次完整流程约 1~3 小时，请保证电源稳定 + 散热通畅（GPU 长时间满载会撞温度墙导致 tk/s 下降）。

---

## 6. 怎么读结果

### 6.1 速度扫描看什么
- **2k–12k 满速区**：~145 tk/s，几乎不损失。
- **16k 第一次明显下跌**（-9%）：KV cache 开始抢占 compute。
- **16k–131k 优雅降级**：跨度 8x 上下文只再降 12 tk/s。
- **196k 断崖**（28%）：撞 32 GB 显存墙，部分 KV 溢出到系统内存。

→ **实操建议**：日常用 8k~12k，写代码用 32k~65k，分析长文档用 65k~131k，196k 留给「确实需要且不赶时间」的场景。

### 6.2 Needle 看什么
- 行 = ctx 大小，列 = 针在文中的位置（Start / 25% / Middle / 75% / End）。
- 单元格里的数字 = 当时生成速度（tk/s）。
- 绿色 = 找到（FOUND），红色 = 没找到（MISS）。
- **理想分布**：整张图全绿 → 没有「lost in the middle」。本仓库 Qwen 3.5 35B-A3B 跑出了 **30/30 全绿**。

### 6.3 Ollama vs vLLM 看什么
| 场景 | 选谁 |
|---|---|
| 单用户、低延迟 | **Ollama**（实测 2x 更快） |
| 多用户并发、API 服务 | **vLLM**（PagedAttention + 连续批处理） |
| 想跑最大上下文 | Ollama（llama.cpp 显存控制更精细） |

---

## 7. 常见问题（FAQ）

**Q1. 跑 196k 时报 OOM / CUDA out of memory？**  
A：关掉 Chrome、Discord 等会用 GPU 显存的程序；或在 `sweep_ctx.py` 的 `SIZES` 里临时把 196 608 删掉。

**Q2. 速度比报告低很多？**  
A：检查 (1) GPU 是否真的在跑（`nvidia-smi` 看利用率），(2) 电源计划是否「最佳性能」，(3) 散热是否撞墙（`nvidia-smi -q -d TEMPERATURE`），(4) 有没有别的进程占 GPU。

**Q3. 想要自己的 prompt / 自己的数据？**  
A：把对应脚本顶部的常量改掉即可：`MODEL`、`SIZES`、`CONTEXT_SIZES`、`HAY_PARAGRAPHS`、`NEEDLES`。

**Q4. 能在非 Windows 平台复现吗？**  
A：可以。Ollama / vLLM 都是跨平台的，模型一样，速度会因显存带宽（Mac 用统一内存会慢一些）有差异。把 `generate_charts.py` 顶部的 `OUT` 改成 Linux/macOS 路径就行。

**Q5. 一键脚本里 `bench_ctx.py` 用不了怎么办？**  
A：它依赖 `agent.py`（`TOOLS` + `execute_tool`）。仓库里放了最小占位实现，真正想做工具压测需要你自己实现 `agent.py`。

---

## 8. 文件结构速查

```
5090-windows11-benchmarks/
├── TUTORIAL.md                     ← 本文档
├── README.md                       ← 顶层导航 + 已有基准索引
├── run_benchmark.ps1               ← Windows 一键脚本
├── run_benchmark.sh                ← bash 一键脚本
└── qwen3.5-35b-a3b/
    ├── README.md                   ← 详细报告（数字、图表、结论）
    ├── charts/                     ← 生成的 PNG 图
    ├── data/                       ← CSV 原始数据
    └── scripts/
        ├── agent.py                ← (最小占位) 工具定义 + 执行器
        ├── bench_ctx.py            ← Agent 多轮对话压测
        ├── find_max_ctx.py         ← 最大 ctx 二分搜索
        ├── generate_charts.py      ← matplotlib 出图
        ├── needle_test.py          ← 检索准确性测试
        └── sweep_ctx.py            ← 上下文 vs 速度扫描
```

---

## 9. 贡献新模型

欢迎提交 PR！建议工作流：
1. 在 `qwen3.5-35b-a3b/` 同级新建 `<model-name>/` 目录。
2. 复制 `scripts/` 里的脚本，把模型名 / 量化方式 / 上下文尺寸改成你测的。
3. 把 `data/` 里的 CSV 用你自己的结果替换。
4. 重新跑 `generate_charts.py`（记得改 `OUT` 路径）。
5. 写一份 `<model-name>/README.md`，结构参考 `qwen3.5-35b-a3b/README.md`。
6. 在顶层 `README.md` 的「Models Tested」表里加一行，链接到新报告。

---

*Happy benchmarking. 跑出好数字别忘了回来开 Issue 炫耀一下。*
