# ui-export-manager

## version 3.0 (ratified 2025-01-25) + draft notes for existing module evaluation

## Overview
The Technical Council (TC) has defined a process for technical evaluation of modules for inclusion in a FOLIO release.  This document outlines the high level values and specific criteria used when evaluating modules as part of this process.  The distinction between values and criteria is as follows:

* **Values** are high-level factors that are unlikely to change over time.  They should be understandable even to a non-technical audience.
* **Criteria** are specific, verifiable tests as to how we’re meeting the Values within the current state of affairs.  Criteria will evolve over time to respond to changes in the Project’s technology stack, current best practices, etc. They may require a degree of technical expertise or domain knowledge to fully understand.

In some cases, we may not yet have comprehensive Criteria for assessing a module’s adherence to a Value.  In such cases, subjective review and analysis will be applied, and may lead to discussion.

This document provides the criteria against which a module will be assessed for inclusion into a FOLIO release, following the [New Module Technical Evaluation Process](NEW_MODULE_TECH_EVAL.MD). 

Existing FOLIO modules ideally conform to the same Values and Criteria.  It is understood that not all existing modules currently do so, especially modules created before the Values & Criteria were initially defined.  The Technical Council will work with development teams to align the current reality of the code with the Values and Criteria over time, as practicable.  Such processes will need to be developed and documented.  The Technical Council is currently piloting an existing module evaluation process with a few initial modules, and has noted below with "For existing module evaluation" where individual criteria will be handled differently.

