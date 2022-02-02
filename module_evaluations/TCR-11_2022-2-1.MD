# Module acceptance criteria template

## How to use this form
When performing a technical evaluation of a module, create a copy of this document and use the conventions below to indicate the status of each criteria.  The evaluation results should be placed in the [module_evaluations](https://github.com/folio-org/tech-council/tree/master/module_evaluations) directory and should conform to the following naming convention:  `{JIRA Key}_YYYY-MM-DD.MD`, e.g. `TCR-1_2021-11-17.MD`.  The date here is used to differenciate between initial and potential re-evaluation(s).  It should be the date which the evaluation results file was created.

* [x] ACCEPTABLE
* [x] ~INAPPLICABLE~
* [ ] UNACCEPTABLE
  * comments on what was evaluated/not evaluated, why a criterion failed

## [Criteria](https://github.com/folio-org/tech-council/blob/4dc5ac6d632fb880131cd214d212f973683b9ebe/MODULE_ACCEPTANCE_CRITERIA.MD)

* [x] Upon acceptance, code author(s) agree to have source code canonically in folio-org github
* [x] Copyright assigned to OLF
* [x] Uses Apache 2.0 license
* [x] Third party dependencies use an Apache 2.0 compatible license
* [x] ~Module’s repository includes a compliant Module Descriptor~
* [x] ~Modules must declare all consumed interfaces in the Module Descriptor “requires” and “optional” sections~
* [x] ~Environment vars are documented in the ModuleDescriptor - _note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)~
* [x] ~Back-end modules must define endpoints consumable by other modules in the Module Descriptor “provides” section~
* [x] ~All API endpoints are documented in RAML or OpenAPI~
* [x] ~All API endpoints protected with appropriate permissions~
* [x] ~No excessive permissions granted to the module~
* [x] Code of Conduct statement in repository
* [x] ~Installation documentation included~
* [x] Contribution guide is included in repo
* [x] ~Module provides reference data (if applicable)~
* [x] Personal data form is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file
* [x] Sensitive information is not checked into git repository
* [x] Module is written in a language and framework that FOLIO development teams are familiar with _e.g. Vertx/RMB, Spring Way/folio-spring-base, and React/Stripes_
* [x] ~Back-end modules are based on Maven/JDK 11 and provide a Dockerfile~
* [x] ~Integration (API) tests written in Karate if applicable -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests~
* [x] ~Back-end unit tests at 80% coverage~
* [x] ~Data is segregated by tenant at the storage layer~
* [x] ~Back-end modules don’t access data in DB schemas other than their own and public~
* [x] ~Tenant data is segregated at the transit layer~
* [x] ~Back-end modules respond with a tenant’s content based on x-okapi-tenant header~
* [x] ~Standard GET /admin/health endpoint returning a 200 response -_note: read more at [https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol](https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol)~
* [x] ~HA compliant~
* [x] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_
* [x] ~Module only uses existing infrastructure / platform technologies_ e.g. PostgreSQL, ElasticSearch (and Kafka, despite it being still unofficial at present)~
* [x] ~Integration with any third party system (outside of the FOLIO environment) tolerates the absence of configuration / presence of the system gracefully.~
* [x] Front-end modules: builds are Node 16/Yarn 1
* [x] Front-end unit tests written in Jest/RTL at 80% coverage
* [x] Front-end End-to-end tests written in Cypress, if applicable -_note: these tests aren’t defined as part of the module_
* [x] Front-end modules have i18n support via react-intl and an en.json file with English texts
* [x] Front-end modules have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension
* [x] Front-end modules use the current version of Stripes
* [x] Front-end modules follow relevant existing UI layouts, patterns and norms -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
* [x] Front-end modules must work in the latest version of Chrome (the supported runtime environment)
* [x] sonarqube hasn't identified any security issues
