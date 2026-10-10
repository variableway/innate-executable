# 范数与距离

> 你的距离函数定义了什么叫「相似」。选错了，下游全崩。

**类型:** Build
**语言:** Python
**先修:** Phase 1, Lessons 01 (Linear Algebra Intuition), 02 (Vectors, Matrices & Operations)
**时长:** ~90 分钟

## 学习目标

- 从零实现 L1、L2、余弦、马氏（Mahalanobis）、Jaccard 与编辑距离函数
- 为给定的 ML 任务选择合适的距离度量，并解释其他度量为何不行
- 把 L1、L2 范数与 LASSO、Ridge 正则化及其几何约束区域联系起来
- 展示同一份数据在不同度量下会产生不同的最近邻

## 问题

你有两个向量。也许是词嵌入，也许是用户画像，也许是像素数组。你需要知道：它们有多近？

答案完全取决于你选了哪个距离函数。两个数据点在一种度量下可能是最近邻，在另一种度量下却相距甚远。你的 KNN 分类器、推荐引擎、向量数据库、聚类算法、损失函数——全都依赖这个选择。选错了，你的模型就在优化错误的东西。

没有普适的最佳距离。L2 适合空间数据。余弦相似度主导 NLP。Jaccard 处理集合。编辑距离处理字符串。马氏距离考虑相关性。Wasserstein 移动概率质量。每一种都编码了对「相似」的不同假设。

本课从零构建所有主要距离函数，告诉你每一种何时才是对的工具，并展示同一份数据在不同度量下会产生完全不同的最近邻。

## 概念

### 范数：度量向量的大小

范数（norm）度量向量的「大小」。两个向量之间的任何距离函数都可以写成它们之差的范数：d(a, b) = ||a - b||。所以理解范数就是理解距离。

### L1 范数（曼哈顿距离）

L1 范数把所有分量的绝对值加起来。

```
||x||_1 = |x_1| + |x_2| + ... + |x_n|
```

它叫曼哈顿距离，因为它度量的是在只能沿坐标轴移动的城市网格里你要走多远。没有对角线。

```
Point A = (1, 1)
Point B = (4, 5)

L1 distance = |4-1| + |5-1| = 3 + 4 = 7

On a grid, you walk 3 blocks east and 4 blocks north.
```

何时用 L1：
- 高维稀疏数据（文本特征、one-hot 编码）
- 需要对离群点稳健时（单个巨大差异不会主导结果）
- 特征选择问题（L1 正则化促进稀疏性）

与 L1 正则化（Lasso）的联系：在损失函数中加入 ||w||_1 会惩罚权重绝对值之和。这会把小权重压到恰好为零，实现自动特征选择。L1 惩罚在权重空间中形成菱形约束区域，而菱形的角落在坐标轴上——那些位置的某些权重为零。

与损失函数的联系：平均绝对误差（MAE）是预测与目标之间 L1 距离的平均。它对所有误差线性惩罚，相比 MSE 对离群点更稳健。

### L2 范数（欧氏距离）

L2 范数是直线距离。分量平方和的平方根。

```
||x||_2 = sqrt(x_1^2 + x_2^2 + ... + x_n^2)
```

这就是你在几何课上学的距离。n 维的勾股定理。

```
Point A = (1, 1)
Point B = (4, 5)

L2 distance = sqrt((4-1)^2 + (5-1)^2) = sqrt(9 + 16) = sqrt(25) = 5.0

The straight line, cutting diagonally through the grid.
```

何时用 L2：
- 中低维连续数据
- 特征尺度可比时
- 物理距离（空间数据、传感器读数）
- 像素级的图像相似度

与 L2 正则化（Ridge）的联系：在损失函数中加入 ||w||_2^2 会惩罚大权重。与 L1 不同，它不会把权重推到零，而是按比例把所有权重向零收缩。L2 惩罚形成圆形约束区域，所以轴上没有角点。权重会变小，但很少恰好为零。

