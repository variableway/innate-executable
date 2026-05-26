# CC GLM5.1 教程

## Task 1: 清理目前所有的教程

1. 检查是否清理当前目前所有的教程数据
2. 检查是否删除所有进度
3. 检查是否删除所有用户数据
4. 启动应用进行人工检查

## Task 2:  安装Claude Code + GLM 5.1 + DeepSeek V4 教程

1. 创建安装Claude Code + GLM 5.1 + DeepSeek V4 教程
2. 需要使用code-helper需要加入到教程中
3. 生成一次性安装教程

## Task 3: please fix issue

```
Runtime Error



Page "/tutorial/[id]/page" is missing param "/tutorial/[id]" in "generateStaticParams()", which is required with "output: export" config.
```

## Task 4: please fix bug

```


1/1

Next.js 16.2.2 (stale)
Turbopack
Runtime Error



Page "/tutorial/[id]/page" is missing param "/tutorial/[id]" in "generateStaticParams()", which is required with "output: export" config.
Call Stack
15
Hide 15 ignore-listed frame(s)
<unknown>
../../node_modules/.pnpm/next@16.2.2_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/src/server/dev/next-dev-server.ts (850:21)
process.processTicksAndRejections
node:internal/process/task_queues (104:5)
async DevServer.renderToResponseWithComponentsImpl
../../node_modules/.pnpm/next@16.2.2_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/src/server/base-server.ts (2342:28)
async DevServer.renderPageComponent
../../node_modules/.pnpm/next@16.2.2_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/src/server/base-server.ts (2525:16)
async DevServer.renderToResponseImpl
../../node_modules/.pnpm/next@16.2.2_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/src/server/base-server.ts (2617:24)
async DevServer.pipeImpl
../../node_modules/.pnpm/next@16.2.2_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/src/server/base-server.ts (1793:21)
async NextNodeServer.handleCatchallRenderRequest
../../node_modules/.pnpm/next@16.2.2_@babel+core@7.29.0_react-dom@19.2.4_react@19.2.4__react@19.2.4/node_modules/next/src/server/next-server.ts (1174:7)
```

## Task 5: 教程Bash不能在运行

1. 教程Bash不能运行，需要修复
2. 修复教程Bash的代码，确保在当前环境下正常运行


## Task 6: 文件教程中的脚本不能运行

1. 文件教程中[text](../../playground/apps/desktop/public/skills/install-claude-code-glm5-deepseek-v4.md)Markdown格式中的脚本不能运行
2. 整个项目是希望可以运行Markdown中的Shell命名，如果Windows下面的环境也要能运行，教程中分开写不同的脚本
3. Markdown教程中点击脚本，右边出现脚本运行内容
4. ![alt text](image.png) 这个图片里面没有可以点击的按钮Run按钮，所以需要添加这个按钮

## Task 7: Run按钮需要同时支持MDX和MD文件

1. Run按钮需要同时支持MDX和MD文件的脚本
2. fix bug:
```
Error: [next-mdx-remote] error compiling MDX: Could not parse expression with acorn More information: https://mdxjs.com/docs/troubleshooting-mdx
```

## Task 8: WayToAGI to Tutorials

- https://waytoagi.feishu.cn/wiki/space/7226178700923011075?ccm_open_type=lark_wiki_spaceLink&open_tab_from=wiki_home 这个是wayToAGI的王章
- 如何使用AI工具可以把这个网站的教程内容批量转化为教程请调研，给出方案，主要是一个Pipeline，给pipeline里面每个步骤
都分析可能性，和可以使用的工具
- 商业化可行性分析也需要调研

## Task 9: 请调研如何把下面内容转为教程

- [hello-claw](../../references/hello-claw) Hello-Claw转化为教程
- [text](../../references/Path2AGI) Path2AGI转化为教程

教程需要可以分等级：
1. 完全小白使用的
2. 可以是中等水平的，有点点基础的
4. 高级/资深的不是这些教程的用户

## Task 10:  第一次运行命令，不执行这个命令
1. 第一次执行教程内容的时候不会在terminal中之执行命令
2. 需要执行每次都能够执行命令
3. 需要增加验证，确保命令能够正常执行

## Task 11: please Add install Kimi-cli 教程

1. 请添加安装kimi-cli教程
2. 请在教程中加入安装kimi-cli的命令安装脚本，同时支持MacOS和Windows

## Task 12: Please Add new basic tutorial for install nodejs

1. create base tutorial for nodejs installation with version management
2. 教程都是中文的，需要支持Mac/Windows
4. 需要有安装脚本保留，一次执行的，不需要手动操作，需要支持Mac/Windows

## Task 13: 请添加git教程
1. 请添加GIT教程，需要支持Mac/Windows
2. GIT教程主要就是安装这些命令行
3. 需要有安装脚本保留，一次执行的，不需要手动操作，需要支持Mac/Windows


## Task 14: 请Fix Bug

```sh
[next-mdx-remote] error compiling MDX: Could not parse expression with acorn More information: https://mdxjs.com/docs/troubleshooting-mdx
```
fix bug

## Task 15: 按照Reasearch 文件开始制作系列教程

[research](../research)这个里面有教程指南，请按照这个说明自作系列教程：
1. 制作系列教程，并且说明制作方法
2. 完成制作系列教程，检查展示成功，考虑如何和Python 结合使用，比如notebook

