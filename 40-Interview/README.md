---
title: 40-Interview 说明
type: meta
---

# 🎙️ 面试记录

## 用途
每场面试的记录和评估。

## 创建方式
使用模板 `面试记录` 创建。

## 关联
- 候选人档案 → `41-Candidates/`
- 面试题库 → `10-Wiki/`
- 面试安排 → `20-Actions/`

```dataview
TABLE date as 面试日期, file.frontmatter.candidate as 候选人
FROM "40-Interview"
SORT date DESC
```
