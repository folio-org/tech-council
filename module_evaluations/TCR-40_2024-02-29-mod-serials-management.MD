# Module acceptance criteria template

## Module Name
mod-serials-management

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
* [ ] Module descriptor MUST include interface requirements for all consumed APIs
  * there are no consumed apis (?). Requires section of the module descriptor is empty. But it seems to rely on orders.po-lines.item.get (mod-orders).
* [ ] Third party dependencies use an Apache 2.0 compatible license
  * micronaut.io: O.K.
  * zaxxer : O.K.
  * http-builder-ng: O.K.
  * virtualdogbert: Eclipse Public License v1.0 as published by the Eclipse Foundation or (per the licensee's choosing) under the terms of the GNU Lesser General Public 
License version 2.1
  * z3950 zing cql is published unter LGPL 1.0, if it is that: https://github.com/indexdata/cql-java/blob/master/LGPL-2.1   -- not compatible with Apache 2.0 ?? Cf. https://www.apache.org/legal/resolved.html
  * https://github.com/pledbrook/groovy-handlebars-engine : Apache 2.0
  * https://github.com/jknack/handlebars.java/blob/master/LICENSE: Apache 2.0
  * https://github.com/everit-org/json-schema/blob/master/LICENSE : Apache 2.0
  * https://github.com/renatoathaydes/spock-reports/blob/master/LICENSE.txt : Apache 2.0
  * https://github.com/bmuschko/gradle-docker-plugin/blob/master/LICENSE.txt : Apache 2.0
* [x] In order to ensure reproducible builds, snapshot versions of build-time dependencies should not be referenced.
  * Can't see any
* [ ] Installation documentation is included
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
  * Installation documentation is too sparse. Just mentioning K8s deployment is not enough. The agreement of SysOps SIG is that deployment documentation should always be provided for a single server installation (K8s instructions are useful, but optional).
    Installation documentation should include running using the grail-app in a Vagrant box, like the documentation for mod-agreements ("Initial Setup").
    Instead of to the latest module descriptor, it should point to a versionized one.
  * reference to Sonar Cube analysis is missing in the documentation.
  * a word on permissions is missing in the documentation
  * a link to the module's API documentation is missing in the documentation (dev.folio.org/reference/api/...)
  * Dockerfile is incomplete because the "java" command has been commented out
* [x] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
    *** hier weiter ***
* [ ] Sensitive and environment-specific information is not checked into git repository
* [ ] Module is written in a language and framework from the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1]
* [ ] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
* [ ] Module gracefully handles the absence of third party systems or related configuration
* [ ] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  * See [Rule Customization](https://dev.folio.org/guides/code-analysis/#rule-customization) details. 
* [ ] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools[^1]
* [ ] Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]

## Frontend
* [ ] If provided, End-to-end tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/stripes-testing_
* [ ] Have i18n support via react-intl and an `en.json` file with English texts
* [ ] Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension
* [ ] Use the Stripes version of referred on the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1]
* [ ] Follow relevant existing UI layouts, patterns and norms
  * -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
  * e.g. Saving state when navigating between apps (or confirming that you'll lose the state)
* [ ] Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation

## Backend
* [ ] Module's repository includes a compliant Module Descriptor
  * -_note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
* [ ] Module includes executable implementations of all endpoints in the provides section of the Module Descriptor
* [ ] Environment vars are documented in the ModuleDescriptor
  * -_note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* [ ] If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section, and must conform to FOLIO [interface naming conventions](https://dev.folio.org/guidelines/naming-conventions/#interfaces).
* [ ] All API endpoints are documented in OpenAPI.
* [ ] All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using `*.all` permissions, all necessary module permissions are assigned, etc.
  * -_note: read more at https://dev.folio.org/guidelines/naming-conventions/ and https://wiki.folio.org/display/DD/Permission+Set+Guidelines_
  * IK: Naming convention of permissions: serials-management.serials.view  vs. serials-management.refdata.collection.get (probably O.K., because "view" is a collection)
  * IK: Write permissions are being defined but never referenced (serials-management.settings.write, ...). Probably intended to be used by other modules.
  * IK: Very granular permission sets. This is probably good.
* [ ] Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value
  * module provides reference data
* [ ] If provided, integration (API) tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
* [ ] Data is segregated by tenant at the storage layer
* [ ] The module doesn't access data in DB schemas other than its own and public
* [ ] Any dependencies, other than on defined interfaces, are declared in the README.md.
* [ ] The module responds with a tenant's content based on x-okapi-tenant header
* [ ] Standard GET `/admin/health` endpoint returning a 200 response
  * -_note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
* [ ] High Availability (HA) compliant
  * Possible red flags:
    * Connection affinity / sticky sessions / etc. are used
    * Local container storage is used
    * Services are stateful
* [ ] Module only uses infrastructure / platform technologies on the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.[^1]
  * _e.g. PostgreSQL, ElasticSearch, etc._

## TCR Process Improvements
[_Please include here any suggestions that you feel might improve the TCR Processes._]

[^1]: Refer to the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page for the most recent ACTIVE release.
