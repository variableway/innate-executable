# Python 环境

> 依赖地狱真实存在。虚拟环境是解药。

**类型:** Build
**语言:** Shell
**先修:** 阶段 0，第 01 课
**时长:** ~30 分钟

## 学习目标

- 使用 `uv`、`venv` 或 `conda` 创建隔离的虚拟环境
- 编写带可选依赖组的 `pyproject.toml`，并生成 lockfile 以保证可复现
- 诊断并修复常见陷阱：全局安装、pip/conda 混用、CUDA 版本不匹配
- 为依赖冲突的项目实现按阶段划分的环境策略

## 问题

你为某个微调项目安装了 PyTorch 2.4。下周另一个项目需要 PyTorch 2.1，因为它的 CUDA 构建被固定了。你全局升级，第一个项目坏了；你降级，第二个项目又坏了。

这就是依赖地狱。它在 AI/ML 工作中不断发生，原因是：

- PyTorch、JAX 和 TensorFlow 各自带了自己的 CUDA 绑定
- 模型库会固定特定的框架版本
- 全局 `pip install` 会覆盖之前已装的内容
- CUDA 11.8 构建无法在 CUDA 12.x 驱动上运行（反之亦然）

解法：每个项目拥有自己隔离的环境和独立的包。

## 概念

```mermaid
graph TD
    subgraph without["没有虚拟环境"]
        SP[系统 Python] --> T24["torch 2.4.0 (CUDA 12.4)\n项目 A 需要这个"]
        SP --> T21["torch 2.1.0 (CUDA 11.8)\n项目 B 需要这个"]
        SP --> CONFLICT["冲突：只能存在一个\ntorch 版本"]
    end

    subgraph with["有虚拟环境"]
        PA["项目 A (.venv/)"] --> PA1["torch 2.4.0 (CUDA 12.4)"]
        PA --> PA2["transformers 4.44"]
        PB["项目 B (.venv/)"] --> PB1["torch 2.1.0 (CUDA 11.8)"]
        PB --> PB2["diffusers 0.28"]
    end
```

```figure
s0-env-isolation
```

## 动手做

### 选项 1：uv venv（推荐）

`uv` 是最快的 Python 包管理器（比 pip 快 10–100 倍）。它用一个工具处理虚拟环境、Python 版本和依赖解析。

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh

uv python install 3.12

cd your-project
uv venv
source .venv/bin/activate
```

安装包：

```bash
uv pip install torch numpy
```

一步创建带 `pyproject.toml` 的项目：

```bash
uv init my-ai-project
cd my-ai-project
uv pip install torch numpy matplotlib
```

### 选项 2：venv（内置）

如果无法安装 `uv`，Python 自带 `venv`：

```bash
python3 -m venv .venv
source .venv/bin/activate  # Linux/macOS
.venv\Scripts\activate     # Windows

pip install torch numpy
```

比 `uv` 慢，但凡装了 Python 就能用。

### 选项 3：conda（需要时再用）

Conda 管理非 Python 依赖，比如 CUDA 工具包、cuDNN 和 C 库。以下情况用它：

- 需要特定版本的 CUDA 工具包，又不想装到系统级
- 在共享集群上，无法安装系统包
- 某个库的安装说明写着"请用 conda"

```bash
# Install miniconda (not the full Anaconda)
curl -LsSf https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-x86_64.sh -o miniconda.sh
bash miniconda.sh -b

conda create -n myproject python=3.12
conda activate myproject

conda install pytorch torchvision torchaudio pytorch-cuda=12.4 -c pytorch -c nvidia
```

一条规则：如果某个环境用 conda 创建，该环境里的所有包都用 conda 装。往 conda 环境里混 `pip install` 会引发难以调试的依赖冲突。

### 本课程：按阶段划分的策略

你可以为整门课创建一个环境。别这么做。不同阶段需要不同（有时互相冲突）的依赖。

策略：

```
ai-engineering-from-scratch/
├── .venv/                    <-- shared lightweight env for phases 0-3
├── phases/
│   ├── 04-neural-networks/
│   │   └── .venv/            <-- PyTorch env
│   ├── 05-cnns/
│   │   └── .venv/            <-- same PyTorch env (symlink or shared)
│   ├── 08-transformers/
│   │   └── .venv/            <-- might need different transformer versions
│   └── 11-llm-apis/
│       └── .venv/            <-- API SDKs, no torch needed
```

`code/env_setup.sh` 脚本会为本课程创建基础环境。

## pyproject.toml 基础

每个 Python 项目都应该有 `pyproject.toml`。它用一个文件取代了 `setup.py`、`setup.cfg` 和 `requirements.txt`。

```toml
[project]
name = "ai-engineering-from-scratch"
version = "0.1.0"
requires-python = ">=3.11"
dependencies = [
    "numpy>=1.26",
    "matplotlib>=3.8",
    "jupyter>=1.0",
    "scikit-learn>=1.4",
]

