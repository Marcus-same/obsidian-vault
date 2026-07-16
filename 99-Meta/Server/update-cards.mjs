import fs from 'fs';
import path from 'path';

const dir = 'D:/obsidian-vault/20-Actions';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md') && f !== 'README.md');

for (const fname of files) {
  const fpath = path.join(dir, fname);
  let content = fs.readFileSync(fpath, 'utf8');

  const fmMatch = content.match(/^---\n[\s\S]*?\n---\n/);
  if (!fmMatch) { console.log('No frontmatter:', fname); continue; }

  const fmRaw = fmMatch[0];
  const body = content.slice(fmMatch[0].length);

  const fields = {};
  fmRaw.split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*(.*)/);
    if (m) fields[m[1]] = m[2].trim();
  });

  const title = fields.title || fname.replace('.md','');
  const deadline = fields.deadline || '';
  const priority = fields.priority || '中';
  const status = fields.status || '待行动';
  const source = fields.source || '';
  const source_type = fields.source_type || '';
  const area = fields.area || '';
  const date_val = fields.date || '2026-07-16';

  let newFm = '---\n';
  newFm += `type: action\n`;
  newFm += `title: "${title}"\n`;
  newFm += `topic_id:\n`;
  newFm += `status: ${status}\n`;
  newFm += `stage: 待排期\n`;
  newFm += `priority: ${priority}\n`;
  newFm += `created: ${date_val}\n`;
  newFm += `updated: 2026-07-16\n`;
  newFm += `deadline: ${deadline}\n`;
  newFm += `scheduled_date: ${deadline}\n`;
  newFm += `scheduled_start:\n`;
  newFm += `scheduled_end:\n`;
  newFm += `source: ${source}\n`;
  newFm += `source_type: ${source_type}\n`;
  newFm += `area: ${area}\n`;
  newFm += `tags: []\n`;
  newFm += `dedupe_key:\n`;
  newFm += `drop_action:\n`;
  newFm += `drop_reason:\n`;
  newFm += `---`;

  fs.writeFileSync(fpath, newFm + '\n' + body, 'utf8');
  console.log('✅ ' + fname.padEnd(30) + ' | deadline=' + deadline + ' | priority=' + priority);
}
