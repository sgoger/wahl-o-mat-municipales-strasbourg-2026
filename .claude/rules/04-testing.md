# Testing Rules

## Every Feature Must Have Tests

Every new feature or bug fix that modifies JavaScript logic MUST include
corresponding tests before the PR can be merged.

### What requires tests

- Any new function or module
- Any change to scoring logic (`calcScore`)
- Any change to data structures (`CANDIDATES`, `THESES`, `POSITIONS`)
- Any new data entry (thesis, candidate, position)
- Any change to result display (`buildDetailHTML`, `buildComparisonTable`)
- Any change to quiz flow (`renderQuestion`, `castVote`, navigation)

### What does not require tests

- Pure CSS changes (visual styling)
- HTML content changes that don't affect logic
- Documentation changes (README, CONTRIBUTING, CLAUDE.md)
- Claude Code configuration changes (`.claude/`)

### Test conventions

- Test files live in `tests/` directory
- Test file names describe the feature: `tests/scoring.test.js`
- Use `describe` blocks grouped by function or feature name
- Use clear test names in English: `test('returns 0 when all answers are skip')`
- Prefer testing pure functions with explicit arguments over mocking globals
- For DOM tests, use the `loadApp()` helper from `tests/helpers/load-app.js`
- Call `resetState(app)` in `beforeEach` to isolate tests

### Running tests

```bash
npm test           # Run all tests once (CI mode)
npm run test:watch # Run in watch mode during development
```

### Requirements

- All tests must pass before opening a PR
- All tests must pass on a clean `npm install && npm test`
- New data entries (theses, positions) must pass `data-integrity.test.js` validation

### Data integrity

The `data-integrity.test.js` file validates that:
- Every `THESES` entry has a non-empty `docs` array with title + https URL
- Every `POSITIONS` entry has `stance`, non-empty `excerpt`, and valid https URL
- Every candidate has at least 15 documented positions

Update this file when adding theses, candidates, or positions.