[project.optional-dependencies]
torch = ["torch>=2.3", "torchvision>=0.18"]
llm = ["anthropic>=0.39", "openai>=1.50"]
```

然后安装：

```bash
uv pip install -e ".[torch]"    # base + PyTorch
uv pip install -e ".[llm]"     # base + LLM SDKs
uv pip install -e ".[torch,llm]" # everything
```

## 锁定文件

lockfile 会把每个依赖（包括传递依赖）固定到精确版本。这保证了可复现：任何人从 lockfile 安装，拿到的包完全一致。

```bash
# uv generates uv.lock automatically when using uv add
uv add numpy

# pip-tools approach
uv pip compile pyproject.toml -o requirements.lock
uv pip install -r requirements.lock
```

把 lockfile 提交到 git。别人克隆仓库后从 lockfile 安装，就能得到完全相同的版本。

## 常见错误

### 1. 全局安装

```bash
pip install torch  # BAD: installs to system Python

source .venv/bin/activate
pip install torch  # GOOD: installs to virtual environment
```

检查包装到了哪里：

```bash
which python       # should show .venv/bin/python, not /usr/bin/python
which pip           # should show .venv/bin/pip
```

### 2. 混用 pip 和 conda

```bash
conda create -n myenv python=3.12
conda activate myenv
conda install pytorch -c pytorch
pip install some-other-package   # BAD: can break conda's dependency tracking
conda install some-other-package # GOOD: let conda manage everything
```

如果非要在 conda 里用 pip（有些包只在 PyPI），先把所有 conda 包装完，最后再装 pip 包。

### 3. 忘记激活

```bash
python train.py           # uses system Python, missing packages
source .venv/bin/activate
python train.py           # uses project Python, packages found
```

shell 提示符应显示环境名：

```
(.venv) $ python train.py
```

### 4. 把 .venv 提交到 git

```bash
echo ".venv/" >> .gitignore
```

虚拟环境有 200MB–2GB。它们是本地的，无法在机器间移植。改为提交 `pyproject.toml` 和 lockfile。

### 5. CUDA 版本不匹配

```bash
nvidia-smi                # shows driver CUDA version (e.g., 12.4)
python -c "import torch; print(torch.version.cuda)"  # shows PyTorch CUDA version

# These must be compatible.
# PyTorch CUDA version must be <= driver CUDA version.
```

## 用起来

运行安装脚本，创建你的课程环境：

```bash
bash phases/00-setup-and-tooling/06-python-environments/code/env_setup.sh
```

这会在仓库根目录创建一个 `.venv`，装好核心依赖并完成验证。

## 练习

1. 运行 `env_setup.sh` 并确认所有检查通过
2. 创建第二个虚拟环境，在里面装一个不同版本的 numpy，确认两个环境互相隔离
3. 为一个同时需要 PyTorch 和 Anthropic SDK 的项目编写 `pyproject.toml`
4. 故意全局安装一个包（不激活 venv），观察它装到了哪里，然后卸载它

## 关键术语

| 术语 | 常见说法 | 实际含义 |
|------|----------|----------|
| 虚拟环境 | "一个 venv" | 一个隔离目录，内含独立的 Python 解释器和包，与系统 Python 分开 |
| 锁定文件 | "固定依赖" | 列出每个包及其精确版本的文件，保证跨机器安装结果一致 |
| pyproject.toml | "新的 setup.py" | Python 项目标准配置文件，取代 setup.py/setup.cfg/requirements.txt |
| 传递依赖 | "依赖的依赖" | 包 B 依赖 C；若你安装依赖 B 的 A，则 C 是 A 的传递依赖 |
| CUDA 不匹配 | "我的 GPU 不工作" | PyTorch 编译时用的 CUDA 版本与 GPU 驱动支持的版本不一致 |
