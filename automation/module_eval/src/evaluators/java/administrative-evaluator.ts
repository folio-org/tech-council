import * as fs from 'fs-extra';
import * as path from 'path';
import { BaseSectionEvaluator } from './base/section-evaluator';
import { CriterionResult, EvaluationStatus, CriterionFunction } from '../../types';
import { ADMINISTRATIVE_CRITERIA } from '../../criteria-definitions';

/**
 * Evaluator for Administrative criteria (A001)
 * Handles administrative requirements for FOLIO modules
 */
export class AdministrativeEvaluator extends BaseSectionEvaluator {
  readonly sectionName = 'Administrative';
  readonly criteriaIds = Array.from(ADMINISTRATIVE_CRITERIA);

  private evaluationMap: Map<string, CriterionFunction>;

  constructor() {
    super();
    this.evaluationMap = new Map<string, CriterionFunction>([
      ['A001', this.evaluateA001.bind(this)]
    ]);
  }

  /**
   * Evaluate specific administrative criterion
   * @param criterionId The ID of the criterion to evaluate
   * @param repoPath Path to the cloned repository
   * @returns Promise<CriterionResult> Result of the specific criterion
   */
  protected async evaluateSpecificCriterion(criterionId: string, repoPath: string): Promise<CriterionResult> {
    const evaluator = this.evaluationMap.get(criterionId);
    if (!evaluator) {
      throw new Error(`Unknown administrative criterion: ${criterionId}`);
    }
    return await evaluator(repoPath);
  }

  /**
   * A001: Product Council evaluation
   * CURRENT STATUS: Manual review only - Product Council approval cannot be automatically verified
   * This criterion inherently requires human review as it involves administrative processes
   * @param repoPath Path to the cloned repository
   * @returns Promise<CriterionResult> Result of A001 evaluation (always MANUAL status)
   */
  private async evaluateA001(repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult(
      'A001',
      'Product Council approval verification requires manual review'
    );
  }
}
