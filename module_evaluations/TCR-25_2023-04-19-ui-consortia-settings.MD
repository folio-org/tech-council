# Module acceptance criteria template

## How to use this form
When performing a technical evaluation of a module, create a copy of this document and use the conventions below to indicate the status of each criterion.  The evaluation results should be placed in the [module_evaluations](https://github.com/folio-org/tech-council/tree/master/module_evaluations) directory and should conform to the following naming convention: `{JIRA Key}_YYYY-MM-DD.MD`, e.g. `TCR-1_2021-11-17.MD`.  The date here is used to differentiate between initial and potential re-evaluation(s).  It should be the date when the evaluation results file was created.

* [x] ACCEPTABLE
* [x] ~INAPPLICABLE~
* [x] ~~UNACCEPTABLE~~
  * comments on what was evaluated/not evaluated, why a criterion failed

## [Criteria](https://github.com/folio-org/tech-council/blob/7b10294a5c1c10c7e1a7c5b9f99f04bf07630f06/MODULE_ACCEPTANCE_CRITERIA.MD)

## Shared/Common
* [x] Uses Apache 2.0 license
* [x] Module build MUST produce a valid module descriptor
* [x] Module descriptor MUST include interface requirements for all consumed APIs
* [x] Third party dependencies use an Apache 2.0 compatible license
  * IANAL. The following licenses are in use in production dependencies, and I believe are all compatible with Apache 2.0:
    * MIT: 289
    * ISC: 23
    * Apache-2.0: 20
    * BSD-3-Clause: 10
    * BSD-2-Clause: 8
    * Unlicense: 2
    * CC0-1.0: 2
    * 0BSD: 2
    * CC-BY-4.0: 1
    * MIT*: 1
* [x] Installation documentation is included
* [x] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
* [x] Sensitive and environment-specific information is not checked into git repository
* [x] Module is written in a language and framework from the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page
* [x] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
  * TCR-26, submitted simultaneously, provides the `consortia` interface.
* [x] Module gracefully handles the absence of third party systems or related configuration
* [x] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools
* [x] Unit tests have 80% coverage or greater, and are based on [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)

## Frontend
* [x] If provided, End-to-end tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)
  * none provided
* [x] Have i18n support via react-intl and an `en.json` file with English texts
* [x] Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension
* [x] Use the latest release of Stripes at the time of evaluation
* [x] Follow relevant existing UI layouts, patterns and norms
* [x] Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation

## Backend
* [x] ~~Module's repository includes a compliant Module Descriptor~~
* [x] ~~Module includes executable implementations of all endpoints in the provides section of the Module Descriptor~~
* [x] ~~Environment vars are documented in the ModuleDescriptor~~
* [x] ~~If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section~~
* [x] ~~All API endpoints are documented in RAML or OpenAPI~~
* [x] ~~All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using `*.all` permissions, all necessary module permissions are assigned, etc.~~
* [x] ~~Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value~~
* [x] ~~If provided, integration (API) tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)~~
* [x] ~~Data is segregated by tenant at the storage layer~~
* [x] ~~The module doesn't access data in DB schemas other than its own and public~~
* [x] ~~The module responds with a tenant's content based on x-okapi-tenant header~~
* [x] ~~Standard GET `/admin/health` endpoint returning a 200 response~~
* [x] ~~High Availability (HA) compliant~~
* [x] ~~Module only uses infrastructure / platform technologies on the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.~~

## TCR Process Improvements
* I'm not confident the "Shared/Common" criterion "Installation documentation is included" makes sense for UI modules. Maybe it just needs an "if relevant" suffix? The closest thing I can think of is configuration instructions for things like ui-eholdings, but that really isn't "installation" documentation.
* I am not especially comfortable assessing Apache 2 license compatibility. It would be helpful to have a list of common known-good licenses. Additionally, there are tools that can assist with finding licenses in dependencies. It may be worth mentioning or providing instructions for them:
  * Frontend: https://www.npmjs.com/package/license-report
  * Frontend: https://www.npmjs.com/package/license-checker
  * Backend: https://maven.apache.org/plugins/maven-project-info-reports-plugin/licenses-mojo.html
