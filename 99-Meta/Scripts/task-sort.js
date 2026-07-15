// 任务自动分流：打勾→工作记录，取消打勾→回到今日任务
// 快捷键建议：Ctrl+Shift+M

async function task_sort(tp) {
    const content = tp.file.content;
    const lines = content.split('\n');
    
    // 找到各区域边界
    let taskHeader = -1, workHeader = -1, nextHeader = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^## 📋 今日任务/)) taskHeader = i;
        if (lines[i].match(/^## 📝 工作记录/) && taskHeader > -1) workHeader = i;
        if (workHeader > -1 && i > workHeader && lines[i].match(/^## /) && !lines[i].match(/工作记录/)) {
            nextHeader = i;
            break;
        }
    }
    
    if (taskHeader === -1 || workHeader === -1) {
        return "❌ 未找到「今日任务」或「工作记录」区域";
    }
    if (nextHeader === -1) nextHeader = lines.length;
    
    // 提取三个区域
    const prefix = lines.slice(0, taskHeader + 1);
    const taskLines = lines.slice(taskHeader + 1, workHeader);
    const workLines = lines.slice(workHeader + 1, nextHeader);
    const suffix = lines.slice(nextHeader);
    
    // 分类：从任务区分离出 纯任务行 与 中间内容（代码块、空行、注释等）
    const isTask = (l) => l.match(/^- \[[ x/]\] /);
    const isChecked = (l) => l.match(/^- \[x\] /);
    const isUnchecked = (l) => l.match(/^- \[ \] /);
    
    // 收集任务区的所有任务行
    let tasksDone = [];
    let tasksTodo = [];
    let tasksInProgress = [];
    
    for (const l of taskLines) {
        if (isChecked(l)) tasksDone.push(l);
        else if (isUnchecked(l)) tasksTodo.push(l);
        else if (l.match(/^- \[\/\] /)) tasksInProgress.push(l);
    }
    
    // 工作区已有的任务
    let workDone = [];
    let workMovedBack = []; // 工作区中被打回的任务（取消打勾的）
    
    for (const l of workLines) {
        if (isUnchecked(l)) workMovedBack.push(l); // 取消打勾，送回今日任务
        else if (isTask(l)) workDone.push(l);       // 保持在工作记录
    }
    
    // 合并：今日任务的未完成 + 从工作记录打回的
    const newTasksTodo = [...tasksTodo, ...tasksInProgress, ...workMovedBack];
    const newWorkDone = [...workDone, ...tasksDone];
    
    // 重建任务区：保留非任务行（Dataview代码块等），追加未完成任务
    const taskNonTaskLines = taskLines.filter(l => !isTask(l));
    const workNonTaskLines = workLines.filter(l => !isTask(l));
    
    // 清理多余空行
    const cleanEmpty = (arr) => {
        while (arr.length > 0 && arr[arr.length-1].trim() === '') arr.pop();
        return arr;
    };
    
    let newTaskSection = [...cleanEmpty(taskNonTaskLines)];
    if (newTasksTodo.length > 0) {
        if (newTaskSection.length > 0 && newTaskSection[newTaskSection.length-1].trim() !== '') newTaskSection.push('');
        newTaskSection.push(...newTasksTodo);
    }
    
    let newWorkSection = [...cleanEmpty(workNonTaskLines)];
    if (newWorkDone.length > 0) {
        if (newWorkSection.length > 0 && newWorkSection[newWorkSection.length-1].trim() !== '') newWorkSection.push('');
        newWorkSection.push(...newWorkDone);
    }
    
    // 组装新内容
    const newContent = [
        ...prefix,
        ...newTaskSection,
        '## 📝 工作记录',
        ...newWorkSection,
        ...suffix
    ].join('\n');
    
    // 写入文件
    const file = tp.file.find_tfile(tp.file.title);
    await app.vault.modify(file, newContent);
    
    return `✅ 已整理：${newTasksTodo.length} 条待办 | ${newWorkDone.length} 条已完成`;
}

module.exports = task_sort;
