// 自动轮询每日笔记，打勾→工作记录，取消→今日任务
import { readFile, writeFile, readdir } from 'fs/promises';
import { join } from 'path';

const DAILY_DIR = 'D:/obsidian-vault/01-Daily';
let lastMtimes = {};

function sortTasks(content) {
    const lines = content.split('\n');
    let taskStart = -1, workStart = -1, nextStart = -1;
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].match(/^## 📋 今日任务/)) taskStart = i;
        if (lines[i].match(/^## 📝 工作记录/) && taskStart > -1) workStart = i;
        if (workStart > -1 && i > workStart && lines[i].match(/^## /) && !lines[i].match(/工作记录/)) {
            nextStart = i; break;
        }
    }
    if (taskStart === -1 || workStart === -1) return null;
    if (nextStart === -1) nextStart = lines.length;

    const prefix = lines.slice(0, taskStart + 1);
    const taskSection = lines.slice(taskStart + 1, workStart);
    const workSection = lines.slice(workStart + 1, nextStart);
    const suffix = lines.slice(nextStart);

    const isTask = (l) => /^- \[[ x/]\] /.test(l);
    const isDone = (l) => /^- \[x\] /.test(l);
    const isTodo = (l) => /^- \[[ /]\] /.test(l);

    const taskDone = taskSection.filter(isDone);
    const taskTodo = taskSection.filter(l => isTask(l) && !isDone(l));
    const taskOther = taskSection.filter(l => !isTask(l));

    const workTodo = workSection.filter(isTodo);
    const workDone = workSection.filter(l => isTask(l) && !isTodo(l));
    const workOther = workSection.filter(l => !isTask(l));

    const newTodos = [...taskTodo, ...workTodo];
    const newDones = [...workDone, ...taskDone];

    const trim = (arr) => {
        while (arr.length && !arr[arr.length-1].trim()) arr.pop();
        while (arr.length && !arr[0].trim()) arr.shift();
        return arr;
    };

    let taskBuild = [...trim(taskOther)];
    if (newTodos.length) {
        if (taskBuild.length && taskBuild[taskBuild.length-1].trim()) taskBuild.push('');
        taskBuild.push(...newTodos);
    }

    let workBuild = [...trim(workOther)];
    if (newDones.length) {
        if (workBuild.length && workBuild[workBuild.length-1].trim()) workBuild.push('');
        workBuild.push(...newDones);
    }

    return [...prefix, ...taskBuild, '## 📝 工作记录', ...workBuild, ...suffix].join('\n');
}

async function poll() {
    try {
        const files = await readdir(DAILY_DIR);
        for (const f of files) {
            if (!f.endsWith('.md')) continue;
            const path = join(DAILY_DIR, f);
            let content, mtime;
            try {
                content = await readFile(path, 'utf-8');
            } catch { continue; }
            
            // 简单哈希判断是否需要排序
            const sorted = sortTasks(content);
            if (!sorted || sorted === content) continue;
            
            await writeFile(path, sorted, 'utf-8');
            console.log(`✅ ${f} 已自动整理`);
        }
    } catch (e) {
        // silent
    }
}

console.log('🔄 task-watcher 已启动（2秒轮询）');
poll(); // 立即跑一次
setInterval(poll, 2000);
