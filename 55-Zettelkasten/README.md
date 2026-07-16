---
title: 55-Zettelkasten 说明
type: meta
---

# 💡 永久笔记（Zettelkasten）

## 用途
经过深度思考后的永久性知识卡片。

> 每条笔记一个概念，用自己的话写，链接到其他笔记。

## 子目录
- `Literature/` — 文献笔记（读别人内容时的笔记）
- `Permanent/` — 永久笔记（自己的思考产物）

## 创建方式
使用模板 `知识卡片` 创建。

## 关联
- 闪念笔记 → `00-Inbox/`
- 文献笔记 → `99-Meta/Templates/文献笔记.md`

```dataview
LIST
FROM "55-Zettelkasten"
WHERE file.name != "README"
SORT file.ctime DESC
```
