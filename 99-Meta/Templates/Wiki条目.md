---
title: "<% tp.file.title %>"
type: wiki
date: <% tp.date.now("YYYY-MM-DD") %>
source: 
source_path: 
status: 待整理
tags: [wiki]
importance: ⭐⭐
---

# <% tp.file.title %>

## 一句话总结

<!-- 50字内概括这条知识的核心 -->

## 整理自

<!-- 链接回原始素材，保留来源路径 -->

```dataview
LIST
FROM "00-Inbox"
WHERE contains(file.name, "<% tp.file.title %>")
SORT file.ctime DESC
```

## 核心内容

- 

## 我的理解 / 应用场景

- 

## 关联行动

```dataview
TASK
FROM "20-Actions"
WHERE contains(source, "<% tp.file.title %>")
```

## 关联 Wiki

- [[]]
