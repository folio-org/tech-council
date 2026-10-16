Technical Council Module Evaluation: mod-users
Jira: TCR-88
Module: mod-users
Version reviewed: v19.6.2
Evaluation date: October 16, 2026
Repository evaluated: FOLIO mod-users
v19.6.2
Working evaluation document:
TCR-88_2026-10-06-mod-users.MD
Acceptance criteria: FOLIO Technical Council
repository
1. Executive summary
This document records a preliminary, evidence-based review of selected
FOLIO Technical Council acceptance criteria for mod-users, a backend
module that maintains user records and related user information. The
review considered source code, RAML API documentation, Maven
configuration, module and deployment descriptors, integration-test
files, the README, the personal-data disclosure, and the automated
module-evaluation results.
The automated evaluator reported 31 criteria: 5 passed, 0 failed, and 26
requiring manual review after the personal-data disclosure filename was
corrected. The evaluator found and parsed PERSONAL_DATA_DISCLOSURE.md,
but its semantic review was skipped because agent review was disabled or
unconfigured. The result therefore does not mean that all manual-review
criteria have passed.
Principal findings
1. S005 --- Personal-data disclosure: The required
   PERSONAL_DATA_DISCLOSURE.md file was found and parsed after the
   filename correction. Its substantive accuracy and completeness still
   require human review because the evaluator did not perform semantic
   review.
2. S010 --- Runtime dependencies and configuration: Several
   inspected database and Kafka write paths propagate failures through
   asynchronous futures. Configuration-absent or invalid behavior,
   object-storage error classification, Kafka-disabled outbox behavior,
   producer cleanup, and unreviewed failure paths still need
   verification.
3. API permissions: The module descriptor declares permissions for
   the inspected handlers. Complete permission coverage, runtime
   authorization, and field-level protection remain unverified.
4. API endpoint documentation: The module uses RAML documentation.
   The checklist explicitly permits RAML for existing RMB-based
   modules. RAML files were reviewed for the principal mod-users API
   resources. The separate folio-custom-fields repository also
   contains RAML documentation for custom-field collection and item
   operations and both custom-field statistics endpoints. A complete
   comparison of all descriptor-declared endpoints has not been
   completed; the /_/tenant and /_/tenant/{id} paths remain to be
   checked.
5. Module descriptor and reference data: The reviewed descriptor
   and implementation provide evidence of alignment. Reference-data
   loading is version-aware in the inspected code. Complete descriptor
   comparison and actual installation/upgrade behavior remain
   unverified.
6. Integration tests: Integration-test classes and test
   dependencies are present. The presence of tests does not establish
   that the complete suite passes.
7. Tenant isolation and tenant-specific responses: The inspected
   code uses tenant-aware PostgreSQL client selection. Cross-tenant
   isolation and outgoing request-header behavior have not been fully
   demonstrated.
8. Database schema and dependency documentation: No prohibited
   cross-schema access was identified in the limited search reviewed.
   The applicable documentation requirements for optional dependencies
   need clarification.
9. Health endpoint: InstallUpgradeIT.java contains a test
   asserting that GET /admin/health returns HTTP 200 and body "OK".
   Successful execution of the test remains unverified.
10. High availability and supported technologies: The reviewed
    profile-picture storage path uses an object-storage client. The
    Maven configuration specifies Java 21, consistent with the cited
    FOLIO Trillium backend technology guidance. Module-wide
    high-availability behavior and full production dependency compliance
    remain unverified.
Overall conclusion: This is a preliminary evaluation, not a
declaration that all acceptance criteria have passed. Findings marked
for manual review or further verification should remain open until
supported by sufficient evidence.
2. Review scope and method
The review covered:
- Automated evaluation results, particularly S005 and S010.
- API permissions and module descriptor configuration.
- API endpoint documentation, including RAML resources and the shared
  custom-fields interface.
