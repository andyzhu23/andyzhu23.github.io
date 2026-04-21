#!/usr/bin/env bash
# SessionEnd hook: commit working-tree changes, push main, deploy to GitHub Pages.
# Output goes to .claude/session-hook.log (gitignored via *.log).

set -u
REPO="/Users/andyzhu/Desktop/andyzhu23.github.io"
LOG="$REPO/.claude/session-hook.log"
ts="$(date '+%Y-%m-%d %H:%M:%S %Z')"

exec >> "$LOG" 2>&1
printf '\n=== %s ===\n' "$ts"

cd "$REPO" || exit 0

if [ -z "$(git status --porcelain)" ]; then
  echo "no changes, skipping"
  exit 0
fi

git add -A && \
git commit -m "chore: auto-deploy $ts" && \
git push origin main && \
npm run deploy

echo "exit=$?"
exit 0