Please see [Before Development](NEW_MODULE_TECH_EVAL.MD#before-development) for any planned development to new or existing modules that may intentionally diverge from these Values or Criteria.

## How to use this document

When performing a technical evaluation of a module, create a copy of this document.  The evaluation results should be placed in the [module_evaluations](https://github.com/folio-org/tech-council/tree/master/module_evaluations) directory and should conform to the following naming convention: `{JIRA Key}_YYYY-MM-DD-{module name}.MD`, e.g. `TCR-1_2021-11-17-mod-foo.MD`.  The date here is used to differentiate between initial and potential re-evaluation(s).  It should be the date when the evaluation results file was created.

Replace the title with the name of the module or library.

Remove either the Frontend or the Backend section.

Use these conventions to indicate the status of each criterion.

* [x] ACCEPTABLE
* [x] ~INAPPLICABLE~
* [ ] UNACCEPTABLE
  * comments on what was evaluated/not evaluated, why a criterion failed

## Values
1. Module adheres to Community Code of Conduct
2. Module license is compatible with the FOLIO Project
3. Module can be included in existing community build processes
4. Module has robust testing that can run with existing community testing processes
5. Module can be deployed in the Community’s reference environments without undue burden
6. Module is secure
7. Module is multi-tenant
8. Module is internationalized
9. Module meets current accessibility requirements
10. Module offers a cohesive user experience consistent with the rest of FOLIO
11. Module has developer and end-user documentation
12. Module depends ONLY on other modules and infrastructure that are already included in FOLIO
13. Module has a long-term development and maintenance plan
14. Module is scalable
15. Module supports high availability
16. Modules conforms to FOLIO upgrade mechanisms

## Criteria

### Administrative
* [x] ~Listed by the Product Council on [Functionality Evaluated by the PC](https://wiki.folio.org/display/PC/Functionality+Evaluated+by+the+PC) with a positive evaluation result.~
  - For existing module evaluation: This criterion is inapplicable.

### Shared/Common
* [x] Uses Apache 2.0 license (2)
* [x] Module build MUST produce a valid module descriptor (3, 5)
  * _This is not applicable to libraries_
* [x] Inclusion of third party dependencies complies with [ASF 3rd Party License Policy](https://apache.org/legal/resolved.html) (2)
  * Uses README for [Category B Appropriately Labelled Condition](https://apache.org/legal/resolved.html#appropriately-labelled-condition)
  * LGPL consideration:
    * org.z3950.zing:cql-java is allowed if appropriately labelled, even if it is LGPL-2.1-only
    * org.marc4j:marc4j is allowed if appropriately labelled, even if it is LGPL-2.1-or-later
    * org.hibernate.* is allowed if appropriately labelled, even if it is LGPL-2.1-or-later
    * By [request of the Community Council](https://folio-org.atlassian.net/wiki/spaces/CC/pages/1243348996/2025-09-26+Community+Council+Meeting+Minutes+at+WOLFcon), and until that request changes, no additional LGPL-licensed dependencies will be allowed. 
  * _note: If a library declares multiple licenses in its pom.xml, [only one of them needs to comply](https://maven.apache.org/ref/3.9.11/maven-model/maven.html#project)._ (This applies only to Maven. For other package managers, closer evaluation is needed.)
  * _note: The [FOLIO Module Evaluator](https://github.com/folio-org/tc-module-eval) tool is optionally available to evaluate this criterion for Java modules (built with Maven) and for front-end modules.  TC expects to [require its use](https://github.com/folio-org/tech-council/pull/110) in the module evaluation process after a trial period._
  * _note: [More information about this criterion](https://github.com/folio-org/tech-council/blob/master/criteria/THIRD_PARTY_DEPENDENCIES.MD)_
* [x] Installation documentation is included (11)
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
  * _This is not applicable to libraries_
* [x] [Personal data form](https://github.com/folio-org/personal-data-disclosure) is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file (6)
  * _This is not applicable to libraries_
* [x] Sensitive and environment-specific information is not checked into git repository (6)
* [x] Written in a language and framework from the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1] (3, 5)
* [x] Uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_ (3, 5, 12)
  * _This is not applicable to libraries_
* [x] Must not depend on a FOLIO library that has not been approved through the TCR process
* [ ] ~Gracefully handles the absence of third party systems or related configuration. (3, 5, 12)~
  * _Note: This applies to optional third-party integrations and their configurations only. Required environment variables (those without sensible defaults) should fail fast on startup per the Environment Variables Policy._
* [x] Sonarqube hasn't identified any security issues, any high or greater severity issues, or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  * See [Rule Customization](https://dev.folio.org/guides/code-analysis/#rule-customization) details. 
* [x] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools (3, 5, 13)
* [x] Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
* [x] Assigned to exactly one application descriptor within the FOLIO Community LSP Platform, specified in the Jira task for this module evaluation (3, 5)
  * _The FOLIO Community LSP Platform is defined at https://github.com/folio-org/platform-lsp._
  * _This can be evaluated by searching application descriptors across the folio-org GitHub organization (considering those applications part of the community platform) and confirming that this module only appears in the application descriptor of the one specified application._

### Frontend

Note: Frontend criteria apply to both modules and shared libraries. 

* [x] For each consumed API `package.json` MUST include the interface requirement in the `"okapiInterfaces"` or `"optionalOkapiInterfaces"` section (3, 5)
  * -_note: read more at https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md#the-package-file-stripes-entry_
* [x] If provided, End-to-end tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/stripes-testing_
* [x] Have i18n support via react-intl and an en.json file with English texts (8)
* [ ] Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension (9)
  * Wasn't sure how to check this. There is axe-testing in the stripes-testing repo but it is a guess that export manager is included in this since it is included in the `cypress/e2e` folder.
  * I ran a Lighthouse report using Chrome and it showed 95 accessibility score, with a note that the buttons don't have an accessible name.
  ```
  <button id="app-list-dropdown-toggle" class="navButton---wRwTS interactionStylesControl---e1lwD undefined" data-test-app-list-apps-toggle="true" aria-expanded="false" aria-haspopup="true"><span class="inner---bGUpf isInteractive---iwCXQ interactionStyles---eaRy_"><span class="icon---D_7At"><svg class="dropdownToggleIcon---iyEOw" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M8.4 2.4H5.1c-1.5 0-2.7 1.2-2.7 2.7v3.3c0 1.5 1.2 2.7 2.7 2.7h3.3c1.5 0 2.7-1.2 2.7-2.7V5.1c0-1.5-1.2-2.7-2.7-2.7zm.7 6c0 .4-.3.7-.7.7H5.1c-.4 0-.7-.3-.7-.7V5.1c0-.4.3-.7.7-.7h3.3c.4 0 .7.3.7.7v3.3zM18.9 2.4h-3.3c-1.5 0-2.7 1.2-2.7 2.7v3.3c0 1.5 1.2 2.7 2.7 2.7h3.3c1.5 0 2.7-1.2 2.7-2.7V5.1c0-1.5-1.2-2.7-2.7-2.7zm.7 6c0 .4-.3.7-.7.7h-3.3c-.4 0-.7-.3-.7-.7V5.1c0-.4.3-.7.7-.7h3.3c.4 0 .7.3.7.7v3.3zM8.4 12.9H5.1c-1.5 0-2.7 1.2-2.7 2.7v3.3c0 1.5 1.2 2.7 2.7 2.7h3.3c1.5 0 2.7-1.2 2.7-2.7v-3.3c0-1.5-1.2-2.7-2.7-2.7zm.7 6c0 .4-.3.7-.7.7H5.1c-.4 0-.7-.3-.7-.7v-3.3c0-.4.3-.7.7-.7h3.3c.4 0 .7.3.7.7v3.3zM18.9 12.9h-3.3c-1.5 0-2.7 1.2-2.7 2.7v3.3c0 1.5 1.2 2.7 2.7 2.7h3.3c1.5 0 2.7-1.2 2.7-2.7v-3.3c0-1.5-1.2-2.7-2.7-2.7zm.7 6c0 .4-.3.7-.7.7h-3.3c-.4 0-.7-.3-.7-.7v-3.3c0-.4.3-.7.7-.7h3.3c.4 0 .7.3.7.7v3.3z"></path></svg></span><span class="label---Reg83 dropdownToggleLabel---W95Md"><span class="icon---Iv6r5 icon-position-end---zJPsT" role="presentation"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" data-test-icon-element="true" class="stripes__icon icon-caret-down medium---jNVX7" focusable="false"><path d="M14.6 22.6c.8.8 2 .8 2.8 0L27 13c.8-.8.8-2 0-2.8s-2-.8-2.8 0L16 18.4l-8.2-8.2c-.8-.8-2-.8-2.8 0s-.8 2 0 2.8c-.2 0 9.6 9.6 9.6 9.6"></path></svg><span class="label---agLJE">Apps</span></span></span></span></button>
  ```
* [x] Use the Stripes version of referred on the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1] (10, 16)
* [x] Follow relevant existing UI layouts, patterns and norms (10) -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
  * E.g. Saving state when navigating between apps (or confirming that you'll lose the state)
  * For UI links to documentation, there is no rule on where that documentation should be hosted, i.e. docs.folio.org, or wiki.folio.org, or module-specific destinations, as long as it is publicly accessible.
* [x] Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation (10)


## TCR Process Improvements

[_Please include here any suggestions that you feel might improve the TCR Processes._]
* I was uncertain how to check if the module descriptor passed schema validation. I looked at https://dev.folio.org/guides/api-lint/ which pointed me to api-tools and zschema but for UI modules, you need to first install yarn and know how to build the module descriptor file in order to use the zschema tool. I asked Maccabee and he referenced his TCR Process Improvements [notes from TCR-56](https://github.com/maccabeelevine/tech-council/blob/8802ea5701df6e59b1bc517992b6afeaeba539b4/module_evaluations/TCR-56_2025-08-25-ui-mosaic-settings.MD?plain=1#L137-L138), which I was able to do to figure if the module descriptor passed schema validation.
* It would be useful to include the link to SonarQube https://sonarcloud.io/organizations/folio-org/projects


[^1]: Refer to the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page for the most recent ACTIVE release.
