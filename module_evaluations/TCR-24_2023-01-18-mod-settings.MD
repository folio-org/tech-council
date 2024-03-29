TCR-24 Mod Settings

## Shared/Common
* [X] Uses Apache 2.0 license
* [X] Module build MUST produce a valid module descriptor
* [X] Module descriptor MUST include interface requirements for all consumed APIs
* [X] Third party dependencies use an Apache 2.0 compatible license
* [X] Installation documentation is included
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
* [X] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
* [X] Sensitive and environment-specific information is not checked into git repository
* [X] Module is written in a language and framework from the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page
  * It would be beneficial the Java version was made explicit in the POM file.  
* [X] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
* [X] Module gracefully handles the absence of third party systems or related configuration
* [X] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication
* [X] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools
* [X] Unit tests have 80% coverage or greater, and are based on [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)

## Backend
* [X] Module's repository includes a compliant Module Descriptor
  * -_note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
* [X] Environment vars are documented in the ModuleDescriptor
  * -_note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* [X] If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section
* [X] All API endpoints are documented in RAML or OpenAPI
* [X] All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using `*.all` permissions, all necessary module permissions are assigned, etc.
  * The permissions, as expressed in the reference commit given to the evaluators, do adhere to the guidelines expressed [here](https://dev.folio.org/guidelines/naming-conventions/). However, it should be noted, that in the master branch of this repo, the permissions are all prefixed with "mod-", which is not recommended by our guidelines.
  * The module developers have stated that the reason for adding the `mod` prefix to each permission is to avoid a collision with existing application setting permissions.
* [X] Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value
* [X] If provided, integration (API) tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
* [X] Data is segregated by tenant at the storage layer
* [X] The module doesn't access data in DB schemas other than its own and public
* [X] The module responds with a tenant's content based on x-okapi-tenant header
* [X] Standard GET `/admin/health` endpoint returning a 200 response
  * -_note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
* [X] High Availability (HA) compliant
  * Possible red flags:
    * Connection affinity / sticky sessions / etc. are used
    * Local container storage is used
    * Services are stateful
* [X] Module only uses infrastructure / platform technologies on the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.
  * There are several dependencies of this module that are not on our officially approved technology list. The TC should consider adding them, because support for them is implicit in the acceptance of VertX:
    * vertx-core
    * vertx-web
    * vertx-web-openapi
    * vertx-rx-java2
    * vertx-web-api-contract
    * vertx-pg-client
  * Additionally, Solr is referenced but not used and will be removed from the dependencies.

### Additional Notes

It should be noted that there are ongoing conversations about the centralization vs distribution of configuration in the FOLIO project. This review of Mod Settings is not intended to be a comment on that topic in any way. This evaluation was intended to determine if Mod Settings met the technical criterion for acceptance as laid out by the technical council.