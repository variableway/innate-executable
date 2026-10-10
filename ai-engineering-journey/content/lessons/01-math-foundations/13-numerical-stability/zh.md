# 数值稳定性

> 浮点是一个漏风的抽象。它会在训练中咬你一口，而且你看不见它来。

**类型:** Build
**语言:** Python
**先修:** Phase 1, Lessons 01-04
**时长:** ~120 分钟

## 学习目标

- 用减最大值技巧实现数值稳定的 softmax 和 log-sum-exp
- 识别浮点计算中的上溢、下溢和灾难性抵消
- 用中心差分法验证解析梯度与数值梯度的一致性
- 解释为什么训练中 bfloat16 优于 float16，以及损失缩放如何防止梯度下溢

## 问题

你的模型训了三个小时，然后 loss 变成 NaN。你加了个 print。第 9,000 步 logits 还好好的。第 9,001 步它们是 `inf`。到第 9,002 步，每个梯度都是 `nan`，训练死了。

或者：你的模型训完了，但准确率比论文声称的低 2%。你什么都检查了。架构一致。超参数一致。数据一致。问题在于论文用了 float32 而你用了 float16，却没有正确的缩放。三十二轮累积的舍入误差悄悄吃掉了你的准确率。

或者：你从零实现了交叉熵损失。小 logits 上没问题。logits 一超过 100，它返回 `inf`。softmax 上溢了，因为 `exp(100)` 超出 float32 能表示的范围。每个 ML 框架都用一个两行的技巧处理这个问题。你不知道那个技巧的存在。

数值稳定性不是理论顾虑。它是一次成功的训练和一次静默失败的训练之间的区别。你将来要调试的每一个严重的 ML bug，最终都会落到浮点上。

## 概念

### IEEE 754：计算机如何存储实数

计算机按照 IEEE 754 标准把实数存储为浮点值。一个 float 有三部分：符号位、指数和尾数（significand）。

```
Float32 layout (32 bits total):
[1 sign] [8 exponent] [23 mantissa]

Value = (-1)^sign * 2^(exponent - 127) * 1.mantissa
```

尾数决定精度（有多少有效数字）。指数决定范围（一个数能多大或多小）。

```
Format     Bits   Exponent  Mantissa  Decimal digits  Range (approx)
float64    64     11        52        ~15-16          +/- 1.8e308
float32    32     8         23        ~7-8            +/- 3.4e38
float16    16     5         10        ~3-4            +/- 65,504
bfloat16   16     8         7         ~2-3            +/- 3.4e38
```

float32 给你大约 7 位十进制精度。也就是说它能分辨 1.0000001 和 1.0000002，但不能分辨 1.00000001 和 1.00000002。7 位之后全是舍入噪声。

float16 给你大约 3 位精度。它能表示的最大数是 65,504。对 ML 来说这小得令人不安，因为 logits、梯度和激活值经常超过它。

bfloat16 是 Google 对 float16 范围问题的回答。它和 float32 一样有 8 位指数（相同范围，最大到 3.4e38），但只有 7 位尾数（比 float16 精度更低）。对训练神经网络来说，范围比精度更重要，所以 bfloat16 通常胜出。

### 为什么 0.1 + 0.2 != 0.3

数字 0.1 在二进制浮点中无法精确表示。在 2 进制下，它是一个循环小数：

```
0.1 in binary = 0.0001100110011001100110011... (repeating forever)
```

Float32 把它截断到 23 位尾数。存储的值约等于 0.100000001490116。类似地，0.2 存储为约 0.200000002980232。它们的和是 0.300000004470348，而不是 0.3。

```
In Python:
>>> 0.1 + 0.2
0.30000000000000004

>>> 0.1 + 0.2 == 0.3
False
```

这对 ML 很重要，因为：

1. 像 `if loss < threshold` 这样的损失比较可能给出错误答案
2. 累积很多小值（数千步上的梯度更新）会偏离真实和
3. 如果用 `==` 比较浮点数，校验和与可复现性测试会失败

