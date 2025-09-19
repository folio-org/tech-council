import { LicenseUtils } from '../utils/license-utils';
import { EvaluationStatus } from '../types';

// Mock fs-extra module
jest.mock('fs-extra', () => ({
  pathExists: jest.fn(),
  readFile: jest.fn()
}));

import * as fs from 'fs-extra';

describe('LicenseUtils', () => {
  const mockFs = {
    pathExists: fs.pathExists as jest.MockedFunction<typeof fs.pathExists>,
    readFile: fs.readFile as jest.MockedFunction<typeof fs.readFile>
  };
  const mockRepoPath = '/tmp/test-repo';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('checkApache2License', () => {
    it('should return PASS for Apache 2.0 license in LICENSE file', async () => {
      mockFs.pathExists.mockImplementation((filePath: any) => {
        return Promise.resolve(filePath.toString().endsWith('LICENSE'));
      });

      mockFs.readFile.mockImplementation((filePath: any) => {
        if (filePath.toString().endsWith('LICENSE')) {
          return Promise.resolve('Apache License\nVersion 2.0\nApache Software Foundation');
        }
        return Promise.resolve('');
      });

      const result = await LicenseUtils.checkApache2License(mockRepoPath, 'S001');

      expect(result.status).toBe(EvaluationStatus.PASS);
      expect(result.evidence).toContain('Apache 2.0 license found in LICENSE');
      expect(result.criterionId).toBe('S001');
    });

    it('should return FAIL for non-Apache license in LICENSE file', async () => {
      mockFs.pathExists.mockImplementation((filePath: any) => {
        return Promise.resolve(filePath.toString().endsWith('LICENSE'));
      });

      mockFs.readFile.mockImplementation((filePath: any) => {
        if (filePath.toString().endsWith('LICENSE')) {
          return Promise.resolve('MIT License\nPermission is hereby granted');
        }
        return Promise.resolve('');
      });

      const result = await LicenseUtils.checkApache2License(mockRepoPath, 'S001');

      expect(result.status).toBe(EvaluationStatus.FAIL);
      expect(result.evidence).toContain('Non-Apache 2.0 license found in LICENSE');
      expect(result.criterionId).toBe('S001');
    });

    it('should return PASS for Apache 2.0 license in pom.xml when no LICENSE file', async () => {
      mockFs.pathExists.mockImplementation((filePath: any) => {
        return Promise.resolve(filePath.toString().endsWith('pom.xml'));
      });

      mockFs.readFile.mockImplementation((filePath: any) => {
        if (filePath.toString().endsWith('pom.xml')) {
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

      const result = await LicenseUtils.checkApache2License(mockRepoPath, 'S001');

      expect(result.status).toBe(EvaluationStatus.PASS);
      expect(result.evidence).toContain('Apache 2.0 license found in pom.xml');
      expect(result.criterionId).toBe('S001');
    });

    it('should return FAIL when no license found anywhere', async () => {
      (mockFs.pathExists as any).mockResolvedValue(false);

      const result = await LicenseUtils.checkApache2License(mockRepoPath, 'S001');

      expect(result.status).toBe(EvaluationStatus.FAIL);
      expect(result.evidence).toContain('No Apache 2.0 license found');
      expect(result.criterionId).toBe('S001');
    });

    it('should return MANUAL when file system error occurs', async () => {
      (mockFs.pathExists as any).mockRejectedValue(new Error('File system error'));

      const result = await LicenseUtils.checkApache2License(mockRepoPath, 'S001');

      expect(result.status).toBe(EvaluationStatus.MANUAL);
      expect(result.evidence).toContain('License evaluation failed');
      expect(result.criterionId).toBe('S001');
    });
  });

  describe('checkLicenseFiles', () => {
    it('should detect Apache 2.0 license in LICENSE file', async () => {
      mockFs.pathExists.mockImplementation((filePath: any) => {
        return Promise.resolve(filePath.toString().endsWith('LICENSE'));
      });

      (mockFs.readFile as any).mockResolvedValue('Apache License\nVersion 2.0');

      const result = await LicenseUtils.checkLicenseFiles(mockRepoPath);

      expect(result).not.toBeNull();
      expect(result!.found).toBe(true);
      expect(result!.isApache2).toBe(true);
      expect(result!.source).toBe('LICENSE');
    });

    it('should detect non-Apache license in LICENSE.txt file', async () => {
      mockFs.pathExists.mockImplementation((filePath: any) => {
        return Promise.resolve(filePath.toString().endsWith('LICENSE.txt'));
      });

      (mockFs.readFile as any).mockResolvedValue('MIT License');

      const result = await LicenseUtils.checkLicenseFiles(mockRepoPath);

      expect(result).not.toBeNull();
      expect(result!.found).toBe(true);
      expect(result!.isApache2).toBe(false);
      expect(result!.source).toBe('LICENSE.txt');
    });

    it('should return null when no license files found', async () => {
      (mockFs.pathExists as any).mockResolvedValue(false);

      const result = await LicenseUtils.checkLicenseFiles(mockRepoPath);

      expect(result).toBeNull();
    });
  });

  describe('checkMavenLicense', () => {
    it('should detect Apache 2.0 license in pom.xml', async () => {
      mockFs.pathExists.mockImplementation((filePath: any) => {
        return Promise.resolve(filePath.toString().endsWith('pom.xml'));
      });

      mockFs.readFile.mockImplementation((filePath: any) => {
        if (filePath.toString().endsWith('pom.xml')) {
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

      const result = await LicenseUtils.checkMavenLicense(mockRepoPath);

      expect(result).not.toBeNull();
      expect(result!.found).toBe(true);
      expect(result!.isApache2).toBe(true);
      expect(result!.source).toBe('pom.xml');
    });

    it('should detect non-Apache license in pom.xml', async () => {
      mockFs.pathExists.mockImplementation((filePath: any) => {
        return Promise.resolve(filePath.toString().endsWith('pom.xml'));
      });

      mockFs.readFile.mockImplementation((filePath: any) => {
        if (filePath.toString().endsWith('pom.xml')) {
          return Promise.resolve(`
            <project>
              <licenses>
                <license>
                  <name>MIT License</name>
                  <url>https://opensource.org/licenses/MIT</url>
                </license>
              </licenses>
            </project>
          `);
        }
        return Promise.resolve('');
      });

      const result = await LicenseUtils.checkMavenLicense(mockRepoPath);

      expect(result).not.toBeNull();
      expect(result!.found).toBe(true);
      expect(result!.isApache2).toBe(false);
      expect(result!.source).toBe('pom.xml');
      expect(result!.details).toContain('MIT License');
    });

    it('should return null when no pom.xml exists', async () => {
      (mockFs.pathExists as any).mockResolvedValue(false);

      const result = await LicenseUtils.checkMavenLicense(mockRepoPath);

      expect(result).toBeNull();
    });

    it('should return null when pom.xml has no licenses section', async () => {
      mockFs.pathExists.mockImplementation((filePath: any) => {
        return Promise.resolve(filePath.toString().endsWith('pom.xml'));
      });

      mockFs.readFile.mockImplementation((filePath: any) => {
        if (filePath.toString().endsWith('pom.xml')) {
          return Promise.resolve('<project></project>');
        }
        return Promise.resolve('');
      });

      const result = await LicenseUtils.checkMavenLicense(mockRepoPath);

      expect(result).toBeNull();
    });

    it('should return null when pom.xml is malformed', async () => {
      mockFs.pathExists.mockImplementation((filePath: any) => {
        return Promise.resolve(filePath.toString().endsWith('pom.xml'));
      });

      mockFs.readFile.mockImplementation((filePath: any) => {
        if (filePath.toString().endsWith('pom.xml')) {
          return Promise.resolve('invalid xml content');
        }
        return Promise.resolve('');
      });

      const result = await LicenseUtils.checkMavenLicense(mockRepoPath);

      expect(result).toBeNull();
    });
  });

  describe('isApache2License', () => {
    it('should detect standard Apache 2.0 license text', () => {
      const licenseText = 'Apache License\\nVersion 2.0\\nApache Software Foundation';
      expect(LicenseUtils.isApache2License(licenseText)).toBe(true);
    });

    it('should detect Apache-2.0 identifier', () => {
      const licenseText = 'Licensed under Apache-2.0';
      expect(LicenseUtils.isApache2License(licenseText)).toBe(true);
    });

    it('should detect case-insensitive Apache license', () => {
      const licenseText = 'APACHE LICENSE\\nversion 2.0';
      expect(LicenseUtils.isApache2License(licenseText)).toBe(true);
    });

    it('should reject MIT license', () => {
      const licenseText = 'MIT License\\nPermission is hereby granted';
      expect(LicenseUtils.isApache2License(licenseText)).toBe(false);
    });

    it('should reject Apache 1.1 license', () => {
      const licenseText = 'Apache Software License, Version 1.1';
      expect(LicenseUtils.isApache2License(licenseText)).toBe(false);
    });
  });

  describe('isApache2LicenseDeclaration', () => {
    it('should detect Apache 2.0 in license name', () => {
      expect(LicenseUtils.isApache2LicenseDeclaration('Apache License, Version 2.0', '')).toBe(true);
    });

    it('should detect Apache 2.0 in license URL', () => {
      expect(LicenseUtils.isApache2LicenseDeclaration('', 'http://www.apache.org/licenses/LICENSE-2.0')).toBe(true);
    });

    it('should detect apache-2.0 in name', () => {
      expect(LicenseUtils.isApache2LicenseDeclaration('apache-2.0', '')).toBe(true);
    });

    it('should reject MIT license declaration', () => {
      expect(LicenseUtils.isApache2LicenseDeclaration('MIT License', 'https://opensource.org/licenses/MIT')).toBe(false);
    });

    it('should reject Apache 1.1 license declaration', () => {
      expect(LicenseUtils.isApache2LicenseDeclaration('Apache Software License, Version 1.1', '')).toBe(false);
    });
  });
});