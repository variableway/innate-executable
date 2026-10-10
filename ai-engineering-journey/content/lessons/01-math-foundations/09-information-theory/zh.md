# 信息论

> 信息论度量的是惊讶。损失函数就建立在它之上。

**类型:** Learn
**语言:** Python
**先修:** Phase 1, Lesson 06 (Probability)
**时长:** ~60 分钟

## 学习目标

- 从零实现熵、交叉熵和 KL 散度，并解释它们之间的关系
- 推导为什么最小化交叉熵损失等价于最大化对数似然
- 计算特征与目标之间的互信息，以对特征重要性排序
- 解释困惑度（perplexity）就是语言模型在选择时所面对的有效词表大小

## 问题

你训练的每一个分类模型里都会调用 `CrossEntropyLoss()`。你在每一篇语言模型论文里都会看到 "perplexity"。你在 VAE、蒸馏和 RLHF 里都会读到 KL 散度。这些并不是彼此无关的概念。它们是同一个思想戴了不同的帽子。

信息论给了你一套语言，用来推理不确定性、压缩和预测。Claude Shannon 在 1948 年发明它，是为了通信问题。结果发现，训练神经网络就是一个通信问题：模型试图通过一条由学到的权重构成的噪声信道，把正确的标签传输出去。

本课从零推导每一个公式，让你看清它们从哪里来、为什么有效。

## 概念

### 信息量（惊讶度）

当不太可能发生的事情发生了，它携带的信息就更多。硬币正面？不惊讶。中彩票？非常惊讶。

概率为 p 的事件，其信息量是：

```
I(x) = -log(p(x))
```

用以 2 为底的对数得到比特（bits）。用自然对数得到奈特（nats）。同一思想，不同单位。

```
Event              Probability    Surprise (bits)
Fair coin heads    0.5            1.0
Rolling a 6        0.167          2.58
1-in-1000 event    0.001          9.97
Certain event      1.0            0.0
```

必然事件携带零信息。你早就知道它会发生。

### 熵（平均惊讶度）

熵是分布所有可能结果上的期望惊讶度。

```
H(P) = -sum( p(x) * log(p(x)) )  for all x
```

对二值变量，公平硬币具有最大熵：1 比特。有偏硬币（99% 正面）熵很低：0.08 比特。你已经知道会发生什么，所以每次抛掷几乎不告诉你任何信息。

```
Fair coin:    H = -(0.5 * log2(0.5) + 0.5 * log2(0.5)) = 1.0 bit
Biased coin:  H = -(0.99 * log2(0.99) + 0.01 * log2(0.01)) = 0.08 bits
```

熵度量分布中不可约的不确定性。你无法压缩到它以下。

### 交叉熵（你每天都在用的损失函数）

交叉熵度量的是：当你用分布 Q 来编码实际上来自分布 P 的事件时，平均有多惊讶。

```
H(P, Q) = -sum( p(x) * log(q(x)) )  for all x
```

P 是真实分布（标签）。Q 是模型的预测。若 Q 与 P 完全一致，交叉熵就等于熵。任何不匹配都会让它变大。

在分类中，P 是 one-hot 向量（真实类概率为 1，其余为 0）。交叉熵因此简化为：

```
H(P, Q) = -log(q(true_class))
```

这就是分类交叉熵损失的全部公式。最大化正确类的预测概率。

### KL 散度（分布之间的距离）

KL 散度度量的是：用 Q 代替 P 之后，你多承受了多少额外的惊讶。

```
D_KL(P || Q) = sum( p(x) * log(p(x) / q(x)) )  for all x
             = H(P, Q) - H(P)
```

交叉熵等于熵加上 KL 散度。由于真实分布的熵在训练中是常数，最小化交叉熵就等价于最小化 KL 散度。你正在把模型的分布推向真实分布。

KL 散度不是对称的：D_KL(P || Q) != D_KL(Q || P)。它不是真正的距离度量。

### 互信息

互信息度量的是：知道一个变量能告诉你关于另一个变量多少信息。

```
I(X; Y) = H(X) - H(X|Y)
        = H(X) + H(Y) - H(X, Y)
```

若 X 与 Y 独立，互信息为零。知道其中一个对另一个毫无帮助。若它们完全相关，互信息等于任一变量的熵。

在特征选择中，特征与目标之间互信息高意味着该特征有用。互信息低意味着它是噪声。

### 条件熵

H(Y|X) 度量的是：在观察到 X 之后，关于 Y 还剩多少不确定性。

```
H(Y|X) = H(X,Y) - H(X)
```

两个极端：
- 若 X 完全决定 Y，则 H(Y|X) = 0。知道 X 就消除了关于 Y 的全部不确定性。例子：X = 摄氏温度，Y = 华氏温度。
- 若 X 对 Y 毫无帮助，则 H(Y|X) = H(Y)。知道 X 完全不减少你的不确定性。例子：X = 抛硬币，Y = 明天的天气。

