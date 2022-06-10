# FOLIO Module Acceptance Values and Criteria

## version 2.0 (ratified 6-10-2022)

# Overview
The Technical Council (TC) has defined a process for technical evaluation of modules for inclusion in a FOLIO release.  This document outlines the high level values and specific criteria used when evaluating modules as part of this process.  The distinction between values and criteria is as follows:

* **Values** are high-level factors that are unlikely to change over time.  They should be understandable even to a non-technical audience.
* **Criteria** are specific, verifiable tests as to how we’re meeting the Values within the current state of affairs.  Criteria will evolve over time to respond to changes in the Project’s technology stack, current best practices, etc. They may require a degree of technical expertise or domain knowledge to fully understand.

In some cases, we may not yet have comprehensive Criteria for assessing a module’s adherence to a Value.  In such cases, subjective review and analysis will be applied, and may lead to discussion.

It is important to note that these Values and Criteria are meant to be applied to new, incoming modules, and may not reflect the current state of affairs in the existing modules of FOLIO.  The Technical Council will work to align the current reality of the code with the Values and Criteria over time, as practicable.

It is also important to note that while this document provides the criteria against which a module will be assessed for inclusion into a FOLIO release, it does not enumerate the process for that evaluation.  Nor does it account for any retroactive evaluation of modules already accepted into FOLIO that may not meet the criteria as currently written.  Such processes will need to be developed and documented by the Technical Council separately.

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

## Frontend
* If provided, End-to-end tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) (3, 4) 
 * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
 * -_note: these tests are defined in https://github.com/folio-org/stripes-testing_
* Have i18n support via react-intl and an en.json file with English texts (8)
* Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension (9)
* Use the latest release of Stripes at the time of evaluation (10, 16)
* Follow relevant existing UI layouts, patterns and norms (10) -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
* Follow relevant existing UX layouts, patterns and norms (10) -_note: read more about current practices at ???_
  * E.g. Saving state when navigating between apps (or confirming that you'll lose the state)
* Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation (10)

## Backend
* Module’s repository includes a compliant Module Descriptor (3, 5)
  * -_note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
* Environment vars are documented in the ModuleDescriptor (5, 11)
  * -_note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* If a module provides interfaces intended to be consued by other FOLIO Modules, they must be defined in the Module Descriptor “provides” section (3, 5)
* All API endpoints are documented in RAML or OpenAPI (11)
* All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using *.all permissions, all necessary module permissions are assigned, etc. (6)
  * -_note: read more at https://dev.folio.org/guidelines/naming-conventions/ and https://wiki.folio.org/display/DD/Permission+Set+Guidelines_
* Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value (3, 16)  
* If provided, integration (API) tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) (3, 4) 
 * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
 * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
* Data is segregated by tenant at the storage layer (6, 7)
* The module doesn’t access data in DB schemas other than its own and public (6, 7)
* The module responds with a tenant’s content based on x-okapi-tenant header (7)
* Standard GET /admin/health endpoint returning a 200 response (5) 
 * -_note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
* High Availity (HA) compliant (5, 14, 15)
 * Possible red flags:
  * Connection affinity / sticky sessions / etc. are used
  * Local container storage is used
  * Services are stateful
* Module only uses infrastructure / platform technologies on the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.
  * _e.g. PostgreSQL, ElasticSearch, etc._ (3, 5, 12)

## Shared/Common
* Uses Apache 2.0 license (2)
* Module build MUST produce a valid module descriptor (3, 5)
* Module descriptor MUST include interface requirements for all consumed APIs (3, 5)
* Third party dependencies use an Apache 2.0 compatible license (2)
* Installation documentation is included (11)
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
* Personal data form is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file (6)
* Sensitive and environment-specific information is not checked into git repository (6)
* Module is written in a language and framework from the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page (3, 5)
* Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_ (3, 5, 12)
* Module gracefully handles the absence of third party systems or related configuration. (3, 5, 12)
* Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication (6)
* Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools (3, 5, 13)
* Unit tests have 80% coverage or greater, and are based on [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) (3, 4)