修复方法：永远不要用 `==` 比较浮点数。用 `abs(a - b) < epsilon` 或 `math.isclose()`。

### 灾难性抵消

当你把两个几乎相等的浮点数相减时，有效数字会抵消，剩下的舍入噪声被提升为主导数字。

```
a = 1.0000001    (stored as 1.00000011920929 in float32)
b = 1.0000000    (stored as 1.00000000000000 in float32)

True difference:  0.0000001
Computed:         0.00000011920929

Relative error: 19.2%
```

一次减法就带来 19% 的相对误差。在 ML 中，这会在以下情况发生：

- 计算均值很大的数据的方差：当 E[x] 很大时的 `E[x^2] - E[x]^2`
- 相减几乎相等的对数概率
- 用过小的 epsilon 计算有限差分梯度

修复方法：重排公式以避免相减大的、几乎相等的数。对方差，用 Welford 算法或先中心化数据。对数概率，全程在 log 空间中运算。

### 上溢与下溢

上溢发生在结果太大无法表示时。下溢发生在结果太小时（比最小可表示的正数更接近零）。

```
Float32 boundaries:
  Maximum:  3.4028235e+38
  Minimum positive (normal): 1.175e-38
  Minimum positive (denorm): 1.401e-45
  Overflow:  anything > 3.4e38 becomes inf
  Underflow: anything < 1.4e-45 becomes 0.0
```

`exp()` 函数是 ML 中上溢的主要来源：

```
exp(88.7)  = 3.40e+38   (barely fits in float32)
exp(89.0)  = inf         (overflow)
exp(-87.3) = 1.18e-38   (barely above underflow)
exp(-104)  = 0.0         (underflow to zero)
```

`log()` 函数则撞上另一个方向：

```
log(0.0)   = -inf
log(-1.0)  = nan
log(1e-45) = -103.3      (fine)
log(1e-46) = -inf        (input underflowed to 0, then log(0) = -inf)
```

在 ML 中，`exp()` 出现在 softmax、sigmoid 和概率计算里。`log()` 出现在交叉熵、对数似然和 KL 散度里。`log(exp(x))` 这个组合在没有正确技巧时是雷区。

### Log-Sum-Exp 技巧

直接计算 `log(sum(exp(x_i)))` 在数值上很危险。如果任何 `x_i` 很大，`exp(x_i)` 就上溢。如果所有 `x_i` 都是非常负的数，每个 `exp(x_i)` 都下溢为零，而 `log(0)` 是 `-inf`。

技巧是：在指数化之前减去最大值。

```
log(sum(exp(x_i))) = max(x) + log(sum(exp(x_i - max(x))))
```

为何有效：减去 `max(x)` 之后，最大的指数项是 `exp(0) = 1`。不可能上溢。求和中至少有一项是 1，所以和至少是 1，而 `log(1) = 0`。不可能下溢到 `-inf`。

证明：

```
log(sum(exp(x_i)))
= log(sum(exp(x_i - c + c)))                    (add and subtract c)
= log(sum(exp(x_i - c) * exp(c)))               (exp(a+b) = exp(a)*exp(b))
= log(exp(c) * sum(exp(x_i - c)))               (factor out exp(c))
= c + log(sum(exp(x_i - c)))                    (log(a*b) = log(a) + log(b))
```

令 `c = max(x)`，上溢就被消除了。

这个技巧在 ML 中无处不在：
- Softmax normalization
- Cross-entropy loss computation
- Log-probability summation in sequence models
- Mixture of Gaussians
- Variational inference

### 为什么 Softmax 需要减最大值技巧

Softmax 把 logits 转换为概率：

```
softmax(x_i) = exp(x_i) / sum(exp(x_j))
```

没有这个技巧，logits [100, 101, 102] 会导致上溢：

