# Security Rules

## Static Site Security

This is a static site hosted on GitHub Pages. There is no backend server, database, or authentication system. Security concerns are limited to frontend code.

## Mandatory Rules

### Content Integrity
- NEVER load scripts from untrusted third-party domains.
- External resources (fonts, icons) should come from well-known CDNs only.
- No `eval()`, `new Function()`, or `innerHTML` with dynamic user-generated content.
- No `document.write()`.

### Data Integrity
- Candidate positions, theses, and sources must be verifiable and sourced.
- Never programmatically alter displayed data based on URL parameters or user input in a way that could mislead.
- All data displayed to users must come from the committed data files.

### Privacy
- No analytics, tracking, or cookies unless explicitly requested by the user.
- No data is sent to any server — all computation happens client-side.
- No localStorage usage for anything beyond user preferences (theme, language).

### XSS Prevention
- Sanitize any user input before rendering it in the DOM.
- Use `textContent` instead of `innerHTML` when inserting dynamic text.
- If `innerHTML` is necessary, escape all special characters first.

### Dependencies
- Minimize external dependencies. This is a static site — every dependency is an attack surface.
- If a CDN-hosted resource is used, include an `integrity` attribute (SRI hash).
- Prefer self-hosted assets when possible.
