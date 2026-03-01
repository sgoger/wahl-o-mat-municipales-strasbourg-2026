#!/usr/bin/env bash
# PostToolUse hook: remind Claude to follow the full git workflow after any file edit.
# Fires after Edit, Write, NotebookEdit.

set -euo pipefail

cat <<'REMINDER'
---------------------------------------------------
GIT WORKFLOW REMINDER (automated hook)
---------------------------------------------------
A file was just modified. If this task is complete,
you MUST immediately (without being asked) execute:

  1. gh issue create ...              (create a GitHub issue)
  2. git checkout -b <type>/<name>    (create a branch)
  3. git add <files> && git commit    (commit the changes)
  4. git push -u origin <branch>      (push)
  5. gh pr create ...                 (open a PR)
  6. gh pr merge <n> --squash --delete-branch  (merge + cleanup)
  7. git checkout main && git pull    (sync local main)

This applies to ALL files, including .claude/ files.
---------------------------------------------------
REMINDER
