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
  * we don't see any dependencies on folio apis. Tenants are stored as references in their own database schemas.
* [x] Third party dependencies use an Apache 2.0 compatible license
  * testcontainer.org, projectlombok.org : The MIT License
* [x] Installation documentation is included
  * is missing: compiling, running it, build the docker container, deploying the module
  * status: in preparation
  * -_note: see for example for mod-search like this: https://github.com/folio-org/mod-search/blob/master/README.md_
* [x] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
  * the form is filled out. But could user_id, username in table tenant_user be personal data ?
  * Pseudonym / Alias / Nickname / Username / User ID have been checked as personal data
* [x] Sensitive and environment-specific information is not checked into git repository
* [x] Module is written in a language and framework from the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page
* [x] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
* [x] Module gracefully handles the absence of third party systems or related configuration
  * it does not seem to depend on anything outside of FOLIO to do its work.
* [x] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools
* [x] Unit tests have 80% coverage or greater, and are based on [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)
  * It has 81.1% code coverage according to this page https://sonarcloud.io/summary/overall?id=org.folio%3Amod-consortia .
## Backend
* [x] Module's repository includes a compliant Module Descriptor
  * -_note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
* [x] Module includes executable implementations of all endpoints in the provides section of the Module Descriptor
* [x] Environment vars are documented in the ModuleDescriptor
  * -_note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* [x] If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section
* [x] All API endpoints are documented in RAML or OpenAPI
  * in the documentation https://github.com/folio-org/mod-consortia/tree/master/src/main/resources/swagger.api, all endpoints are being listed with all methods: /consortia: POST, GET; /user-tenants/{associationId}: PUT, GET. /tenants: GET, POST, PUT, DELETE; /user-tenants: GET, POST, DELETE; /user-tenants/{associationId}: GET.
  * look in /src/main/resources/swagger.api and compare endpoints and methods to the module descriptor. It needs to match. Checked againts the latest reference commit.
  * Here all endpoints are listed, in yaml (good): https://dev.folio.org/reference/api/#mod-consortia-consortia
* [x] All API endpoints are protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using `*.all` permissions, all necessary module permissions are assigned, etc.
  * -_note: read more at https://dev.folio.org/guidelines/naming-conventions/ and https://wiki.folio.org/display/DD/Permission+Set+Guidelines_
  * all endpoints are being protected
  * no *.all permissions are used
  * a description is provided
  * naming conventions are being respected
* [x] Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value
  * There is currently no reference data. It is still under discussion
* [x] If provided, integration (API) tests must be written in an [officially approved technology] / must be compatible with the project's CI pipeline (https://wiki.folio.org/display/TC/Officially+Supported+Technologies)
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
  * Integration tests are here: https://github.com/folio-org/folio-integration-tests/tree/master/acquisitions/src/main/resources/thunderjet/mod-consortia . Technology is "karate".
* [x] Data is segregated by tenant at the storage layer
* [x] The module doesn't access data in DB schemas other than its (the module's) own and public
* [x] The module responds with a tenant's content based on x-okapi-tenant header
  * "mod-consortia will not do some special things with tokens etc. mod-consortia will be enabled in some central tenant and will do http calls to service in another tenant with the same token(changes to make this cross-tenants call possible will be presented in mod-login and mod-authtoken but not in mod-consortia)"
  * We would like to encourage an alternative solution on saml or openid techniques which would be less invasive to the current approach.
* [x] Standard GET `/admin/health` endpoint returning a 200 response
  * -_note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
  * spring-boot-starter-actuator has been included in pom.xml
  * Serhii Nosko : the actuator endpoint is in the yaml file application.yml and /admin/health has been tested locally ("status" : "UP").
* [x] High Availability (HA) compliant
  * Objections because of single-sign-on for cross-tenant staff logins have been raised. Waiting for clarification with Julian.
  * Possible red flags:
    * Connection affinity / sticky sessions / etc. are used
    * Local container storage is used
    * Services are stateful
   * Julian: It doesn't fail the HA availability criterion.
* [x] Module only uses infrastructure / platform technologies on the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.
  * _e.g. PostgreSQL, ElasticSearch, etc._

## TCR Process Improvements
[_Please include here any suggestions that you feel might improve the TCR Processes._]
