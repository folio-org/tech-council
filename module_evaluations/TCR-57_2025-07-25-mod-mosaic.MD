# mod-mosaic

## version 3.0 (ratified 2025-01-25)

## Overview
The Technical Council (TC) has defined a process for technical evaluation of modules for inclusion in a FOLIO release.  This document outlines the high level values and specific criteria used when evaluating modules as part of this process.  The distinction between values and criteria is as follows:

* **Values** are high-level factors that are unlikely to change over time.  They should be understandable even to a non-technical audience.
* **Criteria** are specific, verifiable tests as to how we’re meeting the Values within the current state of affairs.  Criteria will evolve over time to respond to changes in the Project’s technology stack, current best practices, etc. They may require a degree of technical expertise or domain knowledge to fully understand.

In some cases, we may not yet have comprehensive Criteria for assessing a module’s adherence to a Value.  In such cases, subjective review and analysis will be applied, and may lead to discussion.

This document provides the criteria against which a module will be assessed for inclusion into a FOLIO release, following the [New Module Technical Evaluation Process](NEW_MODULE_TECH_EVAL.MD). 

Existing FOLIO modules ideally conform to the same Values and Criteria.  It is understood that not all existing modules currently do so, especially modules created before the Values & Criteria were initially defined.  The Technical Council will work with development teams to align the current reality of the code with the Values and Criteria over time, as practicable.  Such processes will need to be developed and documented.