## Task 16: RunnableBlock Redesign
<RunnableCodeBlock code="python3 -c \"import math\n# 计算抛硬币的熵\ndef entropy(p):\n    if p ==
  0 or p == 1:\n        return 0\n    return -p * math.log2(p) - (1-p) *
  math.log2(1-p)\n\nprint('不同概率下的信息熵：')\nfor p in [0.5, 0.7, 0.9, 0.99, 1.0]:\n
  print(f'  正面概率={p:.0%} → 熵={entropy(p):.3f}
  bit')\nprint()\nprint('结论：越不确定，熵越高！')\"" language="python" />
  这种Rubnnable Block 似乎还是不够Markdown，是否code这块完全做成Markdown形式的
  不如下：
  <RunnableBlock>
```python
import math\n# 计算抛硬币的熵\ndef entropy(p):\n    if p ==
  0 or p == 1:\n        return 0\n    return -p * math.log2(p) - (1-p) *
  math.log2(1-p)\n\nprint('不同概率下的信息熵：')\nfor p in [0.5, 0.7, 0.9, 0.99, 1.0]:\n
  print(f'  正面概率={p:.0%} → 熵={entropy(p):.3f}
  bit')\nprint()\nprint('结论：越不确定，熵越高！')\"
```
  </RunnableBlock>

  Then Use Python to run these code?


## Task 17: AutoScan the code

```
 Update(src/lib/tutorial-scanner.ts)
  ⎿  Added 10 lines
      46    "install-kimi-cli": "/skills/install-kimi-cli.mdx",
      47    "install-nodejs": "/skills/install-nodejs.mdx",
      48    "install-git": "/skills/install-git.mdx",
      49 +  "openclaw-5min-experience": "/skills/openclaw-5min-experience.mdx",
      50 +  "openclaw-search-summarize": "/skills/openclaw-search-summarize.mdx",
      51 +  "openclaw-email-calendar": "/skills/openclaw-email-calendar.mdx",
      52 +  "openclaw-custom-skills": "/skills/openclaw-custom-skills.mdx",
      53 +  "ai-interdisciplinary-journey": "/skills/ai-interdisciplinary-journey.mdx",
      54 +  "ai-math-basics-part1": "/skills/ai-math-basics-part1.mdx",
      55 +  "ai-math-basics-part2": "/skills/ai-math-basics-part2.mdx",
      56 +  "ai-cognitive-science": "/skills/ai-cognitive-science.mdx",
      57 +  "ai-causal-inference": "/skills/ai-causal-inference.mdx",
      58 +  "ai-cybernetics-complexity": "/skills/ai-cybernetics-complexity.mdx",
      59  };
      60
      61  export const BUILTIN_SKILLS: SkillFile[] = [

⏺ Now add the new tutorial entries to BUILTIN_SKILLS:

  Reading 1 file… (ctrl+o to expand)
  ⎿  src/lib/tutorial-scanner.ts
```

- auto scan a given or pre-configured tutorial folder at the application startup
- not hard code in code? it is possible?
- then can add folder for scan, then tutorials updated
- please find a solution for this
- also make sure the web version could be deployed in github pages for static sites

## Task 18: Fix 多操作系统语言脚本不能展示问题

1. 多操作系统的shell/powershell 脚本不能使用
```
步骤 1：安装 Claude Code

macOS / Linux
Windows
如果官方脚本不可用，使用 npm 安装：
```
2. 整个Markdown 的Theme 有点沉闷，是否可以变成更温暖和亮一点的Theme

## Task 19: Test and Verify
1. Test Static site with github action
2. test local desktop version，please run it in local desktop

## Task 20: 课程管理中心修复

1. 课程管理中心问题，没有任何一个课程和技能相关，需要修复
2. 是否在auto discovery中完成这个？或者web的时候可以自动生成static 文件时候就完成
3. 部署GITHUB Pages，完善Github Action，确保每次push到main分支，都能自动部署到GITHUB Pages

## Task 21: 技能列表可以排序

1. 技能列表可以排序，可以移动进行排序并且保存


## Task 22: Fix Bug

```
> desktop@0.1.0 build /home/runner/work/innate-executable/innate-executable/playground/apps/desktop
> next build

⚠ No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache
Attention: Next.js now collects completely anonymous telemetry regarding usage.
This information is used to shape Next.js' roadmap and prioritize features.
You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
https://nextjs.org/telemetry

▲ Next.js 16.2.2 (Turbopack)

  Creating an optimized production build ...

> Build error occurred
Error: Turbopack build failed with 1 errors:
./packages/ui/src/index.ts:1:1
Module not found: Can't resolve './lib/utils'
> 1 | export * from "./lib/utils";
    | ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
  2 | export * from "./components/ui/accordion";
  3 | export * from "./components/ui/alert-dialog";
  4 | export * from "./components/ui/alert";



Import traces:
  Client Component Browser:
    ./packages/ui/src/index.ts [Client Component Browser]
    ./apps/desktop/src/app/tutorial/edit/client.tsx [Client Component Browser]
    ./apps/desktop/src/app/tutorial/edit/page.tsx [Client Component Browser]
    ./apps/desktop/src/app/tutorial/edit/page.tsx [Server Component]

  Client Component SSR:
    ./packages/ui/src/index.ts [Client Component SSR]
    ./apps/desktop/src/app/tutorial/edit/client.tsx [Client Component SSR]
    ./apps/desktop/src/app/tutorial/edit/page.tsx [Client Component SSR]
    ./apps/desktop/src/app/tutorial/edit/page.tsx [Server Component]

https://nextjs.org/docs/messages/module-not-found


    at <unknown> (./packages/ui/src/index.ts:1:1)
    at <unknown> (https://nextjs.org/docs/messages/module-not-found)
 ELIFECYCLE  Command failed with exit code 1.
```
Push to github ,action deploy pages failed.

## Task 23: 部署之后网站不能访问

1. https://variableway.github.io/innate-executable/ 不能访问一直加载中
2. 所有的js和css文件都不能访问，请检查是否时部署脚本问题并且修复


## Task 24: Create GITHUB RELEASE

1. Create Github Release for this session
2. Add all the changes logs into it .