```
exp(100) = 2.69e43
exp(101) = 7.31e43
exp(102) = 1.99e44
sum      = 2.99e44

These overflow float32 (max ~3.4e38)? No, 2.69e43 < 3.4e38? Actually:
exp(88.7) is already at the float32 limit.
exp(100) = inf in float32.
```

用这个技巧，减去 max(x) = 102：

```
exp(100 - 102) = exp(-2) = 0.135
exp(101 - 102) = exp(-1) = 0.368
exp(102 - 102) = exp(0)  = 1.000
sum = 1.503

softmax = [0.090, 0.245, 0.665]
```

概率完全相同。计算是安全的。这不是优化。这是正确性的必要条件。

### NaN 与 Inf：检测与预防

`nan`（Not a Number）和 `inf`（infinity）会在计算中像病毒一样传播。一次梯度更新中的一个 `nan` 会让权重变成 `nan`，进而让之后每一个输出都是 `nan`。训练在一步之内就死了。

`inf` 如何出现：
- `exp()` 一个大的正数
- 除以零：`1.0 / 0.0`
- 累加时的 `float32` 溢出

`nan` 如何出现：
- `0.0 / 0.0`
- `inf - inf`
- `inf * 0`
- 负数的 `sqrt()`
- 负数的 `log()`
- 任何涉及已有 `nan` 的算术

检测：

```python
import math

math.isnan(x)       # True if x is nan
math.isinf(x)       # True if x is +inf or -inf
math.isfinite(x)    # True if x is neither nan nor inf
```

预防策略：

1. 把 `exp()` 的输入夹紧：`exp(clamp(x, -80, 80))`
2. 给分母加 epsilon：`x / (y + 1e-8)`
3. 给 `log()` 内部加 epsilon：`log(x + 1e-8)`
4. 使用稳定实现（log-sum-exp、stable softmax）
5. 梯度裁剪以防止权重爆炸
6. 调试时在每次前向传播后检查 `nan`/`inf`

### 数值梯度检查

解析梯度（来自反向传播）可能有 bug。数值梯度检查通过有限差分计算梯度来验证它们。

中心差分公式：

```
df/dx ~= (f(x + h) - f(x - h)) / (2h)
```

这是 O(h^2) 精度的，远好于只有 O(h) 精度的前向差分 `(f(x+h) - f(x)) / h`。

选择 h：太大则近似不准。太小则灾难性抵消毁掉答案。典型取 `h = 1e-5` 到 `1e-7`。

检查方法：计算解析梯度与数值梯度之间的相对误差。

```
relative_error = |grad_analytical - grad_numerical| / max(|grad_analytical|, |grad_numerical|, 1e-8)
```

经验法则：
- relative_error < 1e-7: perfect, gradient is correct
- relative_error < 1e-5: acceptable, probably correct
- relative_error > 1e-3: something is wrong
- relative_error > 1: gradient is completely wrong

实现新层或新损失函数时，始终检查梯度。PyTorch 提供了 `torch.autograd.gradcheck()` 做这件事。

### 混合精度训练

现代 GPU 有专用硬件（Tensor Cores），做 float16 矩阵乘法比 float32 快 2-8 倍。混合精度训练（mixed precision training）利用这一点：

```
1. Maintain float32 master copy of weights
2. Forward pass in float16 (fast)
3. Compute loss in float32 (prevents overflow)
4. Backward pass in float16 (fast)
5. Scale gradients to float32
6. Update float32 master weights
```

纯 float16 训练的问题：梯度往往非常小（1e-8 或更小）。Float16 会把低于约 6e-8 的任何值下溢为零。你的模型停止学习，因为所有梯度更新都是零。

修复方法是损失缩放（loss scaling）：

```
1. Multiply loss by a large scale factor (e.g., 1024)
2. Backward pass computes gradients of (loss * 1024)
3. All gradients are 1024x larger (pushed above float16 underflow)
4. Divide gradients by 1024 before updating weights
5. Net effect: same update, but no underflow
```

