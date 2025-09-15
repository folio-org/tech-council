/**
 * Evaluation status for a criteria
 */
export enum EvaluationStatus {
  PASS = 'pass',
  FAIL = 'fail',
  MANUAL = 'manual'
}

/**
 * A single criterion from the acceptance criteria
 */
export interface Criterion {
  id: string;
  code: string;
  description: string;
  section: string;
}

/**
 * Result of evaluating a single criterion
 */
export interface CriterionResult {
  criterionId: string;
  status: EvaluationStatus;
  evidence: string;
  details?: string;
}

/**
 * Complete evaluation result for a module
 */
export interface EvaluationResult {
  repositoryUrl: string;
  moduleName: string;
  language: string;
  evaluatedAt: Date;
  criteria: CriterionResult[];
}

/**
 * Configuration for the evaluation process
 */
export interface EvaluationConfig {
  criteriaFilePath: string;
  tempDir?: string;
  outputDir?: string;
}

/**
 * Interface for language-specific evaluators
 */
export interface LanguageEvaluator {
  /**
   * Determine if this evaluator can handle the given repository
   * @param repoPath Path to the cloned repository
   * @returns Promise<boolean> true if this evaluator can handle the repo
   */
  canEvaluate(repoPath: string): Promise<boolean>;

  /**
   * Evaluate the repository against the applicable criteria
   * @param repoPath Path to the cloned repository
   * @param criteria Array of criteria to evaluate
   * @returns Promise<CriterionResult[]> Results of the evaluation
   */
  evaluate(repoPath: string, criteria: Criterion[]): Promise<CriterionResult[]>;

  /**
   * Get the language this evaluator handles
   */
  getLanguage(): string;
}

/**
 * Report generation options
 */
export interface ReportOptions {
  outputHtml?: boolean;
  outputJson?: boolean;
  outputDir?: string;
}
