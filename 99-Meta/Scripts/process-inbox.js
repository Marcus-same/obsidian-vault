/**
 * 整理收件箱 → 生成 Wiki 条目
 *
 * 使用方式：在收件箱条目上运行此脚本（通过 Templater 或快捷键）
 *
 * 作用：
 * 1. 读取当前收件箱条目
 * 2. 在 10-Wiki 创建对应的 Wiki 条目
 * 3. 更新原收件箱条目的状态
 */
async function processInbox(tp) {
    const activeFile = tp.config.target_file;
    if (!activeFile) {
        new Notice("请先打开一个收件箱条目");
        return;
    }

    // 检查是否在收件箱中
    const inboxPath = activeFile.path;
    if (!inboxPath.startsWith("00-Inbox")) {
        new Notice("请先在 00-Inbox 中打开一个文件");
        return;
    }

    const fileName = activeFile.basename;
    const content = await app.vault.read(activeFile);

    // 在 10-Wiki 创建对应条目
    const wikiPath = `10-Wiki/${fileName}.md`;
    const existing = app.vault.getAbstractFileByPath(wikiPath);
    if (existing) {
        new Notice(`Wiki 条目已存在: ${fileName}`);
        return;
    }

    // 创建 Wiki 条目
    await app.vault.create(wikiPath, `---
title: "${fileName}"
type: wiki
date: ${tp.date.now("YYYY-MM-DD")}
source: ${activeFile.path}
status: 待整理
tags: [wiki]
---

# ${fileName}

## 整理自

- [[${activeFile.path.replace(".md", "")}|${fileName}]]

## 核心内容

<!-- 从收件箱中提取要点 -->

## 我的理解

`);
    new Notice(`✅ Wiki 条目已创建: ${fileName}`);
}

module.exports = processInbox;
