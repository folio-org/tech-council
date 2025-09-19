/**
 * Tests for dependency analysis utilities
 */

import { getDependencies, checkLicenseCompliance } from '../utils/dependency-utils';
import { LicenseCategory } from '../utils/license-policy';
import { Dependency, ComplianceResult } from '../types';
import * as fs from 'fs';
import * as path from 'path';

// Mock fs and child_process for testing
jest.mock('fs');
jest.mock('child_process');

const mockFs = fs as jest.Mocked<typeof fs>;

// Mock the license configuration loading
jest.mock('../utils/license-policy', () => {
  const actual = jest.requireActual('../utils/license-policy');
  return {
    ...actual,
    // Provide test configuration data
    getLicenseCategory: jest.fn((licenseName: string) => {
      const testCategories: Record<string, string> = {
        'Apache-2.0': 'A',
        'MIT': 'A',
        'BSD-2-Clause': 'A',
        'LGPL-2.1': 'B',
        'GPL-3.0': 'X'
      };
      return testCategories[licenseName];
    }),
    getLicenseCategoryNormalized: jest.fn((licenseName: string) => {
      const testCategories: Record<string, string> = {
        'Apache-2.0': 'A',
        'MIT': 'A',
        'BSD-2-Clause': 'A',
        'LGPL-2.1': 'B',
        'GPL-3.0': 'X'
      };
      return testCategories[licenseName];
    }),
    isSpecialException: jest.fn((dependencyName: string) => {
      return dependencyName === 'org.hibernate:hibernate-core' ||
             dependencyName === 'org.z3950.zing:cql-java' ||
             dependencyName.startsWith('org.hibernate');
    })
  };
});

describe('Dependency Utils', () => {

  describe('checkLicenseCompliance', () => {
    
    it('should pass with only Category A licenses', () => {
      const dependencies: Dependency[] = [
        {
          name: 'org.apache.commons:commons-lang3',
          version: '3.12.0',
          licenses: ['Apache-2.0']
        },
        {
          name: 'junit:junit',
          version: '4.13.2',
          licenses: ['MIT']
        }
      ];
      
      const readmeContent = 'This is a test README';
      const result = checkLicenseCompliance(dependencies, readmeContent);
      
      expect(result.compliant).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should fail with Category X licenses', () => {
      const dependencies: Dependency[] = [
        {
          name: 'some.gpl:library',
          version: '1.0.0',
          licenses: ['GPL-3.0']
        }
      ];
      
      const readmeContent = 'This is a test README';
      const result = checkLicenseCompliance(dependencies, readmeContent);
      
      expect(result.compliant).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].reason).toContain('Category X (prohibited)');
    });

    it('should fail with undocumented Category B licenses', () => {
      const dependencies: Dependency[] = [
        {
          name: 'some.lgpl:library',
          version: '1.0.0',
          licenses: ['LGPL-2.1']
        }
      ];
      
      const readmeContent = 'This is a test README without any license documentation';
      const result = checkLicenseCompliance(dependencies, readmeContent);
      
      expect(result.compliant).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].reason).toContain('not documented in README');
    });

    it('should pass with documented Category B licenses', () => {
      const dependencies: Dependency[] = [
        {
          name: 'some.lgpl:library',
          version: '1.0.0',
          licenses: ['LGPL-2.1']
        }
      ];
      
      const readmeContent = 'This project uses LGPL libraries that are properly documented.';
      const result = checkLicenseCompliance(dependencies, readmeContent);
      
      expect(result.compliant).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should handle special exceptions for Hibernate libraries', () => {
      const dependencies: Dependency[] = [
        {
          name: 'org.hibernate:hibernate-core',
          version: '5.6.0',
          licenses: ['LGPL-2.1']
        }
      ];
      
      const readmeContent = 'This README does not mention any license information';
      const result = checkLicenseCompliance(dependencies, readmeContent);
      
      expect(result.compliant).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].reason).toContain('special exception: org.hibernate:hibernate-core');
    });

    it('should handle special exceptions for CQL Java library', () => {
      const dependencies: Dependency[] = [
        {
          name: 'org.z3950.zing:cql-java',
          version: '1.13',
          licenses: ['LGPL-2.1']
        }
      ];
      
      const readmeContent = 'This README does not mention any license information';
      const result = checkLicenseCompliance(dependencies, readmeContent);
      
      expect(result.compliant).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].reason).toContain('special exception: org.z3950.zing:cql-java');
    });

    it('should handle dependencies with multiple licenses', () => {
      const dependencies: Dependency[] = [
        {
          name: 'dual.licensed:library',
          version: '1.0.0',
          licenses: ['Apache-2.0', 'MIT']
        }
      ];
      
      const readmeContent = 'This is a test README';
      const result = checkLicenseCompliance(dependencies, readmeContent);
      
      expect(result.compliant).toBe(true);
      expect(result.issues).toHaveLength(0);
    });

    it('should report issues for dependencies without license information', () => {
      const dependencies: Dependency[] = [
        {
          name: 'unknown:library',
          version: '1.0.0',
          licenses: undefined
        },
        {
          name: 'empty:library',
          version: '1.0.0',
          licenses: []
        }
      ];
      
      const readmeContent = 'This is a test README';
      const result = checkLicenseCompliance(dependencies, readmeContent);
      
      expect(result.compliant).toBe(false);
      expect(result.issues).toHaveLength(2);
      expect(result.issues[0].reason).toContain('No license information available');
      expect(result.issues[1].reason).toContain('No license information available');
    });

    it('should report issues for unknown licenses', () => {
      const dependencies: Dependency[] = [
        {
          name: 'custom:library',
          version: '1.0.0',
          licenses: ['Custom-License-1.0']
        }
      ];
      
      const readmeContent = 'This is a test README';
      const result = checkLicenseCompliance(dependencies, readmeContent);
      
      expect(result.compliant).toBe(false);
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0].reason).toContain('Unknown license \'Custom-License-1.0\'');
    });

  });

  describe('getDependencies', () => {
    
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return empty array when no build files found', async () => {
      mockFs.existsSync.mockReturnValue(false);
      
      const result = await getDependencies('/fake/path');
      
      expect(result).toEqual([]);
    });

    it('should handle errors gracefully', async () => {
      mockFs.existsSync.mockImplementation(() => {
        throw new Error('File system error');
      });
      
      const result = await getDependencies('/fake/path');
      
      expect(result).toEqual([]);
    });

  });

});
