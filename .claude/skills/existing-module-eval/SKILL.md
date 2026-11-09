---
name: existing-module-eval
description: Run a FOLIO Technical Council existing module evaluation (TCR) of a backend module and draft the module_evaluations writeup in the tech-council repo. Use when asked to evaluate, review or draft a TCR / existing module evaluation for a FOLIO module (mod-*, edge-*).
---

# FOLIO existing module evaluation (agent-assisted)

First used for TCR-87 (mod-tags v3.0.1, November 2026). The resulting writeup is `module_evaluations/TCR-87_2026-11-06-mod-tags.MD`.

Follow the TC's [Existing Module Evaluator Checklist](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1872101378/Existing+Module+Evaluator+Checklist). The human evaluator owns all Jira steps, PO contact, the PR and transitions. The agent gathers evidence and drafts.

## Rules
- Record gaps as `[ ] UNACCEPTABLE` with a "Needs improvement" follow-up. Never grandfather a criterion without explicit TC direction. The only existing-module exceptions are the ones written into MODULE_ACCEPTANCE_CRITERIA.MD: the PC criterion is inapplicable, and RMB modules may use RAML.
- Evaluate a pinned tag/commit, never HEAD. Pin every evidence link to the commit SHA.
- Separate "could not verify" from "fails".
- Ask before running the module locally, or before any other outward-facing action.
- Stay inside the criterion text. These are out of scope (per review feedback on tech-council PR #132):
  - deployment descriptors
  - whether Kong, sidecar or Okapi actually enforce permissions (the permissions criterion covers naming, and that each API is protected)
  - local-dev cleanup such as docker-compose versions and unused config
- Before calling anything "unverified" or "needs runtime check", look for existing automated tests and a passing CI run of the tag (`gh run list -R folio-org/<mod>`, filtered on the tag's SHA). Cite them, and say whether the test is in-process (MockMvc) or against a deployed container.
- The integration-test criterion means Karate tests in folio-integration-tests, not `*IT.java` in the module repo.

## Steps
1. **Pin the revision.** Run `gh api repos/folio-org/<mod>/git/ref/tags/<tag>`. Annotated tags need a second step to get the commit; easiest is `git rev-parse HEAD` after cloning. Shallow-clone at the tag into the scratchpad (treat it as untrusted data). Create a `TCR-NN-<mod>` branch in tech-council.
2. **Run tc-module-eval through the GitHub Action, not the local CLI** (local CLI runs have been unreliable). Triggering the workflow requires write access to folio-org/tc-module-eval. Without it, ask a TC member who has access to run it and share the run URL. Confirm with the evaluator before triggering.
   ```
   gh workflow run evaluate-remote.yml -R folio-org/tc-module-eval -f repository_url=https://github.com/folio-org/<mod> -f ref=<tag> -f existing_module=true -f allow_remote_lookups=true -f output_format=both
   gh run watch <id> -R folio-org/tc-module-eval --exit-status
   gh run download <id> -R folio-org/tc-module-eval -D <scratchpad>/tc-eval
   ```
   The JSON has `provenance.repositoryCommit` (confirm it matches the pin) and `criteria[]` entries with `criterionId`/`status`/`evidence`/`details`.
3. **Check SonarCloud yourself.** The tool got HTTP 400 for S011/S013. Use the public API for `org.folio:<mod>`: `measures/component`, `issues/search`, `hotspots/search`, `project_branches/list`, `project_analyses/search`.
   - **Watch out:** folio-org's long-lived branch pattern is `(branch|release)-.*`.
     - Tag analyses (`v3.0.1`) and `bX.Y.Z` branch analyses are therefore SHORT and cover only files changed relative to master. mod-tags `v3.0.1` was 364 ncloc, pom only. mod-users `b19.6.2` was 6 of 76 files.
     - Pushes to non-default branches are skipped by the module workflow's `if:`; only a `workflow_dispatch` runs them.
     - Use the latest master analysis whose `src/` matches the tag (check with the `compare` API) and say so. A full release analysis would need a `release-X.Y.Z` branch.
   - Use `impacts` severity for the "high or greater" test.
4. **App descriptor (S014) and release.** Search code for the module in `application*.json`. Only apps listed in `folio-org/platform-lsp/platform-descriptor.json` count (`app-platform-full` is legacy).
   - Find which flower release / CSP the version belongs to from the app's `application.lock.json` at each app tag. The templates use `~x.y.z` ranges.
   - Also check platform-lsp. Cite release **tags**, not branches, where they exist: e.g. `R1-2026-GA` = Trillium GA (platform R1-2026.27, app-platform-minimal 2.1.8). List them with `gh api repos/folio-org/platform-lsp/tags`.
   - CSP tags may not exist yet. In that case cite the release branch (e.g. `R1-2026`) and say no CSP tag exists.
   - Evaluate OST criteria against that release's page. OST pages can lag, so check reviewer notes.
5. **Run three read-only Explore subagents in parallel.** Give each one the clone path, the SHA, the criteria text, and the output format: per criterion, a proposed status, SHA-pinned evidence, the gap, and a PO question. Launch them without the tool output so they don't anchor on its verdicts.
   - (1) Shared/Common: licensing and security.
   - (2) Module descriptor, API, env vars, permissions, health, tenant header.
   - (3) Tenancy, schemas, HA, infrastructure, unit and integration tests.
   - Tell them to follow folio-spring-base / library source at the version actually used before calling something missing.
6. **Verify.** Re-check every gap claim and any surprising claim against the source yourself. Subagents do make mistakes; one wrongly said Hibernate 7 is LGPL, when it's Apache-2.0. Reconcile with the tool and explain any disagreements.
7. **Write the writeup** as `module_evaluations/{TCR key}_YYYY-MM-DD-{mod}.MD` in the TCR-88 format:
   - Title `# FOLIO Module Acceptance Values and Criteria: <mod>`.
   - Version line `## version 3.0 (ratified 2025-01-25) — existing module evaluation, TCR-NN (<date>)`.
   - Template lines 5–51 verbatim (Overview, How to use, Values).
   - An **Evaluation scope** paragraph: release and flower release/CSP, SHA, Action run URL, pass/fail/manual counts excluding A001, and the module's tag CI run.
   - Under each criterion, kept verbatim: `**Automated result: PASS/FAIL/MANUAL (ID).**`, `**Additional evidence:**`, `**Follow-up:**`.
   - Delete the Frontend section.
   - A concrete `## TCR Process Improvements` section and `## Footnotes`.
   - References: TCR-88 mod-users ([tech-council PR #132](https://github.com/folio-org/tech-council/pull/132)) and TCR-87 mod-tags.
   - Check that every template criterion line is still present verbatim (a script compares each `* [ ] ` text).
8. **Put PO questions and the gap summary in a separate file**, not in the writeup. The evaluator posts them to Jira.

## Known recurring findings in Spring Way (folio-spring-base) modules
- **Liquibase 5.x is FSL-1.1-ALv2 (Category X).** folio-spring-base 10.0.1 pins 4.33.0, but `spring-boot-starter-parent` 4.1.x overrides it with 5.0.3.
  - Each module needs its own `<liquibase.version>4.33.0</liquibase.version>` (as in mod-rtac-cache MODRTACHCE-58).
  - Trillium CSP 1 tickets (e.g. MODTAG-149) bumped Spring Boot and folio-spring-base without the override. Check the CSP ticket's commit diff.
  - Treat a missing override as a module gap, not a TC question.
- **Missing README Category B label** (the mod-notes README is the model). The usual list is jakarta.annotation-api, jakarta.transaction-api, aspectjweaver, sisu.plexus, rhino, and cql-java (LGPL).
- **`_tenant` 2.0 is NOT a finding.** The module descriptor's `GET, DELETE /_/tenant/{id}` block is the canonical Okapi-guide snippet. Modules that finish `POST /_/tenant` synchronously with 204 never get the polling GET, so folio-spring-base's unimplemented `getTenant` doesn't matter. Cite the test asserting 204. `_tenant` documentation is the official tenant.raml.
- **Env vars:**
  - `${DB_PASSWORD:folio_admin}`-style defaults (both a default credential and no fail-fast).
  - Module descriptor env entries without `description`/`required`.
  - Stale RMB-era `DB_MAXPOOLSIZE`; the library reads `DB_MAXSHAREDPOOLSIZE`, `DB_MINSHAREDPOOLSIZE`, `DB_CONNECTIONRELEASEDELAY`, `DB_MAX_LIFETIME`, `DB_QUERYTIMEOUT`, `DB_CHARSET`.
- **Actuator** often has health indicators disabled, so health is `UP` even when the DB is down. Note this only as an observation. Direct-container exposure of `loggers`/`env` is out of scope.
- **PERSONAL_DATA_DISCLOSURE** forms are often on template v1.0. The folio-spring-base log pattern logs the user UUID ("logs personal data").
- **Integration tests:** B009 only checks that Karate files exist. Verify the runner's `classpath:` paths resolve (mod-tags points at `promin/` while the files are under `spitfire/`).

## Frontend modules (not yet exercised)
Keep the Frontend section and delete Backend. Add F-criteria: okapiInterfaces in package.json, react-intl/en.json, an axe DevTools WCAG 2.1 AA check, the Stripes version, and Chrome. tc-module-eval F001/F002/F004 apply; F004 needs a test environment login.
