import { BaseSectionEvaluator } from './base/section-evaluator';
import { CriterionResult, EvaluationStatus, CriterionFunction } from '../../types';
import { LicenseUtils } from '../../utils/license-utils';
import { getDependencies, checkLicenseCompliance } from '../../utils/dependency-utils';
import { SHARED_CRITERIA } from '../../criteria-definitions';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Evaluator for Shared/Common criteria (S001-S014)
 * Handles shared requirements that apply to all FOLIO modules
 */
export class SharedEvaluator extends BaseSectionEvaluator {
  readonly sectionName = 'Shared/Common';
  readonly criteriaIds = Array.from(SHARED_CRITERIA);

  private evaluationMap: Map<string, CriterionFunction>;

  constructor() {
    super();
    this.evaluationMap = new Map<string, CriterionFunction>([
      ['S001', this.evaluateS001.bind(this)],
      ['S002', this.evaluateS002.bind(this)],
      ['S003', this.evaluateS003.bind(this)],
      ['S004', this.evaluateS004.bind(this)],
      ['S005', this.evaluateS005.bind(this)],
      ['S006', this.evaluateS006.bind(this)],
      ['S007', this.evaluateS007.bind(this)],
      ['S008', this.evaluateS008.bind(this)],
      ['S009', this.evaluateS009.bind(this)],
      ['S010', this.evaluateS010.bind(this)],
      ['S011', this.evaluateS011.bind(this)],
      ['S012', this.evaluateS012.bind(this)],
      ['S013', this.evaluateS013.bind(this)],
      ['S014', this.evaluateS014.bind(this)]
    ]);
  }

  /**
   * Evaluate specific shared criterion
   * @param criterionId The ID of the criterion to evaluate
   * @param repoPath Path to the cloned repository
   * @returns Promise<CriterionResult> Result of the specific criterion
   */
  protected async evaluateSpecificCriterion(criterionId: string, repoPath: string): Promise<CriterionResult> {
    const evaluator = this.evaluationMap.get(criterionId);
    if (!evaluator) {
      throw new Error(`Unknown shared criterion: ${criterionId}`);
    }
    return await evaluator(repoPath);
  }

  // STUB IMPLEMENTATIONS - Framework provides structure but evaluation logic not yet implemented
  // All methods below currently return MANUAL status and require detailed implementation
  // Future implementation will analyze repository files to determine PASS/FAIL status

  private async evaluateS001(repoPath: string): Promise<CriterionResult> {
    return await LicenseUtils.checkApache2License(repoPath, 'S001');
  }

  private async evaluateS002(_repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult('S002', 'Module descriptor validation - stub implementation');
  }

  private async evaluateS003(repoPath: string): Promise<CriterionResult> {
    try {
      // Extract dependencies from the repository
      const dependencies = await getDependencies(repoPath);
      
      if (dependencies.length === 0) {
        return {
          criterionId: 'S003',
          status: EvaluationStatus.MANUAL,
          evidence: 'No dependencies found or unable to extract dependency information',
          details: 'Could not analyze third-party dependencies. This may be due to build tool configuration issues or the repository not containing dependency information.'
        };
      }

      // Read README content for Category B license validation
      let readmeContent = '';
      const readmeFiles = ['README.md', 'README.txt', 'README', 'readme.md', 'readme.txt'];
      
      for (const readmeFile of readmeFiles) {
        const readmePath = path.join(repoPath, readmeFile);
        if (fs.existsSync(readmePath)) {
          readmeContent = fs.readFileSync(readmePath, 'utf-8');
          break;
        }
      }

      // Check license compliance according to ASF policy
      const complianceResult = checkLicenseCompliance(dependencies, readmeContent);
      
      // Generate evidence summary
      const dependencyCount = dependencies.length;
      const licenseInfo = dependencies
        .filter(d => d.licenses && d.licenses.length > 0)
        .map(d => `${d.name}:${d.version} (${d.licenses!.join(', ')})`)
        .join('; ');
      
      const evidence = `Found ${dependencyCount} dependencies. ` +
        (licenseInfo ? `Licenses: ${licenseInfo}` : 'No license information available for analysis.');

      if (complianceResult.compliant) {
        return {
          criterionId: 'S003',
          status: EvaluationStatus.PASS,
          evidence: evidence,
          details: 'All third-party dependencies comply with ASF 3rd Party License Policy. No Category X licenses found, and all Category B licenses are properly documented.'
        };
      } else {
        // Generate detailed compliance issues
        const issueDetails = complianceResult.issues
          .map(issue => `• ${issue.dependency.name}:${issue.dependency.version} - ${issue.reason}`)
          .join('\n');

        return {
          criterionId: 'S003',
          status: EvaluationStatus.FAIL,
          evidence: evidence,
          details: `Third-party license compliance issues found:\n${issueDetails}\n\nPlease resolve these issues according to ASF 3rd Party License Policy.`
        };
      }

    } catch (error) {
      console.warn('Error evaluating S003:', error);
      return {
        criterionId: 'S003',
        status: EvaluationStatus.MANUAL,
        evidence: 'Error occurred during dependency analysis',
        details: `Failed to analyze third-party license compliance: ${error instanceof Error ? error.message : 'Unknown error'}. Manual review required.`
      };
    }
  }

  private async evaluateS004(_repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult('S004', 'README file evaluation - stub implementation');
  }

  private async evaluateS005(_repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult('S005', 'Version control and branching strategy - stub implementation');
  }

  private async evaluateS006(_repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult('S006', 'Code quality and static analysis - stub implementation');
  }

  private async evaluateS007(_repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult('S007', 'Testing requirements - stub implementation');
  }

  private async evaluateS008(_repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult('S008', 'Documentation requirements - stub implementation');
  }

  private async evaluateS009(_repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult('S009', 'Security requirements - stub implementation');
  }

  private async evaluateS010(_repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult('S010', 'Performance requirements - stub implementation');
  }

  private async evaluateS011(_repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult('S011', 'Accessibility requirements - stub implementation');
  }

  private async evaluateS012(_repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult('S012', 'Internationalization requirements - stub implementation');
  }

  private async evaluateS013(_repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult('S013', 'Configuration management - stub implementation');
  }

  private async evaluateS014(_repoPath: string): Promise<CriterionResult> {
    return this.createManualReviewResult('S014', 'Monitoring and logging - stub implementation');
  }
}
