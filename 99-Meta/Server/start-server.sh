#!/usr/bin/env bash
# 启动阿福周历 UI
# 用法：bash start-server.sh
# 然后打开 http://localhost:4317

set -euo pipefail

VAULT_ROOT="D:/obsidian-vault"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

export TOPIC_PLANNER_VAULT_ROOT="$VAULT_ROOT"
export TOPIC_PLANNER_CONFIG="$VAULT_ROOT/topic-planner.config.json"

cd "$SCRIPT_DIR"
echo "🚀 阿福周历启动中..."
echo "📅 打开 http://localhost:4317"
exec node server.mjs
