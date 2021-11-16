# New Module Technical Evaluation Processes

## Overview
This document outlines the processes for **technical** evaluation of module for inclusion in a FOLIO release.  The following activities are covered:
1. Submission
1. Evaluation
1. Review
1. Feedback
1. Approval/Rejection

### Supporting documentation
* Details of the JIRA workflow are captured in a separate document:  (insert link). 
* Technical evaluation is part of a larger process involving the other FOLIO Councils (PC/CC).  A description of the full process can be found here:  (insert link). 

## Submission
1. The Product Council fills out a form in JIRA (using a template) and submits it to the Technical Council.  
    * See JIRA workflow for details.
    * The Technical Council will only respond to submissions from the Product Council.
1. The Technical Council will update the JIRA within 1 week (See JIRA workflow for details) with the following information:
    * Confirm receipt of the submission
    * Who will be performing the evaluation
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
1. If there’s a new submission, the Technical Council finds one or more people to do the evaluation. The evaluation team will be formed in a way to allow for a fair review and avoid conflicts for interests.
1. The module is evaluated.
    * If the evaluator(s) have questions, they may reach out to the provided points of contact.
    * If answers aren't provided in a timely manner, the criteria in question may be failed.
1. Upon completion of the evaluation the JIRA will be updated to indicate this.
    * See JIRA workflow for details.

## Review
1. The Technical Council reviews the evaluation results.
    * Asks any questions they have for the evaluators.
    * Weigh in on any subjective criteria.
    * The Technical Council may ask the evaluators to make changes to the evaluation.  
    * This review may happen either out of band, during the regularly scheduled Technical Council meeting, or a separate meeting scheduled specifically for this purpose.
1. Upon completion of the review, the JIRA will be updated to indicate this.
    * See JIRA workflow for details.

## Feedback & Acceptance/Rejection
1. Evaluation results are published (in markdown format) to the [tech-council GitHub repository](https://github.com/folio-org/tech-council) and linked to the JIRA ticket.
    * An [Evaluation Results Template](insert link when available) will be used for this.
1. Interested parties (e.g. release coordinator, contributor points of contact, Product Council members, etc.) are notified, and provided a link to the results.
    * See JIRA workflow for details.
    * If failed, the contributors may ask for help understanding the failed criteria.
      * The comments section of the JIRA may be used for this purpose.  
      * If a meeting is required or desired, it's the responsibility of the contributor(s) to find a time that works and set the meeting up with the review team.  The regular Technical Council meeting ***will not*** be used for this purpose.
1. If applicable, the contributor(s) resolve all issues and request a re-review.  
    * See JIRA workflow for details.
