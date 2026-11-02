# TCR-88 --- mod-users Evaluation

**Evaluation date:** October 6, 2026

# FOLIO Module Acceptance Values and Criteria: mod-users

## version 3.0 (ratified 2025-01-25) + draft notes for existing module evaluation

## Overview

The Technical Council (TC) has defined a process for technical
evaluation of modules for inclusion into a FOLIO release. This document
outlines the high level values and specific criteria used when
evaluating modules as part of this process. The distinction between
values and criteria is as follows:

-   **Values** are high-level factors that are unlikely to change over
    time. They should be understandable even to a non-technical
    audience.
-   **Criteria** are specific, verifiable tests as to how we're meeting
    the Values within the current state of affairs. Criteria evolve with
    the Project's technology stack and current best practices, and may
    require technical expertise or domain knowledge.

In some cases, comprehensive criteria may not yet exist for assessing a
Value. In such cases, subjective review and analysis will be applied and
may lead to discussion.

This document provides the criteria against which a module will be
assessed for inclusion into a FOLIO release, following the New Module
Technical Evaluation Process.

Existing FOLIO modules ideally conform to the same Values and Criteria.
It is understood that not all existing modules currently do so,
especially modules created before the Values & Criteria were initially
defined. The Technical Council will work with development teams to align
the current reality of the code with the Values and Criteria over time,
as practicable. The Technical Council is piloting an existing module
evaluation process and has noted below where individual criteria will be
handled differently.

Please see Before Development for any planned development to new or
existing modules that may intentionally diverge from these Values or
Criteria.

## How to use this document

When performing a technical evaluation of a module, create a copy of
this document. The evaluation results should be placed in the
`module_evaluations` directory and follow the naming convention
`{JIRA Key}_YYYY-MM-DD-{module name}.MD`. The date differentiates
initial and potential re-evaluations and should be the date the
evaluation results file was created.

Replace the title with the name of the module or library. Remove either
the Frontend or the Backend section.

Use these conventions to indicate the status of each criterion:

-   [x] ACCEPTABLE
-   [x] ~INAPPLICABLE~
-   [ ] UNACCEPTABLE
    -   Comments on what was evaluated/not evaluated and why a criterion
        failed.

## Values

1.  Module adheres to Community Code of Conduct
2.  Module license is compatible with the FOLIO Project
3.  Module can be included in existing community build processes
4.  Module has robust testing that can run with existing community
    testing processes
5.  Module can be deployed in the Community's reference environments
    without undue burden
6.  Module is secure
7.  Module is multi-tenant
8.  Module is internationalized
9.  Module meets current accessibility requirements
10. Module offers a cohesive user experience consistent with the rest of
    FOLIO
11. Module has developer and end-user documentation
12. Module depends ONLY on other modules and infrastructure that are
    already included in FOLIO
13. Module has a long-term development and maintenance plan
14. Module is scalable
15. Module supports high availability
16. Modules conforms to FOLIO upgrade mechanisms

## Criteria

### Administrative

-   [x] ~INAPPLICABLE~ Listed by the Product Council on Functionality
    Evaluated by the PC with a positive evaluation result.
    -   For existing module evaluation: This criterion is inapplicable.

### Shared/Common

-   [x] **ACCEPTABLE** Uses Apache 2.0 license (2)
    -   The automated evaluator reported this criterion as passed for
        the reviewed evaluation source.
-   [x] **ACCEPTABLE** Module build MUST produce a valid module
    descriptor (3, 5)
    -   This is not applicable to libraries.
    -   `mvn process-resources -DskipTests` generated
        `target/ModuleDescriptor.json`, and the generated descriptor
        passed Okapi schema validation. This does not by itself
        establish that the committed descriptor meets every backend
        descriptor requirement.
