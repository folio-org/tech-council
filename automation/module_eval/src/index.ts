// Main exports for the FOLIO Module Evaluator
// FRAMEWORK STATUS: Fully implemented components
export { ModuleEvaluator } from './module-evaluator';     // ✅ Core orchestration - IMPLEMENTED
export { ReportGenerator } from './utils/report-generator'; // ✅ HTML/JSON reports - IMPLEMENTED
export { GitUtils } from './utils/git';                    // ✅ Git operations - IMPLEMENTED

// Language-specific evaluators
// FRAMEWORK STATUS: Structure implemented, evaluation logic is stubbed
export { JavaEvaluator } from './evaluators/java-evaluator';  // ⚠️ Detection works, criteria are stubs

// Section-based evaluator framework classes
// FRAMEWORK STATUS: Architecture implemented, specific evaluations are stubbed
export { AdministrativeEvaluator } from './evaluators/java/administrative-evaluator'; // ⚠️ A001 - Manual only
export { SharedEvaluator } from './evaluators/java/shared-evaluator';                 // ⚠️ S001-S014 - Stubs
export { BackendEvaluator } from './evaluators/java/backend-evaluator';               // ⚠️ B001-B016 - Stubs
export { BaseSectionEvaluator } from './evaluators/java/base/section-evaluator';      // ✅ Framework - IMPLEMENTED

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
