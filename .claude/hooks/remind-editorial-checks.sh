#!/usr/bin/env bash
# PostToolUse hook: remind to run editorial AI agents when index.html is modified.
# Fires after Edit, Write, NotebookEdit.

set -euo pipefail

INPUT="$(cat)"
FILE_PATH=$(echo "$INPUT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('tool_input', {}).get('file_path', ''))
except:
    print('')
" 2>/dev/null || true)

if [[ "$FILE_PATH" == *"/index.html" ]]; then
  cat <<'REMINDER'
---------------------------------------------------
EDITORIAL CHECKS REMINDER (automated hook)
---------------------------------------------------
index.html was modified. Run the relevant check:

  THESES changed?    /check-objectivity
  POSITIONS changed? /check-sources <candidate-id>
                     /check-sources <T1..T33>

These agents verify neutrality, source accuracy,
and excerpt faithfulness before opening a PR.
---------------------------------------------------
REMINDER
fi
