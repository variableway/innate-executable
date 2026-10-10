# 概率与分布

> 概率是 AI 用来表达不确定性的语言。

**类型:** Learn
**语言:** Python
**先修:** Phase 1, Lessons 01-04
**时长:** ~75 分钟

## 学习目标

- 从零实现伯努利、类别、泊松、均匀和正态分布的 PMF 与 PDF
- 计算期望与方差，并用中心极限定理解释为什么高斯分布无处不在
- 用数值稳定技巧（减去最大 logit）构建 softmax 和 log-softmax 函数
- 从 logits 计算交叉熵损失，并把它与负对数似然联系起来

## 问题

一个分类器输出 `[0.03, 0.91, 0.06]`。一个语言模型从 5 万个候选词中挑出下一个词。一个扩散模型通过从学到的分布中采样来生成图像。这些都是概率在起作用。

模型做出的每一个预测都是一个概率分布。每个损失函数衡量预测分布与真实分布有多远。每一步训练都在调整参数，让一个分布更像另一个分布。没有概率，你一篇 ML 论文都读不懂，一个模型都调不通，也弄不清为什么训练损失是 NaN。

## 概念

### 事件、样本空间与概率

样本空间 S 是所有可能结果的集合。事件是样本空间的一个子集。概率把事件映射到 0 与 1 之间的数。

```
Coin flip:
  S = {H, T}
  P(H) = 0.5,  P(T) = 0.5

Single die roll:
  S = {1, 2, 3, 4, 5, 6}
  P(even) = P({2, 4, 6}) = 3/6 = 0.5
```

三条公理定义了全部概率论：
1. 对任意事件 A，P(A) >= 0
2. P(S) = 1（总会有事发生）
3. 当 A 与 B 不可能同时发生时，P(A or B) = P(A) + P(B)

其他一切（贝叶斯定理、期望、分布）都由这三条规则推出。

### 条件概率与独立性

P(A|B) 表示在 B 已发生的条件下 A 的概率。

```
P(A|B) = P(A and B) / P(B)

Example: deck of cards
  P(King | Face card) = P(King and Face card) / P(Face card)
                      = (4/52) / (12/52)
                      = 4/12 = 1/3
```

当知道其中一个事件不能告诉你另一个事件的任何信息时，两事件独立：

```
Independent:   P(A|B) = P(A)
Equivalent to: P(A and B) = P(A) * P(B)
```

抛硬币是独立的。不放回抽牌不是。

### 概率质量函数 vs 概率密度函数

离散随机变量有概率质量函数（PMF）。每个结果有一个可直接读出的具体概率。

```
PMF: P(X = k)

Fair die:
  P(X = 1) = 1/6
  P(X = 2) = 1/6
  ...
  P(X = 6) = 1/6

  Sum of all probabilities = 1
```

连续随机变量有概率密度函数（PDF）。单点上的密度不是概率。概率来自在区间上对密度积分。

```
PDF: f(x)

P(a <= X <= b) = integral of f(x) from a to b

f(x) can be greater than 1 (density, not probability)
integral from -inf to +inf of f(x) dx = 1
```

这个区分在 ML 里很重要。分类输出是 PMF（离散选择）。VAE 的隐空间用 PDF（连续）。

### 常见分布

**伯努利分布（Bernoulli）：** 一次试验，两种结果。对二分类建模。

```
P(X = 1) = p
P(X = 0) = 1 - p
Mean = p,  Variance = p(1-p)
```

**类别分布（Categorical）：** 一次试验，k 种结果。对多分类建模（softmax 输出）。

```
P(X = i) = p_i,  where sum of p_i = 1
Example: P(cat) = 0.7,  P(dog) = 0.2,  P(bird) = 0.1
```

**均匀分布（Uniform）：** 所有结果等可能。用于随机初始化。

```
Discrete: P(X = k) = 1/n for k in {1, ..., n}
Continuous: f(x) = 1/(b-a) for x in [a, b]
```

**正态分布（Normal / Gaussian）：** 钟形曲线。由均值（mu）和方差（sigma^2）参数化。