-   [ ] **UNACCEPTABLE** Inclusion of third-party dependencies complies
    with ASF 3rd Party License Policy (2)
    -   Uses README for Category B Appropriately Labelled Condition.
    -   LGPL consideration:
        -   `org.z3950.zing:cql-java` is allowed if appropriately
            labelled, even if it is LGPL-2.1-only.
        -   `org.marc4j:marc4j` is allowed if appropriately labelled,
            even if it is LGPL-2.1-or-later.
        -   `org.hibernate.*` is allowed if appropriately labelled, even
            if it is LGPL-2.1-or-later.
        -   By request of the Community Council, and until that request
            changes, no additional LGPL-licensed dependencies will be
            allowed.
    -   If a library declares multiple licenses in its `pom.xml`, only
        one needs to comply. This applies only to Maven; other package
        managers require closer evaluation.
    -   The FOLIO Module Evaluator is optionally available for Java
        modules built with Maven and front-end modules; TC expects to
        require its use after a trial period.
    -   The dependency inventory flagged `org.z3950.zing:cql-java` as
        LGPL-licensed. The reviewed README identifies the module's
        Apache 2.0 license, but the required Category B labeling for
        this dependency was not found. Please verify the labeling and
        review remaining dependencies against the ASF 3rd Party License
        Policy. No policy violation is concluded at this stage.
-   [ ] **UNACCEPTABLE** Installation documentation is included (11)
    -   Note: read more at
        https://github.com/folio-org/mod-search/blob/master/README.md.
    -   This is not applicable to libraries.
    -   The README is present. It describes default database storage and
        S3/MinIO-related configuration for profile pictures. The
        completeness of installation, configuration, and operating
        instructions has not been fully assessed.
-   [ ] **UNACCEPTABLE** Personal data form is completed, accurate, and
    provided as `PERSONAL_DATA_DISCLOSURE.md` file (6)
    -   This is not applicable to libraries.
    -   The original automated evaluation failed because
        `PERSONAL_DATA_DISCLOSURE.md` was missing; the source repository
        at the reviewed tag contains the misspelled file
        `PERSONAL_DATA_DISCOSURE.md`. The original run reported 31
        criteria: 5 passed, 1 failed, and 25 requiring manual review. A
        later evaluation copy corrected the filename, but semantic
        review was skipped. Code review of `UserEventProducer.java` and
        `UsersService.java` found user-related personal data transmitted
        in Kafka events and included in consortium-user data. Please
        verify that the disclosure accurately covers fields and data
        flows, including free-form text, caching, and logging.
-   [ ] **UNACCEPTABLE** Sensitive and environment-specific information
    is not checked into git repository (6)
    -   The initial review of the `v19.6.2` source identified a
        test-data concern. `user8.json` contains a name, an email
        address using the `si.edu` domain, and a phone number. It is not
        known whether these values correspond to a real person.
        `user9.json` appears to use intentionally fictional data.
        Further review is needed to confirm that no personal information
        is present.
-   [ ] **UNACCEPTABLE** There is no default for any password, access
    key, private key or any other credential (6)
    -   No default credential was confirmed in the reviewed material.
        Further verification of configuration and startup paths is
        needed before concluding that the criterion is met.
-   [ ] **UNACCEPTABLE** Written in a language and framework from the
    officially supported technologies page (3, 5)
    -   The newer automated evaluation identified `raml-module-builder`
        version `36.0.0` in `pom.xml` as not officially supported by the
        current policy. The policy cited by the evaluator allows RMB
        version 35 for existing modules only. Java, Lombok, and
        `folio-s3-client` meet the policy. Eclipse Vert.x results are
        mixed: four dependencies meet the policy, while two are used
        only in tests. The RMB finding should be reviewed with the
        Technical Council to determine whether the policy should be
        updated or a currently permitted version should be used. This is
        a policy-compliance finding, not a confirmed software defect.
-   [x] **ACCEPTABLE** Uses FOLIO interfaces already provided by
    previously accepted modules (3, 5, 12)
    -   The automated evaluator reported this criterion as passed for
        the `v19.6.2` release.