- Reference data and integration testing.
- Tenant-aware database access and database schema usage.
- Dependency documentation.
- Tenant-specific request handling.
- The /admin/health endpoint.
- High-availability considerations.
- Infrastructure and platform technologies.
Evidence was collected by inspecting the relevant source files and
configuration. The review distinguishes between evidence that a file or
declaration exists and evidence that behavior has been tested. Where the
available evidence did not establish runtime behavior or complete
coverage, the finding remains preliminary.
3. S005 --- Personal-data disclosure
Assessment: Manual review required; semantic compliance has not been
verified.
Evidence
The automated evaluator found and parsed PERSONAL_DATA_DISCLOSURE.md
after the filename was corrected. The latest reported evaluator run
showed 31 criteria, 5 passed, 0 failed, and 26 manual review. The
evaluator output states that semantic review was skipped because agent
review was disabled or unconfigured.
Finding and parsing the file establishes that the required artifact is
present and readable. It does not establish that the disclosure
accurately describes all relevant personal-data collection, processing,
storage, transmission, sharing, and retention.
The disclosure indicates that the module provides custom fields and
identifies categories of personal information. Those selections should
be compared with the implementation and actual data flows. User-event
code and other paths that transmit user information deserve particular
attention.
Finding
The disclosure artifact is present and parseable, but its substantive
accuracy and completeness have not been verified.
Recommended action
Compare PERSONAL_DATA_DISCLOSURE.md with the implementation and
relevant data flows. Confirm that the selected data categories and
statements about storage, processing, transmission, and other handling
practices are accurate before marking S005 as satisfied.
Status: Manual review required.
4. S010 --- Runtime dependencies and configuration
Assessment: Manual review required. The inspected code demonstrates
explicit failure propagation in several database and Kafka write paths.
Runtime behavior is not fully verified for all dependencies and
configuration states.
Evidence reviewed
1. Configuration declarations:
   descriptors/ModuleDescriptor-template.json declares configuration
   inputs for database connectivity, Kafka, and object storage. The
   descriptor alone does not establish which settings are mandatory at
   runtime or what happens when settings are missing or invalid.
2. HTTP client behavior: HttpClientFactory.java creates and
   caches a VertxOkapiHttpClient per Vert.x instance.
   VertxOkapiHttpClient.java applies explicit timeouts to several
   request methods and converts responses to the wrapper's response
   model. Failure behavior across all HTTP operations has not been
   fully verified.
3. HTTP response handling: ResponseInterpreter.java converts
   unsuccessful HTTP responses into HttpException failures.
   FeesFinesModuleClientImpl.java logs and propagates failures in the
   inspected operations.
4. Database failures: RecordRepositoryImpl.java uses
   getAsyncResultHandler for inspected read and update operations.
   ResultHandlerUtils.java completes a promise successfully when an
   asynchronous operation succeeds and fails it with the original cause
   when the operation fails. This supports failure propagation in the
   reviewed repository paths, but does not establish how every database
   failure is ultimately returned to API callers.
5. Object-storage failures: ProfilePictureStorage.java catches
   exceptions in inspected object-storage operations and translates
   them into API responses. Some caught failures, including failures
   retrieving a presigned URL or fetching an image, can be returned as
   404. Further review is needed to determine whether storage outages
   and other infrastructure failures are classified appropriately and
   whether timeout behavior is suitable.
6. Kafka write failures: UserEventProducer.java checks the result
   of producer.write(...). On failure, it logs the error and fails
   the returned future with the original cause. The inspected
   getKafkaFutures(...) and processOutboxEventLogs(...) methods
   compose futures before attempting outbox deletion. Under standard
   Vert.x future-composition behavior, a failed send should fail this
   chain and prevent the subsequent deletion step.
7. Kafka-disabled behavior: The default UserEventProducer
   constructor obtains its enablement setting from
   KafkaConfigSingleton.INSTANCE.isKafkaEnabled(). When publishing is
   disabled, sendUserEvent(...) returns a successful future
   containing false. The inspected outbox-processing code does not
   inspect individual Boolean results before deriving event IDs for
   deletion. The intended behavior, including whether outbox records
   should be retained when Kafka is disabled, remains unverified.
8. Producer cleanup: sendToKafka(...) calls producer.end()
   after the write completes and calls producer.close() on successful
   completion of end(). The inspected code does not establish how
   cleanup is handled if end() fails.
Finding
The inspected paths provide evidence of explicit failure propagation for
database operations and Kafka writes. They do not establish complete
runtime resilience across all dependencies or configuration states.
Recommended follow-up
- Verify required and optional configuration settings and behavior
  when settings are missing or invalid.
- Confirm the intended outbox behavior when Kafka publishing is
  disabled, including whether events should remain available for later
  delivery.
- Verify object-storage error classification and timeout behavior.
- Confirm producer cleanup when end() fails.
- Review remaining database and HTTP client failure paths, including
  how failures are surfaced to API callers.
