import * as fs from 'fs-extra';
import * as path from 'path';
import { LanguageEvaluator, Criterion, CriterionResult, EvaluationStatus } from '../types';

/**
 * Java-specific module evaluator
 */
export class JavaEvaluator implements LanguageEvaluator {
  
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
   * Evaluate the Java repository against criteria
   * @param repoPath Path to the cloned repository
   * @param criteria Array of criteria to evaluate
   * @returns Promise<CriterionResult[]> Evaluation results
   */
  async evaluate(repoPath: string, criteria: Criterion[]): Promise<CriterionResult[]> {
    const results: CriterionResult[] = [];

    for (const criterion of criteria) {
      const result = await this.evaluateCriterion(repoPath, criterion);
      results.push(result);
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

  /**
   * Evaluate a single criterion (stubbed for now)
   * @param repoPath Path to repository
   * @param criterion Criterion to evaluate
   * @returns Promise<CriterionResult> Result of evaluation
   */
  private async evaluateCriterion(repoPath: string, criterion: Criterion): Promise<CriterionResult> {
    // This is where specific criterion logic would be implemented
    // For now, return stubbed results based on criterion type
    
    const result: CriterionResult = {
      criterionId: criterion.id,
      status: EvaluationStatus.MANUAL,
      evidence: 'Evaluation not yet implemented',
      details: `This criterion (${criterion.code}) requires manual review. Framework is in place for future implementation.`
    };

    // Add some basic checks for demonstration
    if (criterion.description.toLowerCase().includes('readme')) {
      const hasReadme = await fs.pathExists(path.join(repoPath, 'README.md')) ||
                       await fs.pathExists(path.join(repoPath, 'readme.md')) ||
                       await fs.pathExists(path.join(repoPath, 'README.txt'));
      
      if (hasReadme) {
        result.status = EvaluationStatus.PASS;
        result.evidence = 'README file found in repository root';
        result.details = 'Repository contains a README file as required';
      } else {
        result.status = EvaluationStatus.FAIL;
        result.evidence = 'No README file found in repository root';
        result.details = 'Repository should contain a README file';
      }
    } else if (criterion.description.toLowerCase().includes('license')) {
      const hasLicense = await fs.pathExists(path.join(repoPath, 'LICENSE')) ||
                        await fs.pathExists(path.join(repoPath, 'LICENSE.txt')) ||
                        await fs.pathExists(path.join(repoPath, 'LICENSE.md'));
      
      if (hasLicense) {
        result.status = EvaluationStatus.PASS;
        result.evidence = 'LICENSE file found in repository root';
        result.details = 'Repository contains a LICENSE file';
      } else {
        result.status = EvaluationStatus.FAIL;
        result.evidence = 'No LICENSE file found in repository root';
        result.details = 'Repository should contain a LICENSE file';
      }
    } else if (criterion.description.toLowerCase().includes('pom.xml') || 
              criterion.description.toLowerCase().includes('maven')) {
      const hasPom = await fs.pathExists(path.join(repoPath, 'pom.xml'));
      
      if (hasPom) {
        result.status = EvaluationStatus.PASS;
        result.evidence = 'pom.xml file found in repository root';
        result.details = 'Maven project structure detected';
      } else {
        result.status = EvaluationStatus.MANUAL;
        result.evidence = 'No pom.xml found - may be Gradle project';
        result.details = 'Manual review needed for build configuration';
      }
    }

    return result;
  }
}