动态损失缩放自动调整缩放因子。从一个大值开始（65536）。如果梯度上溢为 `inf`，就减半。如果 N 步都没有上溢，就加倍。

### bfloat16 vs float16：为什么训练中 bfloat16 胜出

```
float16:   [1 sign] [5 exponent]  [10 mantissa]
bfloat16:  [1 sign] [8 exponent]  [7 mantissa]
```

float16 精度更高（10 位尾数 vs 7 位），但范围有限（最大约 65,504）。bfloat16 精度更低，但范围与 float32 相同（最大约 3.4e38）。

对训练神经网络：

- 激活值和 logits 在训练尖峰中经常超过 65,504。float16 会溢出；bfloat16 扛得住。
- float16 需要损失缩放，但 bfloat16 通常不需要，因为它的范围覆盖了梯度量级谱。
- bfloat16 是 float32 的简单截断：丢掉尾数的低 16 位。转换是平凡的，指数部分无损。

float16 更适合推理——数值有界且精度更重要。bfloat16 更适合训练——范围更重要。这就是 TPU 和现代 NVIDIA GPU（A100、H100）原生支持 bfloat16 的原因。

### 梯度裁剪

梯度爆炸发生在梯度经过多层指数级增长时（常见于 RNN、深层网络和 transformer）。一个大的梯度就能在一步之内毁掉所有权重。

两种裁剪方式：

**Clip by value:** 独立地把每个梯度元素夹紧。

```
grad = clamp(grad, -max_val, max_val)
```

简单，但可能改变梯度向量的方向。

**Clip by norm:** 缩放整个梯度向量，使其范数不超过阈值。

```
if ||grad|| > max_norm:
    grad = grad * (max_norm / ||grad||)
```

保留梯度的方向。这就是 `torch.nn.utils.clip_grad_norm_()` 做的事。它是标准选择。

典型值：transformers 用 `max_norm=1.0`，RL 用 `max_norm=0.5`，更简单的网络用 `max_norm=5.0`。

梯度裁剪不是 hack。它是安全机制。没有它，一个离群批次就能产生足够大的梯度，毁掉几周的训练。

### 归一化层作为数值稳定器

批归一化（batch normalization）、层归一化（layer normalization）和 RMS 归一化通常被呈现为帮助训练收敛的正则化器。它们也是数值稳定器。

没有归一化，激活值可能随层指数级增长或缩小：

```
Layer 1: values in [0, 1]
Layer 5: values in [0, 100]
Layer 10: values in [0, 10,000]
Layer 50: values in [0, inf]
```

归一化在每一层重新居中并缩放激活值：

```
LayerNorm(x) = (x - mean(x)) / (std(x) + epsilon) * gamma + beta
```

`epsilon`（通常 1e-5）防止所有激活值相同时除以零。学到的参数 `gamma` 和 `beta` 让网络能恢复它需要的任何尺度。

这使数值在整个网络中保持在安全范围内，既防止前向传播中的上溢，也防止反向传播中的梯度爆炸。

### 常见 ML 数值 bug

**Bug: 几个 epoch 后 Loss 是 NaN。**
Cause: logits 增长过大，softmax 溢出。或学习率过高导致权重发散。
Fix: use stable softmax (max subtraction), reduce learning rate, add gradient clipping.

**Bug: Loss 卡在 log(num_classes)。**
Cause: 模型输出接近均匀分布。通常意味着梯度在消失，或模型根本没在学。
Fix: check that data labels are correct, verify the loss function, check for dead ReLUs.

**Bug: 验证准确率比预期低 1-3%。**
Cause: 混合精度但没有正确的损失缩放。梯度下溢静默地把小更新清零。
Fix: enable dynamic loss scaling, or switch to bfloat16.

**Bug: 某些层的梯度范数是 0.0。**
Cause: 死亡 ReLU 神经元（输入全为负），或 float16 下溢。
Fix: use LeakyReLU or GELU, use gradient scaling, check weight initialization.

