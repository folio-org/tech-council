v3 mod-users

# Technical Council Module Evaluation: mod-users

**Module:** `mod-users`
**Version reviewed:** `v19.6.2`
**Evaluation date:** October 9, 2026
**Repository:** [folio-org/mod-users](https://github.com/folio-org/mod-users/tree/v19.6.2)
**Acceptance criteria:** [FOLIO Technical Council Module Acceptance Criteria](https://github.com/folio-org/tech-council/blob/master/MODULE_ACCEPTANCE_CRITERIA.MD)

## 1. Executive summary

This evaluation reviews selected backend-module acceptance criteria for FOLIO's `mod-users` module at version `v19.6.2`. The review used the module source code, Maven configuration, module and deployment descriptors, integration-test files, README, and automated evaluation results.

The review identified evidence supporting several criteria, while others require additional verification.

### Principal findings

1. **S005 — Personal-data disclosure:** Manual review required. The evaluator found and parsed `PERSONAL_DATA_DISCLOSURE.md`, but skipped semantic review because agent review was disabled or unconfigured. The disclosure's accuracy and completeness still require human review.
2. **Runtime dependencies (S010):** The automated evaluator requires manual review. Evidence exists for PostgreSQL, Kafka, AWS-compatible object storage, and HTTP-client integrations, but runtime configuration and failure-handling coverage is incomplete.
3. **API permissions:** The module descriptor contains permission requirements for the inspected endpoints. No confirmed permission defect was identified, but full endpoint coverage has not been established.
4. **Reference data and integration tests:** Reference-data files and integration-test classes are present. The actual reference-data installation behavior and the official support status of the testing technology need further verification.
5. **Tenant isolation:** The reviewed repository methods consistently pass a tenant ID to `PostgresClient`. This supports tenant-aware access but does not independently prove complete storage-layer isolation.
6. **Health endpoint and supported technologies:** The standard health endpoint was not confirmed in the files examined, and the identified technology versions have not been compared against the official supported-technologies list.

**Overall conclusion:** This is a preliminary evidence-based review, not a declaration that all acceptance criteria have passed. No additional confirmed defect should be inferred from a criterion marked for manual verification.

## 2. Review scope and methodology

The review covered these areas:

* Automated evaluation results, including S005 and S010.
* API permissions and module descriptor configuration.
* Reference data and integration testing.
* Tenant-aware database access and database schema usage.
* Dependency documentation.
* Tenant-specific request handling.
* Health endpoint availability.
* High availability considerations.
* Infrastructure and platform technologies.

Evidence was gathered by inspecting source files and configuration in the `v19.6.2` repository. Where a conclusion depended on behavior that could not be established from the inspected code, the criterion is marked for manual verification.

## 3. S005 — Personal-data disclosure

**Assessment: Manual review required; semantic compliance has not been verified.**

**Evidence:**

The evaluator found and parsed `PERSONAL_DATA_DISCLOSURE.md`. The evaluation output indicates that semantic review was skipped because agent review was disabled or unconfigured.

The presence and successful parsing of the disclosure file establish that the expected artifact was found, but do not establish that its contents accurately disclose all relevant personal-data collection, processing, storage, sharing, and retention practices.

The module's user-event implementation also warrants review. The inspected code constructs user-event data from a user DTO that includes identifying and contact fields when personal information is present. The disclosure should be checked against the actual fields and data flows involved.

**Finding:** The required disclosure artifact is present and parseable, but its substantive accuracy and completeness have not been verified.

**Recommended action:** Manually compare the disclosure with the module's implementation and relevant data flows. Confirm that the documented practices accurately describe the personal data processed and transmitted by the module before marking S005 as satisfied.


## 4. S010 — Runtime dependencies and configuration

**Assessment: Manual review required.** The inspected code demonstrates explicit propagation of database and Kafka write failures in several paths. Runtime dependency behavior is not fully verified, including configuration-absent scenarios, object-storage failures, producer cleanup, and the intended behavior when Kafka publishing is disabled.

**Evidence reviewed**

1. **Configuration declarations:** `descriptors/ModuleDescriptor-template.json` declares configuration inputs for database connectivity, Kafka, and object storage. The descriptor alone does not establish which settings are mandatory at runtime or how the module behaves when they are absent or invalid.

2. **HTTP client behavior:** `HttpClientFactory.java` creates and caches a `VertxOkapiHttpClient` per Vert.x instance. `VertxOkapiHttpClient.java` applies explicit timeouts to several request methods and converts responses to the wrapper's response model. Error interpretation and recovery are handled in part by callers; timeout behavior and failure handling across all HTTP operations have not been fully verified.

3. **HTTP response handling:** `ResponseInterpreter.java` converts unsuccessful HTTP responses into `HttpException` failures. `FeesFinesModuleClientImpl.java` logs and propagates failures in the inspected operations rather than silently recovering them.

4. **Database failures:** `RecordRepositoryImpl.java` uses `getAsyncResultHandler` for the inspected read and update operations. `ResultHandlerUtils.java` completes the promise successfully when the asynchronous operation succeeds and fails it with the original cause when the operation fails. This supports failure propagation in the reviewed repository paths; it does not establish how every database failure is ultimately translated into an API response.

5. **Object-storage failures:** `ProfilePictureStorage.java` catches exceptions in the inspected object-storage operations and translates them into API responses. The reviewed code can return `404` for some caught failures, including failures in retrieving a presigned URL or fetching the image. Further review is needed to establish whether storage outages and other infrastructure failures are classified appropriately. The exception-handling assumptions and timeout behavior also warrant verification.

6. **Kafka write failures:** `UserEventProducer.java` checks the result of `producer.write(...)`. On failure, it logs the error and fails the returned future with the original cause. The inspected `getKafkaFutures(...)` and `processOutboxEventLogs(...)` methods compose these futures before attempting outbox deletion. Under standard Vert.x future-composition behavior, a failed send should fail this chain and prevent the subsequent deletion step.

7. **Kafka disabled behavior:** The default `UserEventProducer` constructor obtains its enablement setting from `KafkaConfigSingleton.INSTANCE.isKafkaEnabled()`. When publishing is disabled, `sendUserEvent(...)` returns a successful future containing `false`. The inspected outbox-processing code does not inspect individual Boolean results before deriving event IDs for deletion. The intended behavior when Kafka is disabled, and whether outbox records should be retained in that situation, remain to be verified.

8. **Producer cleanup:** `sendToKafka(...)` calls `producer.end()` after the write completes and calls `producer.close()` on successful completion of `end()`. The inspected code does not establish how cleanup is handled if ending the producer fails.

**Finding**

The inspected paths provide evidence of explicit failure propagation for database operations and Kafka writes. They do not establish complete runtime resilience across all dependencies or configuration states. The Kafka-disabled outbox behavior, object-storage error classification, and producer cleanup require further verification before a definitive compliance conclusion can be made.

**Recommended follow-up**

* Verify required and optional configuration settings and behavior when settings are missing or invalid.
* Confirm the intended outbox behavior when Kafka publishing is disabled, including whether events should remain available for later delivery.
* Verify object-storage error classification and timeout behavior.
* Confirm producer cleanup when `end()` fails.
* Review remaining database and HTTP client failure paths, including how failures are ultimately surfaced to API callers.

**Status: Manual review required.**

## 5. API permissions

**Status: Manual review required**

### Evidence

The `descriptors/ModuleDescriptor-template.json` file defines permission sets and API handler mappings through `permissionsRequired`, `permissionsDesired`, and, for selected handlers, `modulePermissions`.

The inspected handler mappings cover:

* **User records:** Collection and item reads, creation, updates, and deletion.
* **Profile pictures:** GET, POST, PUT, and DELETE operations.
* **User groups, address types, proxy relationships, and departments:** Collection and item operations.
* **Custom fields:** Collection and item operations, statistics, and option statistics.
* **Patron PINs:** Creation, deletion, and verification.
* **User settings:** Collection and item reads, creation, updates, and deletion.

The inspected `permissionsRequired` entries correspond to permission names declared in `permissionSets` for the operations reviewed.

The composite permission `users.all` groups permissions for user records and several related interfaces, including user groups, address types, proxies, departments, patron PINs, tenant affiliations, profile pictures, and user settings. The composite permission `user-settings.custom-fields.all` separately groups eight custom-field permissions. The custom-field permission `user-settings.custom-fields.item.post` was verified as both individually declared and included in the composite permission.

The `/users` and `/users/{id}` handlers declare `users.basic-read.execute` and `users.restricted-read.execute` under `permissionsDesired`, while requiring their respective collection or item permissions. The distinction between endpoint access and restricted-field access requires further review.

The user-delete handler additionally declares `manualblocks.collection.get` and `manualblocks.item.delete` under `modulePermissions`.

The RAML `validate` trait includes a 422 validation-error response. The inspected trait does not itself establish authorization enforcement.

### Outstanding review items

* Verify runtime enforcement of the declared permissions.
* Determine how basic-read and restricted-read permissions control access to user fields.
* Confirm completeness and consistency of permission declarations across all handlers, including all 55 occurrences of `permissionsRequired`.
* Review the purpose and enforcement of additional `modulePermissions`.
* Confirm the intended scope of the `users.all` and `user-settings.custom-fields.all` composite permissions.

### Assessment

The inspected descriptor provides substantial evidence of explicit API permission mappings and consistency between selected handler requirements, individual permission declarations, and composite permissions. However, descriptor declarations alone do not establish correct runtime authorization or field-level protection. Further review is required before this criterion can be considered complete.

## 6. Module descriptor and deployment descriptor

**Assessment: Manual review; no confirmed descriptor defect identified.**

Evidence:

* [ModuleDescriptor-template.json](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json)
* [DeploymentDescriptor-template.json](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/DeploymentDescriptor-template.json)
* [UsersAPI.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/rest/impl/UsersAPI.java)

The module descriptor declares the module name and version, provided interfaces, API handlers, permissions, optional dependencies, and scheduled jobs.

The deployment descriptor identifies the Java command used to launch the module. The reviewed `UsersAPI.java` implementation includes core user operations, profile-picture management, configuration, expiration, and outbox processing.

**Finding:** The reviewed files provide evidence of alignment between the descriptor and substantial parts of the implementation. A complete endpoint-by-endpoint and permission-by-permission comparison has not been performed.

The reviewed descriptor also defines the user-settings and custom-fields interfaces. The inspected custom-fields collection PUT handler requires `user-settings.custom-fields.collection.put`; that permission is declared in `permissionSets` and included in the `user-settings.custom-fields.all` composite permission. The user-settings handlers similarly use individual permissions grouped by `users.settings.all`.

## 7. Reference data

**Assessment: Evidence supports compliance; installation and upgrade behavior not fully verified.**

**Evidence:**

* [Reference-data directory](https://github.com/folio-org/mod-users/tree/v19.6.2/src/main/resources/ref-data)
* [Address-type reference data](https://github.com/folio-org/mod-users/tree/v19.6.2/src/main/resources/ref-data/addresstypes-15.4.0)
* [User-group reference data](https://github.com/folio-org/mod-users/tree/v19.6.2/src/main/resources/ref-data/groups-17.3.0)
* [TenantRefAPI.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/rest/impl/TenantRefAPI.java)
* [MODUSERS-335 commit](https://github.com/folio-org/mod-users/commit/4961efbc818afc06de5dd9b198550c67a9c7aba8)

The module includes address-type reference-data files (`claim.json`, `home.json`, `order.json`, `payment.json`, `returns.json`, and `work.json`) and user-group reference-data files (`faculty.json`, `graduate.json`, `staff.json`, and `undergraduate.json`).

In `TenantRefAPI.loadData()`, reference data is added to the tenant-loading process conditionally, using `isNew()` to evaluate feature versions. Address types are associated with version `15.4.0`, and user groups with version `17.3.0`. The method separately configures sample-data loading. The `isNew()` helper treats a null `moduleFrom` as a new installation and otherwise delegates version comparison to `Versioned.isNewForThisInstall()`.

The MODUSERS-335 commit describes changes intended to ensure that, during a tenant upgrade, only reference or sample data that has changed is installed or restored.

**Finding:** The reference-data files and `TenantRefAPI` implementation provide evidence of version-aware, conditional reference-data loading. The implementation is consistent with the stated goal of avoiding unnecessary reference-data reloads during upgrades.

**Limitation:** The underlying `TenantLoading` behavior and actual installation or upgrade results have not been independently verified. The review therefore does not establish that existing tenant-customized records are always preserved or that all upgrade scenarios behave correctly.

## 8. Integration tests and testing technology

**Assessment: Integration tests are present; official support status and test execution results require confirmation.**

**Evidence:**

* [Integration-test directory](https://github.com/folio-org/mod-users/tree/v19.6.2/src/test/java/org/folio/moduserstest)
* [pom.xml](https://github.com/folio-org/mod-users/blob/v19.6.2/pom.xml)
* [UserOutboxProcessIT.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/test/java/org/folio/moduserstest/UserOutboxProcessIT.java)

The inspected test directory includes:

* `AbstractRestTest.java`
* `AbstractRestTestNoData.java`
* `AbstractRestTestWithData.java`
* `ExpirationIT.java`
* `GroupIT.java`
* `ProxyRelationshipsIT.java`
* `UserOutboxProcessIT.java`

The Maven configuration declares JUnit BOM version `6.0.3`, JUnit Jupiter API and Engine, JUnit Jupiter parameter support, Testcontainers JUnit Jupiter, Testcontainers LocalStack, and JUnit Vintage Engine.

The inspected tests use established Java testing frameworks and Testcontainers. `UserOutboxProcessIT` exercises successful Kafka user-event processing and a nonexistent-tenant error scenario.

**Finding:** Integration-test classes and their supporting test dependencies are present. The inspected outbox integration test provides evidence of testing both a successful event-processing scenario and an error scenario.

**Limitation:** The presence of test classes and dependency declarations does not establish that the complete test suite passes. The official FOLIO support status of the testing technologies has not been independently confirmed against the applicable technology list or integration-test guidance.


## 9. Tenant data segregation at the storage layer

****Assessment: Manual review required.** The inspected code selects tenant-specific PostgreSQL clients in `RecordRepositoryImpl.java`, `UserOutboxService.java`, and `ProfilePictureStorage.java`. `UserOutboxService.java` derives the tenant ID from the Okapi headers, while `AbstractRestTest.java` initializes its test client and headers using the same tenant (`diku`). These findings support tenant-aware client selection in the reviewed paths but do not demonstrate cross-tenant isolation. No explicit test comparing access across two different tenants was identified in the reviewed results. Further verification is required; no tenant-isolation violation has been established.

Evidence:

* [RecordRepositoryImpl.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/service/impl/RecordRepositoryImpl.java)
* [AbstractRestTest.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/test/java/org/folio/moduserstest/AbstractRestTest.java)

The repository defines:

```java
private PostgresClient pgClient(String tenantId) {
    return PostgresClient.getInstance(vertx, tenantId);
}
```

The reviewed retrieval and update methods use `pgClient(tenantId)` for operations on the users table. For example:

```java
pgClient(tenantId).update(
    USERS_TABLE, user, user.getId(), getAsyncResultHandler(promise)
);
```

The integration-test setup also initializes `OkapiHeaders` with `TENANT_NAME` and obtains a PostgreSQL client for that tenant.

**Finding:** The inspected methods consistently pass a tenant identifier to the database client.

**Limitation:** This evidence does not independently prove the underlying client's isolation guarantees or establish that every database access path is tenant-isolated. Cross-tenant integration tests or equivalent evidence would strengthen the conclusion.

## 10. Database schema access

**Assessment: No violation identified in the inspected result; complete module-wide verification remains outstanding.**

**Evidence:**

* [create_configuration_table.sql](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/resources/templates/db_scripts/create_configuration_table.sql#L4)
* `RecordRepositoryImpl.java`

The repository search for the literal string `public.` returned one result in `create_configuration_table.sql`. The supplied SQL snippet includes:

```sql
new_uuid UUID := public.uuid_generate_v4();
```

and:

```sql
id uuid PRIMARY KEY DEFAULT public.uuid_generate_v4()
```

These references invoke the UUID-generation function in the `public` schema, which is permitted by the criterion. The shown table is named `configuration` without a different schema prefix.

The search found no `public.` matches in `RecordRepositoryImpl.java`.

**Finding:** The inspected evidence does not identify a cross-schema access violation.

**Limitation:** Searching for the literal string `public.` does not exhaustively establish that the module avoids prohibited cross-schema access. SQL scripts, dynamically constructed queries, and other database operations have not been comprehensively reviewed.

## 11. Dependency documentation in README

**Assessment: Manual review required; no confirmed violation.**

**Evidence:**

* [README.md](https://github.com/folio-org/mod-users/blob/v19.6.2/README.md)
* [ModuleDescriptor-template.json](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json)

The module descriptor declares optional dependencies on:

* `feesfines`, version `19.1`
* `configuration`, version `2.0`

The README documents profile-picture configuration through the `users.settings` interface and legacy configuration endpoints. It also describes configuration for S3-compatible object storage.

No explicit dependency section was identified in the reviewed README content. The searched location did not mention `feesfines`. References to configuration in the README concern application configuration and do not, by themselves, establish that the separate `configuration` module dependency is documented.

**Finding:** The inspected evidence does not establish whether all dependencies requiring documentation are adequately covered by the README.

**Outstanding review:**

* Determine which dependencies are covered by the module’s defined interfaces.
* Identify any dependencies outside those interfaces that require explicit documentation.
* Check whether the README documents those dependencies and their purpose.

**Recommended action:** Complete the dependency-to-interface comparison before determining whether this criterion is satisfied.

## 12. Tenant-specific responses and `x-okapi-tenant`

**Assessment: Evidence supports tenant-aware test setup; response behavior remains unverified.**

**Evidence:**

* [AbstractRestTest.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/test/java/org/folio/moduserstest/AbstractRestTest.java)

The test setup initializes `OkapiHeaders` and a PostgreSQL client with the same tenant identifier:

```java
okapiHeaders = new OkapiHeaders(wireMockUrl, TENANT_NAME, token);
postgresClient = PostgresClient.getInstance(vertx, TENANT_NAME);
```

The setup then passes the headers into module initialization.

**Finding:** The inspected test setup is tenant-aware and configures a database client for the specified tenant.

**Limitation:** This evidence does not independently establish that outgoing HTTP requests include the expected `x-okapi-tenant` header or that responses contain only data belonging to the requested tenant. Cross-tenant response isolation has not been demonstrated by the inspected snippet.

**Recommended action:** Inspect how `OkapiHeaders` constructs request headers and review or perform integration tests using two tenants to verify that each tenant receives only its own data.

## 13. Standard health endpoint

**Assessment: Manual verification required; endpoint not confirmed.**

**Evidence:**

* [ModuleDescriptor-template.json](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json)
* [AbstractRestTest.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/test/java/org/folio/moduserstest/AbstractRestTest.java)
* Build configuration identifying `org.folio.rest.RestLauncher` and `org.folio.rest.RestVerticle` as application entry points.

The search for `/admin/health` did not identify a match in the inspected module descriptor or integration-test setup.

The build configuration identifies the shared FOLIO REST infrastructure as part of the application startup. However, this evidence alone does not establish that the required health endpoint is available or returns HTTP 200.

**Finding:** The required health endpoint has not been confirmed by the evidence examined. This is an unverified requirement, not a confirmed implementation defect.

**Recommended action:** Verify `GET /admin/health` against a deployed instance of `mod-users` and confirm that it returns HTTP 200. Alternatively, inspect the relevant shared REST infrastructure and establish that the endpoint is provided for this module.

## 14. High availability

**Assessment: Evidence supports the reviewed storage path; full HA compliance remains unverified.**

**Evidence:**

* [ProfilePictureStorage.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/service/storage/ProfilePictureStorage.java)

The reviewed object-storage methods:

* Obtain the tenant identifier from the `x-okapi-tenant` header.
* Prefix object keys with the tenant identifier.
* Use `FolioS3Client` to write, retrieve, and remove profile pictures.
* Use in-memory byte streams when writing profile-picture data.

No `FileOutputStream` match was found in the reviewed file.

**Finding:** The inspected profile-picture storage implementation uses an object-storage client and does not show a dependency on local filesystem persistence for the reviewed operations.

**Limitation:** This evidence does not establish that the entire module avoids local persistent storage, sticky sessions, connection affinity, or other high-availability concerns. The behavior of concurrent requests across multiple module instances has not been tested.

**Recommended action:** Review the remaining storage and session-related code for dependencies on local state or instance affinity. Where practical, test concurrent operations across multiple module instances to assess whether the relevant functionality works without relying on a particular instance.

## 15. Officially supported infrastructure and platform technologies

**Assessment: Manual verification required.**

**Evidence:**

* [pom.xml](https://github.com/folio-org/mod-users/blob/v19.6.2/pom.xml)
* [ProfilePictureStorage.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/service/storage/ProfilePictureStorage.java)

The reviewed files identify the following infrastructure technologies and dependencies:

| **Technology or dependency** | **Evidence**                                                                                  |
| ---------------------------- | --------------------------------------------------------------------------------------------- |
| Vert.x                       | `vertx-stack-depchain`, version `5.0.10`                                                      |
| PostgreSQL testing           | `org.folio:postgres-testing`, test scope, version managed by `${raml-module-builder.version}` |
| FOLIO Kafka wrapper          | `org.folio:folio-kafka-wrapper`, version `4.0.0`                                              |
| Apache Kafka client          | `org.apache.kafka:kafka-clients`, version `4.2.0`                                             |
| S3-compatible storage        | `FolioS3ClientFactory` and `FolioS3Client` used in profile-picture storage                    |

A search for `aws` in `pom.xml` did not identify a matching dependency entry. This does not establish that AWS-compatible storage is absent; the relevant library may use a different artifact name or be supplied transitively.

**Finding:** The reviewed files identify several infrastructure technologies and dependency versions. Their compliance with the official FOLIO supported-technologies requirements has not been established.

**Recommended action:**

* Compare the effective production dependency tree, including transitive dependencies, with the official supported-technologies list applicable to this module version.
* Confirm the resolved versions of dependencies managed through Maven properties and dependency management.
* Verify that the S3-compatible storage integration uses an approved library and supported configuration.

**Limitation:** Dependency declarations alone do not establish that the technologies are officially supported or that the deployed runtime uses the expected versions.

## 16. Consolidated status

| **Criterion**                   | **Preliminary result**                                                                                                                                                                                                 |
| ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| S005 — Personal-data disclosure | **Manual review required.** The evaluator found and parsed `PERSONAL_DATA_DISCLOSURE.md`, but skipped semantic review because agent review was disabled or unconfigured. The disclosure content still requires human review. |
| S010 — Runtime dependencies     | **Manual review required.** Inspected database and Kafka write paths propagate failures through asynchronous futures. HTTP response handling and selected object-storage error paths were also reviewed. Remaining questions include behavior when configuration is absent or invalid, object-storage error classification, Kafka-disabled outbox processing, producer cleanup failures, and runtime failure handling across unreviewed paths. Complete module-wide verification remains outstanding. |
| API permissions                 | Permission declarations and selected endpoint mappings were inspected; complete authorization and field-level protection remain unverified.                                                                            |
| Module descriptor               | **Manual review required.** The inspected descriptor and implementation provide evidence of alignment; a complete endpoint-by-endpoint comparison has not been performed.                                              |
| Reference data                  | Version-aware reference-data loading is supported by the inspected implementation; actual installation, upgrade, and preservation of tenant-customized records remain untested.                                        |
| Integration tests               | Integration-test classes and supporting dependencies are present. Complete test execution results and official technology support status remain unverified.                                                            |
| Tenant storage isolation        | Tenant-aware database access was observed; full tenant isolation has not been independently verified.                                                                                                                  |
| Database schema access          | No violation was identified in the inspected results; broader verification of SQL scripts and database operations remains outstanding.                                                                                 |
| Dependency documentation        | **Manual review required.** The documentation requirement for dependencies outside defined interfaces has not been fully determined.                                                                                   |
| Tenant-specific responses       | Tenant-aware test setup was observed; request-header behavior and cross-tenant response isolation remain unverified.                                                                                                   |
| `/admin/health`                 | The required endpoint and its HTTP 200 response have not been confirmed.                                                                                                                                               |
| High availability               | The reviewed profile-picture storage path uses object storage; module-wide high-availability behavior remains unverified.                                                                                              |
| Supported technologies          | **Manual verification required.** Dependency versions were identified, but compliance with the applicable official FOLIO supported-technologies requirements has not been established.                                 |

These results summarize the evidence collected during this review. They are preliminary assessments, not declarations of complete compliance. A finding that evidence supports compliance in a particular area should not be interpreted as complete verification through testing or exhaustive source review. Items marked as unverified or requiring manual review should remain open until sufficient evidence is collected.

## 17. Recommended follow-up actions

Prioritize the following work:

1. **S005 — Personal-data disclosure:** Manually review `PERSONAL_DATA_DISCLOSURE.md` against the module's implementation and data flows. Confirm the disclosure is accurate and complete before marking the criterion as satisfied.
2. **Complete S010 runtime-dependency verification:** Verify required and optional configuration behavior; confirm Kafka-disabled outbox handling; review object-storage error classification and timeout behavior; verify producer cleanup when `end()` fails; and inspect remaining HTTP and database failure paths.
3. **Verify `/admin/health`:** Confirm the endpoint returns HTTP 200 in a deployed environment or through the applicable shared infrastructure.
4. **Verify tenant isolation:** Confirm the tenant header reaches database operations and inspect cross-tenant integration tests.
5. **Verify dependency documentation:** Determine whether `feesfines` and `configuration` require explicit documentation beyond their declared interfaces.
6. **Compare supported technologies:** Check the effective dependency tree against the official FOLIO support list.
7. **Complete the remaining manual checks:** Confirm full API permission coverage, database schema access, reference-data upgrade behavior, and HA-related behavior.

## 18. References

* [FOLIO mod-users v19.6.2 source](https://github.com/folio-org/mod-users/tree/v19.6.2)
* [FOLIO Technical Council module acceptance criteria](https://github.com/folio-org/tech-council/blob/master/MODULE_ACCEPTANCE_CRITERIA.MD)
* [Module descriptor](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json)
* [Deployment descriptor](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/DeploymentDescriptor-template.json)
* [Maven configuration](https://github.com/folio-org/mod-users/blob/v19.6.2/pom.xml)
* [README](https://github.com/folio-org/mod-users/blob/v19.6.2/README.md)
* [Existing personal-data disclosure](https://github.com/folio-org/mod-users/blob/v19.6.2/PERSONAL_DATA_DISCOSURE.md)
* [Reference-data directory](https://github.com/folio-org/mod-users/tree/v19.6.2/src/main/resources/ref-data)
* [Integration-test directory](https://github.com/folio-org/mod-users/tree/v19.6.2/src/test/java/org/folio/moduserstest)

---

**Review status:** Preliminary evaluation prepared; targeted remediation and manual verification remain outstanding.