Status: Manual review required.
5. API permissions
Assessment: Manual review required.
Evidence
descriptors/ModuleDescriptor-template.json defines permission sets and
API handler mappings through permissionsRequired,
permissionsDesired, and, for selected handlers, modulePermissions.
The inspected handler mappings cover:
- User records: collection and item reads, creation, updates, and
  deletion.
- Profile pictures: GET, POST, PUT, and DELETE operations.
- User groups, address types, proxy relationships, and departments:
  collection and item operations.
- Custom fields: collection and item operations, statistics, and
  option statistics.
- Patron PINs: creation, deletion, and verification.
- User settings: collection and item reads, creation, updates, and
  deletion.
The inspected permissionsRequired entries correspond to permission
names declared in permissionSets for the operations reviewed. The
composite permission users.all groups permissions for user records and
related interfaces, including user groups, address types, proxies,
departments, patron PINs, tenant affiliations, profile pictures, and
user settings. The composite permission
user-settings.custom-fields.all groups eight custom-field permissions.
The /users and /users/{id} handlers declare
users.basic-read.execute and users.restricted-read.execute under
permissionsDesired, while requiring their respective collection or
item permissions. The distinction between endpoint access and
restricted-field access needs further review.
The user-delete handler additionally declares
manualblocks.collection.get and manualblocks.item.delete under
modulePermissions. The RAML validate trait includes a 422
validation-error response; that trait does not itself establish
authorization enforcement.
Outstanding review items
- Verify runtime enforcement of declared permissions.
- Determine how basic-read and restricted-read permissions control
  access to user fields.
- Confirm completeness and consistency of permission declarations
  across handlers, including the occurrences of permissionsRequired.
- Review the purpose and enforcement of additional
  modulePermissions.
- Confirm the intended scope of the users.all and
  user-settings.custom-fields.all composite permissions.
Finding
The inspected descriptor provides evidence of explicit API permission
mappings and consistency between selected handler requirements and
permission declarations. Descriptor declarations alone do not establish
correct runtime authorization or field-level protection.
Status: Manual review required.
6. API endpoint documentation
Assessment: Preliminary evidence supports RAML documentation for the
principal API resources; complete endpoint coverage remains to be
confirmed.
Checklist context
The checklist item states that API endpoints should be documented in
OpenAPI and includes an exception allowing existing RMB-based modules to
continue using RAML. The inspected mod-users repository uses RAML
files, so RAML is an allowed documentation format under that exception.
RAML files reviewed in mod-users
The ramls directory contains documentation for these principal
resources:
- users.raml --- user collection and individual user operations,
  expiration timer, outbox processing, profile-picture operations and
  cleanup, and configuration-entry operations.
- groups.raml --- user-group collection and item resources.
- addressTypes.raml --- address-type collection and item resources.
- proxiesFor.raml --- proxy relationship collection and item
  resources.
- departments.raml --- department collection and item resources.
- patronpin.raml --- patron PIN set, delete, and verify operations.
- userTenants.raml --- user-tenant collection operations.
- settings.raml --- user settings collection and item resources.
- staging_users.raml --- staging-user collection, update by external
  system ID, and merge-or-create operation.
