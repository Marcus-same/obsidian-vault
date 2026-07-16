---
title: 41-Candidates 说明
type: meta
---

# 👤 候选人管理

## 用途
候选人档案、跟踪状态。

## 命名规范
`[姓名]_[岗位]_[日期].md`

## 状态
- 📥 待筛选
- 📞 待沟通
- 🎙️ 待面试
- ✅ 已通过
- ❌ 已淘汰
- 📄 已发 Offer

## 关联
- 面试记录 → `40-Interview/`
- 跟进任务 → `20-Actions/`

```dataview
TABLE file.frontmatter.status as 状态, file.frontmatter.position as 岗位
FROM "41-Candidates"
SORT file.ctime DESC
```
