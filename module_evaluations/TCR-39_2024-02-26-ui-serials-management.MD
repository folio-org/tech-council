# Module acceptance criteria template

## Module Name
mod-XXX or ui-XXX etc.

## How to use this form
When performing a technical evaluation of a module, create a copy of this document and use the conventions below to indicate the status of each criterion.  The evaluation results should be placed in the [module_evaluations](https://github.com/folio-org/tech-council/tree/master/module_evaluations) directory and should conform to the following naming convention: `{JIRA Key}_YYYY-MM-DD-{module name}.MD`, e.g. `TCR-1_2021-11-17-mod-foo.MD`.  The date here is used to differentiate between initial and potential re-evaluation(s).  It should be the date when the evaluation results file was created.

* [x] ACCEPTABLE
* [x] ~INAPPLICABLE~
* [ ] UNACCEPTABLE
  * comments on what was evaluated/not evaluated, why a criterion failed

## [Criteria](https://github.com/folio-org/tech-council/blob/7b10294a5c1c10c7e1a7c5b9f99f04bf07630f06/MODULE_ACCEPTANCE_CRITERIA.MD)

## Administrative
* [x] Listed by the Product Council on [Functionality Evaluated by the PC](https://wiki.folio.org/display/PC/Functionality+Evaluated+by+the+PC) with a positive evaluation result.

## Shared/Common
* [x] Uses Apache 2.0 license
* [x] Module build MUST produce a valid module descriptor
* [x] Module descriptor MUST include interface requirements for all consumed APIs
* [x] Third party dependencies use an Apache 2.0 compatible license
* [x] In order to ensure reproducible builds, snapshot versions of build-time dependencies should not be referenced.
* [x] Installation documentation is included
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
* [x] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
* [x] Sensitive and environment-specific information is not checked into git repository
* [x] Module is written in a language and framework from the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1]
* [x] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
* [x] Module gracefully handles the absence of third party systems or related configuration
* [ ] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  * Pending work to reduce code duplication https://folio-org.atlassian.net/browse/UISER-60
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools[^1]
* [ ] Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]
  * Pending work on increasing test converage https://folio-org.atlassian.net/browse/UISER-51

## Frontend
* [x] If provided, End-to-end tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/stripes-testing_
* [x] Have i18n support via react-intl and an `en.json` file with English texts
* [ ] Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension
  * Pending a range of fixes for issues identified using axe DevTools Chrome Extension https://folio-org.atlassian.net/issues/?jql=project%20%3D%20UI-Serials-Management%20and%20labels%20%3D%20accessibility%20and%20status%20!%3D%20Closed
* [x] Use the Stripes version of referred on the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1]
* [x] Follow relevant existing UI layouts, patterns and norms
  * -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
  * e.g. Saving state when navigating between apps (or confirming that you'll lose the state)
* [x] Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation


## TCR Process Improvements
[_Please include here any suggestions that you feel might improve the TCR Processes._]

[^1]: Refer to the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page for the most recent ACTIVE release.
