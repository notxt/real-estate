# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

[Brief description of what this project does and its main purpose]
Real Estate Empire
Step into the competitive world of property development in this dynamic real estate simulation. You're a budding developer entering an established city market where every plot tells a story and every decision shapes your financial future.
Navigate a living marketplace where AI competitors with distinct strategies compete alongside you for prime properties. The Conservative Investor snaps up stable income properties, while the Aggressive Developer eyes greenfield sites for major projects. Meanwhile, Opportunists hunt for undervalued gems across the entire market.
Start with limited capital in a city that's already bustling with activity - downtown high-rises casting shadows on renovation opportunities, suburban neighborhoods with hidden potential, and industrial zones ripe for transformation. Every property comes with its own challenges: aging buildings that could be goldmines or money pits, vacant lots in hot neighborhoods, and distressed sales from motivated sellers.
Success requires reading the market, timing your moves, and outmaneuvering competitors who have their own plans for the city's future. Will you focus on quick flips, build a rental empire, or bet big on transforming entire neighborhoods?
The city is yours to shape - but you're not the only one with that ambition.
Key Features: Dynamic AI competitors, realistic property valuation, turn-based market simulation, diverse development opportunities
How's that? Captures the competitive dynamics and immediate engagement while highlighting the "jump into an active world" concept.

## Common Commands

```bash
# Build the project
./bin/build

# Run tests
./bin/test

# Run a single test
./bin/test test/homepage.spec.ts

# Run tests in UI mode
./bin/test-ui

# Run tests in debug mode
./bin/test-debug

# Run tests with CI reporter (no hanging)
./bin/test-ci

# Lint the code
./bin/lint

# Fix linting issues
./bin/lint-fix

# Start development server (background process)
mkdir -p log && ./bin/dev > log/dev.log 2>&1 &

# Start production server (background process)
mkdir -p log && ./bin/start > log/server.log 2>&1 &

# Type checking
./bin/typecheck

# Watch mode for TypeScript (background process)
mkdir -p log && ./bin/watch > log/watch.log 2>&1 &

# View logs
tail -f log/dev.log    # Follow dev server logs
tail -f log/server.log # Follow production server logs
tail -f log/watch.log  # Follow TypeScript watch logs

# Kill background processes
pkill -f "node.*server"     # Kill server processes
pkill -f "tsc.*--watch"     # Kill TypeScript watch

# Note: All scripts can also be run via npm, e.g., 'npm run dev'
```

## Architecture

### High-Level Structure
[Describe the overall architecture - e.g., client-server, monolithic, microservices, etc.]
Single page web game

### Key Components
[List and briefly describe the main components/modules that span multiple files]

### Data Flow
[Explain how data flows through the system]
Rendering in realtime with turn based actions

### Important Patterns
[Document any important design patterns or conventions used throughout the codebase]
- Use functional programming
- Use typescript on strictest settings
- Node 24
- Don't use any libraries
- Use web standards
- Return errors rather than throwing them
- Create bin scripts for complicated commands

## Project-Specific Guidelines

[Any special considerations, gotchas, or important notes specific to this codebase]
- Use singular tense rather than plural for directory names

## Testing Approach

[Describe the testing strategy, frameworks used, and any special testing considerations]
- Use playwright for testing and debugging
- Playwright tests need to be fast
- We only need to test in chrome

## Development Workflow

- Commit and push after completing each task

## Pull Request Guidelines

- PRs should be small and single purpose. Try to keep them under 20 files