-   [x] **ACCEPTABLE** Must not depend on a FOLIO library that has not
    been approved through the TCR process.
    -   The automated evaluator reported this criterion as passed for
        the `v19.6.2` release.
-   [ ] **UNACCEPTABLE** SonarQube hasn't identified any security
    issues, any high or greater severity issues, or excessive (\>3%)
    duplication (6); and any disabled or intentionally ignored
    rules/recommendations are reasonably justified.
    -   See Rule Customization details.
    -   The available SonarQube snapshot reported no security issues, no
        security hotspots, and 0% duplication, with 26 other issues. The
        snapshot was labelled `19.7.0-SNAPSHOT`, rather than `v19.6.2`;
        verify the scan for the exact release and whether any rules were
        disabled or issues intentionally ignored.
-   [x] **ACCEPTABLE** Uses officially supported build tools (3, 5, 13)
    -   The automated evaluator reported this criterion as passed for
        the `v19.6.2` release.
-   [x] **ACCEPTABLE** Unit tests have 80% coverage or greater, and are
    based on officially supported technologies (3, 4)
    -   SonarCloud reports 99.1% test coverage for `mod-users` version
        `v19.6.2`, exceeding the 80% threshold. The testing technologies
        identified in the release's Maven configuration align with
        FOLIO's published backend testing guidance.
-   [ ] **UNACCEPTABLE** Assigned to exactly one application descriptor
    within the FOLIO Community LSP Platform, specified in the Jira task
    for this module evaluation (3, 5)
    -   The FOLIO Community LSP Platform is defined at
        https://github.com/folio-org/platform-lsp.
    -   This criterion can be evaluated by searching application
        descriptors across the `folio-org` GitHub organization and
        confirming that the module appears in only the application
        descriptor specified in Jira.
    -   Jira TCR-88 identifies `app-platform-minimal`, and the reviewed
        descriptor includes `mod-users`. A search confirming that the
        module appears in exactly one applicable Community LSP
        application descriptor has not been completed.
-   [ ] **UNACCEPTABLE** Gracefully handles the absence of third-party
    systems or related configuration.
    -   This applies to optional third-party integrations and their
        configurations only. Required environment variables without
        sensible defaults should fail fast on startup per the
        Environment Variables Policy.
    -   The review examined HTTP integration, database access,
        profile-picture storage, and Kafka event-processing code. Some
        inspected paths propagate errors, but the review did not
        establish whether optional services and missing configurations
        are handled appropriately in all relevant cases. The
        profile-picture retrieval path can return 404 for caught storage
        exceptions; whether this response is appropriate for different
        failure conditions remains to be verified.

### Backend

Note: Backend criteria apply to modules, shared backend libraries, and
edge modules.

-   [ ] **UNACCEPTABLE** Module's repository includes a compliant Module
    Descriptor (3, 5)
    -   Note: read more at
        https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json.
    -   The generated descriptor passed schema validation. The committed
        descriptor and all of its fields have not yet been checked
        against this criterion.
-   [ ] **UNACCEPTABLE** For each consumed API the module descriptor
    MUST include the interface requirement in the "requires" or
    "optional" section (3, 5)
    -   This is not applicable to libraries.
    -   The module descriptor template lists required and optional
        interfaces. A complete comparison against every consumed API has
        not been documented.
-   [ ] **UNACCEPTABLE** Module includes executable implementations of
    all endpoints in the provides section of the Module Descriptor
    -   The RAML documentation, module descriptor template, and
        `UsersAPI.java` were reviewed, but a complete comparison of
        every descriptor-provided endpoint against an executable
        implementation has not been completed.
