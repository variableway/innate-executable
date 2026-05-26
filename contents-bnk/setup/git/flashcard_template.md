# Flashcard Creation Guide & Template / 闪卡制作指南与模板

This file serves as both a guide and a template. The Python script (`convert_to_flashcards.py`) ignores everything before the first `## Category` header.
此文件既是指南也是模板。Python 脚本 (`convert_to_flashcards.py`) 会忽略第一个 `## Category` 标题之前的所有内容。

## Introduction / 介绍

To create flashcards, structure your Markdown file using the format below.
要创建闪卡，请使用以下格式构建您的 Markdown 文件。

1.  **Categories (`##`)**: Used to group cards (e.g., by Language or Topic).
    **分类 (`##`)**：用于对卡片进行分组（例如，按语言或主题）。
2.  **Groups of Simple Cards (`###`)**: A section containing a list of bullet points.
    **简单闪卡组 (`###`)**：包含项目符号列表的部分。
    *   Format: `* **Question**: Answer`
    *   格式：`* **问题**: 答案`
3.  **Complex Cards (`###`)**: A section where the Header is the Question, and the Body is the Answer.
    **复杂闪卡 (`###`)**：标题即为问题，正文即为答案的部分。

## Expected Result / 预期结果

The script will convert the template below into the following JSON format:
脚本将把下面的模板转换为以下 JSON 格式：

```json
[
    {
        "language": "English",
        "question": "Question 1",
        "answer": "Answer 1 (Single line)"
    },
    {
        "language": "English",
        "question": "Question 2",
        "answer": "Answer 2 (Code block)"
    },
    {
        "language": "English",
        "question": "Single Complex Flashcard (The Header is the Question)",
        "answer": "1. Step one\n2. Step two\n   ```bash\n   code example\n   ```\n3. Step three"
    },
    {
        "language": "Chinese",
        "question": "问题 1",
        "answer": "答案 1"
    }
]
```

---
(Template Starts Below / 模板从下方开始)

## English (Category Name)

### Group of Simple Flashcards
*   **Question 1**: Answer 1 (Single line)
*   **Question 2**:
    ```code
    Answer 2 (Code block)
    ```

### Single Complex Flashcard (The Header is the Question)
1.  Step one
2.  Step two
    ```bash
    code example
    ```
3.  Step three

---

## Chinese (Category Name / 分类名称)

### 简单闪卡组
*   **问题 1**: 答案 1
*   **问题 2**:
    ```bash
    代码答案
    ```

### 单个复杂闪卡 (标题即问题)
这里是详细的答案内容，可以包含多行文本、列表和代码块。
- 要点 A
- 要点 B
