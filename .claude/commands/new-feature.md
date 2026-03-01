# New Feature Workflow

Set up a complete feature development workflow: GitHub issue + branch + initial structure.

## Arguments
$ARGUMENTS - Description of the feature to implement

## Steps

1. **Create GitHub Issue** — Using `gh issue create`:
   - Title: concise description of the feature
   - Labels: `feature` (or `fix`, `security`, `chore` as appropriate)
   - Body format:
     ```
     ## Description
     What needs to happen

     ## Motivation
     Why this change is needed

     ## Acceptance Criteria
     - [ ] How to verify it's done

     ## Technical Notes
     Implementation hints if relevant
     ```

2. **Create branch** — From latest `main`:
   - `git checkout main && git pull origin main`
   - Branch naming: `feature/<short-description>` (or `fix/`, `chore/`, `security/`)
   - `git checkout -b <branch-name>`

3. **Report** — Output:
   - Issue URL and number
   - Branch name
   - Remind the user to use `/pr` when the feature is ready

## Implementation Checklist (follow for every feature)

After setup, when implementing the feature, always follow this order:

1. **Implement** — write the feature code
2. **Test manually** — open index.html in a browser or use a local server
3. **Commit** — include the issue number in commit body (`Closes #N`)

## Important
- Always start from an up-to-date `main`
- The branch name should be kebab-case and descriptive but short
- If the description ($ARGUMENTS) is unclear, ask the user for clarification before creating anything
- Reference the issue number in all subsequent commits on this branch
