# Module acceptance criteria template - DRAFT

## Module Name
ui-linked-data

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
  * - module descriptor provided by `ui-ld-folio-wrapper`.
* [x] Module descriptor MUST include interface requirements for all consumed APIs
  * - module descriptor provided by `ui-ld-folio-wrapper` includes the consumed APIs, see `ui-ld-folio-wrapper/package.json`.
* [x] Third party dependencies use an Apache 2.0 compatible license
* [x] Installation documentation is included
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
* [x] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
* [x] Sensitive and environment-specific information is not checked into git repository
  * - according to the reviewer's good-faith effort
* [x] Module is written in a language and framework from the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1]
* [x] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
  * - `mod-linked-data` currently under review, [TCR-46](https://folio-org.atlassian.net/browse/TCR-46).
* [ ] Module gracefully handles the absence of third party systems or related configuration
* [x] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  * See [Rule Customization](https://dev.folio.org/guides/code-analysis/#rule-customization) details. 
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools[^1]
 * - uses node
* [x] Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]

## Frontend
* [x] If provided, End-to-end tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/stripes-testing_
* [x] Have i18n support via react-intl and an `en.json` file with English texts
* [ ] Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension
  * - Errors caught in self-eval have been fixed.
  * - Two errors caught by WebAIM, a broken ARIA menu and two empty table headers in the results page over the first and last columns (selection buttons and Edit instance buttons)
* [x] INAPPLICABLE ~Use the Stripes version of referred on the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1]~
 * - This is a React module, does not use Stripes
* [x] Follow relevant existing UI layouts, patterns and norms
  * -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
  * e.g. Saving state when navigating between apps (or confirming that you'll lose the state)
* [x] Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation

## TCR Process Improvements
[_Please include here any suggestions that you feel might improve the TCR Processes._]
* As a reviewer, the purpose of some of the Shared/Common requirements may be different for front-end and back-end modules, e.g. module descriptors. Some context about the purpose.
* We have no requirements around dependencies (direct or indirect) that are deprecated. It seems we would not want to rely on deprecated dependencies unless there is a compelling reason (e.g. current version of a framework has not upgraded yet).

[^1]: Refer to the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page for the most recent ACTIVE release.
