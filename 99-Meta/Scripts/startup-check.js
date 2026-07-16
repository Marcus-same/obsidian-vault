/**
 * Obsidian 启动检查
 *
 * 自动运行（通过 Templater startup_templates）
 * 检查：逾期行动卡、今日到期、收件箱积压
 */
async function startupCheck(tp) {
    // 检查 20-Actions 逾期和今日到期
    const actions = app.vault.getFiles().filter(f =>
        f.path.startsWith("20-Actions/") && f.name.endsWith(".md") && f.name !== "README.md"
    );

    const today = tp.date.now("YYYY-MM-DD");
    let overdue = [];
    let dueToday = [];

    for (const file of actions) {
        const content = await app.vault.read(file);
        const deadlineMatch = content.match(/deadline:\s*(\d{4}-\d{2}-\d{2})/);
        const statusMatch = content.match(/status:\s*(.+)/);

        if (!deadlineMatch || (statusMatch && statusMatch[1].trim() === "已完成")) continue;

        const deadline = deadlineMatch[1];
        const name = file.basename;

        if (deadline < today) {
            overdue.push({ name, deadline });
        } else if (deadline === today) {
            dueToday.push({ name });
        }
    }

    // 检查收件箱积压
    const inboxItems = app.vault.getFiles().filter(f =>
        f.path.startsWith("00-Inbox/") && f.name.endsWith(".md") && f.name !== "README.md" && f.name !== "🏠 首页.md"
    );

    // 组装提醒消息
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
