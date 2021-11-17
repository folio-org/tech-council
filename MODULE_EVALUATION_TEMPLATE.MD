# Module acceptance criteria template

## Conventions
* [x] ACCEPTABLE
* [x] ~INAPPLICABLE~
* [ ] UNACCEPTABLE
  * comments on what was evaluated/not evaluated, why a criterion failed

## [Criteria](https://github.com/folio-org/tech-council/blob/4dc5ac6d632fb880131cd214d212f973683b9ebe/MODULE_ACCEPTANCE_CRITERIA.MD)

* [ ] Upon acceptance, code author(s) agree to have source code canonically in folio-org github
* [ ] Copyright assigned to OLF
* [ ] Uses Apache 2.0 license
* [ ] Third party dependencies use an Apache 2.0 compatible license
* [ ] Module’s repository includes a compliant Module Descriptor
* [ ] Modules must declare all consumed interfaces in the Module Descriptor “requires” and “optional” sections
* [ ] Environment vars are documented in the ModuleDescriptor - _note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* [ ] Back-end modules must define endpoints consumable by other modules in the Module Descriptor “provides” section
* [ ] All API endpoints are documented in RAML or OpenAPI
* [ ] All API endpoints protected with appropriate permissions
* [ ] No excessive permissions granted to the module
* [ ] Code of Conduct statement in repository
* [ ] Installation documentation included
* [ ] Contribution guide is included in repo
* [ ] Module provides reference data (if applicable)
* [ ] Personal data form is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file
* [ ] Sensitive information is not checked into git repository
* [ ] Module is written in a language and framework that FOLIO development teams are familiar with _e.g. Vertx/RMB, Spring Way/folio-spring-base, and React/Stripes_
* [ ] Back-end modules are based on Maven/JDK 11 and provide a Dockerfile
* [ ] Integration (API) tests written in Karate if applicable -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
* [ ] Back-end unit tests at 80% coverage
* [ ] Data is segregated by tenant at the storage layer
* [ ] Back-end modules don’t access data in DB schemas other than their own and public
* [ ] Tenant data is segregated at the transit layer
* [ ] Back-end modules respond with a tenant’s content based on x-okapi-tenant header
* [ ] Standard GET /admin/health endpoint returning a 200 response -_note: read more at [https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol](https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol)_
* [ ] HA compliant
* [ ] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_
* [ ] Module only uses existing infrastructure / platform technologies_ e.g. PostgreSQL, ElasticSearch (and Kafka, despite it being still unofficial at present)_
* [ ] Integration with any third party system (outside of the FOLIO environment) tolerates the absence of configuration / presence of the system gracefully.
* [ ] Front-end modules: builds are Node 16/Yarn 1
* [ ] Front-end unit tests written in Jest/RTL at 80% coverage
* [ ] Front-end End-to-end tests written in Cypress, if applicable -_note: these tests aren’t defined as part of the module_
* [ ] Front-end modules have i18n support via react-intl and an en.json file with English texts
* [ ] Front-end modules have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension
* [ ] Front-end modules use the current version of Stripes
* [ ] Front-end modules follow relevant existing UI layouts, patterns and norms -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
* [ ] Front-end modules must work in the latest version of Chrome (the supported runtime environment)
* [ ] sonarqube hasn't identified any security issues
