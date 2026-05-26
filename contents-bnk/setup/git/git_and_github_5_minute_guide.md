# 5-Minute Git & GitHub Guide

This guide provides a quick overview of basic Git commands and how to use them with GitHub.

## English Version

### 1. Basic Git Commands

*   **Initialize a repository**:
    ```bash
    git init
    ```
*   **Add files to staging**:
    ```bash
    git add .
    ```
*   **Commit changes**:
    ```bash
    git commit -m "Your commit message"
    ```

### 2. GitHub CLI Usage

*   **Create a new repository on GitHub**:
    ```bash
    gh repo create your-repo-name --public --source=. --remote=origin
    ```
*   **Push your code to GitHub**:
    ```bash
    git push -u origin main
    ```

### 3. How to Add, Commit, and Push

1.  **Initialize Git** in your project folder:
    ```bash
    git init
    ```
2.  **Add your files** to the staging area:
    ```bash
    git add .
    ```
3.  **Commit your changes** with a descriptive message:
    ```bash
    git commit -m "Initial commit"
    ```
4.  **Create a new repository** on GitHub using the GitHub CLI:
    ```bash
    gh repo create your-repo-name --public --source=. --remote=origin
    ```
5.  **Push your code** to the newly created repository:
    ```bash
    git push -u origin main
    ```

## 中文版

### 1. 基本Git命令

*   **初始化仓库**：
    ```bash
    git init
    ```
*   **将文件添加到暂存区**：
    ```bash
    git add .
    ```
*   **提交更改**：
    ```bash
    git commit -m "你的提交信息"
    ```

### 2. GitHub CLI 用法

*   **在GitHub上创建新仓库**：
    ```bash
    gh repo create 你的仓库名称 --public --source=. --remote=origin
    ```
*   **将代码推送到GitHub**：
    ```bash
    git push -u origin main
    ```

### 3. 如何添加、提交和推送

1.  在你的项目文件夹中**初始化Git**：
    ```bash
    git init
    ```
2.  **将你的文件添加**到暂存区：
    ```bash
    git add .
    ```
3.  使用描述性信息**提交你的更改**：
    ```bash
    git commit -m "首次提交"
    ```
4.  使用GitHub CLI在GitHub上**创建新仓库**：
    ```bash
    gh repo create 你的仓库名称 --public --source=. --remote=origin
    ```
5.  **将你的代码推送**到新创建的仓库：
    ```bash
    git push -u origin main
    ```
