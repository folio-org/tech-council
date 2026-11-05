
# FOLIO Module Acceptance Values and Criteria: mod-users

## version 3.0 (ratified 2025-01-25) — existing module evaluation, TCR-88 (October 6, 2026)

## Overview

The Technical Council (TC) has defined a process for technical evaluation of modules for inclusion in a FOLIO release. This document outlines the high level values and specific criteria used when evaluating modules as part of this process. The distinction between values and criteria is as follows:

- **Values** are high-level factors that are unlikely to change over time. They should be understandable even to a non-technical audience.
- **Criteria** are specific, verifiable tests as to how we’re meeting the Values within the current state of affairs. Criteria will evolve over time to respond to changes in the Project’s technology stack, current best practices, etc. They may require a degree of technical expertise or domain knowledge to fully understand.

In some cases, we may not yet have comprehensive Criteria for assessing a module’s adherence to a Value. In such cases, subjective review and analysis will be applied, and may lead to discussion.

This document provides the criteria against which a module will be assessed for inclusion into a FOLIO release, following the [New Module Technical Evaluation Process](NEW_MODULE_TECH_EVAL.MD).

Existing FOLIO modules ideally conform to the same Values and Criteria. It is understood that not all existing modules currently do so, especially modules created before the Values & Criteria were initially defined. The Technical Council will work with development teams to align the current reality of the code with the Values and Criteria over time, as practicable. Such processes will need to be developed and documented. The Technical Council is currently piloting an existing module evaluation process with a few initial modules, and has noted below with "For existing module evaluation" where individual criteria will be handled differently.

