import * as fs from 'fs-extra';
import * as path from 'path';
import { EvaluationResult, ReportOptions, EvaluationStatus } from '../types';

/**
 * Generates HTML and JSON reports from evaluation results
 */
export class ReportGenerator {
  private outputDir: string;

  constructor(outputDir: string = './reports') {
    this.outputDir = outputDir;
  }

  /**
   * Generate reports based on evaluation results
   * @param result Evaluation result
   * @param options Report generation options
   * @returns Promise<{ htmlPath?: string; jsonPath?: string }> Paths to generated reports
   */
  async generateReports(
    result: EvaluationResult, 
    options: ReportOptions = {}
  ): Promise<{ htmlPath?: string; jsonPath?: string }> {
    const outputDir = options.outputDir || this.outputDir;
    await fs.ensureDir(outputDir);

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const baseName = `${result.moduleName}-${timestamp}`;
    
    const paths: { htmlPath?: string; jsonPath?: string } = {};

    // Generate JSON report
    if (options.outputJson !== false) {
      const jsonPath = path.join(outputDir, `${baseName}.json`);
      await this.generateJsonReport(result, jsonPath);
      paths.jsonPath = jsonPath;
    }

    // Generate HTML report
    if (options.outputHtml !== false) {
      const htmlPath = path.join(outputDir, `${baseName}.html`);
      await this.generateHtmlReport(result, htmlPath);
      paths.htmlPath = htmlPath;
    }

    return paths;
  }

  /**
   * Generate JSON report
   * @param result Evaluation result
   * @param outputPath Path to save JSON report
   */
  private async generateJsonReport(result: EvaluationResult, outputPath: string): Promise<void> {
    const jsonContent = JSON.stringify(result, null, 2);
    await fs.writeFile(outputPath, jsonContent);
    console.log(`JSON report generated: ${outputPath}`);
  }

  /**
   * Generate HTML report
   * @param result Evaluation result
   * @param outputPath Path to save HTML report
   */
  private async generateHtmlReport(result: EvaluationResult, outputPath: string): Promise<void> {
    const htmlContent = this.generateHtmlContent(result);
    await fs.writeFile(outputPath, htmlContent);
    console.log(`HTML report generated: ${outputPath}`);
  }

  /**
   * Generate HTML content for the report
   * @param result Evaluation result
   * @returns string HTML content
   */
  private generateHtmlContent(result: EvaluationResult): string {
    const stats = this.calculateStats(result);
    
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FOLIO Module Evaluation Report - ${result.moduleName}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f5f5f5;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .header {
            background: #2c5282;
            color: white;
            padding: 20px;
        }
        
        .header h1 {
            margin: 0;
            font-size: 2rem;
        }
        
        .metadata {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-top: 15px;
        }
        
        .metadata-item {
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 4px;
        }
        
        .metadata-label {
            font-weight: bold;
            font-size: 0.9rem;
            opacity: 0.8;
        }
        
        .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 20px;
            padding: 20px;
            background: #f8f9fa;
        }
        
        .stat-card {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 8px;
            border-left: 4px solid;
        }
        
        .stat-card.pass { border-left-color: #28a745; }
        .stat-card.fail { border-left-color: #dc3545; }
        .stat-card.manual { border-left-color: #ffc107; }
        
        .stat-number {
            font-size: 2rem;
            font-weight: bold;
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: #6c757d;
            font-size: 0.9rem;
        }
        
        .criteria-section {
            padding: 20px;
        }
        
        .criteria-section h2 {
            color: #2c5282;
            border-bottom: 2px solid #e9ecef;
            padding-bottom: 10px;
        }
        
        .criterion {
            border: 1px solid #e9ecef;
            border-radius: 6px;
            margin-bottom: 15px;
            overflow: hidden;
        }
        
        .criterion-header {
            padding: 15px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .criterion-header.pass { background: #d4edda; color: #155724; }
        .criterion-header.fail { background: #f8d7da; color: #721c24; }
        .criterion-header.manual { background: #fff3cd; color: #856404; }
        
        .status-badge {
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: bold;
            text-transform: uppercase;
        }
        
        .status-badge.pass { background: #28a745; color: white; }
        .status-badge.fail { background: #dc3545; color: white; }
        .status-badge.manual { background: #ffc107; color: #212529; }
        
        .criterion-content {
            padding: 15px;
            background: #f8f9fa;
        }
        
        .criterion-description {
            margin-bottom: 10px;
            font-style: italic;
            color: #6c757d;
        }
        
        .evidence {
            background: white;
            padding: 10px;
            border-radius: 4px;
            border-left: 3px solid #007bff;
            margin-top: 10px;
        }
        
        .details {
            margin-top: 10px;
            font-size: 0.9rem;
            color: #6c757d;
        }
        
        .footer {
            padding: 20px;
            text-align: center;
            background: #f8f9fa;
            color: #6c757d;
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>FOLIO Module Evaluation Report</h1>
            <div class="metadata">
                <div class="metadata-item">
                    <div class="metadata-label">Module Name</div>
                    <div>${result.moduleName}</div>
                </div>
                <div class="metadata-item">
                    <div class="metadata-label">Language</div>
                    <div>${result.language}</div>
                </div>
                <div class="metadata-item">
                    <div class="metadata-label">Repository</div>
                    <div><a href="${result.repositoryUrl}" target="_blank" style="color: #87ceeb;">${result.repositoryUrl}</a></div>
                </div>
                <div class="metadata-item">
                    <div class="metadata-label">Evaluated At</div>
                    <div>${result.evaluatedAt.toLocaleString()}</div>
                </div>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-card pass">
                <div class="stat-number">${stats.pass}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card fail">
                <div class="stat-number">${stats.fail}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card manual">
                <div class="stat-number">${stats.manual}</div>
                <div class="stat-label">Manual Review</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${stats.total}</div>
                <div class="stat-label">Total Criteria</div>
            </div>
        </div>
        
        <div class="criteria-section">
            <h2>Evaluation Results</h2>
            ${this.generateCriteriaHtml(result)}
        </div>
        
        <div class="footer">
            Generated by FOLIO Module Evaluator | 
            Report created on ${new Date().toLocaleString()}
        </div>
    </div>
</body>
</html>
`;
  }

  /**
   * Generate HTML for criteria results
   * @param result Evaluation result
   * @returns string HTML content for criteria
   */
  private generateCriteriaHtml(result: EvaluationResult): string {
    return result.criteria.map(criterion => `
        <div class="criterion">
            <div class="criterion-header ${criterion.status}">
                <span class="status-badge ${criterion.status}">${criterion.status}</span>
                <span>Criterion ${criterion.criterionId}</span>
            </div>
            <div class="criterion-content">
                <div class="evidence">
                    <strong>Evidence:</strong> ${criterion.evidence}
                </div>
                ${criterion.details ? `<div class="details">${criterion.details}</div>` : ''}
            </div>
        </div>
    `).join('');
  }

  /**
   * Calculate statistics from evaluation results
   * @param result Evaluation result
   * @returns Stats object
   */
  private calculateStats(result: EvaluationResult): { pass: number; fail: number; manual: number; total: number } {
    const pass = result.criteria.filter(c => c.status === EvaluationStatus.PASS).length;
    const fail = result.criteria.filter(c => c.status === EvaluationStatus.FAIL).length;
    const manual = result.criteria.filter(c => c.status === EvaluationStatus.MANUAL).length;
    
    return {
      pass,
      fail,
      manual,
      total: result.criteria.length
    };
  }
}
