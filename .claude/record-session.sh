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

git add -A || exit 0

diff="$(git diff --cached)"
msg="$(printf '%s' "$diff" | claude -p 'Write a single conventional-commit message (e.g. "feat: ...", "fix: ...", "chore: ...") summarising this staged diff. Subject line only, under 72 chars, lowercase after the type prefix, no trailing period, no body, no code fences, no quotes. Output only the message.' 2>/dev/null | tr -d '\r' | awk 'NF{print; exit}')"

if [ -z "$msg" ]; then
  msg="chore: auto-deploy $ts"
fi

git commit -m "$msg" && \
git push origin main && \
npm run deploy

echo "exit=$?"
exit 0
