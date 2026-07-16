---
title: 88-Archive 说明
type: meta
---

# 🗄️ 归档

## 用途
已完成项目、过期资料的存放地。

> 归档不代表删除，需要时还能找回来。

```dataview
LIST
FROM "88-Archive"
WHERE file.name != "README"
SORT file.ctime DESC
```
