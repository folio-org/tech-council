import { JavaEvaluator } from '../evaluators/java-evaluator';
import { EvaluationStatus } from '../types';

// Mock fs-extra module with factory function
jest.mock('fs-extra', () => ({
  pathExists: jest.fn(),
  readFile: jest.fn()
}));

import * as fs from 'fs-extra';

describe('JavaEvaluator', () => {
  let evaluator: JavaEvaluator;
  const mockRepoPath = '/tmp/test-repo';
  const mockFs = fs as jest.Mocked<typeof fs>;

  beforeEach(() => {
    evaluator = new JavaEvaluator();
    jest.clearAllMocks();
  });

  describe('canEvaluate', () => {
    it('should return true for Maven projects', async () => {
      mockFs.pathExists.mockImplementation((filePath: any) => {
        return Promise.resolve(filePath.toString().endsWith('pom.xml'));
      });

      const result = await evaluator.canEvaluate(mockRepoPath);
      expect(result).toBe(true);
    });

    it('should return true for Gradle projects', async () => {
      mockFs.pathExists.mockImplementation((filePath: any) => {
        return Promise.resolve(filePath.toString().endsWith('build.gradle'));
      });

      const result = await evaluator.canEvaluate(mockRepoPath);
      expect(result).toBe(true);
    });

    it('should return false for non-Java projects', async () => {
      (mockFs.pathExists as jest.Mock).mockResolvedValue(false);

      const result = await evaluator.canEvaluate(mockRepoPath);
      expect(result).toBe(false);
    });
  });

  describe('getLanguage', () => {
    it('should return Java', () => {
      expect(evaluator.getLanguage()).toBe('Java');
    });
  });

  describe('evaluate', () => {
    it('should evaluate all applicable criteria sections', async () => {
      // Mock file system for basic repository structure
      mockFs.pathExists.mockImplementation((filePath: any) => {
        const pathStr = filePath.toString();
        return Promise.resolve(
          pathStr.endsWith('README.md') ||
          pathStr.endsWith('LICENSE') ||
          pathStr.endsWith('pom.xml')
        );
      });

      mockFs.readFile.mockImplementation((filePath: any) => {
        const pathStr = filePath.toString();
        if (pathStr.endsWith('LICENSE')) {
          return Promise.resolve('Apache License\nVersion 2.0');
        }
        if (pathStr.endsWith('README.md')) {
          return Promise.resolve('# Test Module\nThis is a FOLIO module for testing.');
        }
        return Promise.resolve('');
      });

//      (mockFs.readdir as jest.Mock).mockResolvedValue([]);

      const results = await evaluator.evaluate(mockRepoPath);
      
      // Should have results from all sections: Administrative (1) + Shared (14) + Backend (16) = 31 total
      expect(results.length).toBe(31);
      
      // Should have results for all major criterion categories
      const criterionIds = results.map(r => r.criterionId);
      expect(criterionIds).toContain('A001'); // Administrative
      expect(criterionIds).toContain('S001'); // Shared - License
      expect(criterionIds).toContain('S004'); // Shared - README
      expect(criterionIds).toContain('B001'); // Backend
      
      // Each result should have the required structure
      results.forEach(result => {
        expect(result).toHaveProperty('criterionId');
        expect(result).toHaveProperty('status');
        expect(result).toHaveProperty('evidence');
        expect(['pass', 'fail', 'manual']).toContain(result.status);
      });
    });

    it('should handle evaluation errors gracefully', async () => {
      // Mock fs to throw errors
      (mockFs.pathExists as jest.Mock).mockRejectedValue(new Error('File system error'));

      const results = await evaluator.evaluate(mockRepoPath);
      
      // Should still return results, even if some evaluations fail
      expect(Array.isArray(results)).toBe(true);
    });

    it('should return PASS for Apache 2.0 license in LICENSE file', async () => {
      // Setup mocks for Apache 2.0 license
      mockFs.pathExists.mockImplementation((filePath: any) => {
        const pathStr = filePath.toString();
        return Promise.resolve(
          pathStr.endsWith('LICENSE') ||
          pathStr.endsWith('README.md') ||
          pathStr.endsWith('pom.xml')
        );
      });

      mockFs.readFile.mockImplementation((filePath: any) => {
        const pathStr = filePath.toString();
        if (pathStr.endsWith('LICENSE')) {
          return Promise.resolve('Apache License\nVersion 2.0\nApache Software Foundation');
        }
        if (pathStr.endsWith('README.md')) {
          return Promise.resolve('# FOLIO Module\nInstallation instructions\nUsage guide\nAPI documentation');
        }
        if (pathStr.endsWith('pom.xml')) {
          return Promise.resolve('<project></project>');
        }
        return Promise.resolve('');
      });

//      (mockFs.readdir as jest.Mock).mockResolvedValue([]);

      const results = await evaluator.evaluate(mockRepoPath);

      // Find S001 criterion result
      const licenseResult = results.find(r => r.criterionId === 'S001');
      expect(licenseResult?.status).toBe(EvaluationStatus.PASS);
      expect(licenseResult?.evidence).toContain('Apache 2.0 license found in LICENSE');
    });

    it('should return FAIL for non-Apache license', async () => {
      // Setup mocks for MIT license
      mockFs.pathExists.mockImplementation((filePath: any) => {
        const pathStr = filePath.toString();
        return Promise.resolve(
          pathStr.endsWith('LICENSE') ||
          pathStr.endsWith('pom.xml')
        );
      });

      mockFs.readFile.mockImplementation((filePath: any) => {
        const pathStr = filePath.toString();
        if (pathStr.endsWith('LICENSE')) {
          return Promise.resolve('MIT License\nPermission is hereby granted');
        }
        if (pathStr.endsWith('pom.xml')) {
          return Promise.resolve('<project></project>');
        }
        return Promise.resolve('');
      });

//      (mockFs.readdir as jest.Mock).mockResolvedValue([]);

      const results = await evaluator.evaluate(mockRepoPath);

      // Find S001 criterion result
      const licenseResult = results.find(r => r.criterionId === 'S001');
      expect(licenseResult?.status).toBe(EvaluationStatus.FAIL);
      expect(licenseResult?.evidence).toContain('Non-Apache 2.0 license found');
    });

    it('should return FAIL for missing license', async () => {
      // Setup mocks with no license files
      mockFs.pathExists.mockImplementation((filePath: any) => {
        const pathStr = filePath.toString();
        return Promise.resolve(pathStr.endsWith('pom.xml'));
      });

      mockFs.readFile.mockImplementation((filePath: any) => {
        const pathStr = filePath.toString();
        if (pathStr.endsWith('pom.xml')) {
          return Promise.resolve('<project></project>');
        }
        return Promise.resolve('');
      });

//      (mockFs.readdir as jest.Mock).mockResolvedValue([]);

      const results = await evaluator.evaluate(mockRepoPath);

      // Find S001 criterion result
      const licenseResult = results.find(r => r.criterionId === 'S001');
      expect(licenseResult?.status).toBe(EvaluationStatus.FAIL);
      expect(licenseResult?.evidence).toContain('No Apache 2.0 license found');
    });

    it('should return PASS for Apache 2.0 license in pom.xml', async () => {
      // Setup mocks with Apache 2.0 license in pom.xml only
      mockFs.pathExists.mockImplementation((filePath: any) => {
        const pathStr = filePath.toString();
        return Promise.resolve(pathStr.endsWith('pom.xml'));
      });

      mockFs.readFile.mockImplementation((filePath: any) => {
        const pathStr = filePath.toString();
        if (pathStr.endsWith('pom.xml')) {
          return Promise.resolve(`
            <project>
              <licenses>
                <license>
                  <name>Apache License, Version 2.0</name>
                  <url>http://www.apache.org/licenses/LICENSE-2.0.txt</url>
                </license>
              </licenses>
            </project>
          `);
        }
        return Promise.resolve('');
      });

//      (mockFs.readdir as jest.Mock).mockResolvedValue([]);

      const results = await evaluator.evaluate(mockRepoPath);

      // Find S001 criterion result
      const licenseResult = results.find(r => r.criterionId === 'S001');
      expect(licenseResult?.status).toBe(EvaluationStatus.PASS);
      expect(licenseResult?.evidence).toContain('Apache 2.0 license found in pom.xml');
    });
  });
});
