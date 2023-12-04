# New Module Technical Evaluation Processes

## Overview
This document outlines the processes for **technical** evaluation of module for inclusion in a FOLIO release.  The following activities are covered:
1. Before Development
1. Submission
1. Evaluation
1. Review
1. Feedback
1. Approval/Rejection

### Supporting documentation
* Details of the JIRA workflow are captured in a separate [document](NEW_MOD_TECH_EVAL_JIRA.md). 
* Technical evaluation is part of a larger process involving the other FOLIO Councils (PC/CC). A description of the full process is currently being developed by a cross council working group. Upon completion a link to this process will be added here. 

## Before Development
* Please review the New Module Evaluation Criteria before (or as early as possible during) development, to avoid any issues which would lead to delay or rejection of the module.
* The Technical Council welcomes architectural questions. In particular, if you anticipate that the module will introduce any architectural changes or other innovations that might conflict with existing TCR criteria, or would imply significant changes to the hosting environment or required infrastructure, please do reach out to the Technical Council ASAP.  The TC may recommend an RFC or other process to resolve these questions first, to avoid the module failing or being delayed during the TCR process.

## Submission
1. The Submitter fills out a form in JIRA (using a template) and submits it to the TCR Board for review.  
    * See JIRA workflow for details.
    * An Evaluator will only respond to submissions from the official Submitters as defined in the 'Roles' section of this document.
1. The Technical Council will update the JIRA within 1 week (See JIRA workflow for details) with the following information:
    * Confirm receipt of the submission
    * Who will be performing the role of Evaluator, as defined in the 'Roles' secrtion of this document
    * Provide an rough estimate for the initial evaluation to be completed
      * Should be 3 weeks or less.
    * Request additional information
      * If there are missing points of contact, the Product Council will be contacted
      * Any questions about the module will be directed to the points of contact.
    * Request a demonstration of the module
      * In some cases the TC may request a demonstration of the module
      * In such instances the Evaluator will contact the Submitter with a request for a demonstration, and a mutually suitable time for the demonstration will be scheduled.

### Submission form
Information gathered includes:
* Module name
* Description of module
* Link to source - a tag/commit in a publicly accessible git (preferably GitHub) repository 
* List of related modules (e.g. is this a Frontend/backend pair?  Business logic/storage pair?  etc.)
* Points of contact (Subject Matter / Domain / Technical)
  * Each point of contact's role should be clearly identified.
  * A single, main point of contact must have an account in issues.folio.org JIRA.
* Free form section for notes, clarifications, background, links to supporting documentation, etc.
* Link to self evaluation results
* Informational Section - provides info, instead of eliciting it.
  * A link/pointer to the most recent version of the Acceptance Criteria.
  * The TC has a maximum duration of 3 weeks to perform the initial review.
    * The evaluator may have between 2 and 3 weeks, depending when the TC meeting happens during that first week.  
    * This does not include activities that happen after feedback is given, etc. 
  * The applicable deadline for submissions in the release timeline (not the date, but the name of the milestone/deadline e.g. "deadline for new modules")

## Evaluation
1. The Technical Council reviews a JIRA board to see if there are any new submissions, and check on the status of evaluations in progress.
1. If there’s a new submission, the Technical Council finds one or more people to perform the role of Evaluator. 
    * The review team will be formed in a way to allow for a fair review and avoid either perceived or actual conflicts of interest.  No members should have participated in the module's development, and at least one member should be independent of the submitter's organization.  The lead evaluator will be assigned in JIRA; if the submitting team has concerns about the chosen evaluator they should contact the TC chairs within one week of the assignment.
    * JIRA workflow: the ticket is transitioned from **SUBMITTED** to **UNDER EVALUATION**
    * In order to improve notifications when the Jira is updated, the primary reviewer should be the Assignee and other members of the review team should be issue watchers.
