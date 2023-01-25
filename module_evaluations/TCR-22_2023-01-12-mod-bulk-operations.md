# Module acceptance criteria template

## How to use this form
When performing a technical evaluation of a module, create a copy of this document and use the conventions below to indicate the status of each criterion.  The evaluation results should be placed in the [module_evaluations](https://github.com/folio-org/tech-council/tree/master/module_evaluations) directory and should conform to the following naming convention: `{JIRA Key}_YYYY-MM-DD.MD`, e.g. `TCR-1_2021-11-17.MD`.  The date here is used to differentiate between initial and potential re-evaluation(s).  It should be the date when the evaluation results file was created.

* [x] ACCEPTABLE
* [x] ~INAPPLICABLE~
* [ ] UNACCEPTABLE
  * comments on what was evaluated/not evaluated, why a criterion failed

## [Criteria](https://github.com/folio-org/tech-council/blob/7b10294a5c1c10c7e1a7c5b9f99f04bf07630f06/MODULE_ACCEPTANCE_CRITERIA.MD)

## Shared/Common
* [x] Uses Apache 2.0 license
* [x] Module build MUST produce a valid module descriptor
* [x] Module descriptor MUST include interface requirements for all consumed APIs
  * Descriptor includes many interface dependencies, assumed to be complete 
* [x] Third party dependencies use an Apache 2.0 compatible license
    * assumed
* [x] Installation documentation is included
    * no documentation, assumed to be standard module
* [x] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
* [x] Sensitive and environment-specific information is not checked into git repository
  * The module descriptor contains environment specific configuration
  * I believe this is common practice amongst many back end modules, thus assumed to be an acceptable exclusion
* [x] Module is written in a language and framework from the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page
  * Java 11 and Spring
* [x] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
  * Only the `login` interface is stated as a dependency
* [x] ~Module gracefully handles the absence of third party systems or related configuration~
  * Assumed to not integrate with any third party systems
* [x] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication
  * The configuration excludes significant packages from the analysis:
  * **/src/main/java/org/folio/bulkops/domain/**,
  * **/src/main/java/org/folio/bulkops/error/**
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools
  * Maven
* [x] Unit tests have 80% coverage or greater, and are based on [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)
  * [Analysis](https://github.com/folio-org/mod-bulk-operations/runs/10477334470) estimates 82% coverage

## Frontend
* [] If provided, End-to-end tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/stripes-testing_
* [ ] Have i18n support via react-intl and an `en.json` file with English texts
* [ ] Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension
* [ ] Use the latest release of Stripes at the time of evaluation
* [ ] Follow relevant existing UI layouts, patterns and norms
  * -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
  * e.g. Saving state when navigating between apps (or confirming that you'll lose the state)
* [ ] Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation

## Backend
* [x] Module's repository includes a compliant Module Descriptor
  * -_note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
* [x] Environment vars are documented in the ModuleDescriptor
  * -_note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* [x] If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section
* [x] All API endpoints are documented in RAML or OpenAPI
  * List of endpoints match between descriptor and OpenAPI docs
* [x] All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using `*.all` permissions, all necessary module permissions are assigned, etc.
  * -_note: read more at https://dev.folio.org/guidelines/naming-conventions/ and https://wiki.folio.org/display/DD/Permission+Set+Guidelines_
* [x] ~Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value~
* [x] ~If provided, integration (API) tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)~
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
* [x] Data is segregated by tenant at the storage layer
  * Assumed to be provided by Spring Base
* [x] The module doesn't access data in DB schemas other than its own and public
  * Assumed to be provided by Spring Base
* [x] The module responds with a tenant's content based on x-okapi-tenant header
  * Assumed to be handled by JpaRepository provided by Spring Base
* [x] Standard GET `/admin/health` endpoint returning a 200 response
  * -_note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
  * Assumed to be provided by Spring Base
* [x] High Availability (HA) compliant
* * Assumed, there is no production code to analyse at the moment
  * Possible red flags:
    * Connection affinity / sticky sessions / etc. are used
    * Local container storage is used
    * Services are stateful
* [x] Module only uses infrastructure / platform technologies on the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.
  * Declares environment variables in descriptor for Postgres
  * Declares environment variables in descriptor for S3
