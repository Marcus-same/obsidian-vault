/**
 * 从 Wiki 生成行动卡
 *
 * 使用方式：在 Wiki 条目上运行此脚本
 *
 * 作用：
 * 1. 读取当前 Wiki 条目
 * 2. 在 20-Actions 创建对应的行动卡
 * 3. 设定默认截止日期
 */
async function createAction(tp) {
    const activeFile = tp.config.target_file;
    if (!activeFile) {
        new Notice("请先打开一个 Wiki 条目");
        return;
    }

    if (!activeFile.path.startsWith("10-Wiki")) {
        new Notice("请在 10-Wiki 中打开一个文件");
        return;
    }

    const fileName = activeFile.basename;
    const actionPath = `20-Actions/${fileName}.md`;
    const existing = app.vault.getAbstractFileByPath(actionPath);
    if (existing) {
        new Notice(`行动卡已存在: ${fileName}`);
        return;
    }

    // 默认截止日期为 7 天后
    const deadline = tp.date.now("YYYY-MM-DD", 7);

    await app.vault.create(actionPath, `---
title: "${fileName}"
type: action
date: ${tp.date.now("YYYY-MM-DD")}
deadline: ${deadline}
priority: 中
status: 待行动
source: ${fileName}
source_type: wiki
area:
---

# ${fileName}

## 做什么

- [ ]

## 为什么做

源自：[[]]

## 分解步骤

- [ ]
- [ ]
- [ ]
`);
    new Notice(`✅ 行动卡已创建: ${fileName}`);
}

module.exports = createAction;
