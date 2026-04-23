# mod-ebsconet

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
* [x] Sensitive and environment-specific information is not checked into git repository (6)
* [ ] Written in a language and framework from the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1] (3, 5)
  * What about "Core dependencies" : log4j 2.24.3, mapstruct 1.6.3, openapi-generator 7.11.0, spring-cloud-starter-openfeign 4.2.0, springdoc-openapi-ui 1.8.0, jackson-databind-nullable 0.2.6 ? These are not listed in the OST. Is this part of the Java / JDK 21 ?
* [x] Uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_ (3, 5, 12)
  * _This is not applicable to libraries_
* [x] Must not depend on a FOLIO library that has not been approved through the TCR process
* [x] Gracefully handles the absence of third party systems or related configuration. (3, 5, 12)
  * _Note: This applies to optional third-party integrations and their configurations only. Required environment variables (those without sensible defaults) should fail fast on startup per the Environment Variables Policy._
* [x] Sonarqube hasn't identified any security issues, any high or greater severity issues, or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  * See [Rule Customization](https://dev.folio.org/guides/code-analysis/#rule-customization) details. 
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools (3, 5, 13)
* [x] Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
  * 86.7% Coverage
* [ ] Assigned to exactly one application descriptor within the FOLIO Community LSP Platform, specified in the Jira task for this module evaluation (3, 5)
  * _The FOLIO Community LSP Platform is defined at https://github.com/folio-org/platform-lsp._
  * _This can be evaluated by searching application descriptors across the folio-org GitHub organization (considering those applications part of the community platform) and confirming that this module only appears in the application descriptor of the one specified application._
  ' mod-ebsconet is part of app-platform-complete and app-platform-full (which is O.K.), but also of app-ebsconet, as the only module thereof. Why does it have its own application ?

### Backend

Note: Backend criteria apply to modules, shared backend libraries, and edge modules.

* [x] Module’s repository includes a compliant Module Descriptor (3, 5)
  * -_note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
* [x] For each consumed API the module descriptor MUST include the interface requirement in the `"requires"` or `"optional"` section (3, 5)
  * _This is not applicable to libraries_
  * very probably fulfilled. Depends on fincance, notes, orders and organisations according to src/main/resources/swagger.api/schemas . And those are included in the "requires" section of the module descriptor (along with order-lines).
* [x] Module includes executable implementations of all endpoints in the provides section of the Module Descriptor
* [-] Environment variables comply with [FOLIO Policy](https://folio-org.atlassian.net/wiki/x/NYCgTg) (5, 11)
  * [-] [All environment variables documented in ModuleDescriptor with required fields](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#3.3-ModuleDescriptor-Enhancement)
    * "description" and "required" fields are missing.
  * [-] [Variables properly classified as required or optional](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#4.-Required-vs.-Optional-Variables)
  * [x] [Variable names follow standardized naming conventions](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#2.-Naming-Conventions)
  * [x] [Module implements proper startup behavior](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#4.2-Startup-Behavior)
    * I don't see that. It doesn't log its configuration on startup. JAVA_OPTIONS seems to be the only env var, though.
  * [x] [No sensitive information logged during startup configuration logging](https://folio-org.atlassian.net/wiki/spaces/TC/pages/1319141429/Environment+Variables#6.1-Startup-Configuration-Logging)
* [x] If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section, and must conform to FOLIO [interface naming conventions](https://dev.folio.org/guidelines/naming-conventions/#interfaces) (3, 5)
* [x] All API endpoints are documented in OpenAPI (11)
  * For existing module evaluation: RMB-based modules may continue using RAML instead.
  * fulfilled in src/main/resources/swagger.api/ebsconet.yaml
* [x] All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using *.all permissions, all necessary module permissions are assigned, etc. (6)
  * -_note: read more at https://dev.folio.org/guidelines/naming-conventions/ and https://wiki.folio.org/display/DD/Permission+Set+Guidelines_
* [x] Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value (3, 16)
  * module has no database schema, therefore no refernce data.
* [ ] If provided, integration (API) tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
  * IK: module does not provide an integration test.
* [x] Data is segregated by tenant at the storage layer (6, 7)
* [x] The module doesn’t access data in DB schemas other than its own and public. Exception: [FOLIO Query Machine](https://folio-org.atlassian.net/wiki/spaces/TC/pages/852852742/0011-Folio+Query+Machine+FQM) and its modules are the mechanism through which we provide read access across DB storage boundaries. (6, 7)
  * the module does not include a DB schema at all and does not use database access.
* [ ] Any dependencies, other than on defined interfaces, are declared in the README.md.
  * wouldn't the consumed interfaces / APIs need to be declared here ?
* [x] The module responds with a tenant’s content based on x-okapi-tenant header (7)
  * usually true if module has multi-client capability, which it does, i.e. it can be enabled for a tenant.
* [x] Standard GET /admin/health endpoint returning a 200 response (5)
  * -_note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
* [x] High Availability (HA) compliant (5, 14, 15)
  * Possible red flags:
    * Connection affinity / sticky sessions / etc. are used
    * Local container storage is used
    * Services are stateful
* [x] Module only uses infrastructure / platform technologies on the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.[^1]
  * _e.g. PostgreSQL, ElasticSearch, etc._ (3, 5, 12)

## TCR Process Improvements

[_Please include here any suggestions that you feel might improve the TCR Processes._]


[^1]: Refer to the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page for the most recent ACTIVE release.
