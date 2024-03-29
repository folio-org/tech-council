# Module acceptance criteria - mod-lists

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
* [ ] Module descriptor MUST include interface requirements for all consumed APIs
  * `mod-lists` uses `/query` and `/entity-types` APIs, module descriptor needs to be updated* [x] Third party dependencies use an Apache 2.0 compatible license
* [x] Installation documentation is included
  * _Note: See https://github.com/folio-org/mod-lists/blob/master/README.md_
* [x] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
* [x] Sensitive and environment-specific information is not checked into git repository
  * _Note: Verified with `git log -p --pickaxe-regex -i -S "password|token|key"` (passwords, tokens, and API keys being the things most likely to be committed)_
* [x] Module is written in a language and framework from the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page
* [x] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
  * _Note: requires mod-fqm-manager which ˜is also under evaluation~ was conditionally accepted on 2023-09-25_
* [x] Module gracefully handles the absence of third party systems or related configuration
  * _Note: Tested various permutations of omitted and/or bogus S3/MinIO environment variables.  All were handled gracefully by the module._
* [ ] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication
  * _Note: There are 7 major code smells.  They are all related to Exception classes having 6 parents which is greater than 5 authorized.  I would personally give this a pass but it's something we'll need to discuss with the TC.  See [Sonarcloud](https://sonarcloud.io/summary/overall?id=org.folio%3Amod-lists)._ 
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools
* [x] Unit tests have 80% coverage or greater, and are based on [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)
  * _Note: 89.6% See [Sonarcloud](https://sonarcloud.io/summary/overall?id=org.folio%3Amod-lists)._

## Backend
* [x] Module's repository includes a compliant Module Descriptor
  * _Note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
* [X] Module includes executable implementations of all endpoints in the provides section of the Module Descriptor
  * _Note: all endpoints in descriptor have entries in `list.yaml`, all `operationId` values listed in `list.yaml` have corresponding methods with matching arguments in `ListController.java`, `ListExportController.java`, and `ListConfigurationController.java`._
* [x] Environment vars are documented in the ModuleDescriptor
  * _Note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* [x] If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section
* [x] All API endpoints are documented in RAML or OpenAPI
* [x] All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using `*.all` permissions, all necessary module permissions are assigned, etc.
  * _Note: read more at https://dev.folio.org/guidelines/naming-conventions/ and https://wiki.folio.org/display/DD/Permission+Set+Guidelines_
* [x] ~Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value~
* [x] ~If provided, integration (API) tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)~
  * _Note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * _Note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
* [x] Data is segregated by tenant at the storage layer
* [x] The module doesn't access data in DB schemas other than its own and public
* [x] The module responds with a tenant's content based on x-okapi-tenant header
* [x] Standard GET `/admin/health` endpoint returning a 200 response
  * _Note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
  * _Note: yes, via actuator_
* [x] High Availability (HA) compliant
  * Possible red flags:
    * Connection affinity / sticky sessions / etc. are used
    * Local container storage is used
    * Services are stateful
* [ ] Module only uses infrastructure / platform technologies on the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.
  * _e.g. PostgreSQL, ElasticSearch, etc._
  * _Note: need to discuss with the TC whether or not MinIO should be on the the OST list_

## Recommendation and justification
Reviewers recommend acceptance with discussion of three points.
With the conditional acceptance of `mod-fqm-manager`, there are three criteria which are in question:
* [ ] Module descriptor MUST include interface requirements for all consumed APIs
  * `mod-lists` uses `/query` and `/entity-types` APIs, module descriptor needs to be updated
  * Reviewers think this is a trivial fix and in the context of our timeframe should not block acceptance.
  * (This was the source of some controversy in the TC discussion.)
* [ ] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication
  * There are code smells related to Exception classes having 6 parents which is greater than 5 authorized. Reviewers would give it a pass, but would like TC to discuss.
  * Ran out of time to discuss, but did not generate controversy. 
* [ ] Module only uses infrastructure / platform technologies on the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.
  * _Note: need to discuss with the TC whether or not MinIO should be on the the OST list_
  * Also generated no controversy, [DR-000026 - S3/MinIO](https://wiki.folio.org/pages/viewpage.action?pageId=96419874) has been around in DRAFT status for over two years and seems like an oversight.


## TCR Process Improvements
* Consider adding lombok to the Officially Supported Technologies list since it is used extensively througout the project, despite NOT having an Apache 2.0 license.  This could help evaluators in the future.
* Consider adjusting the sonarqube rule about number of levels of inheritence allowed (currently 5)
* Consider adding MinIO to the Offiicially Supported Technologies list, and approving the decision here: https://wiki.folio.org/pages/viewpage.action?pageId=96419874
* It would be helpful to have the module name, possibly other metadata listed at the top of this form
* Consider adding criteria about the naming of interfaces, referencing http://ssbp-devdoc-prod.s3-website.us-east-1.amazonaws.com/guidelines/naming-conventions/#interfaces.  The guidence linked does read more like a suggestion than a hard guideline.  Should we also consider rewording so it's more of a requirement than a suggestion?
