# FOLIO Module Acceptance Values and Criteria

## version 1.0 (ratified 9-15-2021)

# Overview

In an effort to provide guidelines to external code contributors for how they get their modules included as part of FOLIO LSP, the Technical Council (TC) has drafted the following document.  This document differentiates between:

* **Values** are high-level factors that are unlikely to change over time.  They should be understandable even to a non-technical audience.

* **Criteria** are specific, verifiable tests as to how we’re meeting the Values within the current state of affairs.  Criteria will evolve over time to respond to changes in the Project’s technology stack, current best practices, etc. They may require a degree of technical expertise or domain knowledge to fully understand.

In some cases, we may not yet have comprehensive Criteria for assessing a module’s adherence to a Value.  In such cases, subjective review and analysis will be applied, and may lead to discussion.

It is important to note that these Values and Criteria are meant to be applied to new, incoming modules, and may not reflect the current state of affairs in the existing modules of FOLIO.  The Technical Council will work to align the current reality of the code with the Values and Criteria over time, as practicable.

It is also important to note that while this document provides the criteria against which a module will be assessed for inclusion into FOLIO, it does not enumerate the process for that evaluation.  Nor does it account for any retroactive evaluation of modules already accepted into FOLIO that may not meet the criteria as currently written.  Such processes will need to be developed and documented by the Technical Council separately.

# Values

1. Module adheres to Community Code of Conduct
1. Module license is compatible with the FOLIO Project
1. Module can be included in existing community build processes
1. Module has robust testing that can run with existing community testing processes
1. Module can be deployed in the Community’s reference environments without undue burden
1. Module is secure
1. Module is multi-tenant
1. Module is internationalized
1. Module meets current accessibility requirements
1. Module offers a cohesive user experience consistent with the rest of FOLIO
1. Module has developer and end-user documentation
1. Module depends ONLY on other modules and infrastructure that are already included in FOLIO
1. Module has a long-term development and maintenance plan
1. Module is scalable
1. Module supports high availability
1. Modules conforms to FOLIO upgrade mechanisms

# Criteria
TODO: create a wiki page that lists official tools/libraries/technologies/etc.
 - FE: Build tools: Node 16/Yarn 1
 - FE: Unit Test stack: JEST/RTL
 - FE: End-to-end test stack: Cypress
 - BE: Build tools: Maven/JDK 11/Docker
 - BE: Unit test stack: JUnit (version?)
 - BE: Integration tech stack: Karate
 - BE: Infrastructure / Plaform technologies: ES, Kafka, Posgres, etc.
 - All: Languages:  Vertx/RMB, Spring Way/folio-spring-base, and React/Stripes, etc.

## Frontend
* The package.json file contains the necessary information to produce a valid ModuleDescriptor (3, 5)
  * ***NOTES*** Maybe provide a link to the specification, or clarifiaction that it must be compliant with the latest relase of OKAPI
  * TODO: ask the Stripes guys if there's a spec or documentation for this -> Talk to Mike Taylor about this...
  * Maybe link to this:  https://github.com/folio-org/stripes-cli/blob/master/doc/user-guide.md#managing-ui-modules
* The package.json declares all consumed OKAPI interfaces in the "okapiInterfaces" and "optionalOkapiInterfaces" sections (3, 5)
  * ***NOTES*** This is difficult to verify.  Need to give this some thought and provide guidance/tips for how to verify this.
  * TODO: ask the Stripes guys how they might go about doing this
* Builds are Node 16/Yarn 1 (3, 5, 13)
  * ***NOTES*** May be better to link out to an official list that's kept up-to-date.
* Unit tests written in Jest/RTL at 80% coverage (3, 4)
  * ***NOTES*** or higher... again maybe reference some documentation of the officially approved technologies.
* End-to-end tests written in Cypress, if applicable  (3, 4) -_note: these tests aren’t defined as part of the module_
  * ***NOTES*** should avoid the use of "if applicable"... needs to be clarified.  Again maybe reference some documentation of the officially approved technologies.
