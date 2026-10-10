# 向量与矩阵运算

> 每个神经网络，不过是多绕了几步的矩阵乘法。

**类型:** Build
**语言:** Python, Julia
**先修:** Phase 1, Lesson 01 (Linear Algebra Intuition)
**时长:** ~60 分钟

## 学习目标

- 构建一个 Matrix 类，支持逐元素运算、矩阵乘法、转置、行列式和逆
- 区分逐元素乘法与矩阵乘法，并说明各自何时适用
- 仅用从零实现的 Matrix 类实现一个稠密神经网络层（`relu(W @ x + b)`）
- 解释广播（broadcasting）规则，以及偏置加法在神经网络框架中如何工作

## 问题

你想构建一个神经网络。读代码时看到这样一行：

```
output = activation(weights @ input + bias)
```

那个 `@` 是矩阵乘法。`weights` 是一个矩阵。`input` 是一个向量。若你不知道这些运算在做什么，这行就是魔法；若你知道，它就是一层网络前向传播的全部——三个运算而已。

模型处理的每张图都是像素值矩阵。每个词向量都是向量。每个神经网络的每一层都是矩阵变换。你无法在不熟练矩阵运算的情况下构建 AI 系统，就像不理解变量就无法写代码一样。

本课从零建立这种熟练度。

## 概念

### 向量：有序的数字列表

向量是一串带方向和模长的数字。在 AI 里，向量表示数据点、特征或参数。

```
v = [3, 4]        -- a 2D vector
w = [1, 0, -2]    -- a 3D vector
```

二维向量 `[3, 4]` 指向平面上的坐标 (3, 4)。它的长度（模长）是 5（3-4-5 三角形）。

### 矩阵：数字网格

矩阵是一个二维网格。有行有列。m x n 矩阵有 m 行 n 列。

```
A = | 1  2  3 |     -- 2x3 matrix (2 rows, 3 columns)
    | 4  5  6 |
```

在神经网络里，权重矩阵把输入向量变换成输出向量。一个 784 输入、128 输出的层用的是 128x784 的权重矩阵。

### 为什么形状很重要

矩阵乘法有条硬规则：`(m x n) @ (n x p) = (m x p)`。内维必须匹配。

```
(128 x 784) @ (784 x 1) = (128 x 1)
  weights       input       output

Inner dimensions: 784 = 784  -- valid
```

若你在 PyTorch 里遇到形状不匹配错误，原因就在这里。

### 运算一览

| 运算 | 做什么 | 神经网络用途 |
|-----------|-------------|-------------------|
| 加法 | 逐元素合并 | 给输出加偏置 |
| 标量乘法 | 缩放每个元素 | 学习率 * 梯度 |
| 矩阵乘法 | 变换向量 | 层的前向传播 |
| 转置 | 行列互换 | 反向传播 |
| 行列式 | 单个数字的摘要 | 检查是否可逆 |
| 逆 | 撤销一次变换 | 解线性方程组 |
| 单位矩阵 | 什么都不做的矩阵 | 初始化、残差连接 |

### 逐元素乘法 vs 矩阵乘法

这个区分经常绊倒初学者。

逐元素（element-wise）：对应位置相乘。两个矩阵必须同形。

```
| 1  2 |   | 5  6 |   | 5  12 |
| 3  4 | * | 7  8 | = | 21 32 |
```

矩阵乘法（matrix multiplication）：行与列的点积。内维必须匹配。

```
| 1  2 |   | 5  6 |   | 1*5+2*7  1*6+2*8 |   | 19  22 |
| 3  4 | @ | 7  8 | = | 3*5+4*7  3*6+4*8 | = | 43  50 |
```

不同的运算，不同的结果，不同的规则。

### 广播

当你把偏置向量加到输出矩阵上时，形状并不匹配。广播（broadcasting）会把较小的数组拉伸以适配。

```
| 1  2  3 |   +   [10, 20, 30]
| 4  5  6 |

Broadcasting stretches the vector across rows:

| 1  2  3 |   | 10  20  30 |   | 11  22  33 |
| 4  5  6 | + | 10  20  30 | = | 14  25  36 |
```

每个现代框架都会自动做这件事。理解它，能避免"形状看起来不对但代码居然能跑"时的困惑。

