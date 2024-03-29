# Module Acceptance Criteria - mod-entities-links

## Shared/Common
* [X] Uses Apache 2.0 license
* [X] Module build MUST produce a valid module descriptor
* [X] Module descriptor MUST include interface requirements for all consumed APIs
* [X] Third party dependencies use an Apache 2.0 compatible license
* [X] Installation documentation is included
* [X] Personal data form is completed, accurate, and provided as `PERSONAL_DATA_DISCLOSURE.md` file
* [X] Sensitive and environment-specific information is not checked into git repository
* [X] Module is written in a language and framework from the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page
* [X] Module only uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn't been accepted yet_
* [X] ~~Module gracefully handles the absence of third party systems or related configuration~~
* [X] Sonarqube hasn't identified any security issues, major code smells or excessive (>3%) duplication
* [X] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools
* [X] Unit tests have 80% coverage or greater, and are based on [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)

## Backend
* [X] Module's repository includes a compliant Module Descriptor
* [X] Environment vars are documented in the ModuleDescriptor
* [X] If a module provides interfaces intended to be consumed by other FOLIO Modules, they must be defined in the Module Descriptor "provides" section
* [X] All API endpoints are documented in RAML or OpenAPI
* [X] All API endpoints protected with appropriate permissions as per the following guidelines and recommendations, e.g. avoid using `*.all` permissions, all necessary module permissions are assigned, etc.
* [X] ~~Module provides reference data (if applicable), e.g. if there is a controlled vocabulary where the module requires at least one value~~
* [X] If provided, integration (API) tests must be written in an [officially approved technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)
* [X] Data is segregated by tenant at the storage layer
* [X] The module doesn't access data in DB schemas other than its own and public
* [X] The module responds with a tenant's content based on x-okapi-tenant header
* [X] Standard GET `/admin/health` endpoint returning a 200 response
* [X] High Availability (HA) compliant
* [X] Module only uses infrastructure / platform technologies on the [officially approved technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) list.


## TCR Process Improvements (For the TC to consider)
- Fix typo includes - a compliant Module Descriptor --> includes a compliant Module Descriptor Template
- Strikethrough markdown syntax is incorrect
- Will be helpful to know what Apache 2.0 compliant licenses are for third party dependencies. 
  Better to have OSI [approved licenses](https://opensource.org/licenses/alphabetical)
- Analyze third party dependencies for vulnerabilities
- Consider having a module documentation template that includes
  - System requirements. Required version of JDK. Infrastructure and third party service integrations
  - Overall design
  - Data model
  - Glossary
  - Known Issues
- Provide link to PERSONAL_DATA_DISCLOSURE in the template
- Rephrase expectation related to x-okapi-tenant header

## Recommendations for the team
- links/instances/{instanceId} --> links/instance-authority/{instanceId}
- It will be useful to document system requirements for the module in the module documentation

## Evaluation Notes
- No third party system integrations
- PERSONAL_DATA_DISCLOSURE out of date and incomplete. 
  - Talked to the team and got it corrected
- Endpoint responds without tenant header
  - Spoke to Pavlo and Craig. It is ok for Okapi to parse the token and pass it on to subsequent calls to modules 
- For license analysis
```
 mvn  license:add-third-party
 cat target/generated-sources/license/THIRD-PARTY.txt  | grep -v Apache | grep -v MIT | grep -v Eclipse | grep -v BSD
```
- Run check for outdated dependencies
```
        <plugin>
            <groupId>org.codehaus.mojo</groupId>
            <artifactId>versions-maven-plugin</artifactId>
            <version>2.7</version>
            <configuration>
                <excludes>
                    <exclude>org.apache.commons:commons-collections4</exclude>
                </excludes>
            </configuration>
        </plugin>
```
- Run OWASP dependency Check maven plugin
```
  mvn verify -DskipTests
```
```
           <plugin>
              <groupId>org.owasp</groupId>
              <artifactId>dependency-check-maven</artifactId>
              <version>7.4.1</version>
              <executions>
                  <execution>
                      <goals>
                          <goal>check</goal>
                      </goals>
                  </execution>
              </executions>
            </plugin>
```  

## Open Questions
- Personal data disclosure indicates that this module can derive user's first and last name. How does it do that ?
  - This is a result of reporting needs. Currently not in the module. But will be added soon.
- Endpoints respond without the tenant header. Problem or not ?
  - It is ok for Okapi to parse the token and pass it on to subsequent calls to modules 



