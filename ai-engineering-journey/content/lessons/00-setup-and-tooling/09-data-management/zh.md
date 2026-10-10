# 数据管理

> 数据是燃料。怎么管数据，决定了你能跑多快。

**类型:** Build
**语言:** Python
**先修:** 阶段 0，第 01 课
**时长:** ~45 分钟

## 学习目标

- 用 Hugging Face `datasets` 库加载、流式读取和缓存数据集
- 在 CSV、JSON、Parquet 和 Arrow 格式之间转换，并说明各自取舍
- 用固定随机种子创建可复现的训练/验证/测试划分
- 用 `.gitignore`、Git LFS 或 DVC 管理大模型和数据集文件

## 问题

每个 AI 项目都从数据开始。你需要找数据集、下载、转换格式、划分训练和评估集，还要做版本管理，让实验可复现。每次都手动做，既慢又容易出错。你需要一套可重复的工作流。

## 概念

```mermaid
graph TD
    A["Hugging Face Hub"] --> B["datasets 库"]
    B --> C["加载 / 流式读取"]
    C --> D["本地缓存<br/>~/.cache/huggingface/"]
    B --> E["格式转换<br/>CSV, JSON, Parquet, Arrow"]
    E --> F["数据划分<br/>train / val / test"]
    F --> G["你的训练流水线"]
```

Hugging Face `datasets` 库是 AI 工作加载数据的标准方式。它开箱即用地处理下载、缓存、格式转换和流式读取。

```figure
s0-data-pipeline
```

## 动手做

### 步骤 1：安装 datasets 库

```bash
pip install datasets huggingface_hub
```

### 步骤 2：加载数据集

```python
from datasets import load_dataset

dataset = load_dataset("stanfordnlp/imdb")
print(dataset)
print(dataset["train"][0])
```

这会下载 IMDB 电影评论数据集。首次下载后，会从 `~/.cache/huggingface/datasets/` 的缓存加载。

### 步骤 3：流式读取大数据集

有些数据集太大，磁盘装不下。流式读取按行加载，无需下载完整数据。

```python
dataset = load_dataset("wikimedia/wikipedia", "20220301.en", split="train", streaming=True)

for i, example in enumerate(dataset):
    print(example["title"])
    if i >= 4:
        break
```

流式读取返回一个 `IterableDataset`。数据到达时逐行处理。无论数据集多大，内存占用保持恒定。

### 步骤 4：数据集格式

`datasets` 库底层使用 Apache Arrow。你可以根据流水线需要转换为其他格式。

```python
dataset = load_dataset("stanfordnlp/imdb", split="train")

dataset.to_csv("imdb_train.csv")
dataset.to_json("imdb_train.json")
dataset.to_parquet("imdb_train.parquet")
```

格式对比：

| 格式 | 体积 | 读取速度 | 最适合 |
|------|------|----------|--------|
| CSV | 大 | 慢 | 人类可读、电子表格 |
| JSON | 大 | 慢 | API、嵌套数据 |
| Parquet | 小 | 快 | 分析、列式查询 |
| Arrow | 小 | 最快 | 内存处理（`datasets` 内部使用） |

对 AI 工作来说，Parquet 是最好的存储格式。Arrow 是你在内存中操作的格式。CSV 和 JSON 用于交换。

### 步骤 5：数据划分

每个 ML 项目都需要三份划分：

- **训练集（Train）**：模型从这里学习（通常 80%）
- **验证集（Validation）**：训练过程中检查进度（通常 10%）
- **测试集（Test）**：训练完成后的最终评估（通常 10%）

有些数据集自带划分。没有的话，自己划分：

```python
dataset = load_dataset("stanfordnlp/imdb", split="train")

split = dataset.train_test_split(test_size=0.2, seed=42)
train_val = split["train"].train_test_split(test_size=0.125, seed=42)

train_ds = train_val["train"]
val_ds = train_val["test"]
test_ds = split["test"]

print(f"Train: {len(train_ds)}, Val: {len(val_ds)}, Test: {len(test_ds)}")
```

务必设置种子以保证可复现。相同种子每次产生相同划分。

### 步骤 6：下载并缓存模型

模型是大文件。`huggingface_hub` 库负责下载和缓存。

