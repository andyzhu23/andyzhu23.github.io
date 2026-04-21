#!/usr/bin/env bash
# SessionEnd hook: append this session's transcript to CLAUDE.md.
# Reads {"transcript_path":"...","session_id":"..."} on stdin.

set -u
CLAUDE_MD="/Users/andyzhu/Desktop/andyzhu23.github.io/CLAUDE.md"

payload="$(cat)"
transcript_path="$(printf '%s' "$payload" | jq -r '.transcript_path // empty')"
session_id="$(printf '%s' "$payload" | jq -r '.session_id // "unknown"')"
ts="$(date '+%Y-%m-%d %H:%M:%S %Z')"

[ -z "$transcript_path" ] || [ ! -f "$transcript_path" ] && exit 0

{
  printf '\n\n---\n## Session %s (id: %s)\n\n' "$ts" "$session_id"
  jq -r '
    select(.type == "user" or .type == "assistant")
    | . as $row
    | ($row.message.content) as $c
    | (if ($c | type) == "string" then $c
       elif ($c | type) == "array" then
         ($c | map(
           if .type == "text" then .text
           elif .type == "tool_use" then "[tool_use: " + (.name // "?") + "]"
           elif .type == "tool_result" then "[tool_result]"
           elif .type == "thinking" then empty
           else empty end
         ) | map(select(. != null and . != "")) | join("\n\n"))
       else empty end) as $body
    | select($body != null and $body != "")
    | "### " + ($row.type | ascii_upcase) + "\n\n" + $body + "\n"
  ' "$transcript_path" 2>/dev/null
} >> "$CLAUDE_MD"

exit 0
