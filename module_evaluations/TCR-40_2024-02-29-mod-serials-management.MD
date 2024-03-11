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
* [x] Module descriptor MUST include interface requirements for all consumed APIs
  * there are no consumed apis (?). Requires section of the module descriptor is empty. But it seems to rely on orders.po-lines.item.get (mod-orders).
  * mod-orders-12.0 has been included as "optional"
* [ ] Third party dependencies use an Apache 2.0 compatible license
  * micronaut.io: O.K.
  * zaxxer : O.K.
  * http-builder-ng: O.K.
  * virtualdogbert: Eclipse Public License v1.0 as published by the Eclipse Foundation or (per the licensee's choosing) under the terms of the GNU Lesser General Public 
License version 2.1 - According to this list https://www.apache.org/legal/resolved.html, inclusion of EPL 1.0 needs to be "appropriately labeled"
  * z3950 zing cql is published unter LGPL 1.0, if it is that: https://github.com/indexdata/cql-java/blob/master/LGPL-2.1   -- not compatible with Apache 2.0 ?? Cf. https://www.apache.org/legal/resolved.html => dependency needs to be removed
  * https://github.com/pledbrook/groovy-handlebars-engine : Apache 2.0
  * https://github.com/jknack/handlebars.java/blob/master/LICENSE: Apache 2.0
  * https://github.com/everit-org/json-schema/blob/master/LICENSE : Apache 2.0
  * https://github.com/renatoathaydes/spock-reports/blob/master/LICENSE.txt : Apache 2.0
  * https://github.com/bmuschko/gradle-docker-plugin/blob/master/LICENSE.txt : Apache 2.0
  * IK: Changes are in master (O.K.), but not in TCR-40
* [x] In order to ensure reproducible builds, snapshot versions of build-time dependencies should not be referenced.
  * Can't see any
* [ ] Installation documentation is included
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
  * Installation documentation is too sparse. Just mentioning K8s deployment is not enough. The agreement of SysOps SIG is that deployment documentation should always be provided for a single server installation (K8s instructions are useful, but optional).
    Installation documentation should include running using the grail-app in a Vagrant box, like the documentation for mod-agreements ("Initial Setup"). (I see scripts are all there, but documentation is missing).
    Instead of to the latest module descriptor, it should point to a versionized one.
  * reference to Sonar Cube analysis is missing in the documentation.
  * a word on permissions is missing in the documentation
  * a link to the module's API documentation is missing in the documentation (dev.folio.org/reference/api/...)
  * Dockerfile is incomplete because the "java" command has been commented out
  * IK: O.K. in master, but not in TCR-40
* [x] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
* [x] Sensitive and environment-specific information is not checked into git repository
* [ ] Module is written in a language and framework from the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1]
  * gradle.properties says 
  - Grails
  grailsVersion=5.3.2
  groovyVersion=3.0.11
  but Quesnelia OST are Grails 6, Groovy 2 : cf. https://folio-org.atlassian.net/wiki/spaces/TC/pages/5056746/Quesnelia
  However, work is under way, cf. the self evaluation:  Pending upgrade to Grails 6 https://folio-org.atlassian.net/browse/MODSER-10 ; @Owen: when do you expect this upgrade to be accomplished ?
  * uses openapi 3.1 whereas the OST page says openapi 3.0 ==> Solved.
* [x] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
* [x] Module gracefully handles the absence of third party systems or related configuration
* [ ] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  * See [Rule Customization](https://dev.folio.org/guides/code-analysis/#rule-customization) details. 
  * See in self-evaluation: Pending work to check and address any Sonarqube issues https://folio-org.atlassian.net/browse/UISER-61
  * IK: UISER-60, 61 are only for the UI module. How are code smells etc. being achieved for the backend module ?
  * News 06.03. : Julian schlägt eine Integration für Sonarcube vor. => Geht nicht.
  * 07.03.: Julian: CodeNarc detects 3584 code smells in the Groovy code, however, all have minor or medium severity, there's no critical severity code smell in the Groovy code. - IK: I will valuate this as "passed".
  * 07.03.: Julian: jscpd detects 317 duplicated lines (5.25%). Quelle: https://julianladisch.github.io/mod-serials-management-eval/megalinter-reports-copy-paste-2024-03-06/  
     * IK: This should go down to 3%. See the detailed analysis in : https://julianladisch.github.io/mod-serials-management-eval/megalinter-reports-copy-paste-2024-03-06/
     * Julian: Re-tuning of MegaLinter to "COPYPASTE_JSCPD_ARGUMENTS: '--ignore-pattern "import .*| *@Defaults.*"'"  . Then the figure of duplicated lines goes down to 4.4%.
     * According to Owen: "looking at the duplication report it includes duplications from the domain model - which we don't feel is sensible in the context of this as a groovy on grails app."
  * 07.03.: Julian: CodeNarc, the static code scanner used by sonar-groovy, reports 3 security issues for mod-serials-management. I've created https://folio-org.atlassian.net/browse/MODSER-23 for them.
      * Owen: Reviewed this with @Jack Golding and @Ian Ibbotson (CC) and we're closing with Won't do. Explanation is in the Jira but essentially this is a vulnerability that doesn't apply in this context (applies to mobile code such as applets and situations where the code can be extended by a 3rd party).
  
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools[^1]
  * Uses Gradle  O.K.
* [ ] Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]
  * taken from self-evaluation:
  * Integration tests used in place of unit tests as more appropriate for a module based on the Grails framework (unit tests would only end up testing the framework and database rather than actual software written for this module)
  * Integration tests in /mod-serials-management/blob/master/service/src/integration-test/groovy/org/olf
  *    BaseSpec.groovy : Purge tenant, Create tenant, Add Refdata
  *    PredictedPieceSetLifecycleSpec.groovy : We ask the system to list known PredictedPieceSets, Post to create new empty serial with a ruleset, We ask the system to generate PredictedPieceSets, The system responds with a list of 12
  *    SerialLifecycleSpec.groovy : We ask the system to list known Serials, Check creating an empty serial, Create a ruleset of a daily recurrence, Create a Serial with status closed with description Test Description
  * IK: Although there is no explicit figure of code coverage, main functionalities of the module are being covered.

