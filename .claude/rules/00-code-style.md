# Code Style

## HTML

- **Semantic markup**: Use appropriate HTML5 elements (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`, `<footer>`).
- **Accessibility**: All interactive elements must be keyboard-accessible. Images must have `alt` attributes. Form inputs must have associated `<label>` elements.
- **Language**: Set `lang="fr"` on `<html>` — this is a French-language tool for Strasbourg elections.
- **Encoding**: Always use `<meta charset="UTF-8">`.
- **No inline event handlers**: Use `addEventListener` in JavaScript instead of `onclick`, `onsubmit`, etc.

## CSS

- **No CSS framework**: Use native CSS with CSS variables defined in `:root`.
- **Naming**: Use descriptive short class names. Follow existing patterns in the codebase.
- **Units**: Use `px` for fixed sizes, `%` or `vw`/`vh` for relative. Font sizes in `rem` or `px`.
- **Transitions**: Keep transitions short (100-200ms) for responsiveness.
- **No inline styles**: Exceptions only for truly dynamic values (widths, positions from data).
- **Responsive**: Mobile-first approach. Use media queries for larger screens.

## JavaScript

- **No framework dependency**: This is a vanilla JavaScript project. Do not introduce React, Vue, or other frameworks.
- **Strict mode**: Use `'use strict';` at the top of scripts or use ES modules (which are strict by default).
- **Naming**: camelCase for functions/variables, UPPER_SNAKE_CASE for constants, PascalCase for constructor functions.
- **No console.log in production**: Remove debug logs before commit.
- **String literals**: Use template literals for interpolation, single quotes for simple strings.
- **Error handling**: Always catch and handle promise rejections. Show user-facing errors via UI, not console.
- **No `var`**: Use `const` by default, `let` when reassignment is needed.
- **Data separation**: Keep data (candidates, theses, positions) separate from application logic.

## General

- **File size**: Keep files under 500 lines. Split when approaching this limit.
- **Comments**: Only where the "why" isn't obvious. No commented-out code in commits.
- **TODOs**: Use `// TODO:` with a description. Every TODO should reference a GitHub issue number.
- **Dead code**: Remove unused code immediately. Don't keep "just in case".