```
f(x) = (1 / sqrt(2*pi*sigma^2)) * exp(-(x - mu)^2 / (2*sigma^2))

Standard normal: mu = 0, sigma = 1
  68% of data within 1 sigma
  95% within 2 sigma
  99.7% within 3 sigma
```

**泊松分布（Poisson）：** 固定区间内稀有事件的计数。对事件速率建模。

```
P(X = k) = (lambda^k * e^(-lambda)) / k!
Mean = lambda,  Variance = lambda
```

### 期望与方差

期望是按概率加权的平均结果。

```
Discrete:   E[X] = sum of x_i * P(X = x_i)
Continuous: E[X] = integral of x * f(x) dx
```

方差衡量围绕均值的分散程度。

```
Var(X) = E[(X - E[X])^2] = E[X^2] - (E[X])^2
Standard deviation = sqrt(Var(X))
```

在 ML 里，期望以损失函数的形式出现（数据分布上的平均损失）。方差告诉你模型的稳定性。梯度方差高意味着训练噪声大。

### 联合分布与边缘分布

联合分布 P(X, Y) 描述两个随机变量一起的行为。

联合 PMF 例子（X = 天气，Y = 带伞）：

| | Y=0 (no umbrella) | Y=1 (umbrella) | 边缘 P(X) |
|---|---|---|---|
| X=0 (sun) | 0.40 | 0.10 | P(X=0) = 0.50 |
| X=1 (rain) | 0.05 | 0.45 | P(X=1) = 0.50 |
| **边缘 P(Y)** | P(Y=0) = 0.45 | P(Y=1) = 0.55 | 1.00 |

边缘分布把另一个变量求和消去：

```
P(X = x) = sum over all y of P(X = x, Y = y)
```

上表中的行和列总计就是边缘分布。

### 正态分布为何无处不在

中心极限定理：许多独立随机变量之和（或平均）收敛到正态分布，与原始分布无关。

```
Roll 1 die:  uniform distribution (flat)
Average of 2 dice:  triangular (peaked)
Average of 30 dice: nearly perfect bell curve

This works for ANY starting distribution.
```

这就是为什么：
- 测量误差近似正态（许多微小的独立来源）
- 神经网络的权重初始化用正态分布
- SGD 中的梯度噪声近似正态（许多样本梯度之和）
- 正态分布是给定均值和方差下的最大熵分布

### 对数概率

原始概率会引起数值问题。把许多很小的概率连乘会很快下溢到零。

```
P(sentence) = P(word1) * P(word2) * ... * P(word_n)
            = 0.01 * 0.003 * 0.02 * ...
            -> 0.0 (underflow after ~30 terms)
```

对数概率解决了这个问题。乘法变成加法。

```
log P(sentence) = log P(word1) + log P(word2) + ... + log P(word_n)
                = -4.6 + -5.8 + -3.9 + ...
                -> finite number (no underflow)
```

规则：
- log(a * b) = log(a) + log(b)
- 对数概率总是 <= 0（因为 0 < P <= 1）
- 越负 = 越不可能
- 交叉熵损失就是正确类别的负对数概率

### Softmax 作为概率分布

神经网络输出原始分数（logits）。Softmax 把它们转成合法的概率分布。

```
softmax(z_i) = exp(z_i) / sum(exp(z_j) for all j)

Properties:
  - All outputs are in (0, 1)
  - All outputs sum to 1
  - Preserves relative ordering of inputs
  - exp() amplifies differences between logits
```

Softmax 技巧：在指数化之前减去最大 logit，以防溢出。

```
z = [100, 101, 102]
exp(102) = overflow

z_shifted = z - max(z) = [-2, -1, 0]
exp(0) = 1  (safe)

Same result, no overflow.
```

Log-softmax 把 softmax 和 log 结合起来以获得数值稳定性。PyTorch 内部就用它计算交叉熵损失。

### 采样

采样就是从分布中抽取随机值。在 ML 里：
- Dropout 随机采样哪些神经元置零
- 数据增强采样随机变换
- 语言模型从预测分布中采样下一个 token
- 扩散模型采样噪声并逐步去噪

