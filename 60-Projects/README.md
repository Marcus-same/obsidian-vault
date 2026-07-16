---
title: 60-Projects 说明
type: meta
---

# 📁 项目

## 用途

有明确目标和截止时间的项目。

> 每个项目一个文件夹，含项目笔记 + 子任务。

## 示例（HR 场景）
- 校招项目
- 培训体系搭建
- 招聘数据分析工具开发
- 入职流程优化

## 项目笔记结构
每个项目建议创建一篇 `README.md` 说明：
- 目标
- 关键节点/里程碑
- 相关 Wiki
- 相关行动卡

```dataview
LIST
FROM "60-Projects"
WHERE file.name != "README"
SORT file.ctime DESC
```