条件熵总是非负的，且永远不会超过 H(Y)：

```
0 <= H(Y|X) <= H(Y)
```

在机器学习中，条件熵出现在决策树里。在每个分裂处，算法挑选使 H(Y|X) 最小的特征 X——也就是消除标签 Y 不确定性最多的那个特征。

### 联合熵

H(X,Y) 是 X 和 Y 联合分布的熵。

```
H(X,Y) = -sum sum p(x,y) * log(p(x,y))   for all x, y
```

关键性质：

```
H(X,Y) <= H(X) + H(Y)
```

当 X 与 Y 独立时取等号。若它们共享信息，联合熵就小于各自熵之和。那部分"缺失"的熵恰好就是互信息。

```mermaid
graph TD
    subgraph "Information Venn Diagram"
        direction LR
        HX["H(X)"]
        HY["H(Y)"]
        MI["I(X;Y)<br/>Mutual<br/>Information"]
        HXgY["H(X|Y)<br/>= H(X) - I(X;Y)"]
        HYgX["H(Y|X)<br/>= H(Y) - I(X;Y)"]
        HXY["H(X,Y) = H(X) + H(Y) - I(X;Y)"]
    end

    HXgY --- MI
    MI --- HYgX
    HX -.- HXgY
    HX -.- MI
    HY -.- MI
    HY -.- HYgX
    HXY -.- HXgY
    HXY -.- MI
    HXY -.- HYgX
```

这些关系：
- H(X,Y) = H(X) + H(Y|X) = H(Y) + H(X|Y)
- I(X;Y) = H(X) - H(X|Y) = H(Y) - H(Y|X)
- H(X,Y) = H(X) + H(Y) - I(X;Y)

### 互信息（深入）

互信息 I(X;Y) 量化了知道一个变量能减少关于另一个变量多少不确定性。

```
I(X;Y) = H(X) - H(X|Y)
       = H(Y) - H(Y|X)
       = H(X) + H(Y) - H(X,Y)
       = sum sum p(x,y) * log(p(x,y) / (p(x) * p(y)))
```

性质：
- I(X;Y) >= 0 恒成立。观察某件事永远不会让你丢失信息。
- I(X;Y) = 0 当且仅当 X 与 Y 独立。
- I(X;Y) = I(Y;X)。它是对称的，与 KL 散度不同。
- I(X;X) = H(X)。一个变量与自身共享全部信息。

**用互信息做特征选择。** 在 ML 中，你要的是对目标有信息量的特征。互信息给出了一种有原则的特征排序方式：

1. 对每个特征 X_i，计算 I(X_i; Y)，其中 Y 是目标变量。
2. 按 MI 分数对特征排序。
3. 保留前 k 个特征。

这对特征与目标之间的任何关系都有效——线性、非线性、单调或不单调。相关系数只能捕捉线性关系。MI 能捕捉一切。

| Method | Detects | Computational cost | Handles categorical? |
|--------|---------|-------------------|---------------------|
| Pearson correlation | Linear relationships | O(n) | No |
| Spearman correlation | Monotonic relationships | O(n log n) | No |
| Mutual information | Any statistical dependency | O(n log n) with binning | Yes |

### 标签平滑与交叉熵

标准分类使用硬目标（hard targets）：[0, 0, 1, 0]。真实类概率为 1，其余为 0。标签平滑（label smoothing）用软目标替换它们：

```
soft_target = (1 - epsilon) * hard_target + epsilon / num_classes
```

取 epsilon = 0.1、4 个类：
- Hard target:  [0, 0, 1, 0]
- Soft target:  [0.025, 0.025, 0.925, 0.025]

从信息论视角看，标签平滑提高了目标分布的熵。硬 one-hot 目标的熵为 0——没有不确定性。软目标具有正熵。

这为何有帮助：
- 防止模型把 logits 推到极端值（在交叉熵下，要完美匹配 one-hot 目标需要无穷大的 logits）
- 起到正则化作用：模型不可能 100% 确信
- 改善校准（calibration）：预测概率更好地反映真实不确定性
- 缩小训练与推理行为之间的差距

带标签平滑的交叉熵损失变成：

```
L = (1 - epsilon) * CE(hard_target, prediction) + epsilon * H_uniform(prediction)
```

第二项惩罚远离均匀分布的预测——这是对置信度的直接正则化。

### 为什么交叉熵就是那个分类损失

三个视角，同一结论。

**信息论视角。** 交叉熵度量的是：用模型的分布而不是真实分布，你浪费了多少比特。最小化它，就是让你的模型成为对现实最高效的编码器。