Please see [Before Development](MODULE_EVALUATION_TEMPLATE#before-development) for any planned development to new or existing modules that may intentionally diverge from these Values or Criteria.

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
* [ ] Listed by the Product Council on [Functionality Evaluated by the PC](https://wiki.folio.org/display/PC/Functionality+Evaluated+by+the+PC) with a positive evaluation result.
  * -> in progress: https://folio-org.atlassian.net/browse/PCE-11
### Shared/Common
* [x] Uses Apache 2.0 license (2)
  * -> https://github.com/folio-org/mod-mosaic/blob/master/LICENSE
  * -> https://github.com/folio-org/mod-mosaic/blob/master/README.md#mod-mosaic
* [x] Module build MUST produce a valid module descriptor (3, 5)
* [x] Inclusion of third party dependencies complies with [ASF 3rd Party License Policy](https://apache.org/legal/resolved.html) (2)
  * Uses README for [Category B Appropriately Labelled Condition](https://apache.org/legal/resolved.html#appropriately-labelled-condition)
  * org.z3950.zing:cql-java is allowed if appropriately labelled, even if it is LGPL-2.1-only
  * org.marc4j:marc4j is allowed if appropriately labelled, even if it is LGPL-2.1-or-later
  * org.hibernate.* is allowed if appropriately labelled, even if it is LGPL-2.1-or-later
  * -> `mvn license:add-third-party`
  * -> `cat target/generated-sources/license/THIRD-PARTY.txt | sort`
  * -> 215 dependencies, some entries require detailed investigation:
  * -> (Apache 2) opencsv (com.opencsv:opencsv:5.9 - http://opencsv.sf.net)
    * -> Reported disallowed version `2` is wrong, it is actually allowed version `2.0`: https://sourceforge.net/p/opencsv/source/ci/master/tree/LICENSE
  * -> (Apache Public License 2.0) plexus-build-api (org.sonatype.plexus:plexus-build-api:0.0.7 - http://forge.sonatype.com/spice-parent/plexus-build-api/)
    * -> Reported license is wrong, actual license is `Apache License Version 2.0`: https://github.com/codehaus-plexus/plexus-build-api/blob/plexus-build-api-0.0.7/pom.xml
  * -> (Apache Software License, version 2.0) (Lesser General Public License, version 3 or greater) btf (com.github.java-json-tools:btf:1.3 - https://github.com/java-json-tools/btf)
    * -> Is (Apache-2.0 OR LGPL-3.0-or-later), see https://github.com/java-json-tools/btf/blob/v1.3/build.gradle
  * -> (Apache Software License, version 2.0) (Lesser General Public License, version 3 or greater) jackson-coreutils (com.github.java-json-tools:jackson-coreutils:2.0 - https://github.com/java-json-tools/jackson-coreutils)
    * -> Is (Apache-2.0 OR LGPL-3.0-or-later), see https://github.com/java-json-tools/jackson-coreutils/blob/v2.0/build.gradle
  * -> (Apache Software License, version 2.0) (Lesser General Public License, version 3 or greater) jackson-coreutils-equivalence (com.github.java-json-tools:jackson-coreutils-equivalence:1.0 - https://github.com/java-json-tools/jackson-coreutils)
    * -> Is (Apache-2.0 OR LGPL-3.0-or-later), see https://github.com/java-json-tools/jackson-coreutils/blob/v2.0/equivalence/project.gradle
  * -> (Apache Software License, version 2.0) (Lesser General Public License, version 3 or greater) json-patch (com.github.java-json-tools:json-patch:1.13 - https://github.com/java-json-tools/json-patch)
    * -> Is (Apache-2.0 OR LGPL-3.0-or-later), see https://github.com/java-json-tools/json-patch/blob/v1.13/project.gradle
  * -> (Apache Software License, version 2.0) (Lesser General Public License, version 3 or greater) json-schema-core (com.github.java-json-tools:json-schema-core:1.2.14 - https://github.com/java-json-tools/json-schema-core)
    * -> Is (Apache-2.0 OR LGPL-3.0-or-later), see https://github.com/java-json-tools/json-schema-core/blob/v1.2.14/project.gradle
  * -> (Apache Software License, version 2.0) (Lesser General Public License, version 3 or greater) json-schema-validator (com.github.java-json-tools:json-schema-validator:2.2.14 - https://github.com/java-json-tools/json-schema-validator)
    * -> Is (Apache-2.0 OR LGPL-3.0-or-later), see https://github.com/java-json-tools/json-schema-validator/blob/v2.2.14/project.gradle
  * -> (Apache Software License, version 2.0) (Lesser General Public License, version 3 or greater) msg-simple (com.github.java-json-tools:msg-simple:1.2 - https://github.com/java-json-tools/msg-simple)
    * -> Is (Apache-2.0 OR LGPL-3.0-or-later), see https://github.com/java-json-tools/msg-simple/blob/v1.2/project.gradle
  * -> (Apache Software License, version 2.0) (Lesser General Public License, version 3 or greater) uri-template (com.github.java-json-tools:uri-template:0.10 - https://github.com/java-json-tools/uri-template)
    * -> Is (Apache-2.0 OR LGPL-3.0-or-later), see https://github.com/java-json-tools/uri-template/blob/master/project.gradle
  * -> (Apache-2.0) (LGPL-2.1-or-later) Java Native Access (net.java.dev.jna:jna:5.12.1 - https://github.com/java-native-access/jna)
    * -> Is (Apache-2.0 OR LGPL-2.1-or-later), see https://github.com/java-native-access/jna/blob/5.12.1/LICENSE
  * -> (BSD License 3) Hamcrest (org.hamcrest:hamcrest:2.2 - http://hamcrest.org/JavaHamcrest/)
    * -> Reported license `BSD License 3` is wrong, correct license is `BSD-3-Clause`, see https://github.com/hamcrest/JavaHamcrest/blob/v2.2/build.gradle#L74
  * -> (Bouncy Castle Licence) Bouncy Castle Provider (org.bouncycastle:bcprov-jdk18on:1.78.1 - https://www.bouncycastle.org/java.html)
    * -> The license is the `BSD` license: https://github.com/bcgit/bc-java/blob/r1rv78v1/LICENSE.html
  * -> (GNU Library General Public License v2.1 or later) Hibernate ORM - hibernate-core (org.hibernate.orm:hibernate-core:6.6.13.Final - https://hibernate.org/orm)
    * -> README contains [Category B Appropriately Labelled Condition](https://apache.org/legal/resolved.html#appropriately-labelled-condition)
    * -> https://github.com/folio-org/mod-mosaic?tab=readme-ov-file#mod-mosaic
  * -> (The (New) BSD License) jmustache (com.samskivert:jmustache:1.16 - http://github.com/samskivert/jmustache)
    * -> Reported name `The (New) BSD License` is wrong, correct name id `BSD-2-Clause`, see https://github.com/samskivert/jmustache/blob/jmustache-1.16/pom.xml#L25
* [x] Installation documentation is included (11)
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
  * -> https://github.com/folio-org/mod-mosaic?tab=readme-ov-file#installing-and-deployment
* [x] Personal data form is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file (6)
  * -> https://github.com/folio-org/mod-mosaic/blob/master/PERSONAL_DATA_DISCLOSURE.md
* [x] Sensitive and environment-specific information is not checked into git repository (6)
* [x] Written in a language and framework from the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1] (3, 5)
  * -> Java 21, FOLIO Spring way
* [x] Uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_ (3, 5, 12)
  * -> https://github.com/folio-org/mod-mosaic/blob/TCR-57-2/descriptors/ModuleDescriptor-template.json
  * -> interfaces "orders" and "order-templates" are provided by mod-orders:
  * -> https://github.com/folio-org/mod-orders/blob/v13.0.0/descriptors/ModuleDescriptor-template.json#L6
  * -> https://github.com/folio-org/mod-orders/blob/v13.0.0/descriptors/ModuleDescriptor-template.json#L774
* [x] Must not depend on a FOLIO library that has not been approved through the TCR process
  * -> Both folio-module-descriptor-validator and folio-spring-base are approved.
* [x] Gracefully handles the absence of third party systems or related configuration. (3, 5, 12)
  * -> If database config is wrong or database is down it logs "Connection to localhost:5432 refused. Check that the hostname and port are correct and that the postmaster is accepting TCP/IP connections.".
* [x] Sonarqube hasn't identified any security issues, any high or greater severity issues, or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  * See [Rule Customization](https://dev.folio.org/guides/code-analysis/#rule-customization) details.
  * -> https://sonarcloud.io/summary/overall?id=org.folio%3Amod-mosaic&branch=master
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools (3, 5, 13)
* [x] Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
  * -> test coverage is 97.7 %: https://sonarcloud.io/project/activity?id=org.folio%3Amod-mosaic&graph=custom&custom_metrics=coverage
* [x] Assigned to exactly one application descriptor within the FOLIO Community LSP Platform, specified in the Jira task for this module evaluation (3, 5)
  * _The FOLIO Community LSP Platform is defined at https://github.com/folio-org/platform-lsp._
  * _This can be evaluated by searching application descriptors across the folio-org GitHub organization (considering those applications part of the community platform) and confirming that this module only appears in the application descriptor of the one specified application._
  * -> https://github.com/folio-org/app-mosaic
  * -> https://github.com/search?q=org%3Afolio-org+mod-mosaic+language%3AJSON&type=code&l=JSON

### Backend

Note: Backend criteria apply to modules, shared backend libraries, and edge modules.

* [x] Module’s repository includes a compliant Module Descriptor (3, 5)
  * -_note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
  * -> https://github.com/folio-org/mod-mosaic/blob/TCR-57-2/descriptors/ModuleDescriptor-template.json
* [x] For each consumed API the module descriptor MUST include the interface requirement in the `"requires"` or `"optional"` section (3, 5)
  * -> https://github.com/folio-org/mod-mosaic/tree/TCR-57-2/src/main/java/org/folio/mosaic/client
  * -> https://github.com/folio-org/mod-mosaic/blob/TCR-57-2/descriptors/ModuleDescriptor-template.json
* [x] Module includes executable implementations of all endpoints in the provides section of the Module Descriptor
  * -> all 6 APIs are implemented: https://github.com/folio-org/mod-mosaic/tree/TCR-57-2/src/main/java/org/folio/mosaic/controller
  * -> https://github.com/folio-org/mod-mosaic/blob/TCR-57-2/src/main/resources/swagger.api/mosaic.yaml
* [x] Environment vars are documented in the ModuleDescriptor (5, 11)
  * -_note: read more at https://dev.folio.org/guides/module-descriptor/#docker-env_
  * -> https://github.com/folio-org/mod-mosaic/blob/TCR-57-2/descriptors/ModuleDescriptor-template.json
* [x] If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section, and must conform to FOLIO [interface naming conventions](https://dev.folio.org/guidelines/naming-conventions/#interfaces) (3, 5)
  * -> https://github.com/folio-org/mod-mosaic/blob/TCR-57-2/descriptors/ModuleDescriptor-template.json
* [ ] All API endpoints are documented in OpenAPI (11)
  * -> Placeholders are provided, actual documentation is missing: https://github.com/folio-org/mod-mosaic/blob/TCR-57-2/src/main/resources/swagger.api/mosaic.yaml https://github.com/folio-org/acq-models/tree/master/mod-mosaic/schemas
* [x] All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using *.all permissions, all necessary module permissions are assigned, etc. (6)
  * -_note: read more at https://dev.folio.org/guidelines/naming-conventions/ and https://wiki.folio.org/display/DD/Permission+Set+Guidelines_
  * -> All 6 API endpoints require a granular permission: https://github.com/folio-org/mod-mosaic/blob/TCR-57-2/descriptors/ModuleDescriptor-template.json
* [ ] Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value (3, 16)
  * -> /mosaic/configuration lacks a default.
* [x] If provided, integration (API) tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
  * -> Karate tests: https://github.com/folio-org/folio-integration-tests/tree/6d2a05e/acquisitions/src/main/resources/thunderjet/mod-mosaic
* [x] Data is segregated by tenant at the storage layer (6, 7)
  * -> database schema is prefixed with tenant
* [x] The module doesn’t access data in DB schemas other than its own and public. Exception: [FOLIO Query Machine](https://folio-org.atlassian.net/wiki/spaces/TC/pages/852852742/0011-Folio+Query+Machine+FQM) and its modules are the mechanism through which we provide read access across DB storage boundaries. (6, 7)
  * -> uses database schema that is prefixed with tenant
* [x] n/a ~Any dependencies, other than on defined interfaces, are declared in the README.md.~
* [x] The module responds with a tenant’s content based on x-okapi-tenant header (7)
* [x] Standard GET /admin/health endpoint returning a 200 response (5)
  * -_note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
* [x] High Availability (HA) compliant (5, 14, 15)
  * Possible red flags:
    * Connection affinity / sticky sessions / etc. are used
    * Local container storage is used
    * Services are stateful
* [x] Module only uses infrastructure / platform technologies on the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.[^1]
  * _e.g. PostgreSQL, ElasticSearch, etc._ (3, 5, 12)
  * -> Only uses PostgreSQL.

## TCR Process Improvements

[_Please include here any suggestions that you feel might improve the TCR Processes._]


[^1]: Refer to the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page for the most recent ACTIVE release.