从任意分布采样需要逆变换采样、拒绝采样或重参数化技巧（VAE 中使用）等技术。

```figure
gaussian-pdf
```

## 动手做

### 步骤 1：概率基础

```python
import math
import random

def factorial(n):
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result

def combinations(n, k):
    return factorial(n) // (factorial(k) * factorial(n - k))

def conditional_probability(p_a_and_b, p_b):
    return p_a_and_b / p_b

p_king_given_face = conditional_probability(4/52, 12/52)
print(f"P(King | Face card) = {p_king_given_face:.4f}")
```

### 步骤 2：从零实现 PMF 与 PDF

```python
def bernoulli_pmf(k, p):
    return p if k == 1 else (1 - p)

def categorical_pmf(k, probs):
    return probs[k]

def poisson_pmf(k, lam):
    return (lam ** k) * math.exp(-lam) / factorial(k)

def uniform_pdf(x, a, b):
    if a <= x <= b:
        return 1.0 / (b - a)
    return 0.0

def normal_pdf(x, mu, sigma):
    coeff = 1.0 / (sigma * math.sqrt(2 * math.pi))
    exponent = -0.5 * ((x - mu) / sigma) ** 2
    return coeff * math.exp(exponent)
```

### 步骤 3：期望与方差

```python
def expected_value(values, probabilities):
    return sum(v * p for v, p in zip(values, probabilities))

def variance(values, probabilities):
    mu = expected_value(values, probabilities)
    return sum(p * (v - mu) ** 2 for v, p in zip(values, probabilities))

die_values = [1, 2, 3, 4, 5, 6]
die_probs = [1/6] * 6
mu = expected_value(die_values, die_probs)
var = variance(die_values, die_probs)
print(f"Die: E[X] = {mu:.4f}, Var(X) = {var:.4f}, SD = {var**0.5:.4f}")
```

### 步骤 4：从分布采样

```python
def sample_bernoulli(p, n=1):
    return [1 if random.random() < p else 0 for _ in range(n)]

def sample_categorical(probs, n=1):
    cumulative = []
    total = 0
    for p in probs:
        total += p
        cumulative.append(total)
    samples = []
    for _ in range(n):
        r = random.random()
        for i, c in enumerate(cumulative):
            if r <= c:
                samples.append(i)
                break
    return samples

def sample_normal_box_muller(mu, sigma, n=1):
    samples = []
    for _ in range(n):
        u1 = random.random()
        u2 = random.random()
        z = math.sqrt(-2 * math.log(u1)) * math.cos(2 * math.pi * u2)
        samples.append(mu + sigma * z)
    return samples
```

### 步骤 5：Softmax 与对数概率

```python
def softmax(logits):
    max_logit = max(logits)
    shifted = [z - max_logit for z in logits]
    exps = [math.exp(z) for z in shifted]
    total = sum(exps)
    return [e / total for e in exps]

def log_softmax(logits):
    max_logit = max(logits)
    shifted = [z - max_logit for z in logits]
    log_sum_exp = max_logit + math.log(sum(math.exp(z) for z in shifted))
    return [z - log_sum_exp for z in logits]

def cross_entropy_loss(logits, target_index):
    log_probs = log_softmax(logits)
    return -log_probs[target_index]
```

### 步骤 6：中心极限定理演示

```python
def demonstrate_clt(dist_fn, n_samples, n_averages):
    averages = []
    for _ in range(n_averages):
        samples = [dist_fn() for _ in range(n_samples)]
        averages.append(sum(samples) / len(samples))
    return averages
```

### 步骤 7：可视化

```python
import matplotlib.pyplot as plt

xs = [mu + sigma * (i - 500) / 100 for i in range(1001)]
ys = [normal_pdf(x, mu, sigma) for x, mu, sigma in ...]
plt.plot(xs, ys)
```

带全部可视化的完整实现见 `code/probability.py`。

## 用起来

用 NumPy 和 SciPy，上面的一切都是一行代码：

