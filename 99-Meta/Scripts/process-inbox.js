/**
 * 自动整理收件箱 → Wiki
 *
 * 增强版：自动提取内容、保留来源、标记状态
 * 使用方式：在收件箱文件上运行此脚本
 */
async function processInbox(tp) {
    const activeFile = tp.config.target_file;
    if (!activeFile) {
        new Notice("⚠️ 请先打开一个收件箱条目");
        return;
    }

    if (!activeFile.path.startsWith("00-Inbox")) {
        new Notice("⚠️ 请在 00-Inbox 中打开一个文件");
        return;
    }

    const fileName = activeFile.basename;
    const content = await app.vault.read(activeFile);

    // 从内容中提取关键信息
    const lines = content.split("\n");
    const firstLine = lines.find(l => l.trim() && !l.startsWith("---") && !l.startsWith("title:"));
    const summary = firstLine ? firstLine.replace(/^#+\\s*/, "").trim() : fileName;

    // 检查 Wiki 是否已存在
    const wikiPath = `10-Wiki/${fileName}.md`;
    const existing = app.vault.getAbstractFileByPath(wikiPath);
    if (existing) {
        // 如果存在，追加来源链接
        new Notice(`ℹ️ Wiki 条目已存在，已补充来源链接`);
        // 在 Wiki 中追加来源引用
        const wikiContent = await app.vault.read(existing);
        if (!wikiContent.includes(activeFile.path)) {
            const updatedContent = wikiContent.replace(
                "## 整理自",
                `## 整理自\n\n- [[${activeFile.path.replace(".md", "")}|${fileName}]] (${tp.date.now("YYYY-MM-DD")})`
            );
            await app.vault.modify(existing, updatedContent);
        }
        return;
    }

    // 自动提取标签
    const tags = ["wiki"];
    const hrKeywords = ["招聘", "面试", "候选人", "JD", "offer", "入职", "培训", "社保", "薪酬", "绩效", "hr", "HR"];
    const techKeywords = ["AI", "python", "代码", "工具", "script", "自动化", "开发", "git"];
    const lowerContent = content.toLowerCase();
    if (hrKeywords.some(k => lowerContent.includes(k))) tags.push("HR");
    if (techKeywords.some(k => lowerContent.includes(k))) tags.push("技术工具");

    // 自动提取链接
    const urlRegex = /https?:\\/\\/[^\\s\\)\\]]+/g;
    const urls = content.match(urlRegex) || [];

    // 创建 Wiki 条目
    let wikiContent = `---
title: "${fileName}"
type: wiki
date: ${tp.date.now("YYYY-MM-DD")}
source: ${activeFile.path}
status: 新建
tags: [${tags.join(", ")}]
---

# ${summary}

## 一句话总结

<!-- 50 字内概括 -->

## 整理自

- [[${activeFile.path.replace(".md", "")}|${fileName}]]
`;

    if (urls.length > 0) {
        wikiContent += `\n## 原始链接\n\n`;
        urls.forEach(url => {
            wikiContent += `- ${url}\n`;
        });
    }

    wikiContent += `
## 核心内容

-

## 我的理解 / 应用场景

-

## 关联行动

- [ ]
`;

    await app.vault.create(wikiPath, wikiContent);

    // 更新原收件箱文件状态
    const updatedInbox = content.includes("status:")
        ? content.replace(/status:.*/, "status: 已整理")
        : content + "\n\n---\n> 已于 " + tp.date.now("YYYY-MM-DD HH:mm") + " 整理为 Wiki";

    await app.vault.modify(activeFile, updatedInbox);

    new Notice(`✅ Wiki 条目已创建: ${fileName}`);
}

module.exports = processInbox;
