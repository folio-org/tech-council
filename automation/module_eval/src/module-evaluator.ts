import { GitUtils } from './utils/git';
import { JavaEvaluator } from './evaluators/java-evaluator';
import { LanguageEvaluator, EvaluationResult, EvaluationConfig, CriterionResult } from './types';
import { getCriteriaForLanguage, isValidCriterionId } from './criteria-definitions';

/**
 * Main orchestrator for module evaluation
 *
 * This framework provides a complete evaluation pipeline but most criterion
 * evaluations currently return MANUAL status. Implementation of specific
 * evaluation logic is needed to provide automated PASS/FAIL results.
 */
export class ModuleEvaluator {
  private gitUtils: GitUtils;
  private evaluators: LanguageEvaluator[];
  private config: EvaluationConfig;

  constructor(config: EvaluationConfig) {
    this.config = config;
    this.gitUtils = new GitUtils(config.tempDir);

    // Register available evaluators
    this.evaluators = [
      new JavaEvaluator()
      // Additional evaluators can be added here in the future
    ];
  }

  /**
   * Evaluate a FOLIO module repository
   * @param repositoryUrl GitHub URL of the repository
   * @returns Promise<EvaluationResult> Complete evaluation result
   */
  async evaluateModule(repositoryUrl: string): Promise<EvaluationResult> {
    let repoPath = '';
    
    try {
      console.log(`Starting evaluation of: ${repositoryUrl}`);
      
      // Clone the repository
      repoPath = await this.gitUtils.cloneRepository(repositoryUrl);
      
      // Determine appropriate evaluator
      const evaluator = await this.selectEvaluator(repoPath);
      if (!evaluator) {
        throw new Error('No suitable evaluator found for this repository');
      }
      
      console.log(`Using ${evaluator.getLanguage()} evaluator`);

      // Validate criteria filter if provided
      if (this.config.criteriaFilter) {
        await this.validateCriteriaFilter(this.config.criteriaFilter, evaluator);
      }

      const criterionResults = await evaluator.evaluate(repoPath, this.config.criteriaFilter);
      
      // Get repository info
      const repoInfo = await this.gitUtils.getRepoInfo(repoPath);
      
      // Compile results
      const result: EvaluationResult = {
        repositoryUrl,
        moduleName: repoInfo.name,
        language: evaluator.getLanguage(),
        evaluatedAt: new Date(),
        criteria: criterionResults
      };
      
      console.log(`Evaluation completed. Results: ${this.summarizeResults(criterionResults)}`);
      return result;
      
    } finally {
      // Clean up cloned repository unless --no-cleanup was specified
      if (repoPath && !this.config.skipCleanup) {
        await this.gitUtils.cleanup(repoPath);
      } else if (repoPath && this.config.skipCleanup) {
        console.log(`Repository preserved at: ${repoPath}`);
      }
    }
  }

  /**
   * Select the appropriate evaluator for the repository
   * @param repoPath Path to the cloned repository
   * @returns Promise<LanguageEvaluator | null> Selected evaluator or null
   */
  private async selectEvaluator(repoPath: string): Promise<LanguageEvaluator | null> {
    for (const evaluator of this.evaluators) {
      if (await evaluator.canEvaluate(repoPath)) {
        return evaluator;
      }
    }
    return null;
  }

  /**
   * Summarize evaluation results
   * @param results Array of criterion results
   * @returns string Summary of results
   */
  private summarizeResults(results: CriterionResult[]): string {
    const pass = results.filter(r => r.status === 'pass').length;
    const fail = results.filter(r => r.status === 'fail').length;
    const manual = results.filter(r => r.status === 'manual').length;
    
    return `${pass} passed, ${fail} failed, ${manual} require manual review`;
  }

  /**
   * Add a new language evaluator
   * @param evaluator Language evaluator to add
   */
  addEvaluator(evaluator: LanguageEvaluator): void {
    this.evaluators.push(evaluator);
  }

  /**
   * Get list of supported languages
   * @returns string[] Array of supported language names
   */
  getSupportedLanguages(): string[] {
    return this.evaluators.map(evaluator => evaluator.getLanguage());
  }

  /**
   * Validate criteria filter against available criteria
   * @param criteriaFilter Array of criterion IDs to validate
   * @param evaluator The language evaluator being used
   */
  private async validateCriteriaFilter(criteriaFilter: string[], evaluator: LanguageEvaluator): Promise<void> {
    // Get available criteria IDs from the evaluator
    const availableCriteria = Array.from(getCriteriaForLanguage(evaluator.getLanguage()));

    // Check each criterion in the filter
    const invalidCriteria = criteriaFilter.filter(id => !availableCriteria.includes(id));

    if (invalidCriteria.length > 0) {
      throw new Error(
        `Invalid criterion IDs: ${invalidCriteria.join(', ')}\n` +
        `Available criteria for ${evaluator.getLanguage()}: ${availableCriteria.join(', ')}`
      );
    }
  }
}