## Backend
* [x] Module's repository includes a compliant Module Descriptor
  * -_note: read more at https://github.com/folio-org/okapi/blob/master/okapi-core/src/main/raml/ModuleDescriptor.json_
* [x] Module includes executable implementations of all endpoints in the provides section of the Module Descriptor
  * IK: It is here: service/grails-app/controllers/org/olf/UrlMappings.groovy and other .groovy sources in that directory
  * IK: classes extend com.k_int.okapi.OkapiTenantAwareController (presumably good)
* [x] Environment vars are documented in the ModuleDescriptor
  * -_note: read more at [https://wiki.folio.org/pages/viewpage.action?pageId=65110683](https://wiki.folio.org/pages/viewpage.action?pageId=65110683)_
* [x] If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section, and must conform to FOLIO [interface naming conventions](https://dev.folio.org/guidelines/naming-conventions/#interfaces).
* [ ] All API endpoints are documented in OpenAPI.
  * in openapi/serials-management.yaml
  * Documentation is incomplete:
     * present (O.K.)
       - /serials-management/refdata GET
       - /serials-management/refdata POST
       - /serials-management/refdata/{uuid} GET
       - /serials-management/refdata/{uuid} PUT
       - /serials-management/refdata/{uuid} DELETE
       - /serials-management/refdata/{domain}/{property}  GET
       - /serials-management/serials  GET
       - /serials-management/serials  POST
       - /serials-management/serials/{uuid}  GET
       - /serials-management/serials/{uuid}  PUT
       - /serials-management/serials/{uuid} DELETE
       - /serials-management/rulesets GET
       - /serials-management/rulesets POST
       - /serials-management/rulesets/{uuid} GET
       - /serials-management/rulesets/{uuid} DELETE
       - /serials-management/predictedPieces GET
       - /serials-management/predictedPieces{uuid} GET
       - /serials-management/predictedPieces/generate POST
       - /serials-management/predictedPieces/create POST
     * one is still missing:
       - /serials-management/predictedPieces/{uuid} PUT
     * IK: Changes are in master but not in TCR-40


* [x] All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using `*.all` permissions, all necessary module permissions are assigned, etc.
  * -_note: read more at https://dev.folio.org/guidelines/naming-conventions/ and https://wiki.folio.org/display/DD/Permission+Set+Guidelines_
  * IK: Naming convention of permissions: serials-management.serials.view  vs. serials-management.refdata.collection.get (probably O.K., because "view" is a collection)
  * IK: Write permissions are being defined but never referenced (serials-management.settings.write, ...). Probably intended to be used by other modules.
  * IK: Very granular permission sets. This is probably good.
* [x] Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value
  * module provides reference data
* [ ] If provided, integration (API) tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1]
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/folio-integration-tests_
  * IK: Because it is the plan of the team to use integration tests in place of unit tests, I consider integration tests in this case mandatory.
  *  cf. self evaluation: Pending integration tests to be written https://folio-org.atlassian.net/browse/MODSER-15
  * IK: not written in Karate or Cucumber Reporting, but not applicable here
* [x] Data is segregated by tenant at the storage layer
* [ ] The module doesn't access data in DB schemas other than its own and public
* [x] Any dependencies, other than on defined interfaces, are declared in the README.md.
  * IK: dependency on mod-orders should be declared (+ "there may be others" (Ethan))
  * IK 06.03.: Possibliy O.K. if the dependency is only optional.
* [x] The module responds with a tenant's content based on x-okapi-tenant header
* [x] Standard GET `/admin/health` endpoint returning a 200 response
  * -_note: read more at https://wiki.folio.org/display/DD/Back+End+Module+Health+Check+Protocol_
  * IK: "org.springframework.boot:spring-boot-starter-actuator" included in build.gradle O.K.
* [ ] High Availability (HA) compliant
  * Possible red flags:
    * Connection affinity / sticky sessions / etc. are used
    * Local container storage is used
    * Services are stateful
* [x] Module only uses infrastructure / platform technologies on the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.[^1]
  * _e.g. PostgreSQL, ElasticSearch, etc._

## TCR Process Improvements
[_Please include here any suggestions that you feel might improve the TCR Processes._]

[^1]: Refer to the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page for the most recent ACTIVE release.
