import { SectionEvaluator, CriterionResult, EvaluationStatus } from '../../../types';

/**
 * Abstract base class for section-specific evaluators
 * Provides common evaluation infrastructure for all section evaluators
 */
export abstract class BaseSectionEvaluator implements SectionEvaluator {
  /**
   * The name of the section this evaluator handles
   */
  abstract readonly sectionName: string;

  /**
   * Array of criterion IDs this evaluator handles
   */
  abstract readonly criteriaIds: string[];

  /**
   * Evaluate all criteria in this section
   * @param repoPath Path to the cloned repository
   * @param criteriaFilter Optional array of criterion IDs to filter evaluation
   * @returns Promise<CriterionResult[]> Results of all criteria in this section
   */
  async evaluate(repoPath: string, criteriaFilter?: string[]): Promise<CriterionResult[]> {
    const results: CriterionResult[] = [];

    // Determine which criteria to evaluate
    const criteriaToEvaluate = criteriaFilter
      ? this.criteriaIds.filter(id => criteriaFilter.includes(id))
      : this.criteriaIds;

    for (const criterionId of criteriaToEvaluate) {
      try {
        const result = await this.evaluateCriterion(criterionId, repoPath);
        results.push(result);
      } catch (error) {
        // If evaluation fails, create a manual review result
        results.push(this.createErrorResult(criterionId, error));
      }
    }

    return results;
  }

  /**
   * Evaluate a specific criterion by ID
   * @param criterionId The ID of the criterion to evaluate
   * @param repoPath Path to the cloned repository
   * @returns Promise<CriterionResult> Result of the specific criterion
   */
  async evaluateCriterion(criterionId: string, repoPath: string): Promise<CriterionResult> {
    // Check if this evaluator handles the criterion
    if (!this.criteriaIds.includes(criterionId)) {
      throw new Error(`Criterion ${criterionId} is not handled by ${this.sectionName} evaluator`);
    }

    // Delegate to the specific evaluation method
    return await this.evaluateSpecificCriterion(criterionId, repoPath);
  }

  /**
   * Abstract method to be implemented by specific evaluators
   * @param criterionId The ID of the criterion to evaluate
   * @param repoPath Path to the cloned repository
   * @returns Promise<CriterionResult> Result of the specific criterion
   */
  protected abstract evaluateSpecificCriterion(criterionId: string, repoPath: string): Promise<CriterionResult>;

  /**
   * Create a standardized result object
   * @param criterionId The ID of the criterion
   * @param status The evaluation status
   * @param evidence Evidence for the evaluation
   * @param details Optional additional details
   * @returns CriterionResult The standardized result
   */
  protected createResult(
    criterionId: string,
    status: EvaluationStatus,
    evidence: string,
    details?: string
  ): CriterionResult {
    return {
      criterionId,
      status,
      evidence,
      details
    };
  }

  /**
   * Create an error result when evaluation fails
   * @param criterionId The ID of the criterion
   * @param error The error that occurred
   * @returns CriterionResult The error result
   */
  protected createErrorResult(criterionId: string, error: any): CriterionResult {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return this.createResult(
      criterionId,
      EvaluationStatus.MANUAL,
      `Evaluation failed: ${errorMessage}`,
      'Manual review required due to evaluation error'
    );
  }

  /**
   * Create a manual review result for criteria that require human evaluation
   * @param criterionId The ID of the criterion
   * @param reason Reason why manual review is needed
   * @returns CriterionResult The manual review result
   */
  protected createManualReviewResult(criterionId: string, reason: string): CriterionResult {
    return this.createResult(
      criterionId,
      EvaluationStatus.MANUAL,
      reason,
      'This criterion requires manual evaluation by a human reviewer'
    );
  }
}
