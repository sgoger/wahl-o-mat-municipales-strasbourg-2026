# Security Audit

Perform a security audit of the codebase against the project's security rules.

## Checks to Perform

### 1. Content Security
- [ ] No `eval()`, `new Function()`, or `document.write()`
- [ ] No `innerHTML` with dynamic user-generated content (use `textContent`)
- [ ] No inline event handlers in HTML (`onclick`, `onload`, etc.)
- [ ] No dynamic script loading from untrusted sources

### 2. External Resources
- [ ] All CDN-hosted resources use `integrity` attribute (SRI)
- [ ] External resources come from well-known, trusted CDNs only
- [ ] No loading of resources from unknown third-party domains

### 3. Data Integrity
- [ ] All candidate positions are sourced from committed data files
- [ ] No URL parameters or user input can alter displayed political data
- [ ] Score calculation logic is transparent and correct

### 4. Privacy
- [ ] No analytics, tracking scripts, or cookies
- [ ] No data sent to any external server
- [ ] No localStorage usage beyond user preferences

### 5. General Web Security
- [ ] No sensitive information in HTML comments or JS comments
- [ ] No hardcoded API keys or tokens
- [ ] `.gitignore` excludes sensitive files

## Output Format
Report findings as a table:

| Severity | File | Issue | Status |
|----------|------|-------|--------|
| Critical | path/to/file | Description | OPEN / FIXED |
| Warning | path/to/file | Description | OPEN / FIXED |
| Info | path/to/file | Description | OPEN / FIXED |

Then suggest GitHub issues to create for any OPEN findings with `security` label.
