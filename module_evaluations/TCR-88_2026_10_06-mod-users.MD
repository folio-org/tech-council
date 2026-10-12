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

1. **Personal-data disclosure (S005):** The automated evaluator reported a failure because `PERSONAL_DATA_DISCLOSURE.md` was not found. A similarly named file, `PERSONAL_DATA_DISCOSURE.md`, exists but has a misspelled filename. Its content also needs review for accuracy.
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

**Assessment: Failed by the automated evaluator; remediation recommended.**

**Automated finding:** The required top-level `PERSONAL_DATA_DISCLOSURE.md` file was not found.

Evidence:

* [Expected disclosure filename](https://github.com/folio-org/mod-users/blob/v19.6.2/PERSONAL_DATA_DISCLOSURE.md)
* [Existing misspelled disclosure file](https://github.com/folio-org/mod-users/blob/v19.6.2/PERSONAL_DATA_DISCOSURE.md)
* [Module repository](https://github.com/folio-org/mod-users/tree/v19.6.2)

The repository contains `PERSONAL_DATA_DISCOSURE.md`, which appears to be a misspelling of the expected filename. The existing disclosure states that no personal data is stored or processed while listing fields such as names, addresses, telephone numbers, email addresses, user identifiers, enrollment information, external IDs, and profile pictures.

This apparent inconsistency needs review. The disclosure should accurately describe the personal data the module stores or processes.

Recommended action: Rename PERSONAL_DATA_DISCOSURE.md to PERSONAL_DATA_DISCLOSURE.md so the file uses the expected filename. Review the disclosure content to ensure it accurately describes the personal data collected, stored, and processed by mod-users. Re-run the Technical Council module evaluation to confirm whether S005 passes after the correction.

Current status: Failed by the automated evaluator due to the missing expected filename. The filename correction and subsequent evaluator result have not yet been verified.
The module transmits user personal data through Kafka events. The inspected consortium-user DTO includes user identifiers, names, email addresses, and phone numbers. The inspected event path does not establish whether free-form text fields are transmitted; this remains to be verified.

The module logs a `CustomField` object at INFO level in `RecordServiceImpl.retrieveStatistic()`. The contents of the logged object have not been verified, so potential personal-data exposure through this log statement remains under review.

## 4. S010 — Runtime dependencies and configuration

**Assessment: Manual review required.**

The automated evaluator identified unresolved runtime-dependency and configuration scenarios involving AWS, PostgreSQL, Kafka, object storage, and HTTP clients.

### Evidence reviewed

* `src/main/java/org/folio/verticle/AbstractConsumersVerticle.java` initializes Kafka consumers.
* `src/main/java/org/folio/event/service/UserOutboxService.java` handles user-event outbox operations.
* `src/test/java/org/folio/moduserstest/UserOutboxProcessIT.java` tests Kafka event publishing and error handling.
* `src/test/java/org/folio/moduserstest/UsersAPIIT.java` includes `canHandleDatabaseException()`, which induces a database constraint violation and expects HTTP 500.
* `src/test/java/org/folio/service/UsersSettingsServiceTest.java` tests profile-picture configuration behavior, including invalid settings.
* `src/main/java/org/folio/service/storage/ProfilePictureStorage.java` implements database and object-storage functionality.

### Outstanding questions

* Kafka consumer startup failure handling requires further investigation. In `AbstractConsumersVerticle.java`, the completion callback for `Future.all(futures)` completes the startup promise without explicitly propagating the aggregate failure. This is a potential concern that should be verified against the surrounding startup logic and tested before classifying it as a defect.

**Finding:** The available evidence demonstrates runtime integrations and some error-handling tests, but does not establish satisfactory behavior for every required configuration and failure scenario.

**HTTP-client evidence:** `HttpClientFactory` creates and caches `VertxOkapiHttpClient` instances. The client configures timeouts for GET, POST, and DELETE requests, returns HTTP status codes and response bodies, and logs request paths. PUT does not explicitly set a timeout in the inspected method. The inspected code does not establish whether all callers handle asynchronous failures and unsuccessful HTTP responses appropriately; caller-level handling remains to be verified.

**Kafka outbox integration-test evidence:** `UserOutboxProcessIT` verifies that triggering outbox processing publishes a user CREATE event to the expected Kafka topic and checks event headers and the personal-data-changed flag. A separate test verifies that triggering processing for a nonexistent tenant returns HTTP 500 and produces no event on the expected topic. These tests do not establish behavior during Kafka broker outages or failed event publishing, nor whether outbox records are retained or retried after publishing failures.

**Outbox failure-handling evidence:** `UserOutboxService.processOutboxEventLogs()` processes records inside `PostgresClient.withTrans(...)`, joins the Kafka publishing futures, and only then attempts to delete the corresponding outbox records. A publishing failure should prevent the deletion step from running. Transaction rollback and subsequent retry behavior have not been independently verified, so retention and retry after Kafka failure remain to be confirmed.

**Profile-picture storage failure handling:** `ProfilePictureStorage.storeProfilePictureInObjectStorage()` writes and updates profile pictures in object storage and catches exceptions, returning HTTP 404 for a specific missing-object case and HTTP 500 for other storage errors. The inspected implementation provides explicit error responses, but automated test coverage for these failure paths has not been established. The exception handler also assumes `e.getMessage()` is non-null; whether that assumption is safe remains unverified.

**Recommended action:** Retain manual-review status until the outstanding runtime scenarios have been tested or otherwise verified. The evidence collected does not, by itself, establish a confirmed S010 defect.

## 5. API permissions

**Assessment: Evidence supports compliance in the inspected interfaces; complete verification remains outstanding.**

Evidence:

* [Module descriptor](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json)
* [Users RAML](https://github.com/folio-org/mod-users/tree/v19.6.2/ramls)

The module descriptor declares API interfaces and permission requirements for the inspected endpoints, including:

* `users`
* `custom-fields`
* `patron-pin`
* `user-tenants`
* `staging-users`
* `users.settings`

The reviewed handlers generally specify individual permissions through `permissionsRequired`. Some GET user endpoints also declare `permissionsDesired`, including `users.basic-read.execute` and `users.restricted-read.execute`.

The descriptor contains composite permissions such as `users.all`, `users.settings.all`, and `user-settings.custom-fields.all`. The presence of composite permissions does not itself demonstrate a violation: the inspected handlers use individual permissions rather than requiring a broad `*.all` permission for every endpoint.

The DELETE user endpoint also declares module permissions associated with manual blocks.

### Limitations

* A complete endpoint-by-endpoint comparison against the permission naming guidelines was not performed.
* The authorization behavior of system interfaces, including `_tenant` and `_timer`, was not independently verified.
* The review did not establish that every endpoint is protected appropriately under all runtime conditions.

**Finding:** No confirmed permission defect was identified in the inspected descriptor entries. Further verification is required before declaring full compliance.

## 6. Module descriptor and deployment descriptor

**Assessment: Manual review; no confirmed descriptor defect identified.**

Evidence:

* [ModuleDescriptor-template.json](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json)
* [DeploymentDescriptor-template.json](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/DeploymentDescriptor-template.json)
* [UsersAPI.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/rest/impl/UsersAPI.java)

The module descriptor declares the module name and version, provided interfaces, API handlers, permissions, optional dependencies, and scheduled jobs.

The deployment descriptor identifies the Java command used to launch the module. The reviewed `UsersAPI.java` implementation includes core user operations, profile-picture management, configuration, expiration, and outbox processing.

**Finding:** The reviewed files provide evidence of alignment between the descriptor and substantial parts of the implementation. A complete endpoint-by-endpoint and permission-by-permission comparison has not been performed.

## 7. Reference data

**Assessment: Evidence supports compliance; installation and upgrade behavior not fully verified.**

Evidence:

* [Reference-data directory](https://github.com/folio-org/mod-users/tree/v19.6.2/src/main/resources/ref-data)
* [Address-type reference data](https://github.com/folio-org/mod-users/tree/v19.6.2/src/main/resources/ref-data/addresstypes-15.4.0)
* [User-group reference data](https://github.com/folio-org/mod-users/tree/v19.6.2/src/main/resources/ref-data/groups-17.3.0)
* [MODUSERS-335 commit](https://github.com/folio-org/mod-users/commit/4961efbc818afc06de5dd9b198550c67a9c7aba8)

The module includes these address-type reference-data files:

* `claim.json`
* `home.json`
* `order.json`
* `payment.json`
* `returns.json`
* `work.json`

The user-group reference-data directory contains:

* `faculty.json`
* `graduate.json`
* `staff.json`
* `undergraduate.json`

The associated commit, MODUSERS-335, describes changes intended to install or restore only reference or sample data that has changed during a tenant upgrade.

**Finding:** Reference-data files are present and their purpose is consistent with the criterion.

**Limitation:** The review did not test reference-data installation, restoration, or upgrade behavior. Full runtime compliance is therefore not independently established.

## 8. Integration tests and testing technology

**Assessment: Integration tests are present; official support status requires confirmation.**

Evidence:

* [Integration-test directory](https://github.com/folio-org/mod-users/tree/v19.6.2/src/test/java/org/folio/moduserstest)
* [pom.xml](https://github.com/folio-org/mod-users/blob/v19.6.2/pom.xml)

The inspected test directory includes:

* `AbstractRestTest.java`
* `AbstractRestTestNoData.java`
* `AbstractRestTestWithData.java`
* `ExpirationIT.java`
* `GroupIT.java`
* `ProxyRelationshipsIT.java`
* `UserOutboxProcessIT.java`

The Maven configuration declares:

* JUnit BOM version `6.0.3`
* JUnit Jupiter API and Engine
* JUnit Jupiter parameter support
* Testcontainers JUnit Jupiter
* Testcontainers LocalStack
* JUnit Vintage Engine

The tests use established Java testing frameworks and Testcontainers. The review also identified tests that exercise Kafka event publishing and database error handling.

**Finding:** Integration tests and their supporting test dependencies are present.

**Limitation:** Dependency declarations do not prove that all tests pass, and the official FOLIO support status of the testing technology has not been independently confirmed against the applicable technology list or integration-test guidance.

## 9. Tenant data segregation at the storage layer

**Assessment: Evidence supports tenant-aware database access; full isolation remains unverified.**

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

The repository search for `public.` identified one result:

* [create_configuration_table.sql](https://github.com/folio-org/mod-users/blob/58eb337e7f89667037e88f297db8fcdd44ebdda8/src/main/resources/templates/db_scripts/create_configuration_table.sql#L4)

The supplied SQL snippet includes:

```sql
new_uuid UUID := public.uuid_generate_v4();
```

and:

```sql
id uuid PRIMARY KEY DEFAULT public.uuid_generate_v4()
```

These references call the UUID-generation function in the `public` schema, which is permitted by the criterion. The shown table is named `configuration` without a different schema prefix.

No `public.` matches were found in `RecordRepositoryImpl.java`.

**Finding:** The reviewed evidence does not identify a cross-schema access violation.

**Limitation:** Searching for the literal string `public.` is not exhaustive proof that the module never accesses other schemas. A broader review of SQL scripts, query construction, and database operations would be required for full verification.

## 11. Dependency documentation in README

**Assessment: Manual review required; no confirmed violation.**

Evidence:

* [README.md](https://github.com/folio-org/mod-users/blob/v19.6.2/README.md)
* [Module descriptor](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json)

The module descriptor declares optional dependencies on:

* `feesfines`, version `19.1`
* `configuration`, version `2.0`

The README documents profile-picture configuration through the `users.settings` interface and legacy configuration endpoints. It also describes S3-compatible object-storage configuration.

However, no explicit dependency section was identified, and the README does not mention `feesfines` in the location searched. The occurrence of the word `configuration` relates to configuration documentation and does not necessarily document the separate module dependency.

**Finding:** The evidence is insufficient to determine whether all dependencies outside defined interfaces are adequately documented.

**Recommended action:** Verify which dependencies are covered by defined interfaces and whether any additional dependencies require explicit README documentation.

## 12. Tenant-specific responses and `x-okapi-tenant`

**Assessment: Evidence supports tenant-aware test setup; response behavior remains unverified.**

Evidence:

* [AbstractRestTest.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/test/java/org/folio/moduserstest/AbstractRestTest.java)

The test setup contains:

```java
okapiHeaders = new OkapiHeaders(wireMockUrl, TENANT_NAME, token);
postgresClient = PostgresClient.getInstance(vertx, TENANT_NAME);
```

It then passes the headers into module initialization.

**Finding:** The test setup is tenant-aware and uses a tenant-specific database client.

**Limitation:** The reviewed snippet does not explicitly show the outgoing `x-okapi-tenant` HTTP header or prove that requests from two different tenants return only the appropriate tenant's data.

**Recommended action:** Verify request-header construction and add or inspect cross-tenant integration tests that demonstrate tenant-specific results.

## 13. Standard health endpoint

**Assessment: Manual verification required; endpoint not confirmed.**

The search for `/admin/health` did not find a match in:

* [ModuleDescriptor-template.json](https://github.com/folio-org/mod-users/blob/v19.6.2/descriptors/ModuleDescriptor-template.json)
* [AbstractRestTest.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/test/java/org/folio/moduserstest/AbstractRestTest.java)

The build configuration identifies `org.folio.rest.RestLauncher` and `org.folio.rest.RestVerticle` as the application entry points. This indicates the use of shared FOLIO REST infrastructure, but does not establish that the health endpoint is present or returns HTTP 200.

**Finding:** The required endpoint has not been confirmed from the evidence examined.

**Recommended action:** Run a request to `GET /admin/health` against a deployed module or inspect the relevant shared REST infrastructure to verify that the endpoint exists and returns HTTP 200.

## 14. High availability

**Assessment: Evidence supports the reviewed storage path; full HA compliance remains unverified.**

Evidence:

* [ProfilePictureStorage.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/service/storage/ProfilePictureStorage.java)

The reviewed object-storage methods:

* Obtain the tenant identifier from the `x-okapi-tenant` header.
* Prefix object keys with the tenant identifier.
* Use `FolioS3Client` to write, retrieve, and remove profile pictures.
* Use in-memory byte streams when writing profile-picture data.

No `FileOutputStream` match was found in the reviewed file.

**Finding:** The reviewed object-storage implementation does not show a dependency on local filesystem persistence for profile pictures.

**Limitation:** This does not establish that the entire module avoids local persistent storage, sticky sessions, connection affinity, or other HA concerns. The review also did not test concurrent operation across multiple module instances.

**Recommended action:** Review the remaining storage and session-related code and, where practical, validate behavior across multiple module instances.

## 15. Officially supported infrastructure and platform technologies

**Assessment: Manual verification required.**

Evidence:

* [pom.xml](https://github.com/folio-org/mod-users/blob/v19.6.2/pom.xml)
* [ProfilePictureStorage.java](https://github.com/folio-org/mod-users/blob/v19.6.2/src/main/java/org/folio/service/storage/ProfilePictureStorage.java)

The following dependencies or versions were identified:

| Technology or dependency | Evidence                                                                                      |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| Vert.x                   | `vertx-stack-depchain`, version `5.0.10`                                                      |
| PostgreSQL testing       | `org.folio:postgres-testing`, test scope, version managed by `${raml-module-builder.version}` |
| FOLIO Kafka wrapper      | `org.folio:folio-kafka-wrapper`, version `4.0.0`                                              |
| Apache Kafka client      | `org.apache.kafka:kafka-clients`, version `4.2.0`                                             |
| S3-compatible storage    | `FolioS3ClientFactory` and `FolioS3Client` used in profile-picture storage                    |

A search for `aws` in `pom.xml` did not identify a matching dependency entry. This does not establish that AWS-compatible storage is absent; the relevant library may have another artifact name or be supplied transitively.

**Finding:** The reviewed files identify several infrastructure technologies, but their versions have not been compared against the official FOLIO supported-technologies list.

**Recommended action:** Compare the effective production dependency tree, including transitive dependencies, with the supported-technologies list applicable to this module version. Confirm whether the AWS-compatible storage integration uses an approved library and supported configuration.

## 16. Consolidated status

| Criterion                       | Preliminary result                                                        |
| ------------------------------- | ------------------------------------------------------------------------- |
| S005 — Personal-data disclosure | **Manual review required**; the evaluator found and parsed `PERSONAL_DATA_DISCLOSURE.md`, but skipped the semantic review because agent review was disabled or unconfigured. The disclosure content still warrants review.|
| S010 — Runtime dependencies     | **Manual review required**                                                |
| API permissions                 | Evidence supports inspected endpoints; full verification outstanding      |
| Module descriptor               | Manual review; no confirmed defect                                        |
| Reference data                  | Evidence supports compliance; loading and upgrade behavior untested       |
| Integration tests               | Tests and dependencies present; official support status to confirm        |
| Tenant storage isolation        | Tenant-aware database access observed; full isolation unverified          |
| Database schema access          | No violation identified in reviewed result; broader verification needed   |
| Dependency documentation        | Manual review required                                                    |
| Tenant-specific responses       | Tenant-aware setup observed; cross-tenant behavior unverified             |
| `/admin/health`                 | Endpoint not confirmed                                                    |
| High availability               | Reviewed storage path supports compliance; module-wide review outstanding |
| Supported technologies          | Manual verification required                                              |

These results describe the evidence collected during this review. A preliminary result of “evidence supports compliance” should not be treated as equivalent to a complete test-based verification.

## 17. Recommended follow-up actions

Prioritize the following work:

1. **Resolve S005:** Correct the disclosure filename, verify its contents, and rerun the automated evaluator.
2. **Complete S010 review:** Investigate configuration-absent scenarios, HTTP-client failures, object-storage failures, database failures, and Kafka consumer startup failures.
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

