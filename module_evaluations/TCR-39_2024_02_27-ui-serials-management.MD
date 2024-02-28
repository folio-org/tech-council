# Module acceptance criteria template

## Module Name
ui-serials-management

## How to use this form
When performing a technical evaluation of a module, create a copy of this document and use the conventions below to indicate the status of each criterion.  The evaluation results should be placed in the [module_evaluations](https://github.com/folio-org/tech-council/tree/master/module_evaluations) directory and should conform to the following naming convention: `{JIRA Key}_YYYY-MM-DD-{module name}.MD`, e.g. `TCR-1_2021-11-17-mod-foo.MD`.  The date here is used to differentiate between initial and potential re-evaluation(s).  It should be the date when the evaluation results file was created.

* [x] ACCEPTABLE
* [x] ~INAPPLICABLE~
* [ ] UNACCEPTABLE
  * comments on what was evaluated/not evaluated, why a criterion failed

## [Criteria](https://github.com/folio-org/tech-council/blob/7b10294a5c1c10c7e1a7c5b9f99f04bf07630f06/MODULE_ACCEPTANCE_CRITERIA.MD)

## Administrative
* [X] Listed by the Product Council on [Functionality Evaluated by the PC](https://wiki.folio.org/display/PC/Functionality+Evaluated+by+the+PC) with a positive evaluation result.

## Shared/Common
* [X] Uses Apache 2.0 license
* [X] Module build MUST produce a valid module descriptor
* [ ] Module descriptor MUST include interface requirements for all consumed APIs
  * Lists serials-management interface.  in constants/endpoints.js, also requires orders/*, organizations/*, several others.
* [ ] Third party dependencies use an Apache 2.0 compatible license
  * ASF excludes:
    * GPL-3.0
    * GPL-3.0-or-later
  * ASF lists as questionable / depending on how it's used:
    * CC-BY-4.0
    * MPL-2.0
  * Unknown:
    * Custom: https://github.com/dominictarr/event-stream
* [X] In order to ensure reproducible builds, snapshot versions of build-time dependencies should not be referenced.
* [X] Installation documentation is included
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
* [X] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
* [X] Sensitive and environment-specific information is not checked into git repository
* [X] Module is written in a language and framework from the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1]
* [ ] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
  * Pending mod-serials-management
* [X] Module gracefully handles the absence of third party systems or related configuration
* [ ] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  * See [Rule Customization](https://dev.folio.org/guides/code-analysis/#rule-customization) details. 
  * 54 code smells
  * 7.2% duplication
* [X] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools[^1]
* [ ] Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]
  * 35.5% coverage

## Frontend
* [X] If provided, End-to-end tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/stripes-testing_
  * no end-to-end tests written
* [X] Have i18n support via react-intl and an `en.json` file with English texts
* [TBD] Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension
* [X] Use the Stripes version of referred on the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1]
* [TBD] Follow relevant existing UI layouts, patterns and norms
  * -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
  * e.g. Saving state when navigating between apps (or confirming that you'll lose the state)
* [TBD] Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation

## TCR Process Improvements
[_Please include here any suggestions that you feel might improve the TCR Processes._]

* Module descriptor check should link to https://dev.folio.org/guides/module-descriptor/


[^1]: Refer to the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page for the most recent ACTIVE release.
