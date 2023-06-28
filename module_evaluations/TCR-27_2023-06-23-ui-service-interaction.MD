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
* [x] Third party dependencies use an Apache 2.0 compatible license
* [x] ~Installation documentation is included~
* [x] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
* [x] Sensitive and environment-specific information is not checked into git repository
* [x] Module is written in a language and framework from the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page
* [x] Module only uses FOLIO interfaces already provided by previously accepted modules
  * `servint` appears to have been introduced in early 2021, before the module acceptance process was in place. This feels more like "this is an exception" rather than "this is acceptable".
* [x] Module gracefully handles the absence of third party systems or related configuration
* [x] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools
* [x] Unit tests have 80% coverage or greater, and are based on [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)

## Frontend
* [x] ~If provided, End-to-end tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)~
* [x] Have i18n support via react-intl and an `en.json` file with English texts
* [ ] Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension
  * There is a single complaint about tabindex=0 on a clickable row in an MCL. This is a legacy pattern that, in fact, we recommended for a long time. Clickable table-rows have been replaced by clicking linked text within a single table-cell. It isn't clear if this app uses a supported pattern (i.e. this needs to be fixed within stripes-components) or if this pattern is already specifically deprecated within stripes-components (i.e. this needs to be fixed within ui-service-interaction). We should consult with Stripes Force for a final opinion.
* [x] Use the latest release of Stripes at the time of evaluation
  * Instead of "latest release" should we use the "officially supported technologies list"?
* [ ] Follow relevant existing UI layouts, patterns and norms
  * "Number generators" marquee is black with contrasting blue text which is ... unusual and seems unlikely to pass a11y constraints. Although axe dev tools do not complain about the contrast ratio of blue on black that may be a technicality of specifying color as an RGB value rather than as a hex value. Given a hex value, the contrast is insufficient: https://webaim.org/resources/contrastchecker/?fcolor=2F609F&bcolor=000000
  * New Sequence form helpfully contains popover links with supplementary descriptions of each field, but the "Output template" descriptor contains a "Learn more" link that should either (1) open in a new window or (2) warn that the form will be cleared when navigating away. (1) is preferable. Additionally, the wiki page it links to is blank. Additionally additionally, is the wiki the source of record for application documentation?
* [x] Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation

## Backend
* [x] ~Module's repository includes a compliant Module Descriptor~
  * -_note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
* [x] ~Module includes executable implementations of all endpoints in the provides section of the Module Descriptor~
* [x] ~Environment vars are documented in the ModuleDescriptor~
  * -_note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* [x] ~If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section~
* [x] ~All API endpoints are documented in RAML or OpenAPI~
* [x] ~All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using `*.all` permissions, all necessary module permissions are assigned, etc.~
  * -_note: read more at https://dev.folio.org/guidelines/naming-conventions/ and https://wiki.folio.org/display/DD/Permission+Set+Guidelines_
* [x] ~Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value~
* [x] ~If provided, integration (API) tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)~
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
* [x] ~Data is segregated by tenant at the storage layer~
* [x] ~The module doesn't access data in DB schemas other than its own and public~
* [x] ~The module responds with a tenant's content based on x-okapi-tenant header~
* [x] ~Standard GET `/admin/health` endpoint returning a 200 response~
  * -_note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
* [x] ~High Availability (HA) compliant~
  * Possible red flags:
    * Connection affinity / sticky sessions / etc. are used
    * Local container storage is used
    * Services are stateful
* [x] ~Module only uses infrastructure / platform technologies on the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.~
  * _e.g. PostgreSQL, ElasticSearch, etc._

## TCR Process Improvements
[_Please include here any suggestions that you feel might improve the TCR Processes._]
* I am increasingly strongly uncomfortable evaluating license compatibility. I suggest we change the line
> Third party dependencies use an Apache 2.0 compatible license
to
> Includes a report of the licenses used by third-party dependencies
and we can delegate evaluation of that list to a person/body with appropriate credentials for this kind of thing. IOW, IANAL and I really really don't want to be responsible for making definitive statements about license compatibility. Example tools in NPM-land:
  * npx apache2-license-checker
  * license-checker
 * Do we/should we have a Source Of Record for application documentation? Is it OK to link to the wiki or should apps point to https://docs.folio.org/?
