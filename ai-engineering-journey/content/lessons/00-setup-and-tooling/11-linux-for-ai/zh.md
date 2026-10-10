# AI 用 Linux

> 大多数 AI 跑在 Linux 上。你得懂到不至于卡住。

**类型:** Learn
**语言:** --
**先修:** Phase 0, Lesson 01
**时长:** ~30 分钟

## 学习目标

- 在 Linux 文件系统中导航，并用命令行完成基本文件操作
- 用 `chmod` 和 `chown` 管理文件权限，解决 "Permission denied" 错误
- 用 `apt` 安装系统包，并配好一台全新的 GPU 机器来做 AI
- 认清 macOS 与 Linux 的差异，避免在远程机器上踩坑

## 问题

你平时在 macOS 或 Windows 上开发。但一旦 SSH 进云 GPU 机器、租一台 Lambda 实例，或开一台 EC2，你就落进了 Ubuntu。终端是你唯一的界面——没有 Finder，没有资源管理器，没有 GUI。不会用命令行导航文件系统、装包、管进程，你就只能一边搜 "how to unzip a file in Linux"，一边为闲置的 GPU 时数付钱。

这是一份生存指南。只讲在远程 Linux 机器上做 AI 工作需要的东西。不多不少。

## 文件系统布局

Linux 把所有东西组织在唯一的根目录 `/` 下。没有 `C:\`，也没有 `/Volumes`。你真正会碰到的目录：

```mermaid
graph TD
    root["/"] --> home["home/your-username/<br/>你的文件 — clone 仓库、跑训练"]
    root --> tmp["tmp/<br/>临时文件，重启即清空"]
    root --> usr["usr/<br/>系统程序与库"]
    root --> etc["etc/<br/>配置文件"]
    root --> varlog["var/log/<br/>日志 — 出问题时来查"]
    root --> mnt["mnt/ 或 /media/<br/>外接驱动器与卷"]
    root --> proc["proc/ 和 /sys/<br/>虚拟文件 — 内核与硬件信息"]
```

你的 home 目录是 `~` 或 `/home/your-username`。几乎所有事情都发生在这里。

## 核心命令

这 15 个命令覆盖你在远程 GPU 机器上 95% 的操作。

### 目录导航

```bash
pwd                         # Where am I?
ls                          # What's here?
ls -la                      # What's here, including hidden files with details?
cd /path/to/dir             # Go there
cd ~                        # Go home
cd ..                       # Go up one level
```

### 文件与目录

```bash
mkdir my-project            # Create a directory
mkdir -p a/b/c              # Create nested directories in one shot

cp file.txt backup.txt      # Copy a file
cp -r src/ src-backup/      # Copy a directory (recursive)

mv old.txt new.txt          # Rename a file
mv file.txt /tmp/           # Move a file

rm file.txt                 # Delete a file (no trash, it's gone)
rm -rf my-dir/              # Delete a directory and everything inside
```

`rm -rf` 是永久删除，没有撤销。回车前务必再看一眼路径。

### 读文件

```bash
cat file.txt                # Print entire file
head -20 file.txt           # First 20 lines
tail -20 file.txt           # Last 20 lines
tail -f log.txt             # Follow a log file in real time (Ctrl+C to stop)
less file.txt               # Scroll through a file (q to quit)
```

### 搜索

```bash
grep "error" training.log           # Find lines containing "error"
grep -r "learning_rate" .           # Search all files in current directory
grep -i "cuda" config.yaml          # Case-insensitive search

find . -name "*.py"                 # Find all Python files under current dir
find . -name "*.ckpt" -size +1G     # Find checkpoint files larger than 1GB
```

## 权限

Linux 里每个文件都有属主和权限位。脚本不能执行、目录写不进去时，你就碰到它了。

```bash
ls -l train.py
# -rwxr-xr-- 1 user group 2048 Mar 19 10:00 train.py
#  ^^^             owner permissions: read, write, execute
#     ^^^          group permissions: read, execute
#        ^^        everyone else: read only
```

常见修法：

```bash
chmod +x train.sh           # Make a script executable
chmod 755 deploy.sh         # Owner: full, others: read+execute
chmod 644 config.yaml       # Owner: read+write, others: read only

chown user:group file.txt   # Change who owns a file (needs sudo)
```

看到 "Permission denied"，几乎都是权限问题。`chmod +x` 或 `sudo` 能解决大多数情况。

## 包管理（apt）

Ubuntu 用 `apt`。装系统级软件就靠它。

```bash
sudo apt update             # Refresh the package list (always do this first)
sudo apt install -y htop    # Install a package (-y skips confirmation)
sudo apt install -y build-essential  # C compiler, make, etc. Needed by many Python packages
sudo apt install -y tmux    # Terminal multiplexer (keep sessions alive after disconnect)

apt list --installed        # What's installed?
sudo apt remove htop        # Uninstall
```

新 GPU 机器上常装的包：

```bash
sudo apt update && sudo apt install -y \
    build-essential \
    git \
    curl \
    wget \
    tmux \
    htop \
    unzip \
    python3-venv
```

## 用户与 sudo

你通常以普通用户登录。有些操作需要 root（管理员）权限。

```bash
whoami                      # What user am I?
sudo command                # Run a single command as root
sudo su                     # Become root (exit to go back, use sparingly)
```

云 GPU 实例上，你一般是唯一用户，且已经有 sudo 权限。但别什么都用 root 跑。只在需要时用 sudo。

## 进程与 systemd

训练卡住时，或需要看什么在跑：

```bash
htop                        # Interactive process viewer (q to quit)
ps aux | grep python        # Find running Python processes
kill 12345                  # Gracefully stop process with PID 12345
kill -9 12345               # Force kill (use when graceful doesn't work)
nvidia-smi                  # GPU processes and memory usage
```

systemd 管理服务（后台守护进程）。跑推理服务时会用到：

```bash
sudo systemctl start nginx          # Start a service
sudo systemctl stop nginx           # Stop it
sudo systemctl restart nginx        # Restart it
sudo systemctl status nginx         # Check if it's running
sudo systemctl enable nginx         # Start automatically on boot
```

## 磁盘空间

GPU 机器磁盘往往不大，模型和数据集很快就能塞满。

```bash
df -h                       # Disk usage for all mounted drives
df -h /home                 # Disk usage for /home specifically

