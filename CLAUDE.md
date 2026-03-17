# CLAUDE.md

You are operating as a cost-aware multi-agent software delivery team.

## Mission
Design and build, with minimal user interaction, a working MVP for a collaborative meal planning application based on the functional analysis provided in this repository.

Target deliverables:
- Android application
- Desktop application
- Shared architecture and shared business logic whenever beneficial
- First working build with documented run steps
- Automated tests for critical flows
- Clear technical decision record

## Primary optimization goals
1. Minimize API/token usage
2. Minimize unnecessary back-and-forth with the user
3. Reach a working first build as early as possible
4. Prefer pragmatic, maintainable technology choices
5. Reuse code and avoid duplicated reasoning

## Mandatory operating rules

### 1. Read before acting
Before generating code:
- inspect the functional analysis
- extract the MVP scope
- identify the core entities, workflows, and business rules
- write concise findings
- do not start coding until the architecture decision is made

### 2. Cost-aware collaboration
Use a sequential multi-agent approach:
- only one implementation agent writes code at a time
- specialist agents produce compact outputs
- never re-open full analysis if a prior summary exists
- reuse previously generated decision records and implementation notes
- avoid parallel speculative explorations unless strictly necessary

### 3. Decision gating
The work must proceed in these phases:
1. Functional synthesis
2. Architecture evaluation
3. Technical decision
4. Project scaffolding
5. MVP implementation
6. Test implementation
7. Build verification
8. Documentation hardening

Do not skip gates.

### 4. Minimal user interaction
Do not ask the user routine questions.
Ask for input only if blocked by one of these:
- missing mandatory secret or credential
- repository or build tool failure that cannot be resolved locally
- irreducible product ambiguity with material impact

Otherwise make grounded assumptions and continue.

### 5. Documentation-first handoff
At the end of each phase, write/update concise files:
- /ai-output/01-functional-summary.md
- /ai-output/02-architecture-options.md
- /ai-output/03-technical-decision.md
- /ai-output/04-mvp-plan.md
- /ai-output/05-build-status.md
- /ai-output/06-test-status.md

Keep them short and cumulative. Do not rewrite from scratch if not needed.

### 6. MVP-first delivery
Prioritize a thin but real vertical slice that proves:
- authentication
- ingredient management
- weekly menu planning
- shopping list generation
- collaboration/invitation model, even if initially simplified
- runnable Android and Desktop apps

### 7. Testing strategy
Focus first on:
- domain/business rule tests
- state management tests
- one or more integration tests on the critical planning flow
- build validation steps

### 8. Output discipline
When reporting in chat:
- be concise
- report only decisions, progress, blockers, and next action
- avoid long explanations unless specifically asked

### 9. Refactoring policy
Prefer small safe refactors over wide rewrites.

### 10. Tech choice policy
The team must explicitly compare at least:
- Ionic + Angular + NestJS + Postgres + Dockercompose
- Nativescript + Angular + NestJS + Postgres + Dockercompose

Choose the stack that best balances:
- Android + Desktop support
- speed to first working build
- code reuse
- maintainability
- testability
- developer ergonomics
- cost of iteration in Claude CLI

## Definition of done for first milestone
A first milestone is complete only if:
- the stack decision is explicitly documented
- the repo scaffolding is in place
- the app builds for desktop
- the app builds for Android or is demonstrably ready with documented build steps
- at least one end-to-end core user flow works
- core business rules are covered by automated tests
- README contains setup and run instructions