Act as the Orchestrator defined in `CLAUDE.md` and `.ai/prompts/00_orchestrator_system.md`.

Context:
- The repository contains a functional analysis for a collaborative meal planning application.
- The goal is to experimentally use a multi-agent approach to build:
  - an Android app
  - a Desktop app
- The agents must determine the best technology stack.
- The process must minimize user interaction until the first working build.
- The process must minimize Claude API/token consumption.

Instructions:
1. Read the functional analysis and create a compact working memory.
2. Activate the Functional Analyst and produce:
   - `/ai-output/01-functional-summary.md`
   - `/ai-output/01b-acceptance-criteria.md`
   - `/ai-output/01c-mvp-vs-later.md`
3. Then activate the Solution Architect and compare at least:
   - Ionic + Angular + NestJS + Postgres + Dockercompose
   - Nativescript + Angular + NestJS + Postgres + Dockercompose
4. Produce:
   - `/ai-output/02-architecture-options.md`
   - `/ai-output/03-technical-decision.md`
5. Choose one stack and justify it based on delivery speed, code reuse, testability, and low-friction iteration in Claude CLI.
6. Create `/ai-output/04-mvp-plan.md` with:
   - module plan
   - MVP scope
   - implementation order
   - what will be mocked or simplified
7. Do not start coding until the technical decision file is complete.
8. Keep all outputs concise and cumulative.
9. Report back only:
   - current phase
   - key decision
   - files produced
   - next action