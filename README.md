---
title: Vault 使用说明
tags: [meta]
date: 2026-06-08
---

# Obsidian 个人知识库 — 使用说明

## 快速开始

1. 打开 Obsidian → 打开仓库 → 选择 `D:\obsidian-vault`
2. 确保已启用社区插件（设置 → 第三方插件 → 关闭安全模式）

## 目录结构

| 目录 | 用途 | 什么时候放这里 |
|------|------|---------------|
| **00-Inbox** | 默认新笔记入口 | 来不及整理的快速捕获 |
| **01-Projects** | 有截止日期的项目 | 专项招聘、培训方案、小程序开发 |
| **02-Areas/HR** | HR 各模块 | 持续积累的专业知识 |
| **02-Areas/技术工具** | 工具和方法 | AI 工具、自动化脚本 |
| **02-Areas/个人成长** | 自我提升 | 沟通、职业规划 |
| **03-Resources** | 系统性学习 + MOC | 教程、专题笔记、知识地图 |
| **04-Archive** | 完成/废弃的内容 | 过时的项目、不再维护的笔记 |
| **05-Zettelkasten/Literature** | 文献笔记 | 用自己的话转述外部内容 |
| **05-Zettelkasten/Permanent** | 永久笔记 | 提炼后的原子化知识点 |
| **Daily** | 每日笔记 | 自动生成，当日工作台 |
| **99-Meta/Templates** | 模板文件夹 | 不存放实际笔记 |

## 6 种笔记模板

| 模板 | 快捷键建议 | 用于 |
|------|-----------|------|
| 每日笔记 | 自动生成 | 每天的计划、记录、复盘 |
| 知识卡片 | Ctrl+Shift+K | 一般知识条目（最常用） |
| 闪念笔记 | Ctrl+Shift+Q | 快速捕捉想法 |
| 文献笔记 | Ctrl+Shift+L | 转述文章/视频/书的内容 |
| MOC | Ctrl+Shift+M | 创建主题索引地图 |
| 项目笔记 | Ctrl+Shift+P | 管理具体项目 |

## 日常工作流

### 每天（10 分钟）
```
早上打开 Obsidian → 自动生成每日笔记
    → 写今日三件事
    → 随时用 QuickAdd 闪念捕获

晚上 → 清理 Inbox
    → 闪念整理成知识卡片
    → 补充每日复盘
```

### 每周（30 分钟）
- 回顾本周笔记，补双向链接 `[[]]`
- Inbox 清空
- 有价值的笔记提炼为永久笔记

### 每月（30 分钟）
- 用 Dataview 扫孤立笔记
- 更新 MOC 知识地图
- 归档过期内容到 04-Archive

## 和 Claude Code 配合

```
"帮我把这篇公众号文章入库"
    → Claude 自动生成 .md 到 00-Inbox/
    → 你手动整理分类
    → 补充自己的思考
```

## 命名规范

- 知识笔记：`主题描述.md`（如 `结构化面试的STAR追问技巧.md`）
- 项目笔记：`项目名.md`
- 文献笔记：`文献笔记 - 来源.md`
- MOC：`📋 主题名.md`

## 建议安装的社区插件

（等熟悉后再装，不用一次性全上）

1. **Templater** — 模板增强（日期、文件操作）
2. **QuickAdd** — 快速捕获入口
3. **Dataview** — 数据查询，如 `LIST WHERE importance = "⭐⭐⭐"`
4. **Smart Connections** — AI 语义关联推荐

## 从旧知识库迁移

现有 `D:\first-cc\knowledge-base\` 的内容按分类搬：

- `hr/` → `02-Areas/HR/`
- `tools/` → `02-Areas/技术工具/`
- `growth/` → `02-Areas/个人成长/`
- `conventions/` → `02-Areas/` 对应子目录
- `projects/` → `01-Projects/`
- `archive/` → `04-Archive/`
- `reading/` → `03-Resources/`
- `life/` → `02-Areas/个人成长/`
- `tech/` → `03-Resources/`

建议每天搬 5 篇，顺便重读和补链接。
