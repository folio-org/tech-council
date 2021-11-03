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

* Upon acceptance, code author(s) agree to have source code canonically in folio-org github (3, 5, 13)
* Copyright assigned to OLF (13)
* Uses Apache 2.0 license (2)
* Third party dependencies use an Apache 2.0 compatible license (2)
* Module’s repository includes a compliant Module Descriptor (3, 5)
* Modules must declare all consumed interfaces in the Module Descriptor “requires” and “optional” sections (3, 5)
* Environment vars are documented in the ModuleDescriptor (5, 11) - _note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* Back end modules must define endpoints consumable by other modules in the Module Descriptor “provides” section (3, 5)
* All API endpoints are documented in RAML or OpenAPI (11)
* All API endpoints protected with appropriate permissions (6)
* No excessive permissions granted to the module (6) 
* Code of Conduct statement in repository (1)
* Installation documentation included (11)
* Contribution guide is included in repo (13)
* Module provides reference data (if applicable) (3, 16)
* Personal data form is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file (6)
* Sensitive information is not checked into git repository (6)
* Module is written in a language and framework that FOLIO development teams are familiar with _e.g. Vertx/RMB, Spring Way/folio-spring-base, and React/Stripes_ (13)
* For backend modules: builds are Maven and JDK 11 based and Dockerfile provided (3, 5, 13)
* Integration (API) tests written in Karate if applicable (3, 4) -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
* Back-end unit tests at 80% coverage (3, 4)
* Data is segregated by tenant at the storage layer (6, 7)
* Back-end modules don’t access data in DB schemas other than their own and public (6, 7)
* Tenant data is segregated at the transit layer (6, 7)
* Back-end modules respond with a tenant’s content based on x-okapi-tenant header (7)
* Standard GET /admin/health endpoint returning a 200 response (5) -_note: read more at [https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol](https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol)_
* HA compliant (5,14,15)
* Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_ (3, 5, 12)
* Module only uses existing infrastructure / platform technologies_ e.g. PostgreSQL, ElasticSearch (and Kafka, despite it being still unofficial at present)_ (3, 5, 12)
* Integration with any third party system (outside of the FOLIO environment) tolerates the absence of configuration / presence of the system gracefully. (3, 5, 12)
* Front-end modules: builds are Node 16/Yarn 1 (3, 5, 13)
* Front-end unit tests written in Jest/RTL at 80% coverage (3, 4)
* Front-end End-to-end tests written in Cypress, if applicable  (3, 4) -_note: these tests aren’t defined as part of the module_
* Front-end modules have i18n support via react-intl and an en.json file with English texts (8)
* Front-end modules have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension (9)
* Front-end modules use the current version of Stripes (10, 16)
* Front-end modules follow relevant existing UI layouts, patterns and norms (10) -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
* Front end modules must work in the latest version of Chrome (the supported runtime environment) (10)
* sonarqube hasn't identified any security issues (6)


# Criteria Per Value

An alternate display of the above content


## Module adheres to Community Code of Conduct



* Code of Conduct statement in repository


## Module license is compatible with the FOLIO Project



* Uses Apache 2.0 license
* Third party dependencies use an Apache 2.0 compatible license


## Module can be included in existing community build processes



* Upon acceptance, code author(s) agree to have source code canonically in folio-org github
* Module’s repository includes a compliant Module Descriptor
* Modules must declare all consumed interfaces in the Module Descriptor “requires” and “optional” sections
* Back end modules must define endpoints consumable by other modules in the Module Descriptor “provides” section
* Module provides reference data (if applicable)
* For backend modules: builds are Maven and JDK 11 based and Dockerfile provided
* Integration (API) tests written in Karate if applicable
* Back-end unit tests at 80% coverage
* Front-end unit tests written in Jest/RTL at 80% coverage
* Front-end End-to-end tests written in Cypress, if applicable
* Module only uses FOLIO interfaces already provided by previously accepted modules 
* Module only uses existing infrastructure / platform technologies
* Integration with any third party system (outside of the FOLIO environment) tolerates the absence of configuration / presence of the system gracefully
* Front-end modules: builds are Node 16/Yarn 1


## Module has robust testing that can run with existing community testing processes



* Integration (API) tests written in Karate if applicable
* Back-end unit tests at 80% coverage
* Front-end unit tests written in Jest/RTL at 80% coverage
* Front-end End-to-end tests written in Cypress, if applicable


## Module can be deployed in the Community’s reference environments without undue burden



* Upon acceptance, code author(s) agree to have source code canonically in folio-org github
* Module’s repository includes a compliant Module Descriptor
* Modules must declare all consumed interfaces in the Module Descriptor “requires” and “optional” sections
* Environment vars are documented in the ModuleDescriptor
* Back end modules must define endpoints consumable by other modules in the Module Descriptor “provides” section
* HA compliant
* Standard GET /admin/health endpoint returning a 200 response
* For backend modules: builds are Maven and JDK 11 based and Dockerfile provided
* Module only uses FOLIO interfaces already provided by previously accepted modules 
* Module only uses existing infrastructure / platform technologies
* Integration with any third party system (outside of the FOLIO environment) tolerates the absence of configuration / presence of the system gracefully
* Front-end modules: builds are Node 16/Yarn 1


## Module is secure



* All API endpoints protected with appropriate permissions
* No excessive permissions granted to the module
* Personal data form is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file
* Sensitive information is not checked into git repository
* Tenant data is segregated at the storage layer
* Back-end modules don’t access data in DB schemas other than their own and public
* Tenant data is segregated at the transit layer
* sonarqube hasn't identified any security issues


## Module is multi-tenant



* Tenant data is segregated at the storage layer
* Back-end modules don’t access data in DB schemas other than their own and public
* Tenant data is segregated at the transit layer
* Back-end modules respond with a tenant’s content based on x-okapi-tenant header


## Module is internationalized



* Front-end modules have i18n support via react-intl and an en.json file with English texts


## Module is meets current accessibility requirements



* Front-end modules have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension


## Module offers a cohesive user experience consistent with the rest of FOLIO



* Front-end modules use the current version of Stripes
* Front-end modules follow relevant existing UI layouts, patterns and norms
* Front end modules must work in the latest version of Chrome


## Module has developer and end-user documentation



* Environment vars are documented in the ModuleDescriptor
* API endpoints are all documented in RAML or OpenAPI
* Installation documentation included


## Module depends ONLY on other modules and infrastructure that are already included in FOLIO



* Module only uses FOLIO interfaces already provided by previously accepted modules 
* Module only uses existing infrastructure / platform technologies
* Integration with any third party system (outside of the FOLIO environment) tolerates the absence of configuration / presence of the system gracefully


## Module has a long-term development and maintenance plan



* Upon acceptance, code author(s) agree to have source code canonically in folio-org github
* Copyright assigned to OLF
* Contribution guide is included in repo
* Module is written in a language and framework that FOLIO development teams are familiar with
* For backend modules: builds are Maven and JDK 11 based and Dockerfile provided
* Front-end modules: builds are Node 16/Yarn 1


## Module is scalable



* HA compliant


## Module supports high availability



* HA compliant


## Modules conforms to FOLIO upgrade mechanisms



* Module provides reference data (if applicable)
* Front-end modules uses the current version of Stripes
