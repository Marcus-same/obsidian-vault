/**
 * 同步每日任务 → 20-Actions 行动卡
 *
 * 功能：
 * 1. 今日已完成的任务 → 对应行动卡 status 改为"已完成"
 * 2. 今日未完成的任务 → 对应行动卡 deadline 设为今天
 *
 * 使用方式：按快捷键或 Ctrl+P 搜"Templater: Sync actions"
 */
async function syncActions(tp) {
    const today = new Date();
    const dateStr = tp.date.now("YYYY-MM-DD");
    const dailyPath = `01-Daily/${dateStr}.md`;

    // 1. 读取今日日记
    const dailyFile = tp.app.vault.getAbstractFileByPath(dailyPath);
    if (!dailyFile) {
        new Notice("⚠️ 今天还没写日记，先创建日记");
        return;
    }

    const content = await tp.app.vault.read(dailyFile);
    const lines = content.split("\n");

    // 2. 找到所有任务行（含 [[20-Actions/ 的）
    const taskRegex = /-\s*\[(.)\]\s*\[\[20-Actions\/(.+?)(?:\||\]\])/g;
    let match;
    let updatedCount = 0;
    let deadlineCount = 0;

    while ((match = taskRegex.exec(content)) !== null) {
        const checked = match[1] === "x";
        const actionFileName = match[2].replace(/\.md$/, "");

        // 找到对应的行动卡文件
        const actionPath = `20-Actions/${actionFileName}.md`;
        const actionFile = tp.app.vault.getAbstractFileByPath(actionPath);
        if (!actionFile) continue;

        let actionContent = await tp.app.vault.read(actionFile);
        let modified = false;

        if (checked) {
            // 已勾选 → 更新 status 为已完成
            const statusRegex = /^status:.*/m;
            if (statusRegex.test(actionContent)) {
                actionContent = actionContent.replace(statusRegex, "status: 已完成");
                modified = true;
            }
        } else {
            // 未勾选 → 如果还没有 deadline，设为今天
            const deadlineRegex = /^deadline:\s*$/m;
            if (deadlineRegex.test(actionContent)) {
                actionContent = actionContent.replace(deadlineRegex, `deadline: ${dateStr}`);
                deadlineCount++;
                modified = true;
            }
        }

        if (modified) {
            await tp.app.vault.modify(actionFile, actionContent);
            updatedCount++;
        }
    }

    new Notice(`✅ 同步完成：${updatedCount} 条已更新（含 ${deadlineCount} 条设定了截止日期）`);
}

module.exports = syncActions;