du -sh *                    # Size of each item in current directory
du -sh ~/.cache             # Size of your cache (pip, huggingface models land here)
du -sh /data/checkpoints/   # Check how big your checkpoints are

# Find the biggest space hogs
du -h --max-depth=1 / 2>/dev/null | sort -hr | head -20
```

常见清理手段：

```bash
# Clear pip cache
pip cache purge

# Clear apt cache
sudo apt clean

# Remove old checkpoints you don't need
rm -rf checkpoints/epoch_01/ checkpoints/epoch_02/
```

## 网络

下载模型、传文件、调 API，都在命令行完成。

```bash
# Download files
wget https://example.com/model.bin                   # Download a file
curl -O https://example.com/data.tar.gz              # Same thing with curl
curl -s https://api.example.com/health | python3 -m json.tool  # Hit an API, pretty-print JSON

# Transfer files between machines
scp model.bin user@remote:/data/                     # Copy file to remote machine
scp user@remote:/data/results.csv .                  # Copy file from remote to local
scp -r user@remote:/data/checkpoints/ ./local-dir/   # Copy directory

# Sync directories (faster than scp for large transfers, resumes on failure)
rsync -avz --progress ./data/ user@remote:/data/
rsync -avz --progress user@remote:/results/ ./results/
```

大文件一律用 `rsync` 而不是 `scp`。它只传变化的字节，还能从断点续传。

## tmux：让会话活下去

SSH 进远程机器后，合上笔记本就会杀掉你的训练。tmux 能防止这一点。

```bash
tmux new -s train           # Start a new session named "train"
# ... start your training, then:
# Ctrl+B, then D            # Detach (training keeps running)

tmux ls                     # List sessions
tmux attach -t train        # Reattach to session

# Inside tmux:
# Ctrl+B, then %            # Split pane vertically
# Ctrl+B, then "            # Split pane horizontally
# Ctrl+B, then arrow keys   # Switch between panes
```

长时间训练任务一律放进 tmux。一定要。

## Windows 用户的 WSL2

如果你用 Windows，WSL2 能给你一个真正的 Linux 环境，无需双系统。

```bash
# In PowerShell (admin)
wsl --install -d Ubuntu-24.04

# After restart, open Ubuntu from Start menu
sudo apt update && sudo apt upgrade -y
```

WSL2 跑的是真正的 Linux 内核。本课的一切在它里面都适用。从 WSL 内部看，Windows 文件在 `/mnt/c/Users/YourName/`。

在 Windows 侧装好 NVIDIA 驱动后 GPU 直通即可用。装 Windows 版 NVIDIA 驱动（不是 Linux 版），CUDA 在 WSL2 里就可用了。

## 坑：macOS 到 Linux

从 macOS 过来会绊倒你的地方：

| macOS | Linux | 说明 |
|-------|-------|-------|
| `brew install` | `sudo apt install` | 包名有时不同。`brew install htop` 与 `sudo apt install htop` 一样，但 `brew install readline` 与 `sudo apt install libreadline-dev` 不是一回事。 |
| `open file.txt` | `xdg-open file.txt` | 但远程机器上没有 GUI。用 `cat` 或 `less`。 |
| `pbcopy` / `pbpaste` | 不可用 | SSH 下没有剪贴板管道。 |
| `~/.zshrc` | `~/.bashrc` | macOS 默认 zsh。多数 Linux 服务器用 bash。 |
| `/opt/homebrew/` | `/usr/bin/`、`/usr/local/bin/` | 可执行文件位置不同。 |
| `sed -i '' 's/a/b/' file` | `sed -i 's/a/b/' file` | macOS 的 sed 在 `-i` 后要一个空字符串。Linux 不要。 |
| 大小写不敏感文件系统 | 大小写敏感文件系统 | 在 Linux 上 `Model.py` 和 `model.py` 是两个文件。 |
| 行尾 `\n` | 行尾 `\n` | 一样。但 Windows 是 `\r\n`，会弄坏 bash 脚本。用 `dos2unix` 修复。 |

## 速查卡

```
Navigation:     pwd, ls, cd, find
Files:          cp, mv, rm, mkdir, cat, head, tail, less
Search:         grep, find
Permissions:    chmod, chown, sudo
Packages:       apt update, apt install
Processes:      htop, ps, kill, nvidia-smi
Services:       systemctl start/stop/restart/status
Disk:           df -h, du -sh
Network:        curl, wget, scp, rsync
Sessions:       tmux new/attach/detach
```

```figure
s0-process-fork
```

## 练习

1. SSH 进任意一台 Linux 机器（或打开 WSL2），导航到 home 目录。建一个项目文件夹，用 `touch` 在里面建三个空文件，再用 `ls -la` 列出来。
2. 用 apt 装 `htop`，运行它，找出哪个进程占内存最多。
3. 开一个 tmux 会话，在里面跑 `sleep 300`，detach、列出会话，再 reattach。
4. 用 `df -h` 查看可用磁盘空间，再用 `du -sh ~/.cache/*` 看看 cache 里什么占空间。
5. 用 `scp` 把一个文件从本地传到远程，再用 `rsync` 做同样的传输，比较两者的体验。