* Have i18n support via react-intl and an en.json file with English texts (8)
* Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension (9)
* Use the latest release of Stripes at the time of evaluation (10, 16)
* Follow relevant existing UI layouts, patterns and norms (10) -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
* Follow relevant existing UX layouts, patterns and norms (10) -_note: read more about current practices at ???_
  * E.g. Saving state when navigating between apps (or confirming that you'll lose the state)
* Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation (10)

## Backend
* Module’s repository includes a compliant Module Descriptor (3, 5)
  * https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json
* Modules must declare all consumed interfaces in the Module Descriptor “requires” and “optional” sections (3, 5)
  * ***NOTES*** This is difficult to verify.  Need to give this some thought.
  * TODO: ask the BE devs how they might go about doing this -> maybe ask Marc J.
* Environment vars are documented in the ModuleDescriptor (5, 11) - _note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* If a module provides interfaces intended to be consued by other FOLIO Modules, they must be defined in the Module Descriptor “provides” section (3, 5)
* All API endpoints are documented in RAML or OpenAPI (11)
* All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using *.all permissions, all necessary module permissions are assigned, etc. (6)
  * https://dev.folio.org/guidelines/naming-conventions/
  * https://wiki.folio.org/display/DD/Permission+Set+Guidelines
* Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value (3, 16)  
* Builds are Maven and JDK 11 based and Dockerfile provided (3, 5, 13)
  * ***NOTES*** provide references, or point to a official list of build tools (possibly combine with language point above).
* Must have integration (API) tests written in an acceptable technology (3, 4) 
 * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
 * TODO:  refer to the wiki page w/ official/approved technologies
* Unit tests at 80% coverage or higher and are written in an approved technology (3, 4)
 * TODO:  refer to the wiki page w/ officially approved technologies
* Data is segregated by tenant by schema at the storage layer (6, 7)
* The module doesn’t access data in DB schemas other than its own and public (6, 7)
* The module responds with a tenant’s content based on x-okapi-tenant header (7)
 * ***NOTES*** Could be much clearer - need to be reworded, or examples need to be provided of what NOT to do.  Is this redundant?
* Standard GET /admin/health endpoint returning a 200 response (5) -_note: read more at [https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol](https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol)_
* HA compliant (5, 14, 15)
 * ***NOTES*** we need more here -- is there a document that we can refer to with more details?  Examples of things we've run into in the past may be helpful.
 * Possible red flags:
  * connection affinity is required
  * local container storage is used
  * etc.
* Module only uses existing infrastructure / platform technologies _e.g. PostgreSQL, ElasticSearch (and Kafka, despite it being still unofficial at present)_ (3, 5, 12)
  * TODO: refer to the wiki page with officially approved list of technologies.

## Shared/Common
* Uses Apache 2.0 license (2)
* Third party dependencies use an Apache 2.0 compatible license (2)
  * ***NOTES*** This is a tough one to verify, especially on the UI side.  
  * TODO: investigate tools that make this easier and provide a link to the tool, or to documentation describing how to use the tool.  See mod-inventory-storage -> has tooling in the build process to generate/expose licensing info. See also https://www.npmjs.com/package/license-checker for Frontend
* Installation documentation is included (11)
  * ***NOTES*** Provide link to a good examples
* Personal data form is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file (6)
* Sensitive and environment-specific information is not checked into git repository (6)
* Module is written in a language and framework that FOLIO development teams are familiar with _e.g. Vertx/RMB, Spring Way/folio-spring-base, and React/Stripes_ (13)
  * TODO: refer to the wiki page with officially approved list of technologies/languages/etc.
* Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_ (3, 5, 12)
* The module gracefully handles the absence of third party systems or related configuration. (3, 5, 12)
* sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication (6)

**TODO**:  Move these to a Post-acceptance stage in the process document.

* Upon acceptance, code author(s) agree to have source code canonically in folio-org github (3, 5, 13)
  * ***NOTES*** This isn't strictly technical.  Maybe make this part of a separate section/part of the overall process that states expectations of post-acceptance into a release
* Copyright assigned to OLF (13)
  * ***NOTES*** CC criteria? 
  * ***NOTES*** This isn't strictly technical.  Maybe make this part of a separate section/part of the overall process that states expectations of post-acceptance into a release
* Code of Conduct statement in repository (1)
  * ***NOTES*** CC criteria?
  * ***NOTES*** This isn't strictly technical.  Maybe make this part of a separate section/part of the overall process that states expectations of post-acceptance into a release
* Contribution guide is included in repository (13)
  * ***NOTES*** CC criteria?
  * ***NOTES*** This isn't strictly technical.  Maybe make this part of a separate section/part of the overall process that states expectations of post-acceptance into a release