```figure
vector-projection
```

## 动手做

### 步骤 1：Vector 类

```python
class Vector:
    def __init__(self, data):
        self.data = list(data)
        self.size = len(self.data)

    def __repr__(self):
        return f"Vector({self.data})"

    def __add__(self, other):
        return Vector([a + b for a, b in zip(self.data, other.data)])

    def __sub__(self, other):
        return Vector([a - b for a, b in zip(self.data, other.data)])

    def __mul__(self, scalar):
        return Vector([x * scalar for x in self.data])

    def dot(self, other):
        return sum(a * b for a, b in zip(self.data, other.data))

    def magnitude(self):
        return sum(x ** 2 for x in self.data) ** 0.5
```

### 步骤 2：带核心运算的 Matrix 类

```python
class Matrix:
    def __init__(self, data):
        self.data = [list(row) for row in data]
        self.rows = len(self.data)
        self.cols = len(self.data[0])
        self.shape = (self.rows, self.cols)

    def __repr__(self):
        rows_str = "\n  ".join(str(row) for row in self.data)
        return f"Matrix({self.shape}):\n  {rows_str}"

    def __add__(self, other):
        return Matrix([
            [self.data[i][j] + other.data[i][j] for j in range(self.cols)]
            for i in range(self.rows)
        ])

    def __sub__(self, other):
        return Matrix([
            [self.data[i][j] - other.data[i][j] for j in range(self.cols)]
            for i in range(self.rows)
        ])

    def scalar_multiply(self, scalar):
        return Matrix([
            [self.data[i][j] * scalar for j in range(self.cols)]
            for i in range(self.rows)
        ])

    def element_wise_multiply(self, other):
        return Matrix([
            [self.data[i][j] * other.data[i][j] for j in range(self.cols)]
            for i in range(self.rows)
        ])

    def matmul(self, other):
        return Matrix([
            [
                sum(self.data[i][k] * other.data[k][j] for k in range(self.cols))
                for j in range(other.cols)
            ]
            for i in range(self.rows)
        ])

    def transpose(self):
        return Matrix([
            [self.data[j][i] for j in range(self.rows)]
            for i in range(self.cols)
        ])

    def determinant(self):
        if self.shape == (1, 1):
            return self.data[0][0]
        if self.shape == (2, 2):
            return self.data[0][0] * self.data[1][1] - self.data[0][1] * self.data[1][0]
        det = 0
        for j in range(self.cols):
            minor = Matrix([
                [self.data[i][k] for k in range(self.cols) if k != j]
                for i in range(1, self.rows)
            ])
            det += ((-1) ** j) * self.data[0][j] * minor.determinant()
        return det

    def inverse_2x2(self):
        det = self.determinant()
        if det == 0:
            raise ValueError("Matrix is singular, no inverse exists")
        return Matrix([
            [self.data[1][1] / det, -self.data[0][1] / det],
            [-self.data[1][0] / det, self.data[0][0] / det]
        ])

    @staticmethod
    def identity(n):
        return Matrix([
            [1 if i == j else 0 for j in range(n)]
            for i in range(n)
        ])
```

### 步骤 3：看它跑起来

```python
A = Matrix([[1, 2], [3, 4]])
B = Matrix([[5, 6], [7, 8]])

print("A + B =", (A + B).data)
print("A @ B =", A.matmul(B).data)
print("A^T =", A.transpose().data)
print("det(A) =", A.determinant())
print("A^-1 =", A.inverse_2x2().data)

I = Matrix.identity(2)
print("A @ A^-1 =", A.matmul(A.inverse_2x2()).data)
```

### 步骤 4：接到神经网络

```python
import random

inputs = Matrix([[0.5], [0.8], [0.2]])
weights = Matrix([
    [random.uniform(-1, 1) for _ in range(3)]
    for _ in range(2)
])
bias = Matrix([[0.1], [0.1]])

def relu_matrix(m):
    return Matrix([[max(0, val) for val in row] for row in m.data])

pre_activation = weights.matmul(inputs) + bias
output = relu_matrix(pre_activation)

print(f"Input shape: {inputs.shape}")
print(f"Weight shape: {weights.shape}")
print(f"Output shape: {output.shape}")
print(f"Output: {output.data}")
```