**Bug: 模型在一个 GPU 上正常，在另一个 GPU 上结果不同。**
Cause: 非确定性的浮点累加顺序。GPU 并行归约在不同硬件上以不同顺序求和，而浮点加法不满足结合律。
Fix: accept small differences (1e-6), or set `torch.use_deterministic_algorithms(True)` and accept the speed penalty.

**Bug: 损失计算中 `exp()` 返回 `inf`。**
Cause: 原始 logits 被传给 `exp()` 而没有用减最大值技巧。
Fix: use `torch.nn.functional.log_softmax()` which implements log-sum-exp internally.

**Bug: 从 float32 切换到 float16 后训练发散。**
Cause: float16 无法表示低于 6e-8 的梯度量级或高于 65,504 的激活值。
Fix: use mixed precision with loss scaling (AMP), or use bfloat16 instead.

```figure
logsumexp-stability
```

## 动手做

### 步骤 1：演示浮点精度限制

```python
print("=== Floating Point Precision ===")
print(f"0.1 + 0.2 = {0.1 + 0.2}")
print(f"0.1 + 0.2 == 0.3? {0.1 + 0.2 == 0.3}")
print(f"Difference: {(0.1 + 0.2) - 0.3:.2e}")
```

### 步骤 2：实现朴素 vs 稳定的 softmax

```python
import math

def softmax_naive(logits):
    exps = [math.exp(z) for z in logits]
    total = sum(exps)
    return [e / total for e in exps]

def softmax_stable(logits):
    max_logit = max(logits)
    exps = [math.exp(z - max_logit) for z in logits]
    total = sum(exps)
    return [e / total for e in exps]

safe_logits = [2.0, 1.0, 0.1]
print(f"Naive:  {softmax_naive(safe_logits)}")
print(f"Stable: {softmax_stable(safe_logits)}")

dangerous_logits = [100.0, 101.0, 102.0]
print(f"Stable: {softmax_stable(dangerous_logits)}")
# softmax_naive(dangerous_logits) would return [nan, nan, nan]
```

### 步骤 3：实现稳定的 log-sum-exp

```python
def logsumexp_naive(values):
    return math.log(sum(math.exp(v) for v in values))

def logsumexp_stable(values):
    c = max(values)
    return c + math.log(sum(math.exp(v - c) for v in values))

safe = [1.0, 2.0, 3.0]
print(f"Naive:  {logsumexp_naive(safe):.6f}")
print(f"Stable: {logsumexp_stable(safe):.6f}")

large = [500.0, 501.0, 502.0]
print(f"Stable: {logsumexp_stable(large):.6f}")
# logsumexp_naive(large) returns inf
```

### 步骤 4：实现稳定的交叉熵

```python
def cross_entropy_naive(true_class, logits):
    probs = softmax_naive(logits)
    return -math.log(probs[true_class])

def cross_entropy_stable(true_class, logits):
    max_logit = max(logits)
    shifted = [z - max_logit for z in logits]
    log_sum_exp = math.log(sum(math.exp(s) for s in shifted))
    log_prob = shifted[true_class] - log_sum_exp
    return -log_prob

logits = [2.0, 5.0, 1.0]
true_class = 1
print(f"Naive:  {cross_entropy_naive(true_class, logits):.6f}")
print(f"Stable: {cross_entropy_stable(true_class, logits):.6f}")
```

### 步骤 5：梯度检查

