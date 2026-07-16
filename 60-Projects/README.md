---
title: 60-Projects 说明
type: meta
date: <% tp.date.now("YYYY-MM-DD") %>
week: <% tp.date.now("YYYY-[W]ww") %>
tags:
  - daily
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
# <% tp.date.now("YYYY-MM-DD (dddd)") %>

## 🎯 今日聚焦

<!-- 今天最优先的 1-3 件事 -->

- [ ] 

## 📥 收件箱待处理

```dataview
TABLE file.cday as 收集日
FROM "00-Inbox"
WHERE file.cday < date("<% tp.date.now("YYYY-MM-DD") %>") AND file.cday >= date("<% tp.date.now("YYYY-MM-DD") %>") - dur(7 days)
SORT file.cday DESC
```

## ⏳ 待行动

```dataview
TASK
FROM "20-Actions"
WHERE !completed AND deadline = date("<% tp.date.now("YYYY-MM-DD") %>")
GROUP BY file.link
```

```dataview
TASK
FROM "20-Actions"
WHERE !completed AND deadline < date("<% tp.date.now("YYYY-MM-DD") %>")
GROUP BY file.link
```

## 📌 滚动待办
```dataview
TASK
FROM "01-Daily"
WHERE !completed AND file.day < date("<% tp.date.now("YYYY-MM-DD") %>")
GROUP BY file.link
```

## 📝 工作记录

## 🤔 思考 & 复盘

## 📎 随手记


```dataview
LIST
FROM "60-Projects"
WHERE file.name != "README"
SORT file.ctime DESC
```