The inspected RAML files include endpoint operations and, where
applicable, descriptions, request and response information, examples,
schemas, and error responses. Some item resources use the shared
raml-util/rtypes/item-collection.raml resource type. The inspected
shared resource type defines standard GET, PUT, and DELETE operations
for an individual record.
One documentation detail was noted in departments.raml: its title says
"User Groups" although the described resource and endpoints concern
departments. This is a metadata inconsistency; by itself, it does not
establish that the endpoints are undocumented.
Custom-fields interface
The mod-users module descriptor declares a custom-fields interface
and handler paths including:
- /custom-fields
- /custom-fields/{id}
- /custom-fields/{id}/stats
- /custom-fields/{id}/options/{optId}/stats
There is no custom-fields.raml file in the mod-users/ramls
directory. However, the separate folio-custom-fields
repository contains
ramls/custom-fields.raml.
The inspected custom-fields.raml documents the /custom-fields
collection and /{id} item resource. It also explicitly documents the
GET operations for /{id}/stats and /{id}/options/{optId}/stats, with
descriptions, response codes, examples, and schemas. The collection and
item resources use shared RAML resource types for standard operations.
This is evidence that the custom-fields API documentation exists in the
shared library repository, even though it is not duplicated in
mod-users/ramls.
Outstanding endpoint check
The module descriptor also declares the system tenant paths /_/tenant
and /_/tenant/{id} under its _tenant interface. Their documentation
location was not confirmed during this review.
A complete endpoint-by-endpoint comparison of every handler in the
module descriptor against the relevant RAML documentation has not been
completed. Therefore, the current evidence supports the use of RAML and
shows documentation for the principal resources and the shared
custom-fields interface, but it does not yet prove that every declared
endpoint is documented.
Finding
The reviewed repositories contain RAML documentation for the principal
mod-users API resources and the custom-fields interface. The checklist
exception permits RAML for an existing RMB-based module. The system
tenant paths and complete descriptor-to-documentation coverage remain to
be confirmed.
Status: Preliminary; final endpoint coverage check outstanding.
7. Module descriptor and deployment descriptor
Assessment: Manual review required; no confirmed descriptor defect
identified in the reviewed evidence.
Evidence
- ModuleDescriptor-template.json
- DeploymentDescriptor-template.json
- UsersAPI.java
The module descriptor declares the module name and version, provided
interfaces, API handlers, permissions, optional dependencies, and
scheduled jobs. The deployment descriptor identifies the Java command
used to launch the module. The reviewed UsersAPI.java implementation
includes core user operations, profile-picture management,
configuration, expiration, and outbox processing.
The descriptor defines user-settings and custom-fields interfaces. The
inspected custom-fields collection PUT handler requires
user-settings.custom-fields.collection.put; this permission is
declared in permissionSets and included in the
user-settings.custom-fields.all composite permission. User-settings
handlers similarly use individual permissions grouped by
users.settings.all.
Finding
The reviewed files provide evidence of alignment between the descriptor
and substantial parts of the implementation. A complete
endpoint-by-endpoint and permission-by-permission comparison has not
been performed.
Status: Manual review required.
8. Reference data
Assessment: Evidence supports version-aware loading; installation and
upgrade behavior are not fully verified.
Evidence
The module includes address-type reference-data files (claim.json,
home.json, order.json, payment.json, returns.json, and
work.json) and user-group reference-data files (faculty.json,
graduate.json, staff.json, and undergraduate.json).
In TenantRefAPI.loadData(), reference data is added to the
tenant-loading process conditionally, using isNew() to evaluate
feature versions. Address types are associated with version 15.4.0,
and user groups with version 17.3.0. The method separately configures
sample-data loading. The isNew() helper treats a null moduleFrom as
a new installation and otherwise delegates version comparison to
Versioned.isNewForThisInstall().
The MODUSERS-335 commit describes changes intended to ensure that during
a tenant upgrade, only reference or sample data that has changed is
installed or restored.
Finding and limitation
The reference-data files and TenantRefAPI implementation provide
evidence of version-aware, conditional reference-data loading. The
underlying TenantLoading behavior and actual installation or upgrade
results have not been independently verified. This review does not
establish that tenant-customized records are always preserved or that
every upgrade scenario behaves correctly.
Status: Further verification required.
9. Integration tests and testing technology
Assessment: Integration tests are present; official support status and
test execution results require confirmation.
Evidence
The inspected integration-test directory includes:
- AbstractRestTest.java
- AbstractRestTestNoData.java
- AbstractRestTestWithData.java
- ExpirationIT.java
- GroupIT.java
- ProxyRelationshipsIT.java
- UserOutboxProcessIT.java
The Maven configuration declares JUnit BOM version 6.0.3, JUnit
Jupiter API and Engine, JUnit Jupiter parameter support, Testcontainers
JUnit Jupiter, Testcontainers LocalStack, and JUnit Vintage Engine.
UserOutboxProcessIT exercises successful Kafka user-event processing
and a nonexistent-tenant error scenario.
Finding and limitation
Integration-test classes and their supporting dependencies are present.
The inspected outbox integration test provides evidence of testing a
successful event-processing scenario and an error scenario. The presence
of test classes and dependency declarations does not establish that the
complete test suite passes. The official FOLIO support status of the
testing technologies has not been independently confirmed against the
applicable technology list or testing guidance.
Status: Further verification required.
10. Tenant data segregation at the storage layer
Assessment: Manual review required. The inspected code selects
tenant-specific PostgreSQL clients in RecordRepositoryImpl.java,
UserOutboxService.java, and ProfilePictureStorage.java.
UserOutboxService.java derives the tenant ID from the Okapi headers,
while AbstractRestTest.java initializes its test client and headers
using the same tenant (diku).
The repository defines a tenant-aware client method:
private PostgresClient pgClient(String tenantId) {
    return PostgresClient.getInstance(vertx, tenantId);
}
The reviewed retrieval and update methods use pgClient(tenantId) for
operations on the users table. For example:
pgClient(tenantId).update(
    USERS_TABLE, user, user.getId(), getAsyncResultHandler(promise)
);
The integration-test setup also initializes OkapiHeaders with
TENANT_NAME and obtains a PostgreSQL client for that tenant.
Finding and limitation
The inspected methods consistently pass a tenant identifier to the
database client. No explicit test comparing access across two different
tenants was identified in the reviewed results. This evidence does not
independently prove the underlying client's isolation guarantees or
establish that every database access path is tenant-isolated. No
tenant-isolation violation has been established.
Status: Manual review required.
11. Database schema access
Assessment: No violation identified in the inspected results; complete
module-wide verification remains outstanding.
The repository search for the literal string public. returned one
result in create_configuration_table.sql. The inspected SQL includes:
new_uuid UUID := public.uuid_generate_v4();
and:
id uuid PRIMARY KEY DEFAULT public.uuid_generate_v4()
These references invoke the UUID-generation function in the public
schema, which is permitted by the criterion. The shown table is named
configuration without a different schema prefix. The search found no
public. matches in RecordRepositoryImpl.java.
Finding and limitation
The inspected evidence does not identify a cross-schema access
violation. Searching for the literal string public. does not
exhaustively establish that the module avoids prohibited cross-schema
access. SQL scripts, dynamically constructed queries, and other database
operations have not been comprehensively reviewed.
Status: No violation identified in the inspected results; further
verification required.
12. Dependency documentation
Assessment: Manual review required.
The module descriptor identifies feesfines and configuration as
optional dependencies. The README content reviewed documents
profile-picture configuration and S3-compatible storage but does not
explicitly explain the feesfines dependency.
Finding
The documentation requirement for dependencies outside defined
interfaces has not been fully determined. The absence of an explanation
in the reviewed README content does not, by itself, establish a
violation.
Recommended follow-up
Confirm which dependency-documentation requirements apply to mod-users
and whether the feesfines dependency needs additional explanation.
Status: Manual review required.
13. Tenant-specific responses and x-okapi-tenant
Assessment: Evidence supports tenant-aware test setup; response
behavior remains unverified.
The test setup in AbstractRestTest.java initializes OkapiHeaders and
a PostgreSQL client with the same tenant identifier:
okapiHeaders = new OkapiHeaders(wireMockUrl, TENANT_NAME, token);
postgresClient = PostgresClient.getInstance(vertx, TENANT_NAME);
The setup then passes the headers into module initialization.
Finding and limitation
The inspected test setup is tenant-aware and configures a database
client for the specified tenant. This evidence does not independently
establish that outgoing HTTP requests include the expected
x-okapi-tenant header or that responses contain only data belonging to
the requested tenant. Cross-tenant response isolation has not been
demonstrated by the inspected snippet.
Recommended action
Inspect how OkapiHeaders constructs request headers and review or
perform integration tests using two tenants to verify that each tenant
receives only its own data.
Status: Further verification required.
14. /admin/health endpoint
Assessment: Test evidence identified; execution status unverified.
src/test/java/org/folio/rest/InstallUpgradeIT.java
contains a health() integration test that sends a GET request to
/admin/health and asserts HTTP status 200 and response body "OK".
Finding
The test explicitly verifies the required endpoint and expected
response. The available evidence does not establish whether this test
was successfully executed in the evaluated version.
Status: The endpoint requirement is covered by an integration test;
successful execution remains unverified.
15. High availability
Assessment: Evidence supports the reviewed storage path; full
high-availability compliance remains unverified.
The reviewed ProfilePictureStorage.java methods:
- Obtain the tenant identifier from the x-okapi-tenant header.
- Prefix object keys with the tenant identifier.
- Use FolioS3Client to write, retrieve, and remove profile pictures.
- Use in-memory byte streams when writing profile-picture data.
No FileOutputStream match was found in the reviewed file.
Finding and limitation
The inspected profile-picture storage implementation uses an
object-storage client and does not show a dependency on local filesystem
persistence for the reviewed operations. This does not establish that
the entire module avoids local persistent storage, sticky sessions,
connection affinity, or other high-availability concerns. Concurrent
requests across multiple module instances have not been tested.
Recommended action
Review the remaining storage and session-related code for dependencies
on local state or instance affinity. Where practical, test concurrent
operations across multiple module instances to assess whether the
relevant functionality works without relying on a particular instance.
Status: Further verification required.
16. Officially supported infrastructure and platform technologies
Assessment: Manual verification required.
The reviewed files identify the following infrastructure technologies
and dependencies:
  Technology or dependency            Evidence
  Vert.x                              vertx-stack-depchain, version
                                      5.0.10
  PostgreSQL testing                  org.folio:postgres-testing, test
                                      scope, version managed by
                                      ${raml-module-builder.version}
  FOLIO Kafka wrapper                 org.folio:folio-kafka-wrapper,
                                      version 4.0.0
  Apache Kafka client                 org.apache.kafka:kafka-clients,
                                      version 4.2.0
  S3-compatible storage               FolioS3ClientFactory and
                                      FolioS3Client used in
                                      profile-picture storage
  Java                                pom.xml sets java.version to
                                      21; the repository lists Java 21
                                      JDK as a prerequisite, and FOLIO
                                      Trillium guidance specifies Java 21
                                      / JDK 21. This supports alignment
                                  on Java version only.
