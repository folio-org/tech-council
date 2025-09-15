import { GitUtils } from './utils/git';
import { CriteriaLoader } from './utils/criteria-loader';
import { JavaEvaluator } from './evaluators/java-evaluator';
import { LanguageEvaluator, EvaluationResult, EvaluationConfig, CriterionResult } from './types';
import * as path from 'path';

/**
 * Main orchestrator for module evaluation
 */
export class ModuleEvaluator {
  private gitUtils: GitUtils;
  private criteriaLoader: CriteriaLoader;
  private evaluators: LanguageEvaluator[];

  constructor(config: EvaluationConfig) {
    this.gitUtils = new GitUtils(config.tempDir);
    this.criteriaLoader = new CriteriaLoader(config.criteriaFilePath);
    
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
      
      // Load criteria
      const criteria = await this.criteriaLoader.loadCriteria();
      console.log(`Loaded ${criteria.length} criteria for evaluation`);
      
      // Determine appropriate evaluator
      const evaluator = await this.selectEvaluator(repoPath);
      if (!evaluator) {
        throw new Error('No suitable evaluator found for this repository');
      }
      
      console.log(`Using ${evaluator.getLanguage()} evaluator`);
      
      // Perform evaluation
      const criterionResults = await evaluator.evaluate(repoPath, criteria);
      
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
      // Clean up cloned repository
      if (repoPath) {
        await this.gitUtils.cleanup(repoPath);
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
}
