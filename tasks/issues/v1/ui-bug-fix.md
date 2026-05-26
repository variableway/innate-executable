# UI Bug fix

## Task 1: Markdown  Content, Block 颜色太浅

```
text

sources:
  - name: "设计模式：可复用面向对象软件的基础"
    url: "https://book.douban.com/subject/1052241/"
    author: "Erich Gamma 等"
    type: "book"
    note: "第 3 章 创建型模式"
```

上面这种文本类型的代码快，但是颜色太浅，导致阅读困难。

## Task 2: Markdown Preview 没有ToC

1. 右侧需要有Markdown的ToC，点击可以跳转到对应位置。
2. 如果为了适配ToC， Markdown 内容的正文可以向左侧移动一下

## Task 3: Sidebar 宽度

1. Sidebar 宽度按有点宽，需要调整一下变窄一点
2. Sidebar整体可以折叠，点击可以展开

## Task 3:  当前是没有登陆用户的
1. 当前没有登陆用户，因此Sidebar最下面的用户登陆样子，可以先去点不展示
2. 设置页面的API Key当前只用Deepseek的API Key，不要使用Open API的方式

## Task 4:  创建系列之后，系统没有保存

1. 创建系列之后，系统没有保存系列
2. 使用需要保存序列，当前可以都保存到workspace下面的settings.json文件中

## Task 5: Bug Fix
```
countered two children with the same key, `01-source-attribution-example`. Keys should be unique so that components maintain their identity across updates. Non-unique keys may cause children to be duplicated and/or omitted — the behavior is unsupported and could change in a future version.
src/components/layout/app-sidebar.tsx (242:35) @ AppSidebar

  240 |
  241 |               {/* Ungrouped skills */}
> 242 |               {ungroupedSkills.map((skill) => (
      |                                   ^
  243 |                 <SidebarMenuItem key={skill.slug}>
  244 |                   <SidebarMenuButton
  245 |                     isActive={pathname === `/tutorial/${skill.slug}`}
Call Stack
22

``` 
这个问题需要修复

## Task 6: 教程只有2个，但是统计变成了3个

1. 在教程中心有三个教程，实际只有2个， 请修复这个统计问题

## Task 7: 确保所有的教程都有一个唯一的slug
1. 每个教程的slug都需要是唯一的，不能重复
2. 如果重复了，需要修复
3. 同时所有的系列，和教程的关系，先都保存的settings.json文件中
4. 如果可以方便的使用SQLite，可以先做一次这个调研，如果可以用pocketbase，golang版本做，可以接受；如果rust做也很快，那也就可以接受

## Task 8:  学习工作台

1. 当前学习工作台看起来都是Mock的
2. 请说明一下当前学习工作台的功能写入到文档中