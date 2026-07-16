/**
 * 从 Wiki / 任意笔记 自动生成行动卡
 *
 * 增强版：自动分析内容提取任务、智能建议截止日期
 * 使用方式：在 Wiki / 收件箱 / 日记文件上运行
 */
async function createAction(tp) {
    const activeFile = tp.config.target_file;
    if (!activeFile) {
        new Notice("⚠️ 请先打开一个文件");
        return;
    }

    const fileName = activeFile.basename;
    const content = await app.vault.read(activeFile);
    const lines = content.split("\n");

    // 提取已有任务
    const existingTasks = [];
    let inTaskList = false;
    for (const line of lines) {
        const match = line.match(/^- \[ \]\s*(.+)/);
        if (match) {
            existingTasks.push(match[1].trim());
            inTaskList = true;
        }
    }

    // 从内容中判断优先级
    const lowerContent = content.toLowerCase();
    let suggestedPriority = "中";
    const highKeywords = ["紧急", "urgent", "今天", "明天", "deadline", "截止", "必须", "重要", "ddl", "due"];
    const lowKeywords = ["有空", "someday", "maybe", "以后", "考虑"];
    if (highKeywords.some(k => lowerContent.includes(k))) suggestedPriority = "高";
    if (lowKeywords.some(k => lowerContent.includes(k))) suggestedPriority = "低";

    // 从内容判断所属领域
    const hrKeywords = ["招聘", "面试", "候选人", "JD", "offer", "入职", "培训", "社保", "薪酬", "绩效"];
    const techKeywords = ["AI", "python", "代码", "工具", "开发", "git", "自动化", "obsidian"];
    let suggestedArea = "";
    if (hrKeywords.some(k => lowerContent.includes(k))) suggestedArea = "HR";
    if (techKeywords.some(k => lowerContent.includes(k))) suggestedArea = "技术工具";

    // 智能建议截止日期（检测内容中的日期）
    const dateRegex = /(\d{1,2})[\/月](\d{1,2})[日号]?/g;
    let suggestedDeadline = tp.date.now("YYYY-MM-DD", 7);
    let dateMatch;
    while ((dateMatch = dateRegex.exec(content)) !== null) {
        const month = parseInt(dateMatch[1]);
        const day = parseInt(dateMatch[2]);
        if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            const year = tp.date.now("YYYY");
            const foundDate = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            if (foundDate > tp.date.now("YYYY-MM-DD")) {
                suggestedDeadline = foundDate;
                break;
            }
        }
    }

    // 行动卡路径
    const actionPath = `20-Actions/${fileName}.md`;
    const existing = app.vault.getAbstractFileByPath(actionPath);
    if (existing) {
        new Notice(`ℹ️ 行动卡已存在: ${fileName}`);
        return;
    }

    // 生成行动卡内容
    let actionContent = `---
title: "${fileName}"
type: action
date: ${tp.date.now("YYYY-MM-DD")}
deadline: ${suggestedDeadline}
priority: ${suggestedPriority}
status: 待行动
source: ${fileName}
source_type: wiki
area: ${suggestedArea}
---

# ${fileName}

## 做什么
`;

    if (existingTasks.length > 0) {
        existingTasks.forEach(task => {
            actionContent += `- [ ] ${task}\n`;
        });
    } else {
        actionContent += `- [ ] \n`;
    }

    actionContent += `
## 为什么做

源自：[[${fileName}]]

## 分解步骤

- [ ]
- [ ]
- [ ]

## 自动识别信息

- 建议优先级：${suggestedPriority}
- 建议截止日期：${suggestedDeadline}
- 所属领域：${suggestedArea || "未识别"}
`;

    await app.vault.create(actionPath, actionContent);

    new Notice(`✅ 行动卡已创建: ${fileName}
  优先级: ${suggestedPriority} | 截止: ${suggestedDeadline}`);
}

module.exports = createAction;