与损失函数的联系：均方误差（MSE）是 L2 距离平方的平均。平方对大误差的惩罚远重于小误差。

```
MAE (L1 loss):  |y - y_hat|         Linear penalty. Robust to outliers.
MSE (L2 loss):  (y - y_hat)^2       Quadratic penalty. Sensitive to outliers.
```

### Lp 范数：一般家族

L1 和 L2 是 Lp 范数的特例：

```
||x||_p = (|x_1|^p + |x_2|^p + ... + |x_n|^p)^(1/p)
```

不同的 p 产生不同形状的「单位球」（到原点距离为 1 的所有点的集合）：

```
p=1:    Diamond shape      (corners on axes)
p=2:    Circle/sphere      (the usual round ball)
p=3:    Superellipse       (rounded square)
p=inf:  Square/hypercube   (flat sides along axes)
```

### 无穷范数（切比雪夫距离）

当 p 趋于无穷时，Lp 范数收敛到最大绝对分量。

```
||x||_inf = max(|x_1|, |x_2|, ..., |x_n|)
```

两点之间的距离由它们差异最大的那一维决定。其他维度全部忽略。

```
Point A = (1, 1)
Point B = (4, 5)

L-inf distance = max(|4-1|, |5-1|) = max(3, 4) = 4
```

何时用无穷范数：
- 任何单维上最坏偏差很重要时
- 棋盘游戏（国际象棋的王走的是无穷范数：任意方向一步的代价都是 1）
- 制造公差（每个维度都必须在规格内）

### 余弦相似度与余弦距离

余弦相似度度量两个向量之间的夹角，忽略它们的大小。

```
cos_sim(a, b) = (a . b) / (||a||_2 * ||b||_2)
```

取值范围从 -1（方向相反）到 +1（方向相同）。垂直向量的余弦相似度为 0。

余弦距离把它转换成距离：cosine_distance = 1 - cosine_similarity。取值范围从 0（方向完全相同）到 2（方向完全相反）。

```
a = (1, 0)    b = (1, 1)

cos_sim = (1*1 + 0*1) / (1 * sqrt(2)) = 1/sqrt(2) = 0.707
cos_dist = 1 - 0.707 = 0.293
```

为什么余弦主导 NLP 和嵌入：在文本中，文档长度不应影响相似度。一篇关于猫的文档即使比另一篇长一倍，仍然应该算「相似」。余弦相似度忽略大小（长度），只关心方向。两篇词分布相同但长度不同的文档指向同一方向，余弦相似度为 1.0。

何时用余弦相似度：
- 文本相似度（TF-IDF 向量、词嵌入、句子嵌入）
- 任何「大小是噪声、方向是信号」的领域
- 推荐系统（用户偏好向量）
- 嵌入检索（向量数据库几乎总是用余弦或点积）

### 点积相似度 vs 余弦相似度

两个向量的点积是：

```
a . b = a_1*b_1 + a_2*b_2 + ... + a_n*b_n
      = ||a|| * ||b|| * cos(angle)
```

余弦相似度是按两个向量的大小归一化后的点积。当两个向量都已是单位向量（大小 = 1）时，点积与余弦相似度完全相同。

```
If ||a|| = 1 and ||b|| = 1:
    a . b = cos(angle between a and b)
```

它们何时不同：点积包含大小信息。大小更大的向量得到更高的点积得分。这在某些检索系统中很重要——你希望「热门」项目排名更高。大小充当隐式的质量或重要性信号。

```
a = (3, 0)    b = (1, 0)    c = (0, 1)

dot(a, b) = 3     dot(a, c) = 0
cos(a, b) = 1.0   cos(a, c) = 0.0

Both agree on direction, but dot product also reflects magnitude.
```

实践中：
- 想要纯方向相似度时用余弦相似度
- 大小携带有意义信息时用点积
- 许多向量数据库（Pinecone、Weaviate、Qdrant）允许你在两者之间选择
- 如果你的嵌入已做 L2 归一化，选哪个都无所谓

