// Main exports for the FOLIO Module Evaluator
export { ModuleEvaluator } from './module-evaluator';
export { ReportGenerator } from './utils/report-generator';
export { GitUtils } from './utils/git';

// Language-specific evaluators
export { JavaEvaluator } from './evaluators/java-evaluator';

// Section-based evaluator framework classes
export { AdministrativeEvaluator } from './evaluators/java/administrative-evaluator';
export { SharedEvaluator } from './evaluators/java/shared-evaluator';
export { BackendEvaluator } from './evaluators/java/backend-evaluator';
export { BaseSectionEvaluator } from './evaluators/java/base/section-evaluator';

// Export types
export {
  EvaluationStatus,
  Criterion,
  CriterionResult,
  EvaluationResult,
  EvaluationConfig,
  LanguageEvaluator,
  SectionEvaluator,
  CriterionFunction,
  ReportOptions
} from './types';