```python
def numerical_gradient(f, x, h=1e-5):
    grad = []
    for i in range(len(x)):
        x_plus = x[:]
        x_minus = x[:]
        x_plus[i] += h
        x_minus[i] -= h
        grad.append((f(x_plus) - f(x_minus)) / (2 * h))
    return grad

def check_gradient(analytical, numerical, tolerance=1e-5):
    for i, (a, n) in enumerate(zip(analytical, numerical)):
        denom = max(abs(a), abs(n), 1e-8)
        rel_error = abs(a - n) / denom
        status = "OK" if rel_error < tolerance else "FAIL"
        print(f"  param {i}: analytical={a:.8f} numerical={n:.8f} "
              f"rel_error={rel_error:.2e} [{status}]")

def f(params):
    x, y = params
    return x**2 + 3*x*y + y**3

def f_grad(params):
    x, y = params
    return [2*x + 3*y, 3*x + 3*y**2]

point = [2.0, 1.0]
analytical = f_grad(point)
numerical = numerical_gradient(f, point)
check_gradient(analytical, numerical)
```

## 用起来

### 混合精度模拟

```python
import struct

def float32_to_float16_round(x):
    packed = struct.pack('f', x)
    f32 = struct.unpack('f', packed)[0]
    packed16 = struct.pack('e', f32)
    return struct.unpack('e', packed16)[0]

def simulate_bfloat16(x):
    packed = struct.pack('f', x)
    as_int = int.from_bytes(packed, 'little')
    truncated = as_int & 0xFFFF0000
    repacked = truncated.to_bytes(4, 'little')
    return struct.unpack('f', repacked)[0]
```

### 梯度裁剪

```python
def clip_by_norm(gradients, max_norm):
    total_norm = math.sqrt(sum(g**2 for g in gradients))
    if total_norm > max_norm:
        scale = max_norm / total_norm
        return [g * scale for g in gradients]
    return gradients

grads = [10.0, 20.0, 30.0]
clipped = clip_by_norm(grads, max_norm=5.0)
print(f"Original norm: {math.sqrt(sum(g**2 for g in grads)):.2f}")
print(f"Clipped norm:  {math.sqrt(sum(g**2 for g in clipped)):.2f}")
print(f"Direction preserved: {[c/clipped[0] for c in clipped]} == {[g/grads[0] for g in grads]}")
```

### NaN/Inf 检测

```python
def check_tensor(name, values):
    has_nan = any(math.isnan(v) for v in values)
    has_inf = any(math.isinf(v) for v in values)
    if has_nan or has_inf:
        print(f"WARNING {name}: nan={has_nan} inf={has_inf}")
        return False
    return True

check_tensor("good", [1.0, 2.0, 3.0])
check_tensor("bad",  [1.0, float('nan'), 3.0])
check_tensor("ugly", [1.0, float('inf'), 3.0])
```

完整实现及所有边界情况的演示见 `code/numerical.py`。

## 交付

本课产出：
- `code/numerical.py`，包含稳定的 softmax、log-sum-exp、交叉熵、梯度检查和混合精度模拟
- `outputs/prompt-numerical-debugger.md`，用于诊断训练中的 NaN/Inf 和数值问题

这些稳定实现在第 3 阶段构建训练循环时、以及第 4 阶段实现注意力机制时会再次出现。

## 练习

1. **灾难性抵消。** 在 float32 中用朴素公式 `E[x^2] - E[x]^2` 计算 [1000000.0, 1000001.0, 1000002.0] 的方差。然后用 Welford 在线算法计算它。把两者的误差与真实方差（0.6667）对比。

2. **精度狩猎。** 找出最小的正 float32 值 `x`，使得 Python 中 `1.0 + x == 1.0`。这就是机器 epsilon。验证它与 `numpy.finfo(numpy.float32).eps` 一致。

3. **Log-sum-exp 边界情况。** 用以下输入测试你的 `logsumexp_stable` 函数：(a) 所有值相等，(b) 一个值远大于其余，(c) 所有值非常负（-1000）。验证它在朴素版本失败的地方给出正确结果。

4. **对一个神经网络层做梯度检查。** 实现单个线性层 `y = Wx + b` 及其解析反向传播。用 `numerical_gradient` 对 3x2 权重矩阵验证正确性。

