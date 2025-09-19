/**
 * Dependency analysis utilities for extracting and analyzing third-party dependencies
 * from Maven and Gradle projects.
 * 
 * SECURITY WARNING: This module executes build commands on untrusted repositories.
 * Ensure proper sandboxing and consider security implications in production use.
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import { parseString } from 'xml2js';
import { Dependency, ComplianceResult, ComplianceIssue } from '../types';
import {
  LicenseCategory,
  getLicenseCategory,
  getLicenseCategoryNormalized,
  isSpecialException,
  isLicenseInCategory
} from './license-policy';

const execAsync = promisify(exec);
const parseXmlAsync = promisify(parseString);

/**
 * Extract dependencies from a repository using available build tools
 * @param repoPath Path to the cloned repository
 * @returns Promise<Dependency[]> Array of dependencies with license information
 */
export async function getDependencies(repoPath: string): Promise<Dependency[]> {
  const dependencies: Dependency[] = [];
  
  try {
    // Check for Maven project
    if (await hasMavenProject(repoPath)) {
      const mavenDeps = await getMavenDependencies(repoPath);
      dependencies.push(...mavenDeps);
    }
    
    // Check for Gradle project
    if (await hasGradleProject(repoPath)) {
      const gradleDeps = await getGradleDependencies(repoPath);
      dependencies.push(...gradleDeps);
    }
    
    // Remove duplicates based on name and version
    return deduplicateDependencies(dependencies);
    
  } catch (error) {
    console.warn(`Error extracting dependencies from ${repoPath}:`, error);
    return [];
  }
}

/**
 * Check license compliance for dependencies according to ASF policy
 * @param dependencies Array of dependencies to check
 * @param readmeContent Content of the README file for Category B validation
 * @returns ComplianceResult with compliance status and any issues found
 */
export function checkLicenseCompliance(
  dependencies: Dependency[], 
  readmeContent: string
): ComplianceResult {
  const issues: ComplianceIssue[] = [];
  
  for (const dependency of dependencies) {
    // Skip dependencies without license information
    if (!dependency.licenses || dependency.licenses.length === 0) {
      issues.push({
        dependency,
        reason: 'No license information available'
      });
      continue;
    }
    
    // Check each license for the dependency
    for (const license of dependency.licenses) {
      // Try normalized license lookup first for better matching
      const category = getLicenseCategoryNormalized(license);

      if (!category) {
        // Unknown license even after normalization
        issues.push({
          dependency,
          reason: `Unknown license '${license}' - requires manual review`
        });
      } else if (category === LicenseCategory.X) {
        // Category X - prohibited
        issues.push({
          dependency,
          reason: `License '${license}' is in Category X (prohibited)`
        });
      } else if (category === LicenseCategory.B) {
        // Category B - requires documentation
        if (!isDocumentedInReadme(dependency, readmeContent)) {
          // Check for special exceptions
          if (isSpecialException(dependency.name)) {
            // Special exception but still needs documentation
            issues.push({
              dependency,
              reason: `Category B license '${license}' not documented in README (special exception: ${dependency.name})`
            });
          } else {
            issues.push({
              dependency,
              reason: `Category B license '${license}' not documented in README`
            });
          }
        }
      }
      // Category A licenses are automatically compliant
    }
  }
  
  return {
    compliant: issues.length === 0,
    issues
  };
}

/**
 * Check if a Maven project exists in the repository
 */
async function hasMavenProject(repoPath: string): Promise<boolean> {
  return fs.existsSync(path.join(repoPath, 'pom.xml'));
}

/**
 * Check if a Gradle project exists in the repository
 */
async function hasGradleProject(repoPath: string): Promise<boolean> {
  return fs.existsSync(path.join(repoPath, 'build.gradle')) ||
         fs.existsSync(path.join(repoPath, 'build.gradle.kts'));
}

/**
 * Extract dependencies from Maven project using license plugin
 */
async function getMavenDependencies(repoPath: string): Promise<Dependency[]> {
  try {
    // Execute Maven license plugin to generate third-party report
    const { stdout } = await execAsync(
      'mvn license:add-third-party -Dlicense.outputDirectory=target/licenses -Dlicense.includeTransitiveDependencies=false',
      { 
        cwd: repoPath,
        timeout: 60000 // 60 second timeout
      }
    );
    
    console.log('Maven license plugin output:', stdout);
    
    // Parse the generated THIRD-PARTY.txt file
    const thirdPartyFile = path.join(repoPath, 'target', 'licenses', 'THIRD-PARTY.txt');
    
    if (fs.existsSync(thirdPartyFile)) {
      const content = fs.readFileSync(thirdPartyFile, 'utf-8');
      return parseMavenThirdPartyFile(content);
    }
    
    // Fallback: try to parse dependency:list output
    const { stdout: depsOutput } = await execAsync(
      'mvn dependency:list -DoutputFile=target/dependencies.txt',
      { cwd: repoPath, timeout: 60000 }
    );
    
    return parseMavenDependencyList(depsOutput);
    
  } catch (error) {
    console.warn('Failed to extract Maven dependencies:', error);
    return [];
  }
}

/**
 * Extract dependencies from Gradle project using license plugin
 */
