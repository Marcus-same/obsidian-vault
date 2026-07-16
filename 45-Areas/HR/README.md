---
title: HR 领域
type: area
---

# 👥 HR 领域

## 范围
- 招聘全流程
- 培训安排与管理
- HRBP 相关
- 员工关系

## 行动卡
```dataview
TASK
FROM "20-Actions"
WHERE area = "HR"
```

## Wiki
```dataview
LIST
FROM "10-Wiki"
WHERE contains(file.tags, "HR")
```
