# CLAUDE.md

## Project: Real Estate Empire
TypeScript web game, single-page app with Node.js dev server. Setup complete, basic structure established.

**Stack**: TypeScript → JavaScript, Node 24, HTML/CSS, Playwright (Chrome only)
**Current state**: `src/main.ts` displays "working!" message in browser

## Essential Commands

**Development (run these first):**
```bash
mkdir -p log && ./bin/watch > log/watch.log 2>&1 &  # TypeScript compilation
mkdir -p log && ./bin/dev > log/dev.log 2>&1 &      # Dev server on :3000
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
- `server.js` serves static files on localhost:3000

**Critical rules:**
- ESLint checks `src/` only with strictest TypeScript rules
- No external libraries - web standards only
- Functional programming, return errors (don't throw)
- Singular directory names (`test/` not `tests/`)

## Must Know

**Before starting work:**
1. Run watch mode: `./bin/watch > log/watch.log 2>&1 &`
2. Run dev server: `./bin/dev > log/dev.log 2>&1 &`

**Current behavior:**
- `main.ts` sets main element text to "working!"
- Tests verify this "working!" text (not game-container)
- ESLint will fail CI if src/ code doesn't pass

**Testing:**
- Chrome-only Playwright tests (fast)
- Tests reuse existing server on :3000
- No unit tests - only e2e through browser

## Workflow

**After each task:** Commit and push changes
**PR size:** Keep under 20 files, single purpose