### 马氏距离

欧氏距离平等对待所有维度。但如果你的特征相关或尺度不同，L2 会给出误导性的结果。

马氏距离（Mahalanobis distance）考虑数据的协方差结构。

```
d_M(x, y) = sqrt((x - y)^T * S^(-1) * (x - y))
```

其中 S 是数据的协方差矩阵。

直觉上：马氏距离先对数据去相关并归一化（白化），然后在那个变换后的空间里计算 L2 距离。如果 S 是单位矩阵（不相关、单位方差的特征），马氏距离就退化为欧氏距离。

```
Example: height and weight are correlated.
Someone 6'2" and 180 lbs is not unusual.
Someone 5'0" and 180 lbs is unusual.

Euclidean distance might say they are equally far from the mean.
Mahalanobis distance correctly identifies the second as an outlier
because it accounts for the height-weight correlation.
```

何时用马氏距离：
- 离群点检测（到均值的马氏距离大的点是离群点）
- 特征尺度和相关性不同时的分类
- 你有足够数据估计可靠协方差矩阵时
- 制造业质量控制（多元过程监控）

### Jaccard 相似度（用于集合）

Jaccard 相似度度量两个集合的重叠程度。

```
J(A, B) = |A intersect B| / |A union B|
```

取值从 0（无重叠）到 1（集合完全相同）。Jaccard 距离 = 1 - Jaccard 相似度。

```
A = {cat, dog, fish}
B = {cat, bird, fish, snake}

Intersection = {cat, fish}         size = 2
Union = {cat, dog, fish, bird, snake}  size = 5

Jaccard similarity = 2/5 = 0.4
Jaccard distance = 0.6
```

何时用 Jaccard：
- 比较标签、类别或特征集合
- 基于词出现（而非频率）的文档相似度
- 近重复检测（Jaccard 的 MinHash 近似）
- 比较二值特征向量（出现/缺失数据）
- 评估分割模型（交并比 IoU = Jaccard）

### 编辑距离（Levenshtein 距离）

编辑距离计算把一个字符串变成另一个所需的最少单字符操作次数。操作是：插入、删除或替换。

```
"kitten" -> "sitting"

kitten -> sitten  (substitute k -> s)
sitten -> sittin  (substitute e -> i)
sittin -> sitting (insert g)

Edit distance = 3
```

用动态规划计算。填充一个矩阵，其中条目 (i, j) 是字符串 A 的前 i 个字符与字符串 B 的前 j 个字符之间的编辑距离。

```
        ""  s  i  t  t  i  n  g
    ""   0  1  2  3  4  5  6  7
    k    1  1  2  3  4  5  6  7
    i    2  2  1  2  3  4  5  6
    t    3  3  2  1  2  3  4  5
    t    4  4  3  2  1  2  3  4
    e    5  5  4  3  2  2  3  4
    n    6  6  5  4  3  3  2  3
```

何时用编辑距离：
- 拼写检查与纠错
- DNA 序列比对（使用带权操作）
- 模糊字符串匹配
- 脏文本数据的去重

### KL 散度（不是距离，但常被当距离用）

KL 散度度量一个概率分布与另一个的差异。第 09 课会讲到，但它属于这里的讨论，因为人们把它当「距离」用，尽管它并不是。

```
D_KL(P || Q) = sum(p(x) * log(p(x) / q(x)))
```

关键性质：KL 散度不是对称的。

```
D_KL(P || Q) != D_KL(Q || P)
```

这意味着它不满足距离度量的基本要求。它也不满足三角不等式。它是散度，不是距离。

前向 KL（D_KL(P || Q)）是「均值寻求」：Q 试图覆盖 P 的所有众数。
反向 KL（D_KL(Q || P)）是「众数寻求」：Q 聚焦于 P 的单个众数。

