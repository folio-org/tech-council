# Module acceptance criteria template

## Conventions
* [x] ACCEPTABLE
* [x] ~INAPPLICABLE~
* [ ] UNACCEPTABLE
  * comments on what was evaluated/not evaluated, why a criterion failed

## [Criteria](https://github.com/folio-org/tech-council/blob/4dc5ac6d632fb880131cd214d212f973683b9ebe/MODULE_ACCEPTANCE_CRITERIA.MD)

* [ ] Upon acceptance, code author(s) agree to have source code canonically in folio-org github (3, 5, 13)
* [ ] Copyright assigned to OLF (13)
* [ ] Uses Apache 2.0 license (2)
* [ ] Third party dependencies use an Apache 2.0 compatible license (2)
* [ ] Module’s repository includes a compliant Module Descriptor (3, 5)
* [ ] Modules must declare all consumed interfaces in the Module Descriptor “requires” and “optional” sections (3, 5)
* [ ] Environment vars are documented in the ModuleDescriptor (5, 11) - _note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* [ ] Back end modules must define endpoints consumable by other modules in the Module Descriptor “provides” section (3, 5)
* [ ] All API endpoints are documented in RAML or OpenAPI (11)
* [ ] All API endpoints protected with appropriate permissions (6)
* [ ] No excessive permissions granted to the module (6)
* [ ] Code of Conduct statement in repository (1)
* [ ] Installation documentation included (11)
* [ ] Contribution guide is included in repo (13)
* [ ] Module provides reference data (if applicable) (3, 16)
* [ ] Personal data form is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file (6)
* [ ] Sensitive information is not checked into git repository (6)
* [ ] Module is written in a language and framework that FOLIO development teams are familiar with _e.g. Vertx/RMB, Spring Way/folio-spring-base, and React/Stripes_ (13)
* [ ] For backend modules: builds are Maven and JDK 11 based and Dockerfile provided (3, 5, 13)
* [ ] Integration (API) tests written in Karate if applicable (3, 4) -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
* [ ] Back-end unit tests at 80% coverage (3, 4)
* [ ] Data is segregated by tenant at the storage layer (6, 7)
* [ ] Back-end modules don’t access data in DB schemas other than their own and public (6, 7)
* [ ] Tenant data is segregated at the transit layer (6, 7)
* [ ] Back-end modules respond with a tenant’s content based on x-okapi-tenant header (7)
* [ ] Standard GET /admin/health endpoint returning a 200 response (5) -_note: read more at [https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol](https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol)_
* [ ] HA compliant (5, 14, 15)
* [ ] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_ (3, 5, 12)
* [ ] Module only uses existing infrastructure / platform technologies_ e.g. PostgreSQL, ElasticSearch (and Kafka, despite it being still unofficial at present)_ (3, 5, 12)
* [ ] Integration with any third party system (outside of the FOLIO environment) tolerates the absence of configuration / presence of the system gracefully. (3, 5, 12)
* [ ] Front-end modules: builds are Node 16/Yarn 1 (3, 5, 13)
* [ ] Front-end unit tests written in Jest/RTL at 80% coverage (3, 4)
* [ ] Front-end End-to-end tests written in Cypress, if applicable  (3, 4) -_note: these tests aren’t defined as part of the module_
* [ ] Front-end modules have i18n support via react-intl and an en.json file with English texts (8)
* [ ] Front-end modules have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension (9)
* [ ] Front-end modules use the current version of Stripes (10, 16)
* [ ] Front-end modules follow relevant existing UI layouts, patterns and norms (10) -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
* [ ] Front-end modules must work in the latest version of Chrome (the supported runtime environment) (10)
* [ ] sonarqube hasn't identified any security issues (6)
