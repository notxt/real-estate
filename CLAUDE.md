# CLAUDE.md

## Project: Real Estate Empire
TypeScript web game, single-page app with Node.js dev server. Setup complete, basic structure established.

**Stack**: TypeScript → JavaScript, Node 24, HTML/CSS, Playwright (Chrome only)
**Current state**: Game UI renders from `src/main.ts` with functional programming

## Essential Commands

**Development (run these first):**
```bash
mkdir -p log && ./bin/watch > log/watch.log 2>&1 &  # TypeScript compilation
mkdir -p log && ./bin/dev > log/dev.log 2>&1 &      # Dev server on :3001
```

**Main commands:**
```bash
./bin/lint          # Check code (src/ only)
./bin/test-ci       # Run tests (Chrome only, fast)
./bin/build         # Compile TypeScript
./bin/typecheck     # Type checking without build
```

**Debugging:**
```bash
tail -f log/watch.log   # TypeScript compilation logs
tail -f log/dev.log     # Server logs
./bin/test-ui           # Interactive test debugging
```

## Key Files & Flow

**Source → Build:**
- `src/main.ts` → `js/main.js` (watch mode compiles automatically)
- `index.html` loads compiled JS
- `server.js` serves static files on localhost:3001

**Critical rules:**
- ESLint checks `src/` only with strictest TypeScript rules
- No external libraries - web standards only
- Functional programming only - use functions, not classes
- Return errors (don't throw)
- Singular directory names (`test/` not `tests/`)
- ES module imports must include `.js` extensions

## Must Know

**Before starting work:**
1. Run watch mode: `./bin/watch > log/watch.log 2>&1 &`
2. Run dev server: `./bin/dev > log/dev.log 2>&1 &`

**Current behavior:**
- `main.ts` renders full game UI with document fragments
- Uses functional programming patterns throughout
- CSS in external `style.css` with CSS Grid layout
- ESLint will fail CI if src/ code doesn't pass

**Testing:**
- Chrome-only Playwright tests (fast)
- Tests reuse existing server on :3001
- No unit tests - only e2e through browser

## Workflow

**After each task:** Commit and push changes
**PR size:** Keep under 20 files, single purpose
- After creating or updating a PR. Make sure CI is passing

## Code Design Principles

- Avoid generics if possible
- Always show errors in the UI
- Favor TypeScript types over interfaces
- Use `const fn = () => {...}` rather than `function`
- ES modules: import paths must include `.js` extensions
- Don't use optional properties in TypeScript
- Prefer null over undefined
- Prefer early returns over optional chaining

## Development Philosophy

- Refactor aggressively. Make sure the code is always clean and human readable

## Code Navigation Tips

- Leave comments for yourself using easily searchable tags so you can quickly navigate files
- Use unique, descriptive tags like `// @NAVIGATION:` or `// @TODO:` to mark important sections or notes for later reference

## Project Organization

- Put debug scripts and images in the `debug/` folder