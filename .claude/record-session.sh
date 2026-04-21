#!/usr/bin/env bash
# SessionEnd hook: commit working-tree changes, push main, deploy to GitHub Pages.
# Runs detached so it survives Claude Code's session termination.
# Output goes to .claude/session-hook.log (gitignored via *.log).

REPO="/Users/andyzhu/Desktop/andyzhu23.github.io"
LOG="$REPO/.claude/session-hook.log"
LOCKDIR="$REPO/.claude/session-hook.lock.d"

# Fork the real work into a detached subshell, then return immediately so
# Claude Code doesn't kill our subprocesses when the session terminates.
(
  set -u
  exec >> "$LOG" 2>&1 </dev/null

  # Serialize runs via atomic mkdir (portable; flock isn't on macOS).
  if ! mkdir "$LOCKDIR" 2>/dev/null; then
    printf '\n[%s] another run is active, skipping\n' "$(date '+%H:%M:%S')"
    exit 0
  fi
  trap 'rmdir "$LOCKDIR" 2>/dev/null' EXIT

  ts="$(date '+%Y-%m-%d %H:%M:%S %Z')"
  printf '\n=== %s ===\n' "$ts"

  cd "$REPO" || { printf 'cd failed\n'; exit 0; }

  if [ -n "$(git status --porcelain)" ]; then
    git add -A || { printf 'git add failed\n'; exit 0; }

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

  ahead="$(git rev-list --count origin/main..HEAD 2>/dev/null || echo 0)"
  if [ "${ahead:-0}" -gt 0 ]; then
    printf 'pushing %s commit(s)\n' "$ahead"
    git push origin main && npm run deploy
    printf 'exit=%s\n' "$?"
  else
    printf 'nothing to push\n'
  fi
) </dev/null >/dev/null 2>&1 &
disown

exit 0
