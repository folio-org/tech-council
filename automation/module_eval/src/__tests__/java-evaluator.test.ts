import { JavaEvaluator } from '../evaluators/java-evaluator';
import { EvaluationStatus } from '../types';
import * as fs from 'fs-extra';
import * as path from 'path';

// Mock fs-extra
jest.mock('fs-extra');
const mockFs = fs as jest.Mocked<typeof fs>;

describe('JavaEvaluator', () => {
  let evaluator: JavaEvaluator;
  const mockRepoPath = '/tmp/test-repo';

  beforeEach(() => {
    evaluator = new JavaEvaluator();
    jest.clearAllMocks();
  });

  describe('canEvaluate', () => {
    it('should return true for Maven projects', async () => {
      mockFs.pathExists.mockImplementation((filePath: string) => {
        return Promise.resolve(filePath.endsWith('pom.xml'));
      });

      const result = await evaluator.canEvaluate(mockRepoPath);
      expect(result).toBe(true);
    });

    it('should return true for Gradle projects', async () => {
      mockFs.pathExists.mockImplementation((filePath: string) => {
        return Promise.resolve(filePath.endsWith('build.gradle'));
      });

      const result = await evaluator.canEvaluate(mockRepoPath);
      expect(result).toBe(true);
    });

    it('should return false for non-Java projects', async () => {
      mockFs.pathExists.mockResolvedValue(false);

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
    it('should return manual status for unimplemented criteria', async () => {
      const mockCriteria = [
        {
          id: 'test-1',
          code: 'T001',
          description: 'Test criterion',
          section: 'Testing'
        }
      ];

      const results = await evaluator.evaluate(mockRepoPath, mockCriteria);
      
      expect(results).toHaveLength(1);
      expect(results[0].status).toBe(EvaluationStatus.MANUAL);
      expect(results[0].criterionId).toBe('test-1');
    });

    it('should pass README criterion when README exists', async () => {
      mockFs.pathExists.mockImplementation((filePath: string) => {
        return Promise.resolve(filePath.endsWith('README.md'));
      });

      const mockCriteria = [
        {
          id: 'readme-1',
          code: 'R001',
          description: 'Repository must contain a README file',
          section: 'Documentation'
        }
      ];

      const results = await evaluator.evaluate(mockRepoPath, mockCriteria);
      
      expect(results[0].status).toBe(EvaluationStatus.PASS);
      expect(results[0].evidence).toContain('README file found');
    });
  });
});