```python
from huggingface_hub import hf_hub_download, snapshot_download

model_path = hf_hub_download(
    repo_id="sentence-transformers/all-MiniLM-L6-v2",
    filename="config.json"
)
print(f"Cached at: {model_path}")

model_dir = snapshot_download("sentence-transformers/all-MiniLM-L6-v2")
print(f"Full model at: {model_dir}")
```

模型缓存在 `~/.cache/huggingface/hub/`。下载一次后，后续运行即时加载。

### 步骤 7：处理大文件

模型权重和大数据集不应进 git。三个选项：

**选项 A：.gitignore（最简单）**

```
*.bin
*.safetensors
*.pt
*.onnx
data/*.parquet
data/*.csv
models/
```

**选项 B：Git LFS（在 git 中跟踪大文件）**

```bash
git lfs install
git lfs track "*.bin"
git lfs track "*.safetensors"
git add .gitattributes
```

Git LFS 在仓库中存指针，实际文件放在单独的服务器上。GitHub 免费提供 1 GB。

**选项 C：DVC（数据版本控制）**

```bash
pip install dvc
dvc init
dvc add data/training_set.parquet
git add data/training_set.parquet.dvc data/.gitignore
git commit -m "Track training data with DVC"
```

DVC 创建指向数据的小 `.dvc` 文件。数据本身存放在 S3、GCS 或其他远程存储后端。

| 方案 | 复杂度 | 最适合 |
|------|--------|--------|
| .gitignore | 低 | 个人项目、可重新下载的数据 |
| Git LFS | 中 | 团队通过 git 共享模型权重 |
| DVC | 高 | 可复现实验、大数据集、团队协作 |

本课程用 `.gitignore` 就够了。需要跨机器复现精确实验时再用 DVC。

### 步骤 8：存储模式

**本地存储**适合约 10 GB 以下的数据集。HF 缓存会自动处理。

**云存储**用于更大或跨机器共享的数据：

```python
import os

local_path = os.path.expanduser("~/.cache/huggingface/datasets/")

# s3_path = "s3://my-bucket/datasets/"
# gcs_path = "gs://my-bucket/datasets/"
```

DVC 可直接对接 S3 和 GCS：

```bash
dvc remote add -d myremote s3://my-bucket/dvc-store
dvc push
```

本课程用本地存储即可。当你在远程 GPU 实例上微调时，云存储才变得相关。

## 本课程使用的数据集

| 数据集 | 课程 | 体积 | 教什么 |
|--------|------|------|--------|
| IMDB | 分词、分类 | 84 MB | 文本分类基础 |
| WikiText | 语言建模 | 181 MB | 下一 token 预测 |
| SQuAD | 问答系统 | 35 MB | 问答、span |
| Common Crawl（子集） | 嵌入 | 不等 | 大规模文本处理 |
| MNIST | 视觉基础 | 21 MB | 图像分类基础 |
| COCO（子集） | 多模态 | 不等 | 图文对 |

现在不必全部下载。每门课会说明需要什么。

## 用起来

运行工具脚本验证一切正常：

```bash
python code/data_utils.py
```

这会下载一个小数据集，转换、划分，并打印摘要。

## 交付

本课产出：
- `code/data_utils.py` - 可复用的数据加载与缓存工具
- `outputs/prompt-data-helper.md` - 为任务找合适数据集的提示词

## 练习

1. 用 `mrpc` 配置加载 `glue` 数据集，并查看前 5 个样本
2. 流式读取 `c4` 数据集，统计 10 秒内能处理多少条样本
3. 把一个数据集转成 Parquet，与 CSV 比较文件大小
4. 用固定种子创建 70/15/15 的 train/val/test 划分，并验证各集合大小

## 关键术语

| 术语 | 常见说法 | 实际含义 |
|------|----------|----------|
| 数据集划分 | "训练数据" | 在 ML 生命周期不同阶段使用的命名子集（train/val/test） |
| 流式读取 | "懒加载" | 从远程源逐行处理数据，无需下载完整数据集 |
| Parquet | "压缩的 CSV" | 面向分析查询和存储效率优化的列式文件格式 |
| Arrow | "快速 dataframe" | datasets 库内部使用的内存列式格式，支持零拷贝读取 |
| Git LFS | "大文件版 Git" | 把大文件存在 git 仓库外、在版本控制中保留指针的扩展 |
| DVC | "数据版 Git" | 面向数据集和模型、可对接云存储的版本控制系统 |
| 缓存 | "已经下过了" | 之前抓取数据的本地副本，默认存放在 ~/.cache/huggingface/ |