Please see [Before Development](NEW_MODULE_TECH_EVAL.MD#before-development) for any planned development to new or existing modules that may intentionally diverge from these Values or Criteria.

## How to use this document

When performing a technical evaluation of a module, create a copy of this document. The evaluation results should be placed in the [module_evaluations](https://github.com/folio-org/tech-council/tree/master/module_evaluations) directory and should conform to the following naming convention: `{JIRA Key}_YYYY-MM-DD-{module name}.MD`, e.g. `TCR-1_2021-11-17-mod-foo.MD`. The date here is used to differentiate between initial and potential re-evaluation(s). It should be the date when the evaluation results file was created.

Replace the title with the name of the module or library.

Remove either the Frontend or the Backend section.

Use these conventions to indicate the status of each criterion.

* [x] ACCEPTABLE
* [x] ~INAPPLICABLE~
* [ ] UNACCEPTABLE
  - comments on what was evaluated/not evaluated, why a criterion failed

## Values

1. Module adheres to Community Code of Conduct
2. Module license is compatible with the FOLIO Project
3. Module can be included in existing community build processes
4. Module has robust testing that can run with existing community testing processes
5. Module can be deployed in the Community’s reference environments without undue burden
6. Module is secure
7. Module is multi-tenant
8. Module is internationalized
9. Module meets current accessibility requirements
10. Module offers a cohesive user experience consistent with the rest of FOLIO
11. Module has developer and end-user documentation
12. Module depends ONLY on other modules and infrastructure that are already included in FOLIO
13. Module has a long-term development and maintenance plan
14. Module is scalable
15. Module supports high availability
16. Modules conforms to FOLIO upgrade mechanisms

## Criteria


**Evaluation scope:** Backend module `mod-users`, release `v19.6.2`. The initial evaluation was dated October 6, 2026. The supplemental agent-assisted evaluator ran on November 4, 2026, against commit `361c1ff7092752c164696152b2dc3c08606d83f5`. Results from different revisions are identified separately. The supplemental run reported **12 passed, 4 failed, and 15 requiring manual review**; this count excludes the inapplicable Product Council criterion. A failed automated check does not necessarily establish a software defect.

### Administrative

* [x] ~INAPPLICABLE~ Listed by the Product Council on [Functionality Evaluated by the PC](https://folio-org.atlassian.net/wiki/spaces/PC/pages/4885367/Functionality+Evaluated+by+the+PC) with a positive evaluation result.
  - For existing module evaluation: This criterion is inapplicable.


### Shared/Common

* [x] ACCEPTABLE Uses Apache 2.0 license (2)
  - **Automated result: PASS.** The evaluator identified the Apache 2.0 license.

* [x] ACCEPTABLE Module build MUST produce a valid module descriptor (3, 5)
  - *This is not applicable to libraries*
  - **Automated result: PASS.** The build-generated module descriptor passed schema validation.
  - **Additional evidence from the earlier review:** The earlier review ran `mvn process-resources -DskipTests` and validated the generated `target/ModuleDescriptor.json` against the Okapi schema.

* [ ] UNACCEPTABLE Inclusion of third party dependencies complies with [ASF 3rd Party License Policy](https://apache.org/legal/resolved.html) (2)
  - Uses README for [Category B Appropriately Labelled Condition](https://apache.org/legal/resolved.html#appropriately-labelled-condition)
  - LGPL consideration:
    - org.z3950.zing:cql-java is allowed if appropriately labelled, even if it is LGPL-2.1-only
    - org.marc4j:marc4j is allowed if appropriately labelled, even if it is LGPL-2.1-or-later
    - org.hibernate.\* is allowed if appropriately labelled, even if it is LGPL-2.1-or-later
    - By [request of the Community Council](https://folio-org.atlassian.net/wiki/spaces/CC/pages/1243348996/2025-09-26+Community+Council+Meeting+Minutes+at+WOLFcon), and until that request changes, no additional LGPL-licensed dependencies will be allowed.
  - *note: If a library declares multiple licenses in its pom.xml, [only one of them needs to comply](https://maven.apache.org/ref/3.9.11/maven-model/maven.html#project).* (This applies only to Maven. For other package managers, closer evaluation is needed.)
  - *note: The [FOLIO Module Evaluator](https://github.com/folio-org/tc-module-eval) tool is optionally available to evaluate this criterion for Java modules (built with Maven) and for front-end modules. TC expects to [require its use](https://github.com/folio-org/tech-council/pull/110) in the module evaluation process after a trial period.*
  - *note: [More information about this criterion](https://github.com/folio-org/tech-council/blob/master/criteria/THIRD_PARTY_DEPENDENCIES.MD)*
  - **Latest agent-enabled evidence: MANUAL REVIEW.** The evaluator examined 172 dependencies and reported no prohibited licenses. It flagged 12 Category B dependencies not named in the README (including `org.z3950.zing:cql-java`, EPL-2.0, and CDDL-1.1 dependencies) and two license names not in its known-license list: `javax.mail:mailapi:1.4.3` (CDDL) and `org.bouncycastle:bcprov-jdk18on:1.81` (Bouncy Castle Licence). **Follow-up:** Check required README labeling and manually verify the two unrecognized licenses against ASF policy. These findings do not establish that prohibited licenses are present.
  - **Additional evidence from the earlier review:** The earlier dependency inventory identified `org.z3950.zing:cql-java` as LGPL-licensed; its required Category B labeling was not found in `README.md`. The template also lists conditional exceptions for `marc4j` and `org.hibernate.*`. Verify the classification and labeling; a license violation is not established by this observation alone.

* [ ] UNACCEPTABLE Installation documentation is included (11)
  - -*note: read more at [https://github.com/folio-org/mod-search/blob/master/README.md](https://github.com/folio-org/mod-search/blob/master/README.md)*
  - *This is not applicable to libraries*
  - **Automated result: MANUAL REVIEW.** The README includes installation instructions. A reviewer still needs to confirm that all important setup steps are covered.
  - **Additional evidence from the earlier review:** The [release README](https://github.com/folio-org/mod-users/blob/v19.6.2/README.md) is present; completeness of installation and configuration instructions remains to be checked.

* [ ] UNACCEPTABLE [Personal data form](https://github.com/folio-org/personal-data-disclosure) is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file (6)
  - *This is not applicable to libraries*
  - **Automated result: FAIL (S005).** The repository uses `PERSONAL_DATA_DISCOSURE.md` rather than the required `PERSONAL_DATA_DISCLOSURE.md`. This is a filename failure, not proof that the disclosure text is inaccurate. Our earlier review also identified personal data transmitted in Kafka events and handled in consortium-user data flows. The agent raised additional questions about profile-picture storage and personal information in logs (such as usernames, barcodes, and UUIDs). **Follow-up:** Correct the filename and compare the disclosure with Kafka events, consortium-user data flows, profile-picture storage, and logging before deciding whether the content is complete. These data flows are evidence for review; omissions from the disclosure have not all been confirmed.
  - **Additional evidence from the earlier review:** The earlier review of [UserEventProducer.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/event/service/UserEventProducer.java) and [UsersService.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/service/UsersService.java) identified personal information in Kafka events and consortium-user data. Check free-form fields, caching, logging, and profile-picture storage against the disclosure.

* [ ] UNACCEPTABLE Sensitive and environment-specific information is not checked into git repository (6)
  - **Automated result: MANUAL REVIEW.** A reviewer should check that the repository contains no real passwords, secrets, or private personal information. A test file named `user8.json` contains realistic contact details, but we do not know whether they belong to a real person.
  - **Additional evidence from the earlier review:** The earlier review identified a name, `si.edu` email domain, and phone number in [user8.json](https://github.com/folio-org/mod-users/blob/v19.6.2/src/test/resources/users/user8.json); [user9.json](https://github.com/folio-org/mod-users/blob/v19.6.2/src/test/resources/users/user9.json) appears to use fictional details. It has not been established whether `user8.json` contains a real person’s data.

* [ ] UNACCEPTABLE There is no default for any password, access key, private key or any other credential (6)
  - **Source verification (November 5):** The `v19.6.2` Module Descriptor template includes credential values in its `launchDescriptor` environment configuration. `DB_USERNAME` and `DB_PASSWORD` are both set to `folio_admin`. The `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` entries contain recognizable example AWS credentials. These are actual values in the template, not simply declarations of environment variable names.
  - **Additional evidence:** `FolioS3ClientFactory.java` reads AWS credentials from environment variables or Java system properties. No hardcoded fallback credentials were identified in that class.
  - **Conclusion: UNACCEPTABLE pending clarification.** The descriptor contains default credential values, although the AWS values appear to be examples. We have not established that these credentials are used in production or that real secrets have been exposed. Confirm whether the `launchDescriptor` values are strictly illustrative or can be used during deployment. If they can be used, the development team should consider removing credential defaults and requiring administrators to supply appropriate values.
  - **Sources:** [Module Descriptor template](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json), [FolioS3ClientFactory.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/service/storage/FolioS3ClientFactory.java).

* [ ] UNACCEPTABLE Written in a language and framework from the [officially supported technologies](https://folio-org.atlassian.net/wiki/spaces/TC/pages/5053681/Officially+Supported+Technologies) page[^1] (3, 5)
  - **Automated result: FAIL (S007).** The evaluator identified RAML Module Builder (RMB) `36.0.0` in the module's Maven configuration, while the supported-technologies list it checked identified RMB 35.
  - **Policy verification (November 5):** The publicly accessible Umbrellaleaf supported-technologies page reviewed during this evaluation was marked DRAFT. The Technical Council criterion requires comparison against the latest ACTIVE release. We have not confirmed that RMB 35 is the required version under that ACTIVE policy.
  - **Conclusion: Manual confirmation required.** The automated evaluator reported a version mismatch, but its applicability to the required ACTIVE policy remains unverified. This does not establish that RMB 36 is unsupported or unsafe. Confirm the latest ACTIVE supported-technologies list and compare its RMB requirement with `mod-users v19.6.2` before making a final determination.
  - **Sources:** [mod-users v19.6.2 Maven configuration](https://github.com/folio-org/mod-users/blob/v19.6.2/pom.xml), [Officially Supported Technologies](https://folio-org.atlassian.net/wiki/spaces/TC/pages/5053681/Officially+Supported+Technologies).

* [x] ACCEPTABLE Uses FOLIO interfaces already provided by previously accepted modules (3,5,12)
  - **Automated result: PASS.** The evaluator found that consumed interfaces are already supplied within the accepted platform.

* [x] ACCEPTABLE Must not depend on a FOLIO library that has not been approved through the TCR process.
  - **Automated result: PASS.** The evaluator found no unapproved FOLIO library dependency in its approved-library check.

* [ ] UNACCEPTABLE Gracefully handles the absence of third party systems or related configuration. (3, 5, 12)
  - **Automated result: MANUAL REVIEW (S010).** The evaluator identified some failure-handling paths for PostgreSQL, Kafka, and S3-compatible object storage, but could not establish behavior for every outage or timeout. **Follow-up:** Verify database startup and recovery, Kafka-disabled outbox processing and delivery failures, S3 failures and timeouts, and cleanup if a Kafka producer cannot shut down normally. Some object-storage exceptions return HTTP 404; confirm that response is appropriate. These are questions for verification, not confirmed module-wide defects.


  - *Note: This applies to optional third-party integrations and their configurations only. Required environment variables (those without sensible defaults) should fail fast on startup per the Environment Variables Policy.*
* [ ] UNACCEPTABLE Sonarqube hasn't identified any security issues, any high or greater severity issues, or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  - **Automated result: MANUAL REVIEW.** An earlier SonarQube/SonarCloud review reported **0 security issues** and **26 other issues** for a `19.7.0-SNAPSHOT` build. These are useful historical findings, but that build is not the `v19.6.2` release under review. **Follow-up:** Confirm the original analysis labels (including whether “security issues” means security hotspots or another measure), check results for the exact evaluated release, and review any high-severity findings, duplication, and rule exceptions. Do not treat the earlier figures as verified results for `v19.6.2`.

  - See [Rule Customization](https://dev.folio.org/guides/code-analysis/#rule-customization) details.
* [x] ACCEPTABLE Uses [officially supported](https://folio-org.atlassian.net/wiki/spaces/TC/pages/5053681/Officially+Supported+Technologies) build tools (3, 5, 13)
  - **Automated result: PASS.** The evaluator identified officially supported build tools.

* [ ] UNACCEPTABLE Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://folio-org.atlassian.net/wiki/spaces/TC/pages/5053681/Officially+Supported+Technologies)[^1] (3, 4)
  - **Automated result: MANUAL REVIEW (S013).** SonarCloud reported **91.2%** coverage, above the required **80%**, but the coverage result was for commit `2a7a624`, not the evaluator's commit `361c1ff7092752c164696152b2dc3c08606d83f5`. The evaluator found JUnit, Testcontainers, and REST Assured. **Independent source check (November 5):** The [`v19.6.2` Maven configuration](https://github.com/folio-org/mod-users/blob/v19.6.2/pom.xml) declares Java 21, JUnit BOM `6.0.3`, Testcontainers BOM `2.0.4`, and REST Assured `6.0.0`. These declarations establish the intended tools and versions, not whether the test suite passed or the coverage figure applies to this release. **Policy review (November 5):** The publicly accessible Umbrellaleaf page is a DRAFT, not the applicable ACTIVE release policy; it lists JUnit, REST Assured, and Testcontainers as supported test tools. FOLIO’s [coverage documentation](https://dev.folio.org/faqs/how-to-integrate-coverage-reports/) explains that backend Maven modules use JaCoCo results in SonarCloud. **Follow-up:** Obtain a SonarCloud or JaCoCo coverage report tied to `v19.6.2` (or an explicitly accepted equivalent commit), and check the tools against the applicable ACTIVE release policy. The SonarCloud project overview could not be retrieved in this review.


  - **Additional evidence from the earlier review:** The earlier review reported 99.1% coverage for `v19.6.2`; the agent-assisted evaluator reported 91.2% for SonarCloud commit `2a7a624`, not the evaluator commit. Both exceed 80%, but the revisions should not be treated as interchangeable; neither figure has been independently verified against a release-specific coverage report during this check.
  - **Reason for provisional UNACCEPTABLE status:** The available coverage figures exceed 80%, but they have not been tied conclusively to the exact code revision under evaluation. This status records incomplete verification, not evidence of insufficient coverage. Confirm the matching release analysis and the support status of testing technologies before making a final decision.

* [ ] UNACCEPTABLE Assigned to exactly one application descriptor within the FOLIO Community LSP Platform, specified in the Jira task for this module evaluation (3, 5)
  - **Automated result: PASS.** The agent-assisted evaluator reported a pass for application assignment; the earlier review found `mod-users` in `app-platform-minimal` and `app-platform-full`. Clarify how the Council interprets the exactly-one requirement before marking this criterion acceptable.

  - *The FOLIO Community LSP Platform is defined at [https://github.com/folio-org/platform-lsp](https://github.com/folio-org/platform-lsp).*
### Backend

Note: Backend criteria apply to modules, shared backend libraries, and edge modules.

* [x] ACCEPTABLE Module’s repository includes a compliant Module Descriptor (3, 5)
  - -*note: read more at [https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json](https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json)*
  - **Automated result: PASS.** The committed ModuleDescriptor template passed the evaluator’s compliance check.
  - **Additional evidence from the earlier review:** The earlier review distinguished schema validation of the **generated** descriptor from a complete review of the **committed** descriptor. The newer evaluator reported a pass for the backend descriptor check; retain the distinction between the two checks.

* [x] ACCEPTABLE For each consumed API the module descriptor MUST include the interface requirement in the `"requires"` or `"optional"` section (3, 5)
  - *This is not applicable to libraries*
  - **Automated result: PASS.** The evaluator matched all three identified outgoing interface requests to declared optional interfaces (`configuration` and `feesfines`).
  - **Additional evidence from the earlier review:** The earlier review had not completed an endpoint-by-endpoint comparison of consumed APIs; the supplemental evaluator matched **three** outgoing interface requests to declared optional `configuration` and `feesfines` interfaces.

* [x] ACCEPTABLE Module includes executable implementations of all endpoints in the provides section of the Module Descriptor
  - **Automated result: MANUAL REVIEW (B003).** The evaluator identified 55 non-system API operations and directly matched 43 to their implementations. The remaining 12 operations required additional review. This automated result reflects the status at the time of the November 4 evaluation.
  - **Additional verification (November 5):** Four patron-group operations (GET, POST, PUT, DELETE) were identified in `UserGroupAPI.java`. The remaining eight custom-fields operations are implemented in the external `folio-custom-fields` library. The `mod-users v19.6.2` Maven configuration declares `folio-custom-fields` version `3.0.0`, and the corresponding `CustomFieldsImpl.java` contains all eight required methods: `postCustomFields`, `putCustomFields`, `getCustomFields`, `getCustomFieldsById`, `deleteCustomFieldsById`, `putCustomFieldsById`, `getCustomFieldsStatsById`, and `getCustomFieldsOptionsStatsByIdAndOptId`.
  - **Conclusion: ACCEPTABLE.** All 55 declared non-system API operations have corresponding implementations identified in the reviewed source code and the version-matched external library (43 directly matched, four patron-group operations, and eight custom-fields operations). No missing implementations were identified. This satisfies the criterion's requirement for executable implementations. Runtime behavior and successful deployment have not been independently verified and remain separate testing considerations.
  - **Supporting evidence:** [mod-users v19.6.2 Maven configuration](https://github.com/folio-org/mod-users/blob/v19.6.2/pom.xml), [Module Descriptor](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json), [UsersAPI.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/rest/impl/UsersAPI.java), [UserGroupAPI.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/rest/impl/UserGroupAPI.java), and [folio-custom-fields v3.0.0 CustomFieldsImpl.java](https://github.com/folio-org/folio-custom-fields/blob/v3.0.0/src/main/java/org/folio/rest/impl/CustomFieldsImpl.java).

* [ ] UNACCEPTABLE Environment variables comply with [FOLIO Policy](https://folio-org.atlassian.net/wiki/x/NYCgTg) (5, 11)
  - [All environment variables documented in ModuleDescriptor with required fields](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#3.3-ModuleDescriptor-Enhancement)
  - [Variables properly classified as required or optional](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#4.-Required-vs.-Optional-Variables)
  - [Variable names follow standardized naming conventions](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#2.-Naming-Conventions)
  - [Module implements proper startup behavior](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#4.2-Startup-Behavior)
  - [No sensitive information logged during startup configuration logging](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#6.1-Startup-Configuration-Logging)
  - **Automated result: FAIL (B004).** Object-storage settings include `AWS_URL`, `AWS_BUCKET`, `AWS_REGION`, `AWS_ACCESS_KEY_ID`, and `AWS_SECRET_ACCESS_KEY` credentials; the evaluator flagged the lack of corresponding standardized `S3_` names or aliases. The existing names may already be used in deployments. **Follow-up:** Confirm the naming policy and consider a compatible transition rather than changing working installations without a plan. The remaining configuration, startup, and logging subchecks still require review.
  - **Additional evidence from the earlier review:** The earlier review also called for verification of all five policy subchecks: documentation, required/optional classification, standardized names, startup behavior, and sensitive-value logging. The code reads some object-storage settings from environment variables or Java system properties.

* [ ] UNACCEPTABLE If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section, and must conform to FOLIO [interface naming conventions](https://dev.folio.org/guidelines/naming-conventions/#interfaces) (3, 5)
  - **Automated result: MANUAL REVIEW.** The module lists the APIs it provides. A reviewer still needs to confirm that their names follow FOLIO guidelines.

* [ ] UNACCEPTABLE All API endpoints are documented in OpenAPI (11)
  - For existing module evaluation: RMB-based modules may continue using RAML instead.
  - **Independent documentation check (November 5):** The FOLIO developer API index publishes RAML documentation for `mod-users` (including users, groups, settings, and other interfaces). Source: [FOLIO API documentation index](https://dev.folio.org/reference/api/).
  - **Version-matched documentation verification (November 5):** `folio-custom-fields` tag `v3.0.0` contains `ramls/custom-fields.raml`, documenting the eight descriptor operations: GET, POST and PUT `/custom-fields`; GET, PUT and DELETE `/custom-fields/{id}`; GET `/custom-fields/{id}/stats`; and GET `/custom-fields/{id}/options/{optId}/stats`. The custom-fields portion of the earlier documentation gap is therefore accounted for in the version-matched library. This does not constitute a fresh exhaustive comparison of all other `mod-users` operations. Source: [folio-custom-fields v3.0.0 RAML](https://github.com/folio-org/folio-custom-fields/blob/v3.0.0/ramls/custom-fields.raml).
  - **Automated result: MANUAL REVIEW (B006).** Existing RMB-based modules may use RAML. The evaluator identified **47 of 55** operations in local RAML and **eight** custom-fields operations in the external `folio-custom-fields` specification. Earlier review also located tenant administration documentation in FOLIO's shared `tenant.raml`, the tenant API reference, and the Okapi tenant guide. **Follow-up:** The eight custom-fields operations have now been matched to the version-specific RAML (see above); finish any remaining operation-by-operation documentation checks.
  - **Additional evidence from the earlier review:** The earlier review located tenant-system documentation in [tenant.raml](https://github.com/folio-org/raml/blob/raml1.0/ramls/tenant.raml), the [tenant API reference](https://s3.amazonaws.com/foliodocs/api/raml/r/tenant.html), and the [Okapi tenant guide](https://github.com/folio-org/okapi/blob/master/doc/guide.md#enabling-for-a-tenant). Existing RMB-based modules may use RAML. The version-matched `folio-custom-fields` documentation was confirmed November 5.
**Existing-module consideration:** The Technical Council's Module Acceptance Criteria explicitly permit existing RMB-based modules to continue using RAML instead of OpenAPI. Because `mod-users` is an existing RMB-based module, its use of RAML is acceptable under this exception. The review should still confirm that the required API endpoints are documented. Any remaining documentation gaps should be recorded as opportunities for improvement rather than treated as automatic exemptions.

* [ ] UNACCEPTABLE All API endpoints protected with appropriate permissions as per the [Permission Naming Guidelines](https://folio-org.atlassian.net/wiki/x/BgDtY), e.g. avoid using *.all permissions, all necessary module permissions are assigned, etc. (6)
  - Review whether each API endpoint is protected by an appropriate permission and whether permission names follow the [FOLIO Permission Naming Guidelines](https://folio-org.atlassian.net/wiki/x/BgDtY). The [module descriptor template](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json) declares permissions for the inspected handlers. However, a complete comparison of API endpoints against their required permissions has not been documented. This review therefore does not establish that all endpoints have appropriate permission declarations. Enforcement by Okapi, folio-kong, or the module sidecar is outside the scope of this criterion.
  - **Independent descriptor check (November 5):** The `v19.6.2` descriptor contains `permissionsRequired` declarations for inspected operations, including user endpoints. This supports the existence of permission mappings but does not verify that all 55 operations have suitable permissions or that field-level access is protected. Source: [module descriptor](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json).
  - **Automated result: MANUAL REVIEW (B007).** The evaluator identified required permissions for **55** operations. The agent flagged bulk `DELETE /user-tenants`, **eight** custom-fields operations, and **39** older permission-naming patterns for closer review. **Follow-up:** Confirm that the declared permissions are appropriate and consistent with FOLIO naming guidance. Runtime enforcement and field-level protection are separate questions; the review did not establish a confirmed permissions defect.
  - **Additional evidence from the earlier review:** The earlier review distinguished permission **declarations** from runtime enforcement by Okapi, folio-kong, or a sidecar. The latter is outside this specific checklist criterion.
  - **Targeted descriptor verification (November 5, `v19.6.2`):** Counting each HTTP method and path separately, the module descriptor contains **61 operations**. **55** have nonempty `permissionsRequired` declarations. The other **six** are three tenant-management operations (`POST /_/tenant`, `GET /_/tenant/{id}`, `DELETE /_/tenant/{id}`) and three scheduled/internal operations (`POST /users/expire/timer`, `POST /users/outbox/process`, `POST /users/profile-picture/cleanup`). These six need to be assessed under their intended internal access controls rather than automatically classified as unprotected public endpoints. All **eight** custom-fields operations have `permissionsRequired` entries; some also declare `modulePermissions`. `DELETE /user-tenants` declares `user-tenants.item.delete`. This confirms the presence of mappings, **not** their suitability or enforcement. Source: [v19.6.2 module descriptor](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json). The evaluator's 55-operation count and the 61-operation descriptor count therefore have different scopes; neither number should be silently substituted for the other.

* [x] ACCEPTABLE Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value (3, 16)
  - **Automated result: PASS (B008).** Starting data is included in `src/main/resources/ref-data/addresstypes-15.4.0` and `groups-17.3.0`; `TenantRefAPI.java` loads reference data during tenant initialization. The repository also includes `ReferenceAndSampleDataMigrationIT.java` for migration testing. **Optional follow-up:** Confirm that upgrades preserve tenant-customized values where applicable; this does not change the automated PASS.
  - **Additional evidence from the earlier review:** Earlier evidence also included [ReferenceAndSampleDataMigrationIT.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/test/java/org/folio/rest/impl/ReferenceAndSampleDataMigrationIT.java) and version-aware loading in [TenantRefAPI.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/rest/impl/TenantRefAPI.java). These support reference-data migration, although preservation of tenant-customized values may warrant a targeted check.

* [ ] UNACCEPTABLE If provided, integration (API) tests must be written in an [officially supported technology](https://folio-org.atlassian.net/wiki/spaces/TC/pages/5053681/Officially+Supported+Technologies)[^1] (3, 4)
  - -*note: while it's strongly recommended that modules implement integration tests, it's not a requirement*
  - -*note: these tests are defined in [https://github.com/folio-org/folio-integration-tests](https://github.com/folio-org/folio-integration-tests)*
  - **Automated result: MANUAL REVIEW (B009).** The evaluator found no Karate `.feature` files in the `mod-users` repository. Its lookup of the separate `folio-integration-tests` repository reached the **120-second limit**, so the external tests were not checked. Earlier review identified a possible `folio-integration-tests/mod-users` test location, which should be inspected directly. The Java `*IT.java` tests within this module are not automatically equivalent to Karate API tests. **Follow-up:** Confirm whether external API tests exist and use a supported technology. The timeout is an incomplete check, not a failed test.
  - **Additional evidence from the earlier review:** The earlier review identified a possible Karate test location in [folio-integration-tests/mod-users](https://github.com/folio-org/folio-integration-tests/tree/master/mod-users/src/test/java/org/folio). Java `*IT.java` module tests are not necessarily the same as the external Karate API tests addressed by this criterion.

* [ ] UNACCEPTABLE Data is segregated by tenant at the storage layer (6, 7)
  - **Automated result: MANUAL REVIEW (B010).** Inspected database operations use RMB's tenant-specific PostgreSQL schema, and profile-picture storage paths include tenant identifiers. No shared tenant-data cache was found. However, four SQL snippets referenced by `schema.json` were absent from the evaluator snapshot: `create_custom_fields_table.sql`, `custom_fields_metadata_cleanup.sql`, `update-textbox-default-format.sql`, and `migrate-to-new-ref-id-format.sql`. **Follow-up:** Locate and inspect those scripts, then consider a two-tenant test. No cross-tenant data leak was confirmed.
  - **Additional evidence from the earlier review:** The earlier review examined tenant-aware database selection in [RecordRepositoryImpl.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/service/impl/RecordRepositoryImpl.java) and tenant-header handling in [UserOutboxService.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/event/service/UserOutboxService.java).

* [x] ACCEPTABLE The module doesn’t access data in DB schemas other than its own and public. Exception: [FOLIO Query Machine](https://folio-org.atlassian.net/wiki/spaces/TC/pages/852852742/0011-Folio+Query+Machine+FQM) and its modules are the mechanism through which we provide read access across DB storage boundaries. (6, 7)
  - **Automated result: PASS (B011).** The evaluator searched **86** SQL scripts, changelogs, and source files, with comments removed. It found **zero** references to another module's database schema; the module's own schema follows the `<tenant>_mod_users` pattern. This is a source-code check, not a live database test.
  - **Additional evidence from the earlier review:** The earlier targeted check also found `public.uuid_generate_v4()` in a configuration-table SQL script. Use of the allowed `public` schema for that function is not evidence of accessing another module’s data. The newer evaluator checked 86 files, a broader source scan than the earlier targeted review.

* [ ] UNACCEPTABLE Any dependencies, other than on defined interfaces, are declared in the README.md.
  - **Automated result: FAIL (B012).** `README.md` mentions **S3** storage but does not explicitly name **PostgreSQL** or **Apache Kafka**, even though `schema.json`, `pom.xml`, and the module descriptor show their use. **Follow-up:** Explain in the README what PostgreSQL and Kafka do, and check that any Kafka topics exchanged with other modules are documented. This is a documentation finding, not evidence that those services fail at runtime.
  - **Additional evidence from the earlier review:** The earlier review identified optional `feesfines` and `configuration` interfaces in the [module descriptor](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json). Confirm that the README explains dependencies beyond defined FOLIO interfaces and the relevant Kafka topics.

* [ ] UNACCEPTABLE The module responds with a tenant’s content based on x-okapi-tenant header (7)
  - **Automated result: MANUAL REVIEW (B013).** Ten inspected request handlers use `X-Okapi-Tenant` through FOLIO's tenant-aware mechanisms. Three consortium Kafka consumers read tenant information from message headers. No fixed or shared tenant was identified; the agent considered the implementation likely sufficient, with medium confidence. **Follow-up:** Confirm that external consortium event producers always include the correct tenant header.
  - **Additional evidence from the earlier review:** The earlier review found `X-Okapi-Tenant` set in [AbstractRestTest.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/test/java/org/folio/moduserstest/AbstractRestTest.java). This supports tenant-aware request handling but does not replace an end-to-end response-isolation test.

* [x] ACCEPTABLE Standard GET /admin/health endpoint returning a 200 response (5)
  - -*note: read more at [https://folio-org.atlassian.net/wiki/spaces/DD/pages/1777917/Back+End+Module+Health+Check+Protocol](https://folio-org.atlassian.net/wiki/spaces/DD/pages/1777917/Back+End+Module+Health+Check+Protocol)*
  - **Automated result: PASS (B014).** RMB supplies `GET /admin/health`. `InstallUpgradeIT.java` includes a test expecting HTTP **200** with body **`OK`**; earlier review identified a successful automated build that runs this test. The new evaluator inferred the endpoint from configuration rather than sending a live request. Database-outage behavior remains part of S010, not this result.
  - **Additional evidence from the earlier review:** The earlier review found [InstallUpgradeIT.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/test/java/org/folio/rest/InstallUpgradeIT.java#L43) expecting HTTP **200** and body **`OK`**, and linked a [successful GitHub Actions job](https://github.com/folio-org/mod-users/actions/runs/38407868759/job/115332182136) that executes the test. The supplemental evaluator did not make a live health request.

* [ ] UNACCEPTABLE High Availability (HA) compliant (5, 14, 15)
  - Possible red flags:
    - Connection affinity / sticky sessions / etc. are used
    - Local container storage is used
    - Services are stateful
  - **Automated result: MANUAL REVIEW (B015).** The agent found no sticky-session requirement, local persistent tenant-data files, or obvious single-instance dependency. It noted tenant-prefixed object-storage paths, database-backed outbox coordination, and per-instance clients that can be recreated. It judged the design likely sufficient with medium confidence. **Follow-up:** Verify behavior with more than one running instance; no multi-instance test was established.
  - **Additional evidence from the earlier review:** Earlier review identified tenant-specific object-storage keys in [ProfilePictureStorage.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/service/storage/ProfilePictureStorage.java); this alone does not establish multi-instance behavior.

* [x] ACCEPTABLE Module only uses infrastructure / platform technologies on the [officially supported technologies](https://folio-org.atlassian.net/wiki/spaces/TC/pages/5053681/Officially+Supported+Technologies) list.[^1]
  - *e.g. PostgreSQL, ElasticSearch, etc.* (3, 5, 12)
  - **Automated result: PASS (B016).** The evaluator matched **PostgreSQL**, **Apache Kafka**, and **S3-compatible object storage** to FOLIO's supported infrastructure list. It reviewed dependencies and configuration, but did not verify deployed server versions or every indirect dependency. The RMB 36-versus-35 policy mismatch is recorded separately under S007.
  - **Additional evidence from the earlier review:** The earlier review also noted Java 21, Vert.x, Kafka, PostgreSQL, and FOLIO object-storage components in [pom.xml](https://github.com/folio-org/mod-users/blob/v19.6.2/pom.xml). The infrastructure pass is distinct from the S007 RMB 36.0.0 versus published RMB 35 policy mismatch.

## TCR Process Improvements

The November 4 evaluation used agent review, providing richer evidence than the current GitHub Actions workflow. The agent-assisted evaluator helped us locate source evidence and focus our manual review. Our evaluation of `mod-users` also identified six practical improvements to the evaluation process:

1. **Separate filename checks from reviews of document content.** **Example — S005:** The evaluator correctly reported that `PERSONAL_DATA_DISCOSURE.md` does not match the required filename `PERSONAL_DATA_DISCLOSURE.md`. That is a clear filename failure. A separate review is still needed to determine whether the disclosure accurately covers Kafka events, consortium-user data flows, profile-picture storage, and personal information in logs. Reporting these as distinct checks would make the result clearer.

2. **Check functionality and documentation provided by external libraries.** **Example — B003 and B006:** Of 55 API operations, eight custom-fields operations come from the external `folio-custom-fields` library rather than code and RAML maintained directly in `mod-users`. The evaluator should follow the version of that library actually used by the module before deciding that an implementation or its documentation cannot be verified.

3. **Explain the difference between a policy-version mismatch and a confirmed technical problem.** **Example — S007:** `mod-users` declares RAML Module Builder (RMB) `36.0.0`, while the supported-technologies list examined by the evaluator identifies RMB 35. This produces a policy-check failure, but it does not by itself show that RMB 36 is unsafe or broken. The evaluator should retain the policy result while clearly explaining what has and has not been established.

4. **Give reviewers a place to record evidence and decisions for each manual item.** **Example — B003:** The automated check matched 43 of 55 operations. Agent review then located four more patron-group operations in `UserGroupAPI.java`, leaving eight external custom-fields operations to verify. Recording these findings against the individual checklist items would show what has been resolved and what remains open, without repeating the work in a separate report.

5. **Show incomplete external lookups separately from failed requirements.** **Example — B009:** The evaluator could not inspect the separate `folio-integration-tests` repository because the lookup reached its 120-second limit. That is not evidence that API tests are missing or failing. A clear “unable to verify” result would help reviewers decide what to check next.

6. **Check that SonarCloud results match the version being evaluated.** **Example — S013:** SonarCloud reported **91.2% test coverage** for commit `2a7a624`, while the agent-assisted evaluator examined commit `361c1ff7092752c164696152b2dc3c08606d83f5`. The earlier code-quality review also reported **0 security issues and 26 other issues** for a `19.7.0-SNAPSHOT` build. Because these analyses do not clearly match the exact release under review, the evaluator should identify the analyzed commit or build and flag any mismatch. Confirming suitable analysis before starting a review would reduce uncertainty about coverage, quality, and security findings.

These changes would make future evaluations easier to explain and more efficient. The evaluator would continue to help find evidence, while reviewers would make the final decisions about requirements that need human judgment.

## Footnotes

[^1]: Refer to the [Officially Supported Technologies](https://folio-org.atlassian.net/wiki/spaces/TC/pages/5053681/Officially+Supported+Technologies) page for the most recent ACTIVE release.

