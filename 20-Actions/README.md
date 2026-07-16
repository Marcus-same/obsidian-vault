---
title: 20-Actions 使用说明
type: meta
---

# ⏳ 行动卡

## 用途

可执行的待办任务，从 Wiki 或收件箱中提炼而来。

> 每条行动卡 = 一个明确的、可执行的动作。

## 卡片字段
- **deadline**：截止日期（逾期会自动标红）
- **priority**：高/中/低
- **status**：待行动 / 进行中 / 已完成 / 已搁置
- **source**：来源 Wiki 或收件箱

## 创建方式
1. 📝 **手动**：在 `20-Actions` 新建，自动套用行动卡模板
2. 🤖 **告诉我**："从这条 Wiki 生成行动卡"
3. ⚡ **快捷键**（在 Wiki 笔记上）：运行 Templater 脚本 `create-action`

## 每日查看

日记顶部已集成 Dataview 查询，自动显示：
- 今天到期的行动卡
- 已逾期的行动卡

```dataview
TABLE deadline, priority, status
FROM "20-Actions"
SORT deadline ASC
```
