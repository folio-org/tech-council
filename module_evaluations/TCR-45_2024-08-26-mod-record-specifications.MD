# Module acceptance criteria template

## Module Name
mod-record-specifications

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
  * [Apache License 2.0](https://github.com/folio-org/mod-record-specifications/blob/master/LICENSE)
* [x] Module build MUST produce a valid module descriptor
   *  Build the module. Inspect module descriptor:
     ```
     git clone https://github.com/folio-org/mod-record-specifications.git
     cd mod-record-specifications
     git checkout tech-evaluation
     mvn clean install -DskipTests=true
     [INFO] BUILD SUCCESS
     cat target/ModuleDescriptor.json
     ```
   * Run the module locally on the default listening port (8081) with the prescribed command:
     ```
     DB_HOST=10.* DB_PORT=5432 DB_DATABASE=folio DB_USERNAME=folio DB_PASSWORD=folio123 \
     java -Dserver.port=8081 -jar mod-record-specifications-server/target/mod-record-specifications-server-fat.jar
     INFO  TomcatWebServer      Tomcat started on port 8081 (http) with context path '/'
     ```
   * Better to adjust the [documentation](https://github.com/folio-org/mod-record-specifications/tree/tech-evaluation#locally) slightly:
     * server jar is built in subfolder mod-record-specifications-server/target
     * has been fixed [PR 72](https://github.com/folio-org/mod-record-specifications/pull/72)
    
* [x] Module descriptor MUST include interface requirements for all consumed APIs
  * This module does not consume any external APIs.
* [x] Third party dependencies use an Apache 2.0 compatible license
  * Checking all dependencies and plugins in [pom.xml](https://github.com/folio-org/mod-record-specifications/blob/tech-evaluation/pom.xml)
  * Also check indirect dependencies. Those can be viewed by 
    * mvn dependency:tree
* [ ] In order to ensure reproducible builds, snapshot versions of build-time dependencies should not be referenced.
  * referenced in pom.xml
    ```
    <folio-spring-support.version>8.2.0-SNAPSHOT</folio-spring-support.version>
    <folio-service-tools.version>4.1.0-SNAPSHOT</folio-service-tools.version>
    ```
  * Criterion has been dropped by the TC: [PR-76](https://github.com/folio-org/tech-council/pull/76)
* [x] Installation documentation is included
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
* [x] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
* [x] Sensitive and environment-specific information is not checked into git repository
* [x] Module is written in a language and framework from the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1], [Ramsons page](https://folio-org.atlassian.net/wiki/spaces/TC/pages/5058042/Ramsons)
* [x] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
  * module(s) do not rely on any other FOLIO modules than themselves.
* [x] Module gracefully handles the absence of third party systems or related configuration
* [x] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  * See [Rule Customization](https://dev.folio.org/guides/code-analysis/#rule-customization) details. 
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools[^1]
* [x] Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]

## Backend
* [x] Module's repository includes a compliant Module Descriptor
  * -_note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
* [x] Module includes executable implementations of all endpoints in the provides section of the Module Descriptor
  * implementations of all endpoints can be found here: 
    * controller classes here: mod-record-specifications-server/src/main/java/org/folio/rspec/controller/
    * service casses here: mod-record-specifications-server/src/main/java/org/folio/rspec/service/
* [x] Environment vars are documented in the ModuleDescriptor
  * -_note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* [x] If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section, and must conform to FOLIO [interface naming conventions](https://dev.folio.org/guidelines/naming-conventions/#interfaces).
  * Navigate to [dev.folio.org](https://dev.folio.org/reference/api/#mod-record-specifications). Follow link under [Source](https://github.com/folio-org/mod-record-specifications/blob/master/target/api/openapi/openapi.yaml) ==> YAML doesn't exist or link to YAML ist wrong (probably the latter).
  * API endpoints described here: [github/specification-storage](https://github.com/folio-org/mod-record-specifications/tree/tech-evaluation/api/paths/specification-storage), [config-doc.json](https://s3.amazonaws.com/foliodocs/api/mod-record-specifications/config-doc.json) or [openapi.html](https://s3.amazonaws.com/foliodocs/api/mod-record-specifications/s/openapi.html) .
  * All 20 API endpoints/methods listed in [openapi.html](https://s3.amazonaws.com/foliodocs/api/mod-record-specifications/s/openapi.html) are listed in the module descriptor.
* [x] All API endpoints are documented in OpenAPI.
  * can be viewed here [openapi.html](https://s3.amazonaws.com/foliodocs/api/mod-record-specifications/s/openapi.html)
* [x] All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using `*.all` permissions, all necessary module permissions are assigned, etc.
  * -_note: read more at https://dev.folio.org/guidelines/naming-conventions/ and https://wiki.folio.org/display/DD/Permission+Set+Guidelines_
  * 20 permission sets defined in Module Descriptor (O.K.)
* [x] Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value
  * The team uses default data that is populated on module init for tenant.
* [x] If provided, integration (API) tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
  * none provided
* [x] Data is segregated by tenant at the storage layer
* [x] The module doesn't access data in DB schemas other than its own and public
  * For DB access the team uses JPA and common library folio-spring-base. There is a code that changes search_path based on x-okapi-tenant header: [DataSourceFolioWrapper.java](https://github.com/folio-org/folio-spring-support/blob/master/folio-spring-base/src/main/java/org/folio/spring/config/DataSourceFolioWrapper.java)
* [x] Any dependencies, other than on defined interfaces, are declared in the README.md.
* [x] The module responds with a tenant's content based on x-okapi-tenant header
  * generally true in a java-spring based framework and using the pertinent libraries
* [x] Standard GET `/admin/health` endpoint returning a 200 response
  * -_note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
  * Implemented here: [application.yml#L70](https://github.com/folio-org/mod-record-specifications/blob/tech-evaluation/mod-record-specifications-server/src/main/resources/application.yml#L70), and a test is here: [RecordSpecificationsAppIT.java](https://github.com/folio-org/mod-record-specifications/blob/tech-evaluation/mod-record-specifications-server/src/test/java/org/folio/api/RecordSpecificationsAppIT.java#L93) .
  * local deployment of the module responds like so: curl -XGET localhost:8081/admin/health
  * {"status":"UP"}
* [x] High Availability (HA) compliant
  * Possible red flags:
    * Connection affinity / sticky sessions / etc. are used
    * Local container storage is used
    * Services are stateful
  * none found
* [x] Module only uses infrastructure / platform technologies on the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.[^1]
  * _e.g. PostgreSQL, ElasticSearch, etc._

## TCR Process Improvements
[_Please include here any suggestions that you feel might improve the TCR Processes._]

[^1]: Refer to the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page for the most recent ACTIVE release.
