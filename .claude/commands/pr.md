# Create Pull Request

Create a complete Pull Request following the project's git workflow.

## Steps

1. **Verify branch** — Ensure we're NOT on `main`:
   - If on `main`, ask the user which branch to create
   - The branch must follow naming: `feature/<desc>`, `fix/<desc>`, `chore/<desc>`, `security/<desc>`

2. **Stage and commit** — Stage all relevant changes:
   - Review `git status` and `git diff` to understand what changed
   - Stage files explicitly (never `git add -A` for safety)
   - Do NOT stage `.env`, credentials, or `.claude/settings.local.json`
   - Write a conventional commit message: `<type>: <description>`
   - Include `Co-Authored-By: Claude Opus 4.6 <noreply@anthropic.com>`

3. **Push** — Push the branch to origin:
   - `git push -u origin <branch-name>`

4. **Create PR** — Use `gh pr create`:
   - Title: concise, under 70 characters
   - Body format:
     ```
     ## Summary
     - bullet points of changes

     ## Related Issue
     Closes #N

     ## Test Plan
     - [ ] checklist of verification steps

     Generated with Claude Code
     ```
   - Add appropriate labels: `feature`, `fix`, `chore`, `security`, `docs`

5. **Report** — Output the PR URL to the user

## Important
- NEVER force-push or push to `main` directly
- If there's no linked issue, ask the user if they want to create one first
