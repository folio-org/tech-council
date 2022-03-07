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
*** NOTES *** Do we want to have distinct sets of criteria for frontend and backend modules?  It's a bit clumsy at the moment.   

## Frontend
* The package.json file contains the necessary information to produce a valid ModuleDescriptor (3, 5)
  * ***NOTES*** Maybe provide a link to the specification, or clarifiaction that it must be compliant with the latest relase of OKAPI
* The package.json declares all consumed OKAPI interfaces in the "okapiInterfaces" and "optionalOkapiInterfaces" sections (3, 5)
  * ***NOTES*** This is difficult to verify.  Need to give this some thought.
* Front-end modules: builds are Node 16/Yarn 1 (3, 5, 13)
  * ***NOTES*** May be better to link out to an official list that's kept up-to-date.
* Front-end unit tests written in Jest/RTL at 80% coverage (3, 4)
  * ***NOTES*** or higher... again maybe reference some documentation of the officially approved technologies.
* Front-end End-to-end tests written in Cypress, if applicable  (3, 4) -_note: these tests aren’t defined as part of the module_
  * ***NOTES*** should avoid the use of "if applicable"... needs to be clarified.  Again maybe reference some documentation of the officially approved technologies.
* Front-end modules have i18n support via react-intl and an en.json file with English texts (8)
* Front-end modules have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension (9)
* Front-end modules use the current version of Stripes (10, 16)
  * ***NOTES*** This changes from release to release... since our process tries not to target specific releases, this could be a moving target.
* Front-end modules follow relevant existing UI layouts, patterns and norms (10) -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
  * ***NOTES*** Do we want to expand this to include UX too?  E.g. saving state when navigating between apps (or confirming that you'll lose the state)
* Front end modules must work in the latest version of Chrome (the supported runtime environment) (10)
 * ***NOTES*** Potentially a moving target... need to think about how to manage this.

## Backend
* Module’s repository includes a compliant Module Descriptor (3, 5)
  * ***NOTES*** Maybe provide a link to the specification, or clarifiaction that it must be compliant with the latest relase of OKAPI
* Modules must declare all consumed interfaces in the Module Descriptor “requires” and “optional” sections (3, 5)
  * ***NOTES*** This is difficult to verify.  Need to give this some thought.
* Environment vars are documented in the ModuleDescriptor (5, 11) - _note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* If a module provides interfaces intended to be consued by other FOLIO Modules, they must be defined in the Module Descriptor “provides” section (3, 5)
* All API endpoints are documented in RAML or OpenAPI (11)
* All API endpoints protected with appropriate permissions as per the following guidelines and recommendations (6)
  * https://dev.folio.org/guidelines/naming-conventions/
  * https://wiki.folio.org/display/DD/Permission+Set+Guidelines
* No excessive permissions granted to the module (6) 
  * ***NOTES*** Possibly clarify this a bit... we're after egregious things like okapi.all, or really .all permissions in general.
  * ***NOTES*** Maybe just merge this with the previous criteria as an example?  Technically this is covered by the guidelines linked above.
* NEW CRITERIA - needs to be worded better:  
  * ***NOTES*** Can we add something to verify there are no missing module permissions -- isn't this covered by line 61 (All API endpoints protected with appropriate permissions)?
* Module provides reference data (if applicable) (3, 16)
  * ***NOTES*** Possibly clarify "if applicable", e.g. is there a controlled vocabulary where the module requires at least one value, there should be reference data?
* For backend modules: builds are Maven and JDK 11 based and Dockerfile provided (3, 5, 13)
  * ***NOTES*** provide references, or point to a official list of build tools (possibly combine with language point above).
* Integration (API) tests written in Karate if applicable (3, 4) -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
 * ***NOTES*** Need to avoid "if applicable".  Does this mean that all modules must have karate tests, or that if a module does have integration (API) tests they're written in Karate?
* Back-end unit tests at 80% coverage or higher (3, 4)
* Data is segregated by tenant at the storage layer (6, 7)
 * ***NOTES*** This is really about data storage in FOLIO and we want to get into specifics... by schema?  Not in the same table?  Maybe rephrase "at rest"?
* Back-end modules don’t access data in DB schemas other than their own and public (6, 7)
* Back-end modules respond with a tenant’s content based on x-okapi-tenant header (7)
 * ***NOTES*** Could be much clearer - need to be reworded, or examples need to be provided of what NOT to do.  Is this redundant?
* Standard GET /admin/health endpoint returning a 200 response (5) -_note: read more at [https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol](https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol)_
* HA compliant (5, 14, 15)
 * ***NOTES*** we need more here -- is there a document that we can refer to with more details?  Examples of things we've run into in the past may be helpful.
* Module only uses existing infrastructure / platform technologies_ e.g. PostgreSQL, ElasticSearch (and Kafka, despite it being still unofficial at present)_ (3, 5, 12)
  * ***NOTES*** provide references, or point to a official list for reference.

## Shared/Common
* Uses Apache 2.0 license (2)
* Third party dependencies use an Apache 2.0 compatible license (2)
  * ***NOTES*** This is a tough one to verify, especially on the UI side.  We should probably investigate tools that make this easier and provide a link to the tool, or to documentation describing how to use the tool.  See mod-inventory-storage -> has tooling in the build process to generate/expose licensing info.
* Installation documentation included (11)
  * ***NOTES*** Provide link to a good example
* Personal data form is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file (6)
* Sensitive information is not checked into git repository (6)
  * ***NOTES*** reword to include environment-specific information as well.
* Module is written in a language and framework that FOLIO development teams are familiar with _e.g. Vertx/RMB, Spring Way/folio-spring-base, and React/Stripes_ (13)
  * ***NOTES*** provide references, or point to a official list for reference.
* Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_ (3, 5, 12)
* Integration with any third party system (outside of the FOLIO environment) tolerates the absence of configuration / presence of the system gracefully. (3, 5, 12)
  * ***NOTES*** Possibly reword this
* sonarqube hasn't identified any security issues (6)
 * ***NOTES*** What about major code smells or duplications (what percentage?)
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