5. **损失缩放实验。** 模拟 float16 训练：在 [1e-9, 1e-3] 范围内创建随机梯度，转换为 float16，测量有多大比例变成零。然后应用损失缩放（乘以 1024），转换为 float16，再缩放回来，再次测量零值比例。

## 关键术语

| 术语 | 人们常说 | 它真正的意思 |
|------|----------------|----------------------|
| IEEE 754 | "浮点标准" | 定义二进制浮点格式、舍入规则和特殊值（inf, nan）的国际标准。每个现代 CPU 和 GPU 都实现它。 |
| 机器 epsilon（Machine epsilon） | "精度极限" | 在给定浮点格式下使 1.0 + e != 1.0 的最小 e 值。对 float32，约为 1.19e-7。 |
| 灾难性抵消（Catastrophic cancellation） | "减法导致的精度损失" | 相减几乎相等的浮点数时，有效数字抵消，舍入噪声主导结果。 |
| 上溢（Overflow） | "数太大了" | 结果超过最大可表示值并变成 inf。exp(89) 会溢出 float32。 |
| 下溢（Underflow） | "数太小了" | 结果比最小可表示正数更接近零并变成 0.0。exp(-104) 会下溢 float32。 |
| Log-sum-exp 技巧 | "先减最大值" | 通过提出 exp(max(x)) 来计算 log(sum(exp(x)))，防止上溢和下溢。用于 softmax、交叉熵和对数概率运算。 |
| 稳定 softmax | "不会炸的 softmax" | 指数化之前减去 max(logits)。数值上结果相同，不可能溢出。 |
| 梯度检查（Gradient checking） | "验证你的反向传播" | 把反向传播的解析梯度与有限差分的数值梯度对比，以捕捉实现 bug。 |
| 混合精度（Mixed precision） | "float16 前向，float32 反向" | 对速度敏感的运算用低精度浮点，对数值敏感的运算用高精度浮点。典型加速 2-3 倍。 |
| 损失缩放（Loss scaling） | "防止梯度下溢" | 反向传播前把损失乘以一个大常数，使梯度保持在 float16 的可表示范围内，然后在权重更新前除以同一常数。 |
| bfloat16 | "Brain floating point" | Google 的 16 位格式，8 位指数（与 float32 同范围）和 7 位尾数（精度低于 float16）。训练的首选。 |
| 梯度裁剪（Gradient clipping） | "给梯度范数设上限" | 缩放梯度向量使其范数不超过阈值。防止梯度爆炸毁掉权重。 |
| NaN | "Not a Number" | 来自未定义运算（0/0, inf-inf, sqrt(-1)）的特殊浮点值。会在之后所有算术中传播。 |
| Inf | "Infinity" | 来自上溢或除以零的特殊浮点值。可以组合产生 NaN（inf - inf, inf * 0）。 |
| 数值梯度（Numerical gradient） | "暴力求导" | 通过计算 f(x+h) 和 f(x-h) 再除以 2h 来近似导数。慢但可靠，适合验证。 |

## 延伸阅读

- [What Every Computer Scientist Should Know About Floating-Point Arithmetic (Goldberg 1991)](https://docs.oracle.com/cd/E19957-01/806-3568/ncg_goldberg.html) -- 权威参考，密集但完整
- [Mixed Precision Training (Micikevicius et al., 2018)](https://arxiv.org/abs/1710.03740) -- NVIDIA 的论文，提出了 float16 训练的损失缩放
- [AMP: Automatic Mixed Precision (PyTorch docs)](https://pytorch.org/docs/stable/amp.html) -- PyTorch 中混合精度的实用指南
- [bfloat16 format (Google Cloud TPU docs)](https://cloud.google.com/tpu/docs/bfloat16) -- Google 为何为 TPU 选择这种格式
- [Kahan Summation (Wikipedia)](https://en.wikipedia.org/wiki/Kahan_summation_algorithm) -- 减少浮点求和舍入误差的算法
