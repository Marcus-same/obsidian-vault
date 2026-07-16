/**
 * 快速捕获 → 收件箱
 *
 * 对话框快速输入，自动生成收件箱条目
 * 使用方式：从 Obsidian 命令面板运行
 */
async function quickCapture(tp) {
    // 弹窗输入标题
    const title = await tp.system.prompt("📥 标题 / 关键词", "");
    if (!title) {
        new Notice("已取消");
        return;
    }

    // 弹窗输入内容
    const note = await tp.system.prompt("📝 内容（可留空后续补充）", "");

    // 选择来源类型
    const sourceType = await tp.system.suggester(
        ["💡 想法", "🔗 文章/链接", "👤 候选人", "📋 待办", "📎 其他"],
        ["想法", "文章", "候选人", "待办", "其他"],
        true, "来源类型"
    );

    // 生成文件名
    const now = tp.date.now("YYYYMMDDHHmmss");
    const safeTitle = title.replace(/[\\/:*?"<>|]/g, "_").slice(0, 40);
    const fileName = `Inbox-${safeTitle}`;
    const filePath = `00-Inbox/${fileName}.md`;

    // 检查是否存在
    const existing = app.vault.getAbstractFileByPath(filePath);
    if (existing) {
        new Notice(`已存在同名收件箱条目`);
        return;
    }

    let tags = ["inbox"];
    if (sourceType === "候选人") tags.push("candidate");
    if (sourceType === "想法") tags.push("idea");

    const content = `---
title: "${title}"
type: inbox
source_type: ${sourceType}
date: ${tp.date.now("YYYY-MM-DD")}
time: ${tp.date.now("HH:mm")}
tags: [${tags.join(", ")}]
status: 待整理
---

# ${title}

${note ? `\n${note}\n` : "\n<!-- 后续补充内容 -->\n"}
`;

    await app.vault.create(filePath, content);

    new Notice(`✅ 已捕获 → 00-Inbox/${fileName}.md`);
}

module.exports = quickCapture;
