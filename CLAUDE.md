# Wahl-O-Mat · Strasbourg 2026

A citizen decision-aid tool for the 2026 Strasbourg municipal elections, inspired by the German Wahl-O-Mat.

## Mandatory Git Workflow (enforced by hook)

**NEVER edit source files directly on `main`.** Every code change MUST follow this process:

1. `gh issue create ...` — create a GitHub issue first
2. `git checkout -b <type>/<name>` — create a branch (`feature/`, `fix/`, `security/`, `chore/`)
3. Implement + commit (following Conventional Commits)
4. `gh pr create ...` — open a PR targeting `main`
5. Squash merge + delete branch

A `PreToolUse` Claude Code hook enforces this: any file edit attempt on `main` is blocked.
Exception: `.claude/` files (memory, settings, hooks) may be edited on any branch.

## Tech Stack

- **Frontend**: Vanilla HTML5, CSS3 (native variables), JavaScript (ES6+)
- **Hosting**: GitHub Pages (static site)
- **No build step**: The site runs directly from source files
- **No framework**: No React, Vue, Angular — intentionally kept simple and dependency-free

## Commands

```bash
# Development
open index.html              # Open in browser (macOS)
python3 -m http.server 8000  # Local dev server (for module imports)

# Testing
npm test                     # Run all tests once
npm run test:watch           # Run tests in watch mode

# Git workflow
git status                   # Check working tree
git diff                     # Review changes
gh issue create ...          # Create issue
gh pr create ...             # Create pull request
```

## Architecture

```
wahl-o-mat/
├── index.html               ← Main application (single-page)
├── README.md                ← Project documentation (French)
├── CONTRIBUTING.md          ← Contribution guide (French)
├── LICENSE                  ← MIT license
├── CLAUDE.md                ← This file (Claude Code instructions)
├── .claude/
│   ├── settings.json        ← Claude Code permissions & hooks
│   ├── rules/
│   │   ├── 00-code-style.md ← HTML/CSS/JS coding standards
│   │   ├── 01-security.md   ← Web security rules
│   │   ├── 02-git-workflow.md ← Git branch & commit conventions
│   │   ├── 03-privacy.md   ← No personal paths in committed files
│   │   └── 04-testing.md   ← Testing requirements for every feature
│   ├── hooks/
│   │   ├── enforce-branch.sh ← Block edits on main branch
│   │   └── remind-git-workflow.sh ← Remind to commit/push/PR
│   └── commands/
│       ├── new-feature.md   ← /new-feature: issue + branch setup
│       ├── pr.md            ← /pr: create pull request
│       └── security-check.md ← /security-check: audit codebase
├── tests/
│   ├── helpers/
│   │   └── load-app.js      ← Test helper: loads index.html script
│   ├── smoke.test.js        ← Setup validation
│   ├── data-integrity.test.js ← Data structure & source verification
│   ├── scoring.test.js      ← Score calculation tests
│   ├── ranking.test.js      ← Ranking order tests
│   ├── detail.test.js       ← Source display in results tests
│   └── comparison.test.js   ← Comparison table tests
├── package.json             ← Dev dependencies (Vitest, happy-dom)
├── vitest.config.js         ← Test runner configuration
└── .gitignore
```

## Important Notes

- **Language duality**: Code, git messages, and technical docs are in English. User-facing content (UI, README, CONTRIBUTING) is in French.
- **Data integrity is critical**: This tool displays political positions attributed to real candidates. Every position must be sourced from verifiable press articles. Never fabricate or guess positions.
- **Neutrality**: The tool must remain strictly non-partisan. No thesis should be formulated to advantage or disadvantage any candidate.
- **Accessibility**: The site must be usable on mobile and by screen readers. Semantic HTML and keyboard navigation are required.
- **No tracking**: No analytics, no cookies, no external data collection. All computation is client-side.

## Rules

Detailed rules are auto-loaded from `.claude/rules/`:

@.claude/rules/00-code-style.md
@.claude/rules/01-security.md
@.claude/rules/02-git-workflow.md
@.claude/rules/03-privacy.md
