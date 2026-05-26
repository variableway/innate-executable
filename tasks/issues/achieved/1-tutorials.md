# Tutorials

## Task 1: 清理目前所有的教程

### ✅ 1. 清理目前所有的教程

#### MDX / Markdown 教程文件
已删除 `playground/apps/desktop/public/tutorials/` 下的所有教程内容文件：
- **27 个** `.mdx` / `.md` 文件（含 `openclaw-quickstart`、`exec-helloclaw`、`terminal-basics`、`vibe-coding` 等子目录下的教程）
- **3 个** `_course.json` 课程定义文件
- 已清理所有空子目录

#### JSON / JS 教程定义
- `playground/apps/desktop/src/lib/tutorial-scanner.ts`
  - `BUILTIN_COURSES` → 清空为 `[]`
  - `BUILTIN_SKILL_PATHS` → 清空为 `{}`
  - `scanBuiltin()` → 返回 `{ courses: [], skills: [] }`

#### 其他教程数据
- `.local-workflow.state.json` → 已删除
- `docs/guides/` 下的用户文档未删除（属于项目指南，非应用内教程）

---

### ✅ 2. 删除所有进度

#### 应用状态（Store）
`playground/apps/desktop/src/store/useAppStore.ts`：
- 初始状态已为空的数组：`skills: []`, `courses: []`, `discoveredSkills: []`, `discoveredCourses: []`
- 初始进度已为空对象：`progress: {}`
- **Persist 配置修改**：
  - 存储名称从 `innate-playground-storage` 改为 `innate-playground-storage-v2`（跳过旧存储数据）
  - `partialize` 中移除 `progress` 字段，不再持久化进度

#### 持久化存储
| 存储位置 | 操作 |
|----------|------|
| Tauri 应用数据目录 (`~/Library/Application Support/com.innate.playground/`) | 已删除 |
| Tauri Store 文件 (`innate-playground-store*.bin`) | 已删除 |
| Chrome localStorage (`leveldb`) | 无 innate 数据残留 |

---

### 📋 清理清单

```
□ 删除 public/tutorials/ 下所有 .md/.mdx 文件      ✅ 27 个
□ 删除 _course.json 课程定义                         ✅ 3 个
□ 清空 tutorial-scanner.ts 内置数据                  ✅
□ 删除 .local-workflow.state.json                    ✅
□ 清空 store 初始状态                                ✅ (已为空)
□ 修改 persist 配置（跳过旧数据 + 不保存 progress）   ✅
□ 删除 Tauri 应用数据目录                            ✅
□ 删除 Tauri Store 持久化文件                        ✅
```

---

### 🔄 下一步

重启应用后，所有教程和进度将完全清空。如需重新添加教程，可将 `.md`/`.mdx` 文件放入工作区的 `skills/` 或 `lessons/` 目录，通过「工作区」功能自动扫描导入。