```python
import numpy as np
from scipy import stats

normal = stats.norm(loc=0, scale=1)
samples = normal.rvs(size=10000)
print(f"Mean: {np.mean(samples):.4f}, Std: {np.std(samples):.4f}")
print(f"P(X < 1.96) = {normal.cdf(1.96):.4f}")

logits = np.array([2.0, 1.0, 0.1])
from scipy.special import softmax, log_softmax
probs = softmax(logits)
log_probs = log_softmax(logits)
print(f"Softmax: {probs}")
print(f"Log-softmax: {log_probs}")
```

你已经从零实现过这些。现在你知道库函数在做什么了。

## 练习

1. 为指数分布实现逆变换采样。采样 10,000 个值，把直方图与真实 PDF 比较以验证。

2. 为两个不均匀的骰子构建联合分布表。计算边缘分布，并检查两个骰子是否独立。

3. 计算一个 5 类分类器的交叉熵损失：它输出 logits `[2.0, 0.5, -1.0, 3.0, 0.1]`，正确类别是索引 3。然后用 PyTorch 的 `nn.CrossEntropyLoss` 验证你的答案。

4. 写一个函数，接受一组对数概率，返回最可能的序列、总对数概率，以及等价的原始概率。用一个 50 词的句子测试，每个词的概率为 0.01。

## 关键术语

| 术语 | 人们常说 | 它真正的意思 |
|------|----------|--------------|
| 样本空间（Sample space） | "所有可能性" | 一次试验每个可能结果组成的集合 S |
| PMF | "概率函数" | 给出每个离散结果确切概率的函数，总和为 1 |
| PDF | "概率曲线" | 连续变量的密度函数。在区间上积分得到概率 |
| 条件概率（Conditional probability） | "在某事发生下的概率" | P(A\|B) = P(A and B) / P(B)。贝叶斯思维与贝叶斯定理的基础 |
| 独立性（Independence） | "互不影响" | P(A and B) = P(A) * P(B)。知道一个事件不能告诉你另一个事件的信息 |
| 期望（Expected value） | "平均" | 所有结果按概率加权之和。损失函数就是一个期望 |
| 方差（Variance） | "有多分散" | 相对均值的期望平方偏差。方差高 = 噪声大、估计不稳定 |
| 正态分布（Normal distribution） | "钟形曲线" | f(x) = (1/sqrt(2*pi*sigma^2)) * exp(-(x-mu)^2/(2*sigma^2))。因中心极限定理而无处不在 |
| 中心极限定理（Central Limit Theorem） | "平均变成正态" | 无论来源如何，许多独立样本的均值收敛到正态分布 |
| 联合分布（Joint distribution） | "两个变量一起" | P(X, Y) 描述 X 与 Y 每种结果组合的概率 |
| 边缘分布（Marginal distribution） | "把另一个变量求和消掉" | P(X) = sum_y P(X, Y)。从联合分布还原单个变量的分布 |
| 对数概率（Log probability） | "概率的对数" | log P(x)。把连乘变成连加，防止长序列的数值下溢 |
| Softmax | "把分数变成概率" | softmax(z_i) = exp(z_i) / sum(exp(z_j))。把实值 logits 映射为合法概率分布 |
| 交叉熵（Cross-entropy） | "损失函数" | -sum(p_true * log(p_predicted))。衡量两个分布的差异。越低越好 |
| Logits | "模型原始输出" | softmax 之前的未归一化分数。得名于 logistic 函数 |
| 采样（Sampling） | "抽取随机值" | 按概率分布生成数值。模型生成输出的方式 |

## 延伸阅读

- [3Blue1Brown: But what is the Central Limit Theorem?](https://www.youtube.com/watch?v=zeJD6dqJ5lo) - 为什么平均会变成正态的可视化证明
- [Stanford CS229 Probability Review](https://cs229.stanford.edu/section/cs229-prob.pdf) - 覆盖本文内容及更多的简明参考
- [The Log-Sum-Exp Trick](https://gregorygundersen.com/blog/2020/02/09/log-sum-exp/) - 数值稳定性为何重要以及如何实现