A search for aws in pom.xml did not identify a matching dependency
entry. This does not establish that AWS-compatible storage is absent;
the relevant library may use a different artifact name or be supplied
transitively.
Finding and recommended action
The reviewed files identify several infrastructure technologies and
dependency versions. Their compliance with the official FOLIO
supported-technologies requirements has not been established.
- Compare the effective production dependency tree, including
  transitive dependencies, with the official supported-technologies
  list applicable to this module version.
- Confirm resolved versions of dependencies managed through Maven
  properties and dependency management.
- Verify that the S3-compatible storage integration uses an approved
  library and supported configuration.
Dependency declarations alone do not establish that the technologies are
officially supported or that the deployed runtime uses the expected
versions.
Status: Manual verification required.
17. Consolidated status
  Criterion                           Preliminary result
  S005 --- Personal-data disclosure   Manual review required. The
                                      evaluator found and parsed
                                      PERSONAL_DATA_DISCLOSURE.md, but
                                      skipped semantic review because
                                      agent review was disabled or
                                      unconfigured. The disclosure
                                      content still requires human
                                      review.
  S010 --- Runtime dependencies       Manual review required.
                                      Inspected database and Kafka write
                                      paths propagate failures through
                                      asynchronous futures. HTTP response
                                      handling and selected
                                      object-storage error paths were
                                      also reviewed. Remaining questions
                                      include behavior when configuration
                                      is absent or invalid,
                                      object-storage error
                                      classification, Kafka-disabled
                                      outbox processing, producer cleanup
                                      failures, and runtime failure
                                      handling across unreviewed paths.
  API permissions                     Permission declarations and
                                      selected endpoint mappings were
                                      inspected; complete authorization
                                      and field-level protection remain
                                      unverified.
  API endpoint documentation          Preliminary; final endpoint
                                      coverage check outstanding. RAML
                                      documentation was found for the
                                      principal mod-users API
                                      resources. The separate
                                      folio-custom-fields repository
                                      documents collection and item
                                      operations and both
                                      usage-statistics endpoints.
                                      Documentation for /_/tenant and
                                      /_/tenant/{id} was not confirmed,
                                      and a complete
                                      descriptor-to-documentation
                                      comparison remains outstanding.
  Module descriptor                   Manual review required. The
                                      inspected descriptor and
                                      implementation provide evidence of
                                      alignment; a complete
                                      endpoint-by-endpoint comparison has
                                      not been performed.
  Reference data                      Version-aware reference-data
                                      loading is supported by the
                                      inspected implementation; actual
                                      installation, upgrade, and
                                      preservation of tenant-customized
                                      records remain untested.
  Integration tests                   Integration-test classes and
                                      supporting dependencies are
                                      present. Complete test execution
                                      results and official technology
                                      support status remain unverified.
  Tenant isolation                    Manual review required.
                                      Inspected code selects
                                      tenant-specific PostgreSQL clients
                                      in RecordRepositoryImpl.java,
                                      UserOutboxService.java, and
                                      ProfilePictureStorage.java. Test
                                      setup uses the same tenant (diku)
                                      for Okapi headers and the
                                      PostgreSQL client. Cross-tenant
                                      isolation remains unverified; no
                                      violation has been established.
  Database schema access              No violation was identified in the
                                      inspected results; broader
                                      verification of SQL scripts and
                                      database operations remains
                                      outstanding.
  Dependency documentation            Manual review required. The
                                      descriptor lists feesfines and
                                      configuration as optional
                                      dependencies. The reviewed README
                                      content does not explicitly explain
                                      feesfines. Applicable
                                      documentation requirements have not
                                      been fully determined, so no
                                      violation has been established.
  Tenant-specific responses           Tenant-aware test setup was
                                      observed; request-header behavior
                                      and cross-tenant response isolation
                                      remain unverified.
  /admin/health                     The InstallUpgradeIT.java
                                      integration test verifies that GET
                                      /admin/health returns HTTP 200
                                      and body "OK". Successful
                                      execution of the test remains
                                      unverified.
  High availability                   The reviewed profile-picture
                                      storage path uses object storage;
                                      module-wide high-availability
                                      behavior remains unverified.
  Supported technologies              Manual verification required.
                                      pom.xml specifies Java 21, which
                                      aligns with the cited FOLIO
                                      Trillium backend technology
                                      guidance. Compliance of all
                                      relevant production and transitive
                                  dependencies remains unverified.
