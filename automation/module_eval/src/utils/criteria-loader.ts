import * as fs from 'fs-extra';
import { Criterion } from '../types';

/**
 * Loads and parses criteria from the MODULE_ACCEPTANCE_CRITERIA.md file
 */
export class CriteriaLoader {
  private criteriaFilePath: string;

  constructor(criteriaFilePath: string) {
    this.criteriaFilePath = criteriaFilePath;
  }

  /**
   * Load criteria from the markdown file
   * @returns Promise<Criterion[]> Array of criteria
   */
  async loadCriteria(): Promise<Criterion[]> {
    if (!await fs.pathExists(this.criteriaFilePath)) {
      throw new Error(`Criteria file not found: ${this.criteriaFilePath}`);
    }

    const content = await fs.readFile(this.criteriaFilePath, 'utf-8');
    return this.parseCriteria(content);
  }

  /**
   * Parse criteria from markdown content
   * @param content Markdown content
   * @returns Criterion[] Array of parsed criteria
   */
  private parseCriteria(content: string): Criterion[] {
    const criteria: Criterion[] = [];
    const lines = content.split('\n');
    
    let currentSection = '';
    let criterionCounter = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Track current section (headers)
      if (line.startsWith('#')) {
        currentSection = line.replace(/^#+\s*/, '').trim();
        continue;
      }

      // Look for criteria items (numbered lists or bullet points that look like criteria)
      if (this.isCriterionLine(line)) {
        const description = this.extractDescription(line);
        if (description) {
          const criterion: Criterion = {
            id: `criterion-${criterionCounter}`,
            code: this.generateCode(currentSection, criterionCounter),
            description: description,
            section: currentSection
          };
          criteria.push(criterion);
          criterionCounter++;
        }
      }
    }

    return criteria;
  }

  /**
   * Check if a line represents a criterion
   * @param line Line to check
   * @returns boolean true if line is a criterion
   */
  private isCriterionLine(line: string): boolean {
    // Match numbered lists, bullet points, or lines that start with criteria patterns
    return /^\s*(\d+\.|-|\*|\w+\.)\s+/.test(line) && 
           line.length > 10 && // Ensure it's substantial content
           !line.toLowerCase().includes('table of contents') &&
           !line.toLowerCase().includes('overview');
  }

  /**
   * Extract description from a criterion line
   * @param line Line containing criterion
   * @returns string|null Extracted description
   */
  private extractDescription(line: string): string | null {
    // Remove list markers (numbers, bullets, etc.)
    const cleaned = line.replace(/^\s*(\d+\.|-|\*|\w+\.)\s*/, '').trim();
    
    // Return null for very short or empty descriptions
    if (cleaned.length < 5) {
      return null;
    }

    return cleaned;
  }

  /**
   * Generate a code for the criterion
   * @param section Section name
   * @param counter Criterion counter
   * @returns string Generated code
   */
  private generateCode(section: string, counter: number): string {
    // Generate code based on section and counter
    const sectionPrefix = section
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .substring(0, 3) || 'GEN';
    
    return `${sectionPrefix}${counter.toString().padStart(3, '0')}`;
  }

  /**
   * Get criteria filtered by section
   * @param sectionName Section to filter by
   * @returns Promise<Criterion[]> Filtered criteria
   */
  async getCriteriaBySection(sectionName: string): Promise<Criterion[]> {
    const allCriteria = await this.loadCriteria();
    return allCriteria.filter(criterion => 
      criterion.section.toLowerCase().includes(sectionName.toLowerCase())
    );
  }
}
