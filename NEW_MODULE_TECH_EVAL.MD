# New Module Technical Evaluation Processes

## Overview
This document outlines the processes for **technical** evaluation of module for inclusion in a FOLIO release.  The following activities are covered:
1. Submission
1. Evaluation
1. Review
1. Feedback
1. Approval/Rejection

### Supporting documentation
* Details of the JIRA workflow are captured in a separate [document](NEW_MOD_TECH_EVAL_JIRA.md). 
* Technical evaluation is part of a larger process involving the other FOLIO Councils (PC/CC). A description of the full process is currently being developed by a cross council working group. Upon completion a link to this process will be added here. 

## Submission
1. The Submitter fills out a form in JIRA (using a template) and submits it to the TCR Board for review.  
    * See JIRA workflow for details.
    * A Reviewer will only respond to submissions from the official Submitters as defined in the 'Roles' section of this document.
1. The Technical Council will update the JIRA within 1 week (See JIRA workflow for details) with the following information:
    * Confirm receipt of the submission
    * Who will be performing the role of Reviewer, as defined in the 'Roles' secrtion of this document
    * Provide an rough estimate for the initial evaluation to be completed
      * Should be 3 weeks or less.
    * Request additional information
      * If there are missing points of contact, the Product Council will be contacted
      * Any questions about the module will be directed to the points of contact.

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
  * A maximum duration (3 weeks) from the submission date for the initial review.  
    * This does not include activities that happen after feedback is given, etc. 
  * The applicable deadline for submissions in the release timeline (not the date, but the name of the milestone/deadline e.g. "deadline for new modules")

## Evaluation
1. The Technical Council reviews a JIRA board to see if there are any new submissions, and check on the status of evaluations in progress.
1. If there’s a new submission, the Technical Council finds one or more people to perofm the role of Reviewer. The review team will be formed in a way to allow for a fair review and avoid conflicts for interests.
    * JIRA workflow: the ticket is transitioned from **SUBMITTED** to **UNDER EVALUATION**
3. The module is evaluated.
    * If the Reviwer(s) have questions, they may reach out to the Submiter for clarification.
    * If answers aren't provided in a timely manner, the criteria in question may be failed.
4. Upon completion of the evaluation the JIRA will be updated to indicate this.
     * JIRA workflow: the ticket is transitioned from **UNDER EVALUATION** to **TC REVIEW**

## Review
1. The Technical Council reviews the evaluation results.
    * Asks any questions they have for the evaluators.
    * Weigh in on any subjective criteria.
    * The Technical Council may ask the Reviewer(s) to make changes to the evaluation.  
    * This review may happen either out of band, during the regularly scheduled Technical Council meeting, or a separate meeting scheduled specifically for this purpose.
1. Upon completion of the review, the JIRA will be updated to indicate this.
    * JIRA workflow: the ticket is transitioned from **TC REVIEW** to **APROVED** or **REJECTED**

## Feedback & Acceptance/Rejection
1. Evaluation results are published (in markdown format) to the [tech-council GitHub repository](https://github.com/folio-org/tech-council) and linked to the JIRA ticket.
    * An [Evaluation Results Template](https://github.com/folio-org/tech-council/blob/master/MODULE_EVALUATION_TEMPLATE.MD) will be used for this.
1. Interested parties (e.g. release coordinator, contributor points of contact, Product Council members, etc.) are notified, and provided a link to the results.
    * JIRA workflow: notification is in the form of transition from **TC REVIEW** to **APROVED** or **REJECTED**
    * If failed, the Submiter(s) may ask for help understanding the failed criteria.
      * The comments section of the JIRA may be used for this purpose.  
      * If a meeting is required or desired, it's the responsibility of the Submiter(s) to find a time that works and set the meeting up with the review team.  The regular Technical Council meeting ***will not*** be used for this purpose.
1. If applicable, the Submiter(s) resolve all issues and request a re-review.  
    * * JIRA workflow: the ticket is transitioned from  **REJECTED** to **SUBMITTED**

### Roles

1. Submitter

    * Creates the JIRA ticket on the TCR board.
    * Can be a member of the PC or a delegate appointed by the PC
    * Must not be a member of the development team seeking approval.

1. Reviewer

    * Processes a TCR ticket through the JIRA workflow
    * Can be a member of the TC or a delegate appointed by the TC
    * Must not be a member of the development team seeking approval.

1. Module Developers

    * Communicates relevent module information through updates to the TCR Issue in jira, once it has been created by the submitter.
    * Includes developers, product owners and other team members.
