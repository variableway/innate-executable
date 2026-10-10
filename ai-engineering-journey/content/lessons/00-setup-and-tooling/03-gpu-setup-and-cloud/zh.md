# GPU 与云端

> 用 CPU 学习没问题。真正训练，需要 GPU。

**类型:** Build
**语言:** Python
**先修:** 阶段 0、第 01 课
**时长:** ~45 分钟

## 学习目标

- 用 `nvidia-smi` 和 PyTorch 的 CUDA API 验证本地 GPU 是否可用
- 配置 Google Colab 的 T4 GPU，免费做云端实验
- 对比 CPU 与 GPU 的矩阵乘法性能，测出加速比
- 用 fp16 经验法则估算显存能装下的最大模型

## 问题

阶段 1–3 的大多数课程在 CPU 上就能跑。但一旦开始训练 CNN、Transformer 或 LLM（阶段 4 之后），就需要 GPU 加速。CPU 上跑 8 小时的训练，GPU 上 10 分钟就能完成。

你有三个选择：本地 GPU、云 GPU，或 Google Colab（免费）。

## 概念

```
你的选择：

1. 本地 NVIDIA GPU
   费用：$0（你已经有了）
   安装：安装 CUDA + cuDNN
   适合：日常使用、大数据集

2. Google Colab（免费层）
   费用：$0
   安装：无需
   适合：快速实验、家里没有 GPU

3. 云 GPU（Lambda、RunPod、Vast.ai）
   费用：$0.20-2.00/hr
   安装：SSH + 安装
   适合：认真训练、大模型
```

```figure
s0-gpu-dispatch
```

## 动手做

### 选项 1：本地 NVIDIA GPU

先看你有没有：

```bash
nvidia-smi
```

安装带 CUDA 的 PyTorch：

```python
import torch

print(f"CUDA available: {torch.cuda.is_available()}")
print(f"CUDA version: {torch.version.cuda}")
if torch.cuda.is_available():
    print(f"GPU: {torch.cuda.get_device_name(0)}")
    print(f"Memory: {torch.cuda.get_device_properties(0).total_memory / 1e9:.1f} GB")
```

### 选项 2：Google Colab

1. 打开 [colab.research.google.com](https://colab.research.google.com)
2. Runtime > Change runtime type > T4 GPU
3. 运行 `!nvidia-smi` 验证

可以把本课程的 notebook 直接上传到 Colab。

### 选项 3：云 GPU

以 Lambda Labs、RunPod 或 Vast.ai 为例：

```bash
ssh user@your-gpu-instance

pip install torch torchvision torchaudio
python -c "import torch; print(torch.cuda.get_device_name(0))"
```

### 没有 GPU？没关系。

大多数课程在 CPU 上也能跑。需要 GPU 的课程会明确说明，并附上 Colab 链接。

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
print(f"Using: {device}")
```

## 动手做：GPU 与 CPU 基准测试

```python
import torch
import time

size = 5000

a_cpu = torch.randn(size, size)
b_cpu = torch.randn(size, size)

start = time.time()
c_cpu = a_cpu @ b_cpu
cpu_time = time.time() - start
print(f"CPU: {cpu_time:.3f}s")

if torch.cuda.is_available():
    a_gpu = a_cpu.to("cuda")
    b_gpu = b_cpu.to("cuda")

    torch.cuda.synchronize()
    start = time.time()
    c_gpu = a_gpu @ b_gpu
    torch.cuda.synchronize()
    gpu_time = time.time() - start
    print(f"GPU: {gpu_time:.3f}s")
    print(f"Speedup: {cpu_time / gpu_time:.0f}x")
```

## 练习

1. 运行上面的基准测试，比较 CPU 与 GPU 的耗时
2. 如果你没有 GPU，在 Google Colab 上跑一遍并对比
3. 查看你的显存大小，估算能装下的最大模型（经验法则：fp16 每个参数 2 字节）

## 关键术语

| 术语 | 人们常说 | 实际含义 |
|------|----------------|----------------------|
| CUDA | “GPU 编程” | NVIDIA 的并行计算平台，让你在 GPU 上跑代码 |
| VRAM | “显存” | GPU 上的显存，与系统内存分开。决定模型大小上限 |
| fp16 | “半精度” | 16 位浮点数，内存占用是 fp32 的一半，精度损失极小 |
| Tensor Core | “快速矩阵硬件” | 专用的 GPU 矩阵乘法核心，比普通核心快 4–8 倍 |