1. The module is evaluated.
    * If the Evaluator(s) have questions, they may reach out to the Point of Contact for clarification.
      * This may be an iterative process: the evaluator and submitter may choose to iterate on the submission, making adjustment to address the questions raised. 
      * Whenever changes are made, the submitter should update the commit hash in the Jira.
    * If answers aren't provided in a timely manner, the criteria in question may be failed.
1. Upon completion of the evaluation the JIRA will be updated to indicate this.
     * JIRA workflow: the ticket is transitioned from **UNDER EVALUATION** to **TC REVIEW**

## Review
1. The Technical Council reviews the evaluation results.
    * The evaluators present the evaluation results, and optionally recommends a TC decision.
    * Asks any questions they have for the evaluators.
    * Weigh in on any subjective criteria.
    * The Technical Council may ask the Evaluator(s) to make changes to the evaluation.  
    * This review may happen either out of band, during the regularly scheduled Technical Council meeting, or a separate meeting scheduled specifically for this purpose.
1. The Technical Council decides, using its standard protocols, to accept, provisionally accept, or reject the module, or else to defer a decision pending other action.
    * An evaluation where all criteria are met will typically result in the acceptance of a module by the Technical Council.
    * An evaluation where not all criteria are met will typically result in the rejection of a module by the Technical Council. However:
        * If some of the failures are due to proposed architectural (or other cross-module) changes, the TC may request that Submitter first propose those changes via the RFC process to get sufficient community input. In that situation the TC may defer its decision pending the resolution of the RFC. (See [Before Development](#Before-Development).)
        * If TC and Submitter unanimously agree on module changes that would resolve any failures, the TC may decide to provisionally accept the module with an agreed-upon timeline for the changes to be completed.  When Submitter notifies TC that the changes are complete, the reviewer(s) may update the evaluation and TC may adjust its decision.
        * If the TC determines that some failed criteria would be resolved by non-controversial changes to the criteria themselves (or referenced requirements like the Officially Supported Technologies), TC may decide to accept the module and make the agreed-upon changes.
    * When the Technical council's decision is contrary to the evaluation, or after any provisional acceptance or deferral, the Technical Council is required to provide written justification for their decision.
1. Upon completion of the review, the JIRA will be updated to indicate this.
    * JIRA workflow: the ticket is transitioned from **TC REVIEW** to **APROVED** or **REJECTED**

## Feedback & Acceptance/Rejection
1. Evaluation results are published (in markdown format) to the [tech-council GitHub repository](https://github.com/folio-org/tech-council) and linked to the JIRA ticket.
    * An [Evaluation Results Template](https://github.com/folio-org/tech-council/blob/master/MODULE_EVALUATION_TEMPLATE.MD) will be used for this.
1. Interested parties (e.g. release coordinator, contributor points of contact, Product Council members, etc.) are notified, and provided a link to the results.
    * JIRA workflow: notification is in the form of transition from **TC REVIEW** to **APROVED** or **REJECTED**
    * If failed, the Point of Contact may ask for help understanding the failed criteria.
      * The comments section of the JIRA may be used for this purpose.  
      * If a meeting is required or desired, it's the responsibility of the Point of Contact to find a time that works and set the meeting up with the review team.  The regular Technical Council meeting ***will not*** be used for this purpose.
1. If applicable, the module developers resolve all issues and request a re-review.  
    * * JIRA workflow: the ticket is transitioned from  **REJECTED** to **SUBMITTED**

### Roles

1. Submitter

    * Creates the JIRA ticket on the TCR board.

1. Evaluator

    * Processes a TCR ticket through the JIRA workflow
    * Can be a member of the TC or a delegate appointed by the TC
    * Must not be a member of the development team seeking approval.

1. Development Team Point of Contact (Point of Contact)

    * Communicates relevent module information through updates to the TCR Issue in jira, once it has been created by the submitter.
    * Includes developers, product owners and other team members.

1. Product Council

    * Leaves a comment in the TCR saying they approved the relevant functionality.
