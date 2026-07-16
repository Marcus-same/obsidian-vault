/**
 * 候选人 → 自动生成跟进行动卡
 *
 * 在候选人档案上运行，自动生成面试安排、Offer 等行动卡
 */
async function candidateFollowup(tp) {
    const activeFile = tp.config.target_file;
    if (!activeFile) {
        new Notice("⚠️ 请先打开一个候选人档案");
        return;
    }

    if (!activeFile.path.startsWith("41-Candidates")) {
        new Notice("⚠️ 请在 41-Candidates 中打开一个文件");
        return;
    }

    const name = activeFile.basename;
    const content = await app.vault.read(activeFile);

    // 解析候选人信息
    const positionMatch = content.match(/position:\s*(.+)/);
    const position = positionMatch ? positionMatch[1].trim() : "待定";

    // 选择下一步操作
    const action = await tp.system.suggester(
        ["📞 电话沟通", "🎙️ 约初面", "🎙️ 约二面", "📄 发 Offer", "❌ 淘汰", "📅 安排入职"],
        ["call", "first_interview", "second_interview", "offer", "reject", "onboard"],
        true, "选择下一步操作"
    );

    if (!action) {
        new Notice("已取消");
        return;
    }

    // 根据操作类型生成行动卡
    const actionMap = {
        call: {
            title: `${name}——电话沟通`,
            deadline: "3",
            priority: "高",
            tasks: [`联系 ${name} 进行电话沟通`, "记录沟通结果"],
        },
        first_interview: {
            title: `${name}——约初面`,
            deadline: "7",
            priority: "高",
            tasks: [`联系 ${name} 约初面时间`, "协调面试官", "准备面试问题"],
        },
        second_interview: {
            title: `${name}——约二面`,
            deadline: "7",
            priority: "高",
            tasks: [`联系 ${name} 约二面时间`, "协调二面面试官"],
        },
        offer: {
            title: `${name}——发 Offer`,
            deadline: "3",
            priority: "高",
            tasks: [`准备 ${name} 的 Offer 材料`, "提交审批", "发送 Offer"],
        },
        reject: {
            title: `${name}——通知淘汰`,
            deadline: "2",
            priority: "中",
            tasks: [`通知 ${name} 面试结果`, "记录淘汰原因"],
        },
        onboard: {
            title: `${name}——安排入职`,
            deadline: "14",
            priority: "高",
            tasks: [`准备 ${name} 的入职材料`, "安排入职时间", "通知相关部门"],
        },
    };

    const config = actionMap[action];
    if (!config) return;

    const deadlineDate = tp.date.now("YYYY-MM-DD", parseInt(config.deadline));
    const actionPath = `20-Actions/${config.title}.md`;

    const existing = app.vault.getAbstractFileByPath(actionPath);
    if (existing) {
        new Notice(`ℹ️ 行动卡已存在: ${config.title}`);
        return;
    }

    let actionContent = `---
title: "${config.title}"
type: action
date: ${tp.date.now("YYYY-MM-DD")}
deadline: ${deadlineDate}
priority: ${config.priority}
status: 待行动
source: ${name}
source_type: candidate
area: HR
position: ${position}
---

# ${config.title}

## 做什么
`;

    config.tasks.forEach(task => {
        actionContent += `- [ ] ${task}\n`;
    });

    actionContent += `
## 候选人信息

- 姓名：${name}
- 岗位：${position}
- 档案：[[${name}]]

## 步骤分解

- [ ]
- [ ]
`;

    await app.vault.create(actionPath, actionContent);

    // 更新候选人档案
    const statusMap = {
        call: "待沟通",
        first_interview: "待初面",
        second_interview: "待二面",
        offer: "待发Offer",
        reject: "已淘汰",
        onboard: "待入职",
    };

    const newStatus = statusMap[action];
    const updatedContent = content.includes("status:")
        ? content.replace(/status:.*/, `status: ${newStatus}`)
        : content;

    if (updatedContent !== content) {
        await app.vault.modify(activeFile, updatedContent);
    }

    new Notice(`✅ 已创建: ${config.title}\n状态已更新: ${newStatus}`);
}

module.exports = candidateFollowup;