你会在哪里见到 KL 散度：
- VAE（ELBO 中的 KL 项把隐分布推向先验）
- 知识蒸馏（学生试图匹配教师的分布）
- RLHF（KL 惩罚让微调后的模型靠近基座模型）
- 策略梯度方法（约束策略更新）

### Wasserstein 距离（推土机距离）

Wasserstein 距离度量把一个概率分布变成另一个所需的最小「工作量」。可以这样想：如果一个分布是一堆土，另一个是一个坑，你要搬多少土、搬多远？

```
W(P, Q) = inf over all transport plans gamma of E[d(x, y)]
```

对一维分布，它简化为累积分布函数之差的绝对值的积分：

```
W_1(P, Q) = integral |CDF_P(x) - CDF_Q(x)| dx
```

为什么 Wasserstein 重要：
- 它是真正的度量（对称，满足三角不等式）
- 即使分布不重叠，它也能提供梯度（KL 散度会趋于无穷）
- 这一性质使它成为 Wasserstein GAN（WGAN）的核心，解决了原始 GAN 的训练不稳定问题

```
Distributions with no overlap:

P: [1, 0, 0, 0, 0]    Q: [0, 0, 0, 0, 1]

KL divergence: infinity (log of zero)
Wasserstein: 4 (move all mass 4 bins)

Wasserstein gives a meaningful gradient. KL does not.
```

何时用 Wasserstein：
- GAN 训练（WGAN、WGAN-GP）
- 比较可能不重叠的分布
- 最优传输问题
- 图像检索（比较颜色直方图）

### 为什么不同任务需要不同的距离

| 任务 | 最佳距离 | 原因 |
|------|--------------|-----|
| 文本相似度 | 余弦 | 大小是噪声，方向是意义 |
| 图像像素比较 | L2 | 空间关系重要，特征尺度可比 |
| 稀疏高维特征 | L1 | 稳健，不放大罕见的大差异 |
| 集合重叠（标签、类别） | Jaccard | 数据天然是集合值，不是向量值 |
| 字符串匹配 | 编辑距离 | 操作对应人类的编辑直觉 |
| 离群点检测 | 马氏 | 考虑特征相关性和尺度 |
| 比较分布 | KL 散度 | 度量用 Q 代替 P 所损失的信息 |
| GAN 训练 | Wasserstein | 分布不重叠时仍提供梯度 |
| 嵌入（向量库） | 余弦或点积 | 嵌入被训练成把意义编码在方向里 |
| 推荐 | 点积 | 大小可以编码热度或置信度 |
| DNA 序列 | 加权编辑距离 | 替换代价随碱基对而变 |
| 制造业质检 | 无穷范数 | 任一维度的最坏偏差都重要 |

### 与损失函数的联系

损失函数就是作用在预测与目标上的距离函数。

```
Loss function       Distance it uses       Behavior
MSE                 L2 squared             Penalizes large errors heavily
MAE                 L1                     Penalizes all errors equally
Huber loss          L1 for large errors,   Best of both: robust to outliers,
                    L2 for small errors    smooth gradient near zero
Cross-entropy       KL divergence          Measures distribution mismatch
Hinge loss          max(0, margin - d)     Only penalizes below margin
Triplet loss        L2 (typically)         Pulls positives close, pushes
                                           negatives away
Contrastive loss    L2                     Similar pairs close, dissimilar
                                           pairs beyond margin
```

### 与正则化的联系

正则化在损失函数上加一个对权重的范数惩罚。

```
L1 regularization (Lasso):   loss + lambda * ||w||_1
  -> Sparse weights. Some weights become exactly zero.
  -> Automatic feature selection.
  -> Solution has corners (non-differentiable at zero).

L2 regularization (Ridge):   loss + lambda * ||w||_2^2
  -> Small weights. All weights shrink toward zero.
  -> No feature selection (nothing goes to exactly zero).
  -> Smooth solution everywhere.

Elastic Net:                  loss + lambda_1 * ||w||_1 + lambda_2 * ||w||_2^2
  -> Combines sparsity of L1 with stability of L2.
  -> Groups of correlated features are kept or dropped together.
```

