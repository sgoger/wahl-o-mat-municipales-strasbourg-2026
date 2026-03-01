# Privacy — No Machine-Specific Paths

## Rule: Never commit personal paths or usernames to git

This project's `.claude/settings.json` is committed to a **public** GitHub repository.
It MUST NOT contain any machine-specific or personal information.

### Forbidden in any committed file

- Absolute paths containing a username: `/Users/<name>/`, `/home/<name>/`
- Personal tool paths: `/Users/<name>/.local/bin`
- Any path that would expose the developer's username or home directory layout

### settings.json — PATH rule

The `env.PATH` in `.claude/settings.json` MUST only contain generic, machine-agnostic paths:

```json
"PATH": "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin"
```

If you need to add a non-standard tool path during a session, do NOT edit settings.json.
Instead, add the path to your **shell profile** (`~/.zshrc`, `~/.bashrc`) so it is available system-wide without polluting the committed config.

### Hook commands — use relative paths

Hook commands in `settings.json` MUST use paths relative to the project root:

```json
"command": "bash .claude/hooks/enforce-branch.sh"   (correct)
"command": "bash /Users/<name>/project/.claude/hooks/enforce-branch.sh"   (wrong)
```

### If you accidentally commit personal paths

1. Fix the file immediately.
2. Run `git filter-repo --replace-text .claude/tmp/replacements.txt --force` to rewrite history.
3. Force-push to remove the exposure from GitHub.
4. Update this rule file if the pattern is new.
