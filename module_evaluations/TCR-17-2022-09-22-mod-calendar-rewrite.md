## Subject

Module: mod-calendar (rewrite)
Revision: [https://github.com/folio-org/mod-calendar/pull/148] - This has changed during this review, due to the use of a single squashed commit that gets amended

## Notation

* [x] ACCEPTABLE
* [x] ~INAPPLICABLE~
* [ ] UNACCEPTABLE
  * comments on what was evaluated/not evaluated, why a criterion failed

## Backend
* [x] Module’s repository includes a compliant Module Descriptor (3, 5)
  * -_note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
    * Tested with a local Okapi
* [x] Environment vars are documented in the ModuleDescriptor (5, 11)
  * -_note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* [x] If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor “provides” section (3, 5)
* [x] All API endpoints are documented in RAML or OpenAPI (11)
  * Documented in OpenAPI (produces false errors using the FOLIO documentation generation tools)
* [x] All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using *.all permissions, all necessary module permissions are assigned, etc. (6)
  * -_note: read more at https://dev.folio.org/guidelines/naming-conventions/ and https://wiki.folio.org/display/DD/Permission+Set+Guidelines_
    * Endpoints are protected by permissions
    * There are some variations from the conventions that FOLIO tends to adopt
    * The module defines permission-sets intended to be used by clients 
    * Usually clients use the individual endpoint permissions that they specifically need
    * Whilst this is convenient for clients, it could result in escalated permissions
    * This is unlikely to have much practical impact in this case
* [x] ~Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value (3, 16)~
  * No reference data is provided
* [x] If provided, integration (API) tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) (3, 4)
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
    * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
    * Tests are written in Karate, no evaluation of the tests themselves has been undertaken
* [x] Data is segregated by tenant at the storage layer (6, 7)
  * Assumed, based upon a conversation with Noah stating that folio-spring-base does this
* [x] The module doesn’t access data in DB schemas other than its own and public (6, 7)
  * Assuming we consider the older versions of mod-calendar as it's own, then I don't believe this accesses anything else
* [x] The module responds with a tenant’s content based on x-okapi-tenant header (7)
  * Assumed based upon use of folio-spring-base
* [x] Standard GET /admin/health endpoint returning a 200 response (5)
  * -_note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
    * Assumed to be provided by folio-spring-base (and there is a test)
* [x] High Availability (HA) compliant (5, 14, 15)
  * Possible red flags:
    * Connection affinity / sticky sessions / etc. are used
      * Local container storage is used
      * Services are stateful
  * Assumed, there were no obvious examples of this encountered during a brief review
* [x] Module only uses infrastructure / platform technologies on the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.
    * _e.g. PostgreSQL, ElasticSearch, etc._ (3, 5, 12)
  * Based upon environment variables and brief review, it seems only PostgreSQL is used

## Shared/Common
* [x] Uses Apache 2.0 license (2)
* [x] Module build MUST produce a valid module descriptor (3, 5)
  * Tested via local Okapi
* [x] Module descriptor MUST include interface requirements for all consumed APIs (3, 5)
  * Assumed, a brief review does not suggest any interface dependencies
* [x] Third party dependencies use an Apache 2.0 compatible license (2)
  * Assumed, we have no reasonable way to check that I am aware of
* [x] Installation documentation is included (11)
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
  * There is some documentation about deployment of the module
  * I don't believe it needs the kinds of instructions that mod-search has because it has less unusual configuration needs
* [x] Personal data form is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file (6)
* [x] Sensitive and environment-specific information is not checked into git repository (6)
  * There is some (snapshot I think) environment specific configuration in the module descriptor
  * I think pretty much all back end modules do that today, this is not specific to this module
  * A brief check of the source did not find other obvious examples 
* [x] Module is written in a language and framework from the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page (3, 5)
  * The module uses JDK 17
* [x] ~Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_ (3, 5, 12)~
* [x] ~Module gracefully handles the absence of third party systems or related configuration. (3, 5, 12)~
  * Assumed that it does not rely on any third party systems
* [x] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication (6)
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools (3, 5, 13)
  * Maven
* [x] Unit tests have 80% coverage or greater, and are based on [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) (3, 4)
  * folio-spring-base uses some tooling that isn't in the list (I don't know to what degree that list is intended to be exhaustive) 
  * This is not specific to this module, many modules use tools that are not in this list 