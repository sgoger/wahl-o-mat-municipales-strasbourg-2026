#!/usr/bin/env bash
# PreToolUse hook: block file edits on main branch
# Reads tool input from stdin as JSON

set -euo pipefail

input=$(cat)
branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "")

if [ "$branch" = "main" ]; then
  # Extract file_path from tool input (Edit/Write/NotebookEdit)
  file_path=$(echo "$input" | python3 -c "
import sys, json
d = json.load(sys.stdin)
print(d.get('file_path', d.get('notebook_path', '')))
" 2>/dev/null || echo "")

  # Allow edits to .claude/ files and memory even on main
  if [[ "$file_path" == *"/.claude/"* ]] || [[ "$file_path" == *".claude/"* ]]; then
    exit 0
  fi

  echo "BLOCKED: you are on the 'main' branch."
  echo ""
  echo "Every code change must go through:"
  echo "  1. gh issue create ...          (create a GitHub issue)"
  echo "  2. git checkout -b <type>/<name> (create a branch)"
  echo "  3. Implement + commit"
  echo "  4. gh pr create ...             (open a PR)"
  echo ""
  echo "Branch types: feature/ fix/ security/ chore/ docs/"
  exit 1
fi