为什么 L1 产生稀疏而 L2 不：想象二维权重空间中的约束区域。L1 是菱形，L2 是圆。损失函数的等高线（椭圆）最可能在菱形的角上相切——那里某个权重为零。它们在圆上则是在光滑点相切，两个权重都非零。

### 最近邻搜索

每个距离函数都隐含一个最近邻搜索问题：给定查询点，在数据集中找到最接近的点。

在 n 个点、d 维的数据集上，精确最近邻搜索每次查询是 O(n * d)。对大数据集来说太慢。

近似最近邻（ANN）算法用少量精度换取巨大加速：

```
Algorithm         Approach                      Used by
KD-trees          Axis-aligned space partition   scikit-learn (low-dim)
Ball trees        Nested hyperspheres            scikit-learn (medium-dim)
LSH               Random hash projections        Near-duplicate detection
HNSW              Hierarchical navigable         FAISS, Qdrant, Weaviate
                  small-world graph
IVF               Inverted file index with       FAISS (billion-scale)
                  cluster-based search
Product quant.    Compress vectors, search       FAISS (memory-constrained)
                  in compressed space
```

HNSW（Hierarchical Navigable Small World，分层可导航小世界）是现代向量数据库中的主导算法。它构建一个多层图，每个节点连接到其近似最近邻。搜索从顶层（稀疏、长跳）开始，下降到底层（密集、短跳）。

```figure
norm-unit-balls
```

## 动手做

### 步骤 1：全部范数与距离函数

完整实现见 `code/distances.py`。每个函数都只用基础 Python 数学从零构建。

### 步骤 2：同一份数据，不同距离，不同邻居

`distances.py` 中的演示创建一个数据集，选一个查询点，并展示最近邻如何随距离度量而变化。在 L1 下「最近」的点，在 L2 或余弦下未必最近。

### 步骤 3：嵌入相似度检索

代码包含一个模拟的嵌入相似度检索，用余弦相似度 vs L2 距离找出与查询最相似的「文档」，展示排名可能不同。

## 用起来

最常见的实际用途：在向量数据库中找相似项。

```python
import numpy as np

def cosine_similarity_matrix(X):
    norms = np.linalg.norm(X, axis=1, keepdims=True)
    norms = np.where(norms == 0, 1, norms)
    X_normalized = X / norms
    return X_normalized @ X_normalized.T

embeddings = np.random.randn(1000, 768)

sim_matrix = cosine_similarity_matrix(embeddings)

query_idx = 0
similarities = sim_matrix[query_idx]
top_k = np.argsort(similarities)[::-1][1:6]
print(f"Top 5 most similar to item 0: {top_k}")
print(f"Similarities: {similarities[top_k]}")
```

当你调用 `model.encode(text)` 然后搜索向量数据库时，底层发生的就是这些。嵌入模型把文本映射为向量。向量数据库计算你的查询向量与每个存储向量之间的余弦相似度（或点积），并用 ANN 算法避免逐一检查全部向量。

## 练习

1. 计算 (1, 2, 3) 与 (4, 0, 6) 之间的 L1、L2 和无穷范数距离。验证对任意一对点总有 L-inf <= L2 <= L1。证明为什么这个顺序一定成立。

2. 构造两个向量，使余弦相似度很高（> 0.9）但 L2 距离很大（> 10）。从几何上解释发生了什么。再构造两个向量，使余弦相似度很低（< 0.3）但 L2 距离很小（< 0.5）。

3. 实现一个函数，接受数据集和查询点，返回在 L1、L2、余弦和马氏距离下的最近邻。找出一个数据集，使四种度量对「哪个点最近」意见全不一致。

