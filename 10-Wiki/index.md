# 📚 Wiki 索引

> 知识层总目录。LLM 维护，每次摄入后自动更新。

## 按分类

### 📖 概念

```dataview
TABLE date AS 创建日, source AS 来源
FROM "10-Wiki/概念"
SORT date DESC
```

### 🏢 实体

```dataview
TABLE date AS 创建日, source AS 来源
FROM "10-Wiki/实体"
SORT date DESC
```

### 📄 来源摘要

```dataview
TABLE date AS 日期
FROM "10-Wiki/来源"
SORT date DESC
```

## 全部条目

```dataview
TABLE date AS 整理日, status AS 状态
FROM "10-Wiki"
WHERE file.name != "index" AND file.name != "log" AND file.name != "README"
SORT date DESC
```
