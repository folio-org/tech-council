/**
 * Evaluation status for a criteria
 *
 * FRAMEWORK USAGE NOTES:
 * - PASS: Criterion automatically verified as meeting requirements
 * - FAIL: Criterion automatically verified as NOT meeting requirements
 * - MANUAL: Requires human review (current default for most stub implementations)
 *
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
  tempDir?: string;
  outputDir?: string;
  skipCleanup?: boolean;
  criteriaFilter?: string[];
}

/**
 * Function signature for individual criterion evaluation methods
 */
export type CriterionFunction = (repoPath: string) => Promise<CriterionResult>;

/**
 * Base interface for section-specific evaluators
 */
export interface SectionEvaluator {
  /**
   * The name of the section this evaluator handles
   */
  readonly sectionName: string;

  /**
   * Array of criterion IDs this evaluator handles
   */
  readonly criteriaIds: string[];

  /**
   * Evaluate all criteria in this section
   * @param repoPath Path to the cloned repository
   * @param criteriaFilter Optional array of criterion IDs to filter evaluation
   * @returns Promise<CriterionResult[]> Results of all criteria in this section
   */
  evaluate(repoPath: string, criteriaFilter?: string[]): Promise<CriterionResult[]>;

  /**
   * Evaluate a specific criterion by ID
   * @param criterionId The ID of the criterion to evaluate
   * @param repoPath Path to the cloned repository
   * @returns Promise<CriterionResult> Result of the specific criterion
   */
  evaluateCriterion(criterionId: string, repoPath: string): Promise<CriterionResult>;
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
   * Evaluate the repository against all applicable criteria
   * @param repoPath Path to the cloned repository
   * @param criteriaFilter Optional array of criterion IDs to filter evaluation
   * @returns Promise<CriterionResult[]> Results of the evaluation
   */
  evaluate(repoPath: string, criteriaFilter?: string[]): Promise<CriterionResult[]>;

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

/**
 * Represents a third-party dependency with its licenses
 */
export interface Dependency {
  name: string;
  version: string;
  // A dependency can have multiple licenses, or none declared
  licenses?: string[];
}

/**
 * Represents a compliance issue with a specific dependency
 */
export interface ComplianceIssue {
  dependency: Dependency;
  reason: string; // e.g., "License 'GPL-3.0' is in Category X", "Category B license not documented in README"
}

/**
 * Result of license compliance checking
 */
export interface ComplianceResult {
  compliant: boolean;
  issues: ComplianceIssue[];
}

/**
 * Configuration interfaces for external JSON files used by license policy
 */

/**
 * License categories configuration structure
 */
export interface LicenseCategoriesConfig {
  _description?: string;
  _reference?: string;
  categories: Record<string, string>;
}

/**
 * Special exceptions configuration structure
 */
export interface SpecialExceptionsConfig {
  _description?: string;
  _note?: string;
  exceptions: Array<{
    name: string;
    description: string;
    matchType: 'exact' | 'prefix';
  }>;
}

/**
 * License variations configuration structure
 */
export interface LicenseVariationsConfig {
  _description?: string;
  _source?: string;
  variations: Record<string, string>;
}
