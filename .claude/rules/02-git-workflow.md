# Git Workflow

## Branch Strategy

- **Main branch**: `main` — always deployable, protected.
- **Feature branches**: `feature/<short-description>` (e.g., `feature/responsive-results`)
- **Bug fix branches**: `fix/<short-description>` (e.g., `fix/score-calculation`)
- **Chore branches**: `chore/<short-description>` (e.g., `chore/update-sources`)

## Language

**Everything that enters git MUST be written in English**, regardless of the language used in the conversation between the user and Claude:

- Commit messages (subject line and body)
- Branch names
- GitHub issue titles and bodies
- Pull request titles and bodies
- Code comments and documentation strings
- Variable names, function names, and identifiers

The only exceptions are:
- User-facing UI strings in HTML/JS (which are in French)
- Content data (candidate names, thesis texts, source excerpts)
- README.md and CONTRIBUTING.md (which are in French by design)

## Commit Conventions

Use Conventional Commits format:

<type>: <short description>

[optional body]

[optional footer]
Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>

### Types
- `feat`: New feature or capability
- `fix`: Bug fix
- `refactor`: Code restructuring without behavior change
- `chore`: Tooling, deps, CI changes
- `docs`: Documentation only
- `style`: Formatting fixes (no logic change)
- `perf`: Performance improvement
- `security`: Security fix or hardening

### Rules
- Keep the subject line under 72 characters.
- Use imperative mood ("add feature" not "added feature").
- Reference GitHub issue numbers in the body when applicable (e.g., `Closes #12`).

## GitHub Workflow

### For every feature or bug fix:
1. **Create a GitHub Issue** first — describe what needs to be done and why.
2. **Create a branch** from `main` following the naming convention.
3. **Implement** the change with clean, focused commits.
4. **Create a Pull Request** targeting `main`:
   - Title: concise, matches the issue
   - Body: summary of changes, test plan, link to issue (`Closes #N`)
5. **Squash merge** the PR into `main`.
6. **Delete the feature branch** after merge.

## Claude Code Automation

### Auto commit/push/PR
After completing any task that modifies source files, Claude MUST automatically (without waiting to be asked):
1. Create a GitHub issue
2. Create a branch and commit
3. Push and open a PR

Do not wait for the user to say "commit" or "push". Execute the full git workflow as part of every task completion.

### No heredocs in Bash commands

**NEVER use heredoc syntax in Bash commands.** The `*` glob in `permissions.allow` does
not match newlines, so any multiline Bash command triggers a confirmation prompt even
when the command starts with an allowed prefix like `git` or `gh`.

Instead, write multiline content using the **Write tool** to a file **inside the workspace**
(`.claude/tmp/`), then reference it in a single-line command:

| Wrong | Correct |
|---|---|
| `git commit -m "$(cat <<'EOF'\n...\nEOF\n)"` | Write -> `.claude/tmp/commit_msg.txt` -> `git commit -F .claude/tmp/commit_msg.txt` |
| `gh pr create --body "$(cat <<'EOF'\n...\nEOF\n)"` | Write -> `.claude/tmp/body.txt` -> `gh pr create --body "$(cat .claude/tmp/body.txt)"` |
| `gh issue create --body "$(cat <<'EOF'\n...\nEOF\n)"` | Write -> `.claude/tmp/body.txt` -> `gh issue create --body "$(cat .claude/tmp/body.txt)"` |

**Key**: `/tmp/` is outside the workspace -> still asks for permission in `acceptEdits` mode.
`.claude/tmp/` is inside the workspace -> auto-approved. It is listed in `.gitignore`.

The resulting single-line commands match `Bash(git *)` / `Bash(gh *)` and run without prompts.

## Parallel Work with Worktrees

For tasks that are independent of each other, use git worktrees to isolate each session:

```bash
claude --worktree feature/<name>   # launch from terminal for a new isolated session
```
