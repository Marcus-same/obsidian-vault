/**
 * Obsidian 启动检查 + 自动创建今日日记
 *
 * 自动运行（通过 Templater startup_templates）
 * 1. 创建今日日记（如不存在），自动套用每日笔记模板
 * 2. 检查：逾期行动卡、今日到期、收件箱积压
 */
async function startupCheck(tp) {
    const today = tp.date.now("YYYY-MM-DD");
    const dailyPath = `01-Daily/${today}.md`;

    // 1. 自动创建今日日记（如不存在）
    let dailyFile = tp.app.vault.getAbstractFileByPath(dailyPath);
    if (!dailyFile) {
        const templateFile = tp.app.vault.getAbstractFileByPath("99-Meta/Templates/每日笔记.md");
        if (templateFile) {
            let templateContent = await tp.app.vault.read(templateFile);
            // 手动替换 Templater 变量（startup_templates 里 tp.file 不可用）
            templateContent = templateContent
                .replace(/<% tp\.date\.now\("YYYY-MM-DD"\) %>/g, today)
                .replace(/<% tp\.date\.now\("YYYY-MM-DD \(dddd\)"\) %>/g, today);
            await tp.app.vault.create(dailyPath, templateContent);
        } else {
            await tp.app.vault.create(dailyPath, `# ${today}\n`);
        }
    }

    // 2. 检查 20-Actions 逾期和今日到期
    const actions = app.vault.getFiles().filter(f =>
        f.path.startsWith("20-Actions/") && f.name.endsWith(".md") && f.name !== "README.md"
    );

    let overdue = [];
    let dueToday = [];

    for (const file of actions) {
        const content = await app.vault.read(file);
        const deadlineMatch = content.match(/deadline:\s*(\d{4}-\d{2}-\d{2})/);
        const statusMatch = content.match(/status:\s*(.+)/);

        if (!deadlineMatch || (statusMatch && statusMatch[1].trim() === "已完成")) continue;

        const deadline = deadlineMatch[1];

        if (deadline < today) {
            overdue.push({ name: file.basename, deadline });
        } else if (deadline === today) {
            dueToday.push({ name: file.basename });
        }
    }

    // 3. 检查收件箱积压
    const inboxItems = app.vault.getFiles().filter(f =>
        f.path.startsWith("00-Inbox/") && f.name.endsWith(".md") && f.name !== "README.md"
    );

    // 4. 组装提醒消息
    let messageParts = [];
    if (overdue.length > 0) {
        messageParts.push(`🔴 ${overdue.length} 条待办已逾期！`);
    }
    if (dueToday.length > 0) {
        messageParts.push(`🟡 ${dueToday.length} 条待办今日到期`);
    }
    if (inboxItems.length > 0) {
        messageParts.push(`📥 收件箱还有 ${inboxItems.length} 条未整理`);
    }

    if (messageParts.length > 0) {
        new Notice(`📋 开工提醒\n${messageParts.join("\n")}`, 8000);
    } else {
        new Notice(`✅ 一切正常，开工愉快！`, 3000);
    }
}

module.exports = startupCheck;
