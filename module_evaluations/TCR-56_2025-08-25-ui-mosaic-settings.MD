# FOLIO Module Acceptance Values and Criteria

## version 3.0 (ratified 2025-01-25)

## Overview
The Technical Council (TC) has defined a process for technical evaluation of modules for inclusion in a FOLIO release.  This document outlines the high level values and specific criteria used when evaluating modules as part of this process.  The distinction between values and criteria is as follows:

* **Values** are high-level factors that are unlikely to change over time.  They should be understandable even to a non-technical audience.
* **Criteria** are specific, verifiable tests as to how we’re meeting the Values within the current state of affairs.  Criteria will evolve over time to respond to changes in the Project’s technology stack, current best practices, etc. They may require a degree of technical expertise or domain knowledge to fully understand.

In some cases, we may not yet have comprehensive Criteria for assessing a module’s adherence to a Value.  In such cases, subjective review and analysis will be applied, and may lead to discussion.

This document provides the criteria against which a module will be assessed for inclusion into a FOLIO release, following the [New Module Technical Evaluation Process](NEW_MODULE_TECH_EVAL.MD). 

Existing FOLIO modules ideally conform to the same Values and Criteria.  It is understood that not all existing modules currently do so, especially modules created before the Values & Criteria were initially defined.  The Technical Council will work with development teams to align the current reality of the code with the Values and Criteria over time, as practicable.  Such processes will need to be developed and documented.

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
* [ ] Listed by the Product Council on [Functionality Evaluated by the PC](https://wiki.folio.org/display/PC/Functionality+Evaluated+by+the+PC) with a positive evaluation result.
  * We were told at TC today that the PC approved this last week.  It's not actually on that page yet, check again later.

### Shared/Common
* [X] Uses Apache 2.0 license (2)
* [ ] Module build MUST produce a valid module descriptor (3, 5)
  * _This is not applicable to libraries_
  * Neither Wayne (on OS X) or I (on Windows) can build this.  Yarn install not working either.  What tag/commit is supposed to build?
  * Mess around for a while and try again.
* [ ] Inclusion of third party dependencies complies with [ASF 3rd Party License Policy](https://apache.org/legal/resolved.html) (2)
  * Uses README for [Category B Appropriately Labelled Condition](https://apache.org/legal/resolved.html#appropriately-labelled-condition)
  * org.z3950.zing:cql-java is allowed if appropriately labelled, even if it is LGPL-2.1-only
  * org.marc4j:marc4j is allowed if appropriately labelled, even if it is LGPL-2.1-or-later
  * org.hibernate.* is allowed if appropriately labelled, even if it is LGPL-2.1-or-later
  **** find the apache checker I used before
* [X] Installation documentation is included (11)
  * -_note: read more at https://github.com/folio-org/mod-search/blob/master/README.md_
  * _This is not applicable to libraries_
* [X] Personal data form is completed, accurate, and provided as PERSONAL_DATA_DISCLOSURE.md file (6)
  * _This is not applicable to libraries_
* [X] Sensitive and environment-specific information is not checked into git repository (6)
* [X] Written in a language and framework from the [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1] (3, 5)
  * Typescript
* [ ] Uses FOLIO interfaces already provided by previously accepted modules _e.g. a UI module cannot be accepted that relies on an interface only provided by a back end module that hasn’t been accepted yet_ (3, 5, 12)
  * _This is not applicable to libraries_
    - Depends on two okapi interfaces. 
      - 'mosaic' interface from mod-mosaic is in the midst of its own TCR approval.
      - 'order-templates' interface from mod-orders, which has been in the flower releases for an eternity
* [X] Must not depend on a FOLIO library that has not been approved through the TCR process
* [ ] Gracefully handles the absence of third party systems or related configuration. (3, 5, 12)
* [ ] Sonarqube hasn't identified any security issues, any high or greater severity issues, or excessive (>3%) duplication (6); and any disabled or intentionally ignored rules/recommendations are reasonably justified.
  * See [Rule Customization](https://dev.folio.org/guides/code-analysis/#rule-customization) details. 
* [ ] Uses [officially supported](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) build tools (3, 5, 13)
* [ ] Unit tests have 80% coverage or greater, and are based on [officially supported technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
* [ ] Assigned to exactly one application descriptor within the FOLIO Community LSP Platform, specified in the Jira task for this module evaluation (3, 5)
  * _The FOLIO Community LSP Platform is defined at https://github.com/folio-org/platform-lsp._
  * _This can be evaluated by searching application descriptors across the folio-org GitHub organization (considering those applications part of the community platform) and confirming that this module only appears in the application descriptor of the one specified application._

### Frontend

Note: Frontend criteria apply to both modules and shared libraries. 

* [ ] For each consumed API `package.json` MUST include the interface requirement in the `"okapiInterfaces"` or `"optionalOkapiInterfaces"` section (3, 5)
  * -_note: read more at https://github.com/folio-org/stripes/blob/master/doc/dev-guide.md#the-package-file-stripes-entry_
* [ ] If provided, End-to-end tests must be written in an [officially supported technology](https://wiki.folio.org/display/TC/Officially+Supported+Technologies)[^1] (3, 4)
  * -_note: while it's strongly recommended that modules implement integration tests, it's not a requirement_
  * -_note: these tests are defined in https://github.com/folio-org/stripes-testing_
* [ ] Have i18n support via react-intl and an en.json file with English texts (8)
* [ ] Have WCAG 2.1 AA compliance as measured by a current major version of axe DevTools Chrome Extension (9)
* [ ] Use the Stripes version of referred on the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page[^1] (10, 16)
* [ ] Follow relevant existing UI layouts, patterns and norms (10) -_note: read more about current practices at [https://ux.folio.org/docs/all-guidelines/](https://ux.folio.org/docs/all-guidelines/)_
  * E.g. Saving state when navigating between apps (or confirming that you'll lose the state)
  * For UI links to documentation, there is no rule on where that documentation should be hosted, i.e. docs.folio.org, or wiki.folio.org, or module-specific destinations, as long as it is publicly accessible.
* [ ] Must work in the latest version of Chrome (the supported runtime environment) at the time of evaluation (10)

## TCR Process Improvements

[_Please include here any suggestions that you feel might improve the TCR Processes._]
* Document *how* to evaluate each of these steps.
  * For the module actual license, should we check for the top-level LICENSE file, or within package.json (for UI modules), or look on GitHub module page for what it says?
  * To build a module descriptor for a yarn-based UI module, run 'yarn build-mod-descriptor', look at the file created module-descriptor.json and ???  Need some steps here.
  * For installation documentation, look in the README
  * For sensitive information (UI modules), check package.json, other json configuration files, mocks in test folder...
  * For interface dependencies (UI modules), check package.json for the okapiInterfaces section to see the interfaces, then search what backend module(s) provide that interface with a URL like https://folio-registry.dev.folio.org/_/proxy/modules?provide=order-templates.  
  * For depending on previously approved libraries (UI modules), look at package.json for dependencies and peer-dependencies section for anything in the @folio namespace.  (Do dev dependencies matter?  Probably not in this context.)


[^1]: Refer to the [Officially Supported Technologies](https://wiki.folio.org/display/TC/Officially+Supported+Technologies) page for the most recent ACTIVE release.