-   [ ] **UNACCEPTABLE** Environment variables comply with FOLIO Policy
    (5, 11)
    -   All environment variables documented in the ModuleDescriptor
        with required fields.
    -   Variables properly classified as required or optional.
    -   Variable names follow standardized naming conventions.
    -   Module implements proper startup behavior.
    -   No sensitive information logged during startup configuration
        logging.
    -   The newer automated evaluation identified 18 environment
        variables, but found no complete environment-variable table in
        the README and no `ENV_VARS.md`. Eight variables are documented
        by RMB, but the README does not link to the relevant RMB
        documentation. `JAVA_OPTIONS` is documented by the FOLIO Java
        base image, but the README does not link to that documentation.
        Nine other variables were not documented in an `ENV_VARS.md`
        file or README table. The module descriptor template has no
        top-level `env` section. The evaluator also identified six
        AWS-prefixed variables without corresponding S3-prefixed
        alternatives: `AWS_URL`, `AWS_REGION`, `AWS_BUCKET`,
        `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, and `AWS_SDK`.
        Required/optional status and startup behavior when required
        variables are missing or empty were not established. The
        evaluator did not identify log statements printing secret-like
        values or the entire environment in the inspected
        configuration-reading files. These findings warrant review
        against the current FOLIO Environment Variables policy; they do
        not establish that sensitive values are being logged.
-   [ ] **UNACCEPTABLE** If a module provides interfaces intended to be
    consumed by other FOLIO Modules, they must be defined in the Module
    Descriptor "provides" section, and must conform to FOLIO interface
    naming conventions (3, 5)
    -   The module descriptor template includes provided interfaces.
    -   The newer automated evaluation identified the interface name
        `users.settings` as not following the FOLIO naming convention,
        which requires words in interface names to be joined by hyphens.
        The evaluator treated the module as a new module. Any proposed
        rename should first be reviewed for compatibility with modules
        that may depend on the existing interface. This is a
        naming-convention finding, not evidence that the interface is
        broken.
-   [ ] **UNACCEPTABLE** All API endpoints are documented in OpenAPI
    (11)
    -   For existing module evaluation: RMB-based modules may continue
        using RAML instead.
    -   RAML documentation was found for users, departments, groups,
        patron PIN, proxies, settings, staging users, and user-tenants.
        The shared `folio-custom-fields` repository contains
        documentation for custom-field endpoints. Official tenant API
        documentation was also confirmed in `tenant.raml`, the tenant
        API reference, and the Okapi tenant guide.
    -   The newer automated evaluation identified 55 endpoints in the
        module descriptor. Forty-seven are documented in RAML files in
        the repository, while eight are provided by the
        `folio-custom-fields` library. The evaluator treated the module
        as new and therefore required OpenAPI documentation. Under the
        existing-module evaluation note in this template, an existing
        RMB-based module may continue using RAML. The module's
        classification should be confirmed before determining whether
        this is a compliance gap. The published specification for
        `folio-custom-fields` should also be checked for the eight
        library-provided endpoints. A complete endpoint-to-documentation
        comparison remains to be completed.
-   [ ] **UNACCEPTABLE** All API endpoints protected with appropriate
    permissions as per the Permission Naming Guidelines, e.g. avoid
    using \*.all permissions, all necessary module permissions are
    assigned, etc. (6)
    -   The module descriptor template declares permissions for the
        inspected handlers. A complete comparison of API endpoints
        against their required permissions has not been documented. This
        review therefore does not establish that all endpoints have
        appropriate permission declarations. Enforcement by Okapi,
        folio-kong, or the module sidecar is outside the scope of this
        criterion.
-   [x] **ACCEPTABLE** Module provides reference data (if applicable),
    e.g. if there is a controlled vocabulary where the module requires
    at least one value (3, 16)
    -   Address types and user groups were identified in the
        reference-data resources. The repository includes
        `ReferenceAndSampleDataMigrationIT.java`, an automated
        integration test for reference and sample data migration.
        `TenantRefAPI.java` also uses version-aware loading logic.
        Remaining questions should be limited to behavior not
        established by the test, including preservation of
        tenant-customized values where applicable.
-   [ ] **UNACCEPTABLE** If provided, integration (API) tests must be
    written in an officially supported technology (3, 4)
    -   While strongly recommended, integration tests are not a
        requirement.
    -   These tests are defined in
        https://github.com/folio-org/folio-integration-tests.
    -   The Java `*IT.java` tests in
        `mod-users/src/test/java/org/folio/moduserstest` are Maven
        verification tests; they are not the Karate API integration
        tests addressed by this criterion. This criterion refers to
        tests in the FOLIO integration-tests repository for `mod-users`.
        Review those Karate tests, if provided, to determine whether
        they use an officially supported technology.
-   [ ] **UNACCEPTABLE** Data is segregated by tenant at the storage
    layer (6, 7)
    -   `RecordRepositoryImpl.java` uses tenant-specific PostgreSQL
        client selection, and `UserOutboxService.java` obtains the
        tenant ID from request headers. A complete isolation test using
        two tenants was not identified. This is a verification item, not
        a confirmed tenant-isolation defect.
-   [ ] **UNACCEPTABLE** The module doesn't access data in DB schemas
    other than its own and public. Exception: FOLIO Query Machine and
    its modules are the mechanism through which we provide read access
    across DB storage boundaries. (6, 7)
    -   A limited search of the database schema resources found
        `public.uuid_generate_v4()` in a configuration-table SQL script
        and did not identify cross-schema data access in the reviewed
        `RecordRepositoryImpl.java`. This limited check does not
        establish module-wide compliance.
-   [ ] **UNACCEPTABLE** Any dependencies, other than on defined
    interfaces, are declared in the README.md.
    -   The newer automated evaluation found that the README names S3
        object storage but does not name PostgreSQL or Apache Kafka,
        both of which are used by the module. The evaluator also could
        not confirm that the README lists the Kafka topics the module
        consumes or produces. This appears to be a documentation gap; it
        does not indicate that either service is malfunctioning. The
        README should be reviewed to determine whether these services
        and the relevant Kafka topics are described elsewhere or need to
        be added.
-   [ ] **UNACCEPTABLE** The module responds with a tenant's content
    based on x-okapi-tenant header (7)
    -   `AbstractRestTest.java` sets the tenant header in test setup,
        and `RecordRepositoryImpl.java` uses tenant-aware database
        access. Response isolation and consistent header handling across
        endpoints have not been verified.
-   [x] **ACCEPTABLE** Standard GET /admin/health endpoint returning a
    200 response (5)
    -   `InstallUpgradeIT.java` creates a Docker image, deploys it in
        the build environment, and tests `GET /admin/health`, expecting
        HTTP 200 with body `OK`. A successful automated build run
        executes `InstallUpgradeIT`.
-   [ ] **UNACCEPTABLE** High Availability (HA) compliant (5, 14, 15)
    -   Possible red flags include connection affinity/sticky sessions,
        local container storage, and stateful services.
    -   `ProfilePictureStorage.java` uses an object-storage client with
        tenant-specific keys. That does not establish module-wide
        high-availability compliance. Verify that the module does not
        rely on local state, sticky sessions, or single-instance
        behavior.
-   [ ] **UNACCEPTABLE** Module only uses infrastructure / platform
    technologies on the officially supported technologies list (3, 5,
    12)
    -   E.g. PostgreSQL, Elasticsearch, etc.
    -   The Maven configuration and inspected source use Java 21,
        Vert.x, Kafka, PostgreSQL, and FOLIO object-storage components.
        The newer automated evaluation found RMB 36.0.0 outside the
        currently permitted policy version; see the Shared/Common
        officially supported technologies criterion above. Relevant
        infrastructure/platform technologies should also be checked
        against the supported list for the release being evaluated.

## TCR Process Improvements

[*Please include here any suggestions that you feel might improve the TCR Processes.*]

##

[^1]: Refer to the [Officially Supported Technologies](https://folio-org.atlassian.net/wiki/spaces/TC/pages/5053681/Officially+Supported+Technologies) page for the most recent ACTIVE release.