4. 用 CDF 方法手工计算 [0.5, 0.5, 0, 0] 与 [0, 0, 0.5, 0.5] 之间的 Wasserstein 距离。再计算 [0.25, 0.25, 0.25, 0.25] 与 [0, 0, 0.5, 0.5] 之间的。哪个更大，为什么？

5. 实现用于近似 Jaccard 相似度的 MinHash。生成 100 个随机集合，计算所有配对的精确 Jaccard，并与使用 50、100、200 个哈希函数的 MinHash 近似比较。绘制近似误差。

## 关键术语

| 术语 | 人们常说 | 它真正的意思 |
|------|----------------|----------------------|
| 范数（Norm） | 「向量的大小」 | 把向量映到非负标量的函数，满足三角不等式、绝对齐次性，且仅对零向量取零 |
| L1 范数 | 「曼哈顿距离」 | 分量绝对值之和。在优化中产生稀疏性。对离群点稳健 |
| L2 范数 | 「欧氏距离」 | 分量平方和的平方根。欧氏空间中的直线距离 |
| Lp 范数 | 「广义范数」 | 分量绝对值的 p 次幂之和的 p 次方根。L1 和 L2 是特例 |
| 无穷范数 | 「最大值范数」或「切比雪夫距离」 | 最大绝对分量值。Lp 当 p 趋于无穷时的极限 |
| 余弦相似度 | 「向量夹角」 | 按两个向量大小归一化的点积。范围 -1 到 +1。忽略向量长度 |
| 余弦距离 | 「1 减余弦相似度」 | 把余弦相似度转成距离。范围 0 到 2 |
| 点积 | 「未归一化的余弦」 | 分量逐对乘积之和。等于余弦相似度乘以两个向量的大小 |
| 马氏距离 | 「考虑相关性的距离」 | 在用数据协方差矩阵白化（去相关并归一化）后的空间中的 L2 距离 |
| Jaccard 相似度 | 「集合重叠」 | 交集大小除以并集大小。针对集合，不是向量 |
| 编辑距离 | 「Levenshtein 距离」 | 把一个字符串变成另一个所需的最少插入、删除和替换次数 |
| KL 散度 | 「分布之间的距离」 | 不是真正的距离（不对称）。度量用 Q 编码 P 所多出的比特数 |
| Wasserstein 距离 | 「推土机距离」 | 把质量从一个分布运到另一个的最小工作量。真正的度量 |
| 近似最近邻 | 「ANN 搜索」 | 比精确搜索快得多地找到近似最近点的算法（HNSW、LSH、IVF） |
| HNSW | 「向量库算法」 | 分层可导航小世界图。用于快速近似最近邻搜索的多层图 |
| L1 正则化 | 「Lasso」 | 在损失中加入权重的 L1 范数。把权重推向零（稀疏） |
| L2 正则化 | 「Ridge」或「weight decay」 | 在损失中加入权重的 L2 范数平方。把权重向零收缩但不产生稀疏 |
| Elastic Net | 「L1 + L2」 | 结合 L1 与 L2 正则化。比单独任一种更好地处理相关特征组 |

## 延伸阅读

- [FAISS: A Library for Efficient Similarity Search](https://github.com/facebookresearch/faiss) - Meta 的十亿级 ANN 搜索库
- [Wasserstein GAN (Arjovsky et al., 2017)](https://arxiv.org/abs/1701.07875) - 把推土机距离引入 GAN 的论文
- [Locality-Sensitive Hashing (Indyk & Motwani, 1998)](https://dl.acm.org/doi/10.1145/276698.276876) - 奠基性的 ANN 算法
- [Efficient Estimation of Word Representations (Mikolov et al., 2013)](https://arxiv.org/abs/1301.3781) - Word2Vec，余弦相似度由此成为嵌入的默认选择
- [sklearn.neighbors documentation](https://scikit-learn.org/stable/modules/neighbors.html) - scikit-learn 中距离度量与邻居算法的实用指南
