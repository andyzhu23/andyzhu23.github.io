#!/usr/bin/env bash
# SessionEnd hook: commit working-tree changes, push main, deploy to GitHub Pages.
# Output goes to .claude/session-hook.log (gitignored via *.log).

set -u
REPO="/Users/andyzhu/Desktop/andyzhu23.github.io"
LOG="$REPO/.claude/session-hook.log"
ts="$(date '+%Y-%m-%d %H:%M:%S %Z')"

exec >> "$LOG" 2>&1
printf '\n=== %s ===\n' "$ts"

cd "$REPO" || { printf 'cd failed\n'; exit 0; }

# Stage and commit any working-tree changes
if [ -n "$(git status --porcelain)" ]; then
  git add -A || exit 0

  diff="$(git diff --cached)"
  msg="$(printf '%s' "$diff" | claude -p 'Write a single conventional-commit message (e.g. "feat: ...", "fix: ...", "chore: ...") summarising this staged diff. Subject line only, under 72 chars, lowercase after the type prefix, no trailing period, no body, no code fences, no quotes. Output only the message.' 2>/dev/null | tr -d '\r' | awk 'NF{print; exit}')"

  if [ -z "$msg" ]; then
    msg="chore: auto-deploy $ts"
  fi

  git commit -m "$msg" || { printf 'commit failed\n'; exit 0; }
  printf 'committed: %s\n' "$msg"
else
  printf 'no working-tree changes\n'
fi

# Push if ahead of origin
ahead="$(git rev-list --count origin/main..HEAD 2>/dev/null || true)"
if [ "${ahead:-0}" -gt 0 ]; then
  printf 'pushing %s commit(s)\n' "$ahead"
  git push origin main && npm run deploy
  printf 'exit=%s\n' "$?"
else
  printf 'nothing to push\n'
fi
