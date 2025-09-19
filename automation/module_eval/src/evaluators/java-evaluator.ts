import * as fs from 'fs-extra';
import * as path from 'path';
import { LanguageEvaluator, CriterionResult } from '../types';
import { AdministrativeEvaluator } from './java/administrative-evaluator';
import { SharedEvaluator } from './java/shared-evaluator';
import { BackendEvaluator } from './java/backend-evaluator';

/**
 * Java-specific module evaluator
 * Uses composition of section-specific evaluators for comprehensive evaluation
 *
 * This evaluator provides the framework structure but individual criterion
 * evaluation methods need detailed implementation to analyze code and return
 * accurate PASS/FAIL results.
 */
export class JavaEvaluator implements LanguageEvaluator {
  private readonly administrativeEvaluator: AdministrativeEvaluator;
  private readonly sharedEvaluator: SharedEvaluator;
  private readonly backendEvaluator: BackendEvaluator;

  constructor() {
    this.administrativeEvaluator = new AdministrativeEvaluator();
    this.sharedEvaluator = new SharedEvaluator();
    this.backendEvaluator = new BackendEvaluator();
  }
  
  /**
   * Check if this evaluator can handle the repository
   * @param repoPath Path to the cloned repository
   * @returns Promise<boolean> true if this is a Java repository
   */
  async canEvaluate(repoPath: string): Promise<boolean> {
    // Check for Maven or Gradle build files
    const hasPomXml = await fs.pathExists(path.join(repoPath, 'pom.xml'));
    const hasBuildGradle = await fs.pathExists(path.join(repoPath, 'build.gradle')) ||
                          await fs.pathExists(path.join(repoPath, 'build.gradle.kts'));
    
    // Check for Java source files
    const hasJavaFiles = await this.hasJavaSourceFiles(repoPath);

    return hasPomXml || hasBuildGradle || hasJavaFiles;
  }

  /**
   * Evaluate the Java repository against all applicable criteria
   * @param repoPath Path to the cloned repository
   * @param criteriaFilter Optional array of criterion IDs to filter evaluation
   * @returns Promise<CriterionResult[]> Evaluation results
   */
  async evaluate(repoPath: string, criteriaFilter?: string[]): Promise<CriterionResult[]> {
    const results: CriterionResult[] = [];

    try {
      // Evaluate Administrative criteria (A001)
      const administrativeResults = await this.administrativeEvaluator.evaluate(repoPath, criteriaFilter);
      results.push(...administrativeResults);

      // Evaluate Shared/Common criteria (S001-S014)
      const sharedResults = await this.sharedEvaluator.evaluate(repoPath, criteriaFilter);
      results.push(...sharedResults);

      // Evaluate Backend criteria (B001-B016) for Java modules
      const backendResults = await this.backendEvaluator.evaluate(repoPath, criteriaFilter);
      results.push(...backendResults);

    } catch (error) {
      console.error('Error during Java evaluation:', error);
      // Continue with partial results rather than failing completely
    }

    return results;
  }

  /**
   * Get the language this evaluator handles
   */
  getLanguage(): string {
    return 'Java';
  }

  /**
   * Check if repository has Java source files
   * @param repoPath Path to repository
   * @returns Promise<boolean> true if Java files found
   */
  private async hasJavaSourceFiles(repoPath: string): Promise<boolean> {
    try {
      const srcDir = path.join(repoPath, 'src');
      if (await fs.pathExists(srcDir)) {
        return await this.searchForJavaFiles(srcDir);
      }
      return false;
    } catch (error) {
      return false;
    }
  }

  /**
   * Recursively search for Java files
   * @param dirPath Directory to search
   * @returns Promise<boolean> true if Java files found
   */
  private async searchForJavaFiles(dirPath: string): Promise<boolean> {
    try {
      const entries = await fs.readdir(dirPath, { withFileTypes: true });
      
      for (const entry of entries) {
        if (entry.isFile() && entry.name.endsWith('.java')) {
          return true;
        } else if (entry.isDirectory()) {
          const found = await this.searchForJavaFiles(path.join(dirPath, entry.name));
          if (found) return true;
        }
      }
      return false;
    } catch (error) {
      return false;
    }
  }
}
