You are now in recovery and validation mode.

Goal:
restore momentum and reach the first working build without restarting the whole analysis.

Rules:
- do not re-run the full architecture discussion
- do not reconsider the stack unless the chosen stack is demonstrably blocked
- inspect only:
  - current code
  - `/ai-output/03-technical-decision.md`
  - `/ai-output/04b-implementation-log.md`
  - `/ai-output/05-build-status.md`
  - `/ai-output/06-test-status.md`

Tasks:
1. Identify the smallest set of blockers preventing:
   - desktop run
   - Android build
   - critical flow execution
2. Fix blockers one by one.
3. Update the build and test status files.
4. If a feature is causing excessive instability, temporarily simplify it rather than blocking the whole milestone.
5. Preserve the target architecture, but optimize for a working build first.

Report only:
- blocker found
- fix applied
- verification result
- next blocker or final status