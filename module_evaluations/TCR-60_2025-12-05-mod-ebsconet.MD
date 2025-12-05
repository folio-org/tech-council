# FOLIO Module Acceptance Values and Criteria

## version 3.0 (ratified 2025-01-25) + draft notes for existing module evaluation

## Overview
The Technical Council (TC) has defined a process for technical evaluation of modules for inclusion in a FOLIO release.  This document outlines the high level values and specific criteria used when evaluating modules as part of this process.  The distinction between values and criteria is as follows:

* **Values** are high-level factors that are unlikely to change over time.  They should be understandable even to a non-technical audience.
* **Criteria** are specific, verifiable tests as to how we’re meeting the Values within the current state of affairs.  Criteria will evolve over time to respond to changes in the Project’s technology stack, current best practices, etc. They may require a degree of technical expertise or domain knowledge to fully understand.

In some cases, we may not yet have comprehensive Criteria for assessing a module’s adherence to a Value.  In such cases, subjective review and analysis will be applied, and may lead to discussion.

This document provides the criteria against which a module will be assessed for inclusion into a FOLIO release, following the [New Module Technical Evaluation Process](NEW_MODULE_TECH_EVAL.MD). 

Existing FOLIO modules ideally conform to the same Values and Criteria.  It is understood that not all existing modules currently do so, especially modules created before the Values & Criteria were initially defined.  The Technical Council will work with development teams to align the current reality of the code with the Values and Criteria over time, as practicable.  Such processes will need to be developed and documented.  The Technical Council is currently piloting an existing module evaluation process with a few initial modules, and has noted below with "For existing module evaluation" where individual criteria will be handled differently.