These results summarize the evidence collected during the review. They
are preliminary assessments, not declarations of complete compliance.
Evidence that supports compliance in one area should not be interpreted
as complete verification through testing or exhaustive source review.
Items marked unverified or requiring manual review should remain open
until sufficient evidence is collected.
18. Recommended follow-up actions
Prioritize the remaining work as follows:
1. S005 --- Personal-data disclosure: Manually review
   PERSONAL_DATA_DISCLOSURE.md against the implementation and data
   flows. Confirm that the disclosure is accurate and complete.
2. S010 --- Runtime dependencies: Verify required and optional
   configuration behavior; confirm Kafka-disabled outbox handling;
   review object-storage error classification and timeout behavior;
   verify producer cleanup when end() fails; and inspect remaining
   HTTP and database failure paths.
3. API endpoint documentation: Confirm where /_/tenant and
   /_/tenant/{id} are documented. Complete a comparison of the module
   descriptor's declared handlers against the relevant RAML
   documentation before marking the criterion fully satisfied.
4. API permissions: Verify runtime enforcement, field-level
   protection, and completeness of permission mappings.
5. Module descriptor: Complete the endpoint-by-endpoint and
   permission-by-permission comparison.
6. Reference data: Verify installation and upgrade behavior,
   including preservation of tenant-customized records.