这就是一个稠密层：`output = relu(W @ x + b)`。每个神经网络里的每个稠密层做的就是这件事。

## 用起来

NumPy 用更少的行数、快几个数量级地完成上面所有事。

```python
import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print("A + B =\n", A + B)
print("A * B (element-wise) =\n", A * B)
print("A @ B (matrix multiply) =\n", A @ B)
print("A^T =\n", A.T)
print("det(A) =", np.linalg.det(A))
print("A^-1 =\n", np.linalg.inv(A))
print("I =\n", np.eye(2))

inputs = np.random.randn(3, 1)
weights = np.random.randn(2, 3)
bias = np.array([[0.1], [0.1]])
output = np.maximum(0, weights @ inputs + bias)

print(f"\nNeural network layer: {weights.shape} @ {inputs.shape} = {output.shape}")
print(f"Output:\n{output}")
```

Python 里的 `@` 运算符调用 `__matmul__`。NumPy 用 C 和 Fortran 写的优化 BLAS 例程实现它。同样的数学，快 100 倍。

NumPy 中的广播：

```python
matrix = np.array([[1, 2, 3], [4, 5, 6]])
bias = np.array([10, 20, 30])
print(matrix + bias)
```

NumPy 自动把一维偏置广播到两行上。每个神经网络框架里的偏置加法都是这么工作的。

## 交付

本课产出一份通过几何直觉教矩阵运算的提示词。见 `outputs/prompt-matrix-operations.md`。

这里构建的 Matrix 类，是 Phase 3 Lesson 10 中迷你神经网络框架的基础。

## 练习

1. **验证逆矩阵。** 计算 `A @ A.inverse_2x2()`，确认得到单位矩阵。用三个不同的 2x2 矩阵试一试。行列式为 0 时会发生什么？

2. **实现 3x3 逆。** 用伴随矩阵法扩展 Matrix 类，计算 3x3 矩阵的逆。与 NumPy 的 `np.linalg.inv` 对照测试。

3. **搭一个两层网络。** 只用你的 Matrix 类（不用 NumPy），创建一个两层神经网络：输入 (3) -> 隐藏 (4) -> 输出 (2)。随机初始化权重，跑一次前向传播，验证所有形状正确。

## 关键术语

| 术语 | 人们常说 | 它真正的意思 |
|------|----------------|----------------------|
| 向量（Vector） | "一支箭" | 有序数字列表。在 AI 中：高维空间中的一个点。 |
| 矩阵（Matrix） | "一张数字表" | 一次线性变换。它把向量从一个空间映射到另一个空间。 |
| 矩阵乘法（Matrix multiply） | "数字乘一乘就行" | 第一个矩阵的每一行与第二个矩阵的每一列做点积。顺序很重要。 |
| 转置（Transpose） | "翻一下" | 行列互换。把 m x n 矩阵变成 n x m。反向传播中至关重要。 |
| 行列式（Determinant） | "矩阵算出来的一个数" | 衡量矩阵把面积（2D）或体积（3D）缩放了多少。为 0 意味着变换压扁了一个维度。 |
| 逆（Inverse） | "撤销这个矩阵" | 反转该变换的矩阵。仅当行列式不为 0 时存在。 |
| 单位矩阵（Identity matrix） | "无聊的矩阵" | 相当于乘以 1 的矩阵。用在残差连接（ResNet）里。 |
| 广播（Broadcasting） | "魔法修形状" | 沿缺失维度重复，把较小数组拉伸以匹配较大数组。 |
| 逐元素（Element-wise） | "普通乘法" | 对应位置相乘。两个数组必须同形（或可广播）。 |

## 延伸阅读

- [3Blue1Brown: Essence of Linear Algebra](https://www.3blue1brown.com/topics/linear-algebra) - 本课每个运算的视觉直觉
- [NumPy documentation on broadcasting](https://numpy.org/doc/stable/user/basics.broadcasting.html) - NumPy 遵循的确切规则
- [Stanford CS229 Linear Algebra Review](http://cs229.stanford.edu/section/cs229-linalg.pdf) - 面向 ML 的线性代数简明参考