async function getGradleDependencies(repoPath: string): Promise<Dependency[]> {
  try {
    // Try to use Gradle license report plugin if available
    const { stdout } = await execAsync(
      './gradlew generateLicenseReport || gradle generateLicenseReport',
      { 
        cwd: repoPath,
        timeout: 60000
      }
    );
    
    console.log('Gradle license plugin output:', stdout);
    
    // Look for generated license report
    const licenseReport = path.join(repoPath, 'build', 'reports', 'dependency-license', 'index.json');
    
    if (fs.existsSync(licenseReport)) {
      const content = fs.readFileSync(licenseReport, 'utf-8');
      return parseGradleLicenseReport(content);
    }
    
    // Fallback: use dependencies task
    const { stdout: depsOutput } = await execAsync(
      './gradlew dependencies --configuration runtimeClasspath || gradle dependencies',
      { cwd: repoPath, timeout: 60000 }
    );
    
    return parseGradleDependencies(depsOutput);
    
  } catch (error) {
    console.warn('Failed to extract Gradle dependencies:', error);
    return [];
  }
}

/**
 * Parse Maven THIRD-PARTY.txt file format
 * Expected format: (License Name) Artifact Name (groupId:artifactId:version - URL)
 */
function parseMavenThirdPartyFile(content: string): Dependency[] {
  const dependencies: Dependency[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    // Skip empty lines and headers
    if (!trimmedLine || trimmedLine.startsWith('Lists of') || !trimmedLine.startsWith('(')) {
      continue;
    }

    // Parse format: (License Name) Artifact Name (groupId:artifactId:version - URL)
    const licenseEnd = trimmedLine.indexOf(')');
    if (licenseEnd === -1) {
      continue;
    }

    const licenseName = trimmedLine.substring(1, licenseEnd).trim();
    const remaining = trimmedLine.substring(licenseEnd + 1).trim();

    // Find the coordinates in parentheses
    const coordStart = remaining.indexOf('(');
    const coordEnd = remaining.indexOf(')');

    if (coordStart === -1 || coordEnd === -1) {
      continue;
    }

    const artifactName = remaining.substring(0, coordStart).trim();
    const coordPart = remaining.substring(coordStart + 1, coordEnd);

    // Split coordinates and URL
    const parts = coordPart.split(' - ');
    const coordinates = parts[0] ? parts[0].trim() : '';
    const url = parts[1] && parts[1] !== 'no url defined' ? parts[1].trim() : undefined;

    // Parse coordinates (groupId:artifactId:version)
    const coordParts = coordinates.split(':');
    if (coordParts.length >= 3) {
      const groupId = coordParts[0];
      const artifactId = coordParts[1];
      const version = coordParts[2];

      const depName = `${groupId}:${artifactId}`;

      dependencies.push({
        name: depName,
        version: version,
        licenses: [licenseName]
      });
    }
  }

  return dependencies;
}

/**
 * Parse Maven dependency:list output
 */
function parseMavenDependencyList(output: string): Dependency[] {
  const dependencies: Dependency[] = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    // Look for dependency lines like: "[INFO]    org.apache.commons:commons-lang3:jar:3.12.0:compile"
    const match = line.match(/\[INFO\]\s+(.+?):(.+?):(.+?):(.+?):(.+)/);
    if (match) {
      const [, groupId, artifactId, type, version] = match;
      dependencies.push({
        name: `${groupId}:${artifactId}`,
        version,
        licenses: undefined // License info not available from dependency:list
      });
    }
  }
  
  return dependencies;
}

/**
 * Parse Gradle license report JSON format
 */
function parseGradleLicenseReport(content: string): Dependency[] {
  try {
    const report = JSON.parse(content);
    const dependencies: Dependency[] = [];
    
    if (report.dependencies) {
      for (const dep of report.dependencies) {
        dependencies.push({
          name: dep.moduleName || `${dep.group}:${dep.name}`,
          version: dep.version,
          licenses: dep.licenses?.map((l: any) => l.name || l.license) || []
        });
      }
    }
    
    return dependencies;
  } catch (error) {
    console.warn('Failed to parse Gradle license report:', error);
    return [];
  }
}

/**
 * Parse Gradle dependencies output
 */
function parseGradleDependencies(output: string): Dependency[] {
  const dependencies: Dependency[] = [];
  const lines = output.split('\n');
  
  for (const line of lines) {
    // Look for dependency lines like: "+--- org.apache.commons:commons-lang3:3.12.0"
    const match = line.match(/[+\\-]+\s*(.+?):(.+?):(.+?)(\s|$)/);
    if (match) {
      const [, groupId, artifactId, version] = match;
      dependencies.push({
        name: `${groupId}:${artifactId}`,
        version,
        licenses: undefined // License info not available from dependencies task
      });
    }
  }
  
  return dependencies;
}

/**
 * Remove duplicate dependencies based on name and version
 */
function deduplicateDependencies(dependencies: Dependency[]): Dependency[] {
  const seen = new Set<string>();
  const unique: Dependency[] = [];
  
  for (const dep of dependencies) {
    const key = `${dep.name}:${dep.version}`;
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(dep);
    }
  }
  
  return unique;
}

/**
 * Check if a dependency is documented in the README file
 * Looks for mentions of LGPL libraries or the specific dependency name
 */
function isDocumentedInReadme(dependency: Dependency, readmeContent: string): boolean {
  const content = readmeContent.toLowerCase();
  const depName = dependency.name.toLowerCase();
  
  // Check for specific dependency name mention
  if (content.includes(depName)) {
    return true;
  }
  
  // Check for LGPL mentions (common for Category B dependencies)
  if (dependency.licenses?.some(license => license.toLowerCase().includes('lgpl'))) {
    return content.includes('lgpl') || 
           content.includes('lesser general public license');
  }
  
  // For other Category B licenses, require specific mention
  return false;
}
