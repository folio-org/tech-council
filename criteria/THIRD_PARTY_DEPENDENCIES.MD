# Inclusion of third party dependencies complies with ASF 3rd Party License Policy

Q&A and context for evaluators.

## How should the evaluator handle a license that doesn’t appear at all on the ASF page?

When FOLIO Module Evaluator tool encounters a dependency with an unknown license, it will report that the module is not compliant with FOLIO policy.  The evaluator should then fail the third-party license criterion.

Technical Council [process](https://github.com/folio-org/tc-module-eval/blob/master/LICENSE_LIST_MANAGEMENT.md) will keep the evaluator tool’s lists of licenses up to date with the ASF source lists and FOLIO policy.

## What should we do when a new module includes a problem dependency that is already included in existing modules (that went through TCR, or pre-dated it)?

TBD

## Why reference the Apache Software Foundation's policy for the FOLIO project's dependencies?

Very early in the project, the FOLIO community determined that the Apache Open Source License was the most appropriate for the project's goals. Apache 2.0 is considered a "permissive license." This means the software can be used for any purpose, including commercial ones, and can be modified and distributed. In the realm of commercial hosting operations, this means a company can take the software, adjust it to fit their needs, and use it to operate their service without any restriction.

As a project that incorporates open source components ("third-party components"), we are obliged to be aware of the terms of those third-party components. Some open source licenses have terms incompatible with Apache. For instance, software licensed under the GNU General Public License (GPL) is not generally compatible with the Apache License. This is because the GPL is a copyleft license, which requires derivative works to be distributed under the same license (GPL). In contrast, the Apache License does not have this requirement. Therefore, using GPL-licensed components within the FOLIO project could force the entire project to be distributed under the GPL, which contradicts the terms of the Apache License.

As the purveyors of the Apache License, the Apache Software Foundation (ASF) is well-positioned to determine which licenses are and are not compatible with its own terms. It created and maintains the ASF 3rd Party License Policy as guidance for its projects to "identif[y] the acceptable licenses for inclusion of third-party Open Source components". ASF's criteria for inclusion of a particular license are that it's open source and that "as applied in practice, [it] must not impose significant restrictions beyond those imposed by the Apache License 2.0." ASF's list is actively managed, discussed, and updated (to categorize new licenses, for instance) by ASF's Legal Affairs Committee. 

The FOLIO Project is using the ASF 3rd Party License Policy as the basis of its own policy to avoid duplicative work. FOLIO's deviations from ASF's policy reflect the project's interpretation of the Apache License in consultation with its own legal counsel. These deviations cater to FOLIO's unique needs and operational requirements. They also take into account the specific legal considerations, risks, and compliance requirements associated with the project's use of third-party open-source components. The FOLIO Project must balance legal integrity with its spirit of openness, collaboration, and contribution, all within the Apache License's framework, which necessitates slight deviations from the ASF's policy.