**最大似然视角。** 对 N 个训练样本、真实类别 y_i：

```
Likelihood     = product( q(y_i) )
Log-likelihood = sum( log(q(y_i)) )
Negative log-likelihood = -sum( log(q(y_i)) )
```

最后一行就是交叉熵损失。最小化交叉熵 = 在模型下最大化训练数据的似然。

**梯度视角。** 交叉熵对 logits 的梯度就是 (predicted - true)。干净、稳定、算得快。这就是它与 softmax 完美搭配的原因。

### 比特与奈特

唯一的区别是对数的底。

```
log base 2   -> bits      (information theory tradition)
log base e   -> nats      (machine learning convention)
log base 10  -> hartleys  (rarely used)
```

1 nat = 1/ln(2) bits = 1.4427 bits。PyTorch 和 TensorFlow 默认使用自然对数（nats）。

### 困惑度

困惑度（perplexity）是交叉熵的指数。它告诉你：模型在多少个等可能选项之间犹豫。

```
Perplexity = 2^H(P,Q)   (if using bits)
Perplexity = e^H(P,Q)   (if using nats)
```

困惑度为 50 的语言模型，平均而言就像必须从 50 个可能的下一个 token 中均匀挑选一样困惑。越低越好。

GPT-2 在常见基准上达到约 30 的困惑度。现代模型在充分覆盖的领域里是个位数。

```figure
entropy-kl
```

## 动手做

### 步骤 1：信息量与熵

```python
import math

def information_content(p, base=2):
    if p <= 0 or p > 1:
        return float('inf') if p <= 0 else 0.0
    return -math.log(p) / math.log(base)

def entropy(probs, base=2):
    return sum(
        p * information_content(p, base)
        for p in probs if p > 0
    )

fair_coin = [0.5, 0.5]
biased_coin = [0.99, 0.01]
fair_die = [1/6] * 6

print(f"Fair coin entropy:   {entropy(fair_coin):.4f} bits")
print(f"Biased coin entropy: {entropy(biased_coin):.4f} bits")
print(f"Fair die entropy:    {entropy(fair_die):.4f} bits")
```

### 步骤 2：交叉熵与 KL 散度

```python
def cross_entropy(p, q, base=2):
    total = 0.0
    for pi, qi in zip(p, q):
        if pi > 0:
            if qi <= 0:
                return float('inf')
            total += pi * (-math.log(qi) / math.log(base))
    return total

def kl_divergence(p, q, base=2):
    return cross_entropy(p, q, base) - entropy(p, base)

true_dist = [0.7, 0.2, 0.1]
good_model = [0.6, 0.25, 0.15]
bad_model = [0.1, 0.1, 0.8]

print(f"Entropy of true dist:     {entropy(true_dist):.4f} bits")
print(f"CE (good model):          {cross_entropy(true_dist, good_model):.4f} bits")
print(f"CE (bad model):           {cross_entropy(true_dist, bad_model):.4f} bits")
print(f"KL divergence (good):     {kl_divergence(true_dist, good_model):.4f} bits")
print(f"KL divergence (bad):      {kl_divergence(true_dist, bad_model):.4f} bits")
```

### 步骤 3：交叉熵作为分类损失

```python
def softmax(logits):
    max_logit = max(logits)
    exps = [math.exp(z - max_logit) for z in logits]
    total = sum(exps)
    return [e / total for e in exps]

def cross_entropy_loss(true_class, logits):
    probs = softmax(logits)
    return -math.log(probs[true_class])

logits = [2.0, 1.0, 0.1]
true_class = 0

probs = softmax(logits)
loss = cross_entropy_loss(true_class, logits)

print(f"Logits:      {logits}")
print(f"Softmax:     {[f'{p:.4f}' for p in probs]}")
print(f"True class:  {true_class}")
print(f"Loss:        {loss:.4f} nats")
print(f"Perplexity:  {math.exp(loss):.2f}")
```

### 步骤 4：交叉熵等于负对数似然

```python
import random

random.seed(42)

n_samples = 1000
n_classes = 3
true_labels = [random.randint(0, n_classes - 1) for _ in range(n_samples)]
model_logits = [[random.gauss(0, 1) for _ in range(n_classes)] for _ in range(n_samples)]

ce_loss = sum(
    cross_entropy_loss(label, logits)
    for label, logits in zip(true_labels, model_logits)
) / n_samples

nll = -sum(
    math.log(softmax(logits)[label])
    for label, logits in zip(true_labels, model_logits)
) / n_samples

print(f"Cross-entropy loss:      {ce_loss:.6f}")
print(f"Negative log-likelihood: {nll:.6f}")
print(f"Difference:              {abs(ce_loss - nll):.2e}")
```

### 步骤 5：互信息