Please see [Before Development](NEW_MODULE_TECH_EVAL.MD#before-development) for any planned development to new or existing modules that may intentionally diverge from these Values or Criteria.

## How to use this document

When performing a technical evaluation of a module, create a copy of this document.  The evaluation results should be placed in the [module_evaluations](https://github.com/folio-org/tech-council/tree/master/module_evaluations) directory and should conform to the following naming convention: `{JIRA Key}_YYYY-MM-DD-{module name}.MD`, e.g. `TCR-1_2021-11-17-mod-foo.MD`.  The date here is used to differentiate between initial and potential re-evaluation(s).  It should be the date when the evaluation results file was created.

Replace the title with the name of the module or library.

Remove either the Frontend or the Backend section.

Use these conventions to indicate the status of each criterion.

* [x] ACCEPTABLE
* [x] ~INAPPLICABLE~
* [ ] UNACCEPTABLE
  * comments on what was evaluated/not evaluated, why a criterion failed

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

### Administrative
* [x] Listed by the Product Council on [Functionality Evaluated by the PC](https://wiki.folio.org/display/PC/Functionality+Evaluated+by+the+PC) with a positive evaluation result.
  - For existing module evaluation: This criterion is inapplicable.

### Shared/Common
* [x] Uses Apache 2.0 license (2)
* [x] Module build MUST produce a valid module descriptor (3, 5)
  * _This is not applicable to libraries_
* [x] Inclusion of third party dependencies complies with [ASF 3rd Party License Policy](https://apache.org/legal/resolved.html) (2)
  * Uses README for [Category B Appropriately Labelled Condition](https://apache.org/legal/resolved.html#appropriately-labelled-condition)
  * LGPL consideration:
    * org.z3950.zing:cql-java is allowed if appropriately labelled, even if it is LGPL-2.1-only
    * org.marc4j:marc4j is allowed if appropriately labelled, even if it is LGPL-2.1-or-later
    * org.hibernate.* is allowed if appropriately labelled, even if it is LGPL-2.1-or-later
    * By [request of the Community Council](https://folio-org.atlassian.net/wiki/spaces/CC/pages/1243348996/2025-09-26+Community+Council+Meeting+Minutes+at+WOLFcon), and until that request changes, no additional LGPL-licensed dependencies will be allowed. 
  * _note: If a library declares multiple licenses in its pom.xml, [only one of them needs to comply](https://maven.apache.org/ref/3.9.11/maven-model/maven.html#project)._ (This applies only to Maven. For other package managers, closer evaluation is needed.)
  * _note: The [FOLIO Module Evaluator](https://github.com/folio-org/tc-module-eval) tool is optionally available to evaluate this criterion for Java modules (built with Maven) and for front-end modules.  TC expects to [require its use](https://github.com/folio-org/tech-council/pull/110) in the module evaluation process after a trial period._
  * _note: [More information about this criterion](https://github.com/folio-org/tech-council/blob/master/criteria/THIRD_PARTY_DEPENDENCIES.MD)_
* [ ] Installation documentation is included (11)
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
  * link to API doucmentation is missing
  * description of env vars is missing
  * _This is not applicable to libraries_
  * configuration information is missing, how to use this module ? What is the purpose of this module ?
* [x] [Personal data form](https://github.com/folio-org/personal-data-disclosure) is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file (6)
  * mod-ebsconet does not store data to persistent storage (Database, S3, ...) itself
  * _This is not applicable to libraries_
* [ ] Sensitive and environment-specific information is not checked into git repository (6)
* [ ] Written in a language and framework from the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1] (3, 5)
* [ ] Uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_ (3, 5, 12)
  * _This is not applicable to libraries_
* [ ] Must not depend on a FOLIO library that has not been approved through the TCR process
* [ ] Gracefully handles the absence of third party systems or related configuration. (3, 5, 12)
  * _Note: This applies to optional third-party integrations and their configurations only. Required environment variables (those without sensible defaults) should fail fast on startup per the Environment Variables Policy._
* [x] Sonarqube hasn't identified any security issues, any high or greater severity issues, or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  * See [Rule Customization](https://dev.folio.org/guides/code-analysis/#rule-customization) details. 
* [ ] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools (3, 5, 13)
* [ ] Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
* [ ] Assigned to exactly one application descriptor within the FOLIO Community LSP Platform, specified in the Jira task for this module evaluation (3, 5)
  * _The FOLIO Community LSP Platform is defined at https://github.com/folio-org/platform-lsp._
  * _This can be evaluated by searching application descriptors across the folio-org GitHub organization (considering those applications part of the community platform) and confirming that this module only appears in the application descriptor of the one specified application._

### Frontend

Note: Frontend criteria apply to both modules and shared libraries. 

* [ ] For each consumed API `package.json` MUST include the interface requirement in the `"okapiInterfaces"` or `"optionalOkapiInterfaces"` section (3, 5)
  * -_note: read more at https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md#the-package-file-stripes-entry_
* [ ] If provided, End-to-end tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/stripes-testing_
* [ ] Have i18n support via react-intl and an en.json file with English texts (8)
* [ ] Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension (9)
* [ ] Use the Stripes version of referred on the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1] (10, 16)
* [ ] Follow relevant existing UI layouts, patterns and norms (10) -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
  * E.g. Saving state when navigating between apps (or confirming that you'll lose the state)
  * For UI links to documentation, there is no rule on where that documentation should be hosted, i.e. docs.folio.org, or wiki.folio.org, or module-specific destinations, as long as it is publicly accessible.
* [ ] Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation (10)

### Backend

Note: Backend criteria apply to modules, shared backend libraries, and edge modules.

* [ ] Module’s repository includes a compliant Module Descriptor (3, 5)
  * -_note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
* [ ] For each consumed API the module descriptor MUST include the interface requirement in the `"requires"` or `"optional"` section (3, 5)
  * _This is not applicable to libraries_
* [ ] Module includes executable implementations of all endpoints in the provides section of the Module Descriptor
* [ ] Environment variables comply with [FOLIO Policy](https://folio-org.atlassian.net/wiki/x/NYCgTg) (5, 11)
  * [ ] [All environment variables documented in ModuleDescriptor with required fields](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#3.3-ModuleDescriptor-Enhancement)
  * [ ] [Variables properly classified as required or optional](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#4.-Required-vs.-Optional-Variables)
  * [ ] [Variable names follow standardized naming conventions](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#2.-Naming-Conventions)
  * [ ] [Module implements proper startup behavior](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#4.2-Startup-Behavior)
  * [ ] [No sensitive information logged during startup configuration logging](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#6.1-Startup-Configuration-Logging)
* [ ] If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section, and must conform to FOLIO [interface naming conventions](https://dev.folio.org/guidelines/naming-conventions/#interfaces) (3, 5)
* [ ] All API endpoints are documented in OpenAPI (11)
  * For existing module evaluation: RMB-based modules may continue using RAML instead.
* [ ] All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using *.all permissions, all necessary module permissions are assigned, etc. (6)
  * -_note: read more at https://dev.folio.org/guidelines/naming-conventions/ and https://wiki.folio.org/display/DD/Permission+Set+Guidelines_
* [ ] Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value (3, 16)
* [ ] If provided, integration (API) tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
* [ ] Data is segregated by tenant at the storage layer (6, 7)
* [ ] The module doesn’t access data in DB schemas other than its own and public. Exception: [FOLIO Query Machine](https://folio-org.atlassian.net/wiki/spaces/TC/pages/852852742/0011-Folio+Query+Machine+FQM) and its modules are the mechanism through which we provide read access across DB storage boundaries. (6, 7)
* [ ] Any dependencies, other than on defined interfaces, are declared in the README.md.
* [ ] The module responds with a tenant’s content based on x-okapi-tenant header (7)
* [ ] Standard GET /admin/health endpoint returning a 200 response (5)
  * -_note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
* [ ] High Availability (HA) compliant (5, 14, 15)
  * Possible red flags:
    * Connection affinity / sticky sessions / etc. are used
    * Local container storage is used
    * Services are stateful
* [ ] Module only uses infrastructure / platform technologies on the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.[^1]
  * _e.g. PostgreSQL, ElasticSearch, etc._ (3, 5, 12)

## TCR Process Improvements

[_Please include here any suggestions that you feel might improve the TCR Processes._]


[^1]: Refer to the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page for the most recent ACTIVE release.
