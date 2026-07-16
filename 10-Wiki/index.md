# Wiki 索引

> 自动维护，记录 Wiki 条目的创建和更新。

```dataview
TABLE date as 整理日期, status as 状态
FROM "10-Wiki"
WHERE file.name != "index" AND file.name != "log" AND file.name != "README"
SORT date DESC
```