```python
def mutual_information(joint_probs, base=2):
    rows = len(joint_probs)
    cols = len(joint_probs[0])

    margin_x = [sum(joint_probs[i][j] for j in range(cols)) for i in range(rows)]
    margin_y = [sum(joint_probs[i][j] for i in range(rows)) for j in range(cols)]

    mi = 0.0
    for i in range(rows):
        for j in range(cols):
            pxy = joint_probs[i][j]
            if pxy > 0:
                mi += pxy * math.log(pxy / (margin_x[i] * margin_y[j])) / math.log(base)
    return mi

independent = [[0.25, 0.25], [0.25, 0.25]]
dependent = [[0.45, 0.05], [0.05, 0.45]]

print(f"MI (independent): {mutual_information(independent):.4f} bits")
print(f"MI (dependent):   {mutual_information(dependent):.4f} bits")
```

## 用起来

同样的概念，用 NumPy 来写——这是你在实践中真正会用的方式：

```python
import numpy as np

def np_entropy(p):
    p = np.asarray(p, dtype=float)
    mask = p > 0
    result = np.zeros_like(p)
    result[mask] = p[mask] * np.log(p[mask])
    return -result.sum()

def np_cross_entropy(p, q):
    p, q = np.asarray(p, dtype=float), np.asarray(q, dtype=float)
    mask = p > 0
    return -(p[mask] * np.log(q[mask])).sum()

def np_kl_divergence(p, q):
    return np_cross_entropy(p, q) - np_entropy(p)

true = np.array([0.7, 0.2, 0.1])
pred = np.array([0.6, 0.25, 0.15])
print(f"Entropy:    {np_entropy(true):.4f} nats")
print(f"Cross-ent:  {np_cross_entropy(true, pred):.4f} nats")
print(f"KL div:     {np_kl_divergence(true, pred):.4f} nats")
```

你刚刚从零实现了 `torch.nn.CrossEntropyLoss()` 内部所做的事情。现在你知道训练时损失为什么会下降：模型的预测分布正在逼近真实分布——用浪费掉的信息奈特数来衡量。

## 练习

1. 假设均匀分布（26 个字母），计算英文字母表的熵。然后用实际字母频率估计它。哪个更高，为什么？

2. 一个模型对真实类别为 1 的样本输出 logits [5.0, 2.0, 0.5]。手工计算交叉熵损失，然后用你的 `cross_entropy_loss` 函数验证。什么样的 logits 会给出零损失？

3. 证明 KL 散度不是对称的。选两个分布 P 和 Q，分别计算 D_KL(P || Q) 和 D_KL(Q || P)。解释它们为何不同。

4. 构建一个函数，对一串 token 预测计算困惑度。给定一组 (true_token_index, predicted_logits) 对，返回该序列的困惑度。

## 关键术语

| 术语 | 人们常说 | 它真正的意思 |
|------|----------------|----------------------|
| 信息量（Information content） | "惊讶" | 编码一个事件所需的比特数（或奈特数）：-log(p) |
| 熵（Entropy） | "随机性" | 分布所有结果上的平均惊讶度。度量不可约的不确定性。 |
| 交叉熵（Cross-entropy） | "那个损失函数" | 用模型分布 Q 编码来自真实分布 P 的事件时的平均惊讶度。 |
| KL 散度（KL divergence） | "分布之间的距离" | 用 Q 而非 P 多浪费的比特数。等于交叉熵减去熵。不对称。 |
| 互信息（Mutual information） | "X 和 Y 有多相关" | 知道 Y 后关于 X 的不确定性减少量。为零意味着独立。 |
| Softmax | "把 logits 变成概率" | 先指数化再归一化。把任意向量映射为合法概率分布。 |
| 困惑度（Perplexity） | "模型有多懵" | 交叉熵的指数。模型每一步所面对的有效词表大小。 |
| 比特（Bits） | "Shannon 的单位" | 以 2 为底的对数度量的信息。一比特解决一次公平硬币抛掷。 |
| 奈特（Nats） | "ML 的单位" | 以自然对数度量的信息。PyTorch 和 TensorFlow 默认使用它。 |
| 负对数似然（Negative log-likelihood） | "NLL loss" | 对 one-hot 标签与交叉熵损失完全相同。最小化它就是最大化正确预测的概率。 |

## 延伸阅读

- [Shannon 1948: A Mathematical Theory of Communication](https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf) - 原始论文，至今可读
- [Visual Information Theory (Chris Olah)](https://colah.github.io/posts/2015-09-Visual-Information/) - 关于熵与 KL 散度最好的可视化讲解
- [PyTorch CrossEntropyLoss docs](https://pytorch.org/docs/stable/generated/torch.nn.CrossEntropyLoss.html) - 框架如何实现你刚刚亲手写出来的东西
