import path from 'node:path';
import fs from 'node:fs';

const VAULT_ROOT = 'D:/obsidian-vault';
const LOG_DIR = path.join(VAULT_ROOT, '99-Meta', 'Logs');

function todayString() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
}

function nowISO() {
  return new Date().toISOString();
}

export async function appendOperationLog({ action, title = '', details = {} }) {
  const date = todayString();
  fs.mkdirSync(LOG_DIR, { recursive: true });

  const logPath = path.join(LOG_DIR, `${date}.md`);
  const exists = fs.existsSync(logPath);

  const lines = [];
  if (!exists) {
    lines.push('---');
    lines.push('type: operation-log');
    lines.push(`date: ${date}`);
    lines.push('---');
    lines.push(`# 操作日志 ${date}`);
    lines.push('');
  }

  lines.push(`## ${nowISO()} | ${action}`);
  if (title) lines.push(`- 标题: ${title}`);
  for (const [key, value] of Object.entries(details)) {
    if (value) lines.push(`  - ${key}: ${value}`);
  }
  lines.push('');

  fs.appendFileSync(logPath, lines.join('\n') + '\n', 'utf8');
  return logPath;
}

export function getLogPath() {
  const date = todayString();
  return path.join(LOG_DIR, `${date}.md`);
}