7. Integration tests: Confirm which test suites pass and verify the
   applicable official support status of testing technologies.
8. Tenant isolation: Review or add tests using two distinct tenant
   IDs to confirm that one tenant cannot access another tenant's
   records.
9. /admin/health: Confirm that the integration test passes in the
   applicable environment or verify the endpoint in a deployed
   environment.
10. Dependency documentation: Confirm the applicable requirements
    for the optional feesfines and configuration dependencies.
11. High availability: Review remaining storage and session-related
    code for local state or instance affinity, and test multi-instance
    behavior where practical.
12. Supported technologies: Compare the effective production
    dependency tree, including transitive dependencies and resolved
    versions, with the official supported-technologies requirements.
    Verify the S3-compatible storage library as well.
13. Database schema access: Complete a broader review of SQL scripts
    and database access paths.
19. References
- FOLIO mod-users v19.6.2
  source
- FOLIO Technical Council module acceptance
  criteria
- Module
  descriptor
- Deployment
  descriptor
- Maven
  configuration
- README
- Personal-data
  disclosure
- RAML directory in
  mod-users
- Module descriptor in the reviewed mod-users fork
  snapshot
- Shared folio-custom-fields RAML
  documentation
- Reference-data
  directory
- Integration-test
  directory
- Health endpoint integration
  test
Review status: Preliminary evaluation updated October 16, 2026.
Targeted remediation and manual verification remain outstanding.
