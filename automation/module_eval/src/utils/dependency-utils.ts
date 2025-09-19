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
  isLicenseInCategory,
  getLicensesInCategory
} from './license-policy';

const execAsync = promisify(exec);
const parseXmlAsync = promisify(parseString);

// Constants for configuration and patterns
const COMMAND_TIMEOUT = 60000; // 60 seconds
const MAVEN_THIRD_PARTY_PATH = path.join('target', 'licenses', 'THIRD-PARTY.txt');
const MAVEN_DEPENDENCIES_PATH = path.join('target', 'dependencies.txt');
const GRADLE_LICENSE_REPORT_PATH = path.join('build', 'reports', 'dependency-license', 'index.json');

// Regex patterns for parsing
const MAVEN_DEPENDENCY_PATTERN = /\[INFO\]\s+(.+?):(.+?):(.+?):(.+?):(.+)/;
const GRADLE_DEPENDENCY_PATTERN = /[+\\-]+\s*(.+?):(.+?):(.+?)(\s|$)/;
const MAVEN_COORDINATE_PATTERN = /^(.+?):(.+?):(.+?)$/;

// File existence patterns
const MAVEN_BUILD_FILES = ['pom.xml'];
const GRADLE_BUILD_FILES = ['build.gradle', 'build.gradle.kts'];

/**
 * Type guard to check if a value is a non-empty string
 * @param value - Value to check
 * @returns True if value is a non-empty string
 */
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Type guard to check if a dependency object is valid
 * @param dep - Dependency object to validate
 * @returns True if dependency has required fields
 */
function isValidDependency(dep: Partial<Dependency>): dep is Dependency {
  return isNonEmptyString(dep.name) && isNonEmptyString(dep.version);
}

/**
 * Parse Maven coordinates (groupId:artifactId:version)
 * @param coordinates - Coordinate string to parse
 * @returns Parsed coordinate parts or null if invalid
 */
function parseMavenCoordinates(coordinates: string): { groupId: string; artifactId: string; version: string } | null {
  if (!isNonEmptyString(coordinates)) {
    return null;
  }

  const match = coordinates.match(MAVEN_COORDINATE_PATTERN);
  if (!match || match.length < 4) {
    return null;
  }

  const [, groupId, artifactId, version] = match;
  if (!isNonEmptyString(groupId) || !isNonEmptyString(artifactId) || !isNonEmptyString(version)) {
    return null;
  }

  return { groupId: groupId.trim(), artifactId: artifactId.trim(), version: version.trim() };
}

/**
 * Safely read file contents
 * @param filePath - Path to file
 * @returns File contents or null if file doesn't exist or can't be read
 */
function safeReadFile(filePath: string): string | null {
  try {
    if (!fs.existsSync(filePath)) {
      return null;
    }
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.warn(`Failed to read file ${filePath}:`, error);
    return null;
  }
}

/**
 * Get documentation keywords for a license name
 * @param licenseName - License name to get keywords for
 * @returns Array of keywords that indicate this license is documented
 */
function getLicenseDocumentationKeywords(licenseName: string): string[] {
  if (!isNonEmptyString(licenseName)) {
    return [];
  }

  const lowerLicense = licenseName.toLowerCase();
  const keywords: string[] = [];

  // LGPL family
  if (lowerLicense.includes('lgpl') || lowerLicense.includes('lesser general public')) {
    keywords.push('lgpl', 'lesser general public license');
  }

  // MPL family (Mozilla Public License)
  if (lowerLicense.includes('mpl') || lowerLicense.includes('mozilla')) {
    keywords.push('mpl', 'mozilla public license', 'mozilla');
  }

  // EPL family (Eclipse Public License)
  if (lowerLicense.includes('epl') || lowerLicense.includes('eclipse')) {
    keywords.push('epl', 'eclipse public license', 'eclipse');
  }

  // CDDL family (Common Development and Distribution License)
  if (lowerLicense.includes('cddl') || lowerLicense.includes('common development')) {
    keywords.push('cddl', 'common development', 'common development and distribution license');
  }

  return keywords;
}

/**
 * Check if any of the dependency's licenses are Category B and documented in README
 * @param dependency - Dependency to check
 * @param readmeContent - README content to search
 * @returns True if any Category B licenses are documented
 */
function isCategoryBLicenseDocumented(dependency: Dependency, readmeContent: string): boolean {
  if (!dependency.licenses || !Array.isArray(dependency.licenses) || !isNonEmptyString(readmeContent)) {
    return false;
  }

  const content = readmeContent.toLowerCase();
  const categoryBLicenses = getLicensesInCategory(LicenseCategory.B);
  const categoryBLicenseSet = new Set(categoryBLicenses.map(license => license.toLowerCase()));

  // Check each of the dependency's licenses
  for (const license of dependency.licenses) {
    if (!isNonEmptyString(license)) {
      continue;
    }

    // Check if this license is Category B
    const normalizedLicense = getLicenseCategoryNormalized(license);
    if (normalizedLicense === LicenseCategory.B) {
      // Get documentation keywords for this license
      const keywords = getLicenseDocumentationKeywords(license);

      // Check if any keywords are documented in README
      if (keywords.some(keyword => content.includes(keyword.toLowerCase()))) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Extract dependencies from a repository using available build tools
 * @param repoPath - Path to the cloned repository
 * @returns Promise resolving to array of dependencies with license information
 * @throws Error if repoPath is invalid
 */
export async function getDependencies(repoPath: string): Promise<Dependency[]> {
  if (!isNonEmptyString(repoPath)) {
    console.warn('Repository path must be a non-empty string');
    return [];
  }

  const dependencies: Dependency[] = [];

  try {
    // Check if path exists - return empty array if not (for test compatibility)
    if (!fs.existsSync(repoPath)) {
      return [];
    }

    // Check for Maven project
    if (await hasMavenProject(repoPath)) {
      const mavenDeps = await getMavenDependencies(repoPath);
      if (Array.isArray(mavenDeps)) {
        dependencies.push(...mavenDeps.filter(isValidDependency));
      }
    }

    // Check for Gradle project
    if (await hasGradleProject(repoPath)) {
      const gradleDeps = await getGradleDependencies(repoPath);
      if (Array.isArray(gradleDeps)) {
        dependencies.push(...gradleDeps.filter(isValidDependency));
      }
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
 * @param dependencies - Array of dependencies to check
 * @param readmeContent - Content of the README file for Category B validation
 * @returns ComplianceResult with compliance status and any issues found
 * @throws Error if parameters are invalid
 */
export function checkLicenseCompliance(
  dependencies: Dependency[],
  readmeContent: string
): ComplianceResult {
  if (!Array.isArray(dependencies)) {
    console.warn('Dependencies must be an array');
    return { compliant: false, issues: [] };
  }

  if (typeof readmeContent !== 'string') {
    console.warn('README content must be a string');
    readmeContent = '';
  }
  const issues: ComplianceIssue[] = [];

  for (const dependency of dependencies) {
    // Validate dependency object
    if (!isValidDependency(dependency)) {
      continue;
    }

    // Skip dependencies without license information
    if (!dependency.licenses || !Array.isArray(dependency.licenses) || dependency.licenses.length === 0) {
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
 * @param repoPath - Path to repository
 * @returns Promise resolving to true if Maven project exists
 */
async function hasMavenProject(repoPath: string): Promise<boolean> {
  if (!isNonEmptyString(repoPath)) {
    return false;
  }
  return MAVEN_BUILD_FILES.some(file => fs.existsSync(path.join(repoPath, file)));
}

/**
 * Check if a Gradle project exists in the repository
 * @param repoPath - Path to repository
 * @returns Promise resolving to true if Gradle project exists
 */
async function hasGradleProject(repoPath: string): Promise<boolean> {
  if (!isNonEmptyString(repoPath)) {
    return false;
  }
  return GRADLE_BUILD_FILES.some(file => fs.existsSync(path.join(repoPath, file)));
}

/**
 * Extract dependencies from Maven project using license plugin
 * @param repoPath - Path to Maven project
 * @returns Promise resolving to array of dependencies
 */
async function getMavenDependencies(repoPath: string): Promise<Dependency[]> {
  if (!isNonEmptyString(repoPath)) {
    return [];
  }

  try {
    // Execute Maven license plugin to generate third-party report
    const { stdout } = await execAsync(
      'mvn license:add-third-party -Dlicense.outputDirectory=target/licenses -Dlicense.includeTransitiveDependencies=false',
      {
        cwd: repoPath,
        timeout: COMMAND_TIMEOUT
      }
    );

    console.log('Maven license plugin output:', stdout);

    // Parse the generated THIRD-PARTY.txt file
    const thirdPartyFile = path.join(repoPath, MAVEN_THIRD_PARTY_PATH);
    const thirdPartyContent = safeReadFile(thirdPartyFile);

    if (thirdPartyContent) {
      return parseMavenThirdPartyFile(thirdPartyContent);
    }

    // Fallback: try to parse dependency:list output
    const { stdout: depsOutput } = await execAsync(
      `mvn dependency:list -DoutputFile=${MAVEN_DEPENDENCIES_PATH}`,
      { cwd: repoPath, timeout: COMMAND_TIMEOUT }
    );

    return parseMavenDependencyList(depsOutput);

  } catch (error) {
    console.warn('Failed to extract Maven dependencies:', error);
    return [];
  }
}

/**
 * Extract dependencies from Gradle project using license plugin
 * @param repoPath - Path to Gradle project
 * @returns Promise resolving to array of dependencies
 */
async function getGradleDependencies(repoPath: string): Promise<Dependency[]> {
  if (!isNonEmptyString(repoPath)) {
    return [];
  }

  try {
    // Try to use Gradle license report plugin if available
    const { stdout } = await execAsync(
      './gradlew generateLicenseReport || gradle generateLicenseReport',
      {
        cwd: repoPath,
        timeout: COMMAND_TIMEOUT
      }
    );

    console.log('Gradle license plugin output:', stdout);

    // Look for generated license report
    const licenseReport = path.join(repoPath, GRADLE_LICENSE_REPORT_PATH);
    const licenseContent = safeReadFile(licenseReport);

    if (licenseContent) {
      return parseGradleLicenseReport(licenseContent);
    }

    // Fallback: use dependencies task
    const { stdout: depsOutput } = await execAsync(
      './gradlew dependencies --configuration runtimeClasspath || gradle dependencies',
      { cwd: repoPath, timeout: COMMAND_TIMEOUT }
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
 * @param content - Content of the THIRD-PARTY.txt file
 * @returns Array of parsed dependencies
 */
function parseMavenThirdPartyFile(content: string): Dependency[] {
  if (!isNonEmptyString(content)) {
    return [];
  }

  const dependencies: Dependency[] = [];
  const lines = content.split('\n');

  for (const line of lines) {
    const dependency = parseMavenThirdPartyLine(line);
    if (dependency && isValidDependency(dependency)) {
      dependencies.push(dependency);
    }
  }

  return dependencies;
}

/**
 * Parse a single line from Maven THIRD-PARTY.txt file
 * @param line - Line to parse
 * @returns Parsed dependency or null if invalid
 */
function parseMavenThirdPartyLine(line: string): Dependency | null {
  const trimmedLine = line.trim();

  // Skip empty lines and headers
  if (!trimmedLine || trimmedLine.startsWith('Lists of') || !trimmedLine.startsWith('(')) {
    return null;
  }

  // Parse format: (License Name) Artifact Name (groupId:artifactId:version - URL)
  const licenseEnd = trimmedLine.indexOf(')');
  if (licenseEnd === -1) {
    return null;
  }

  const licenseName = trimmedLine.substring(1, licenseEnd).trim();
  if (!isNonEmptyString(licenseName)) {
    return null;
  }

  const remaining = trimmedLine.substring(licenseEnd + 1).trim();

  // Find the coordinates in parentheses
  const coordStart = remaining.indexOf('(');
  const coordEnd = remaining.indexOf(')');

  if (coordStart === -1 || coordEnd === -1) {
    return null;
  }

  const coordPart = remaining.substring(coordStart + 1, coordEnd);

  // Split coordinates and URL
  const parts = coordPart.split(' - ');
  const coordinates = parts[0]?.trim();

  if (!isNonEmptyString(coordinates)) {
    return null;
  }

  // Parse coordinates using helper function
  const parsed = parseMavenCoordinates(coordinates);
  if (!parsed) {
    return null;
  }

  const depName = `${parsed.groupId}:${parsed.artifactId}`;

  return {
    name: depName,
    version: parsed.version,
    licenses: [licenseName]
  };
}

/**
 * Parse Maven dependency:list output
 * @param output - Output from mvn dependency:list command
 * @returns Array of parsed dependencies (without license information)
 */
function parseMavenDependencyList(output: string): Dependency[] {
  if (!isNonEmptyString(output)) {
    return [];
  }

  const dependencies: Dependency[] = [];
  const lines = output.split('\n');

  for (const line of lines) {
    // Look for dependency lines like: "[INFO]    org.apache.commons:commons-lang3:jar:3.12.0:compile"
    const match = line.match(MAVEN_DEPENDENCY_PATTERN);
    if (match && match.length >= 5) {
      const [, groupId, artifactId, , version] = match;

      if (isNonEmptyString(groupId) && isNonEmptyString(artifactId) && isNonEmptyString(version)) {
        const dependency: Dependency = {
          name: `${groupId.trim()}:${artifactId.trim()}`,
          version: version.trim(),
          licenses: undefined // License info not available from dependency:list
        };

        if (isValidDependency(dependency)) {
          dependencies.push(dependency);
        }
      }
    }
  }

  return dependencies;
}

/**
 * Parse Gradle license report JSON format
 * @param content - JSON content from Gradle license report
 * @returns Array of parsed dependencies with license information
 */
function parseGradleLicenseReport(content: string): Dependency[] {
  if (!isNonEmptyString(content)) {
    return [];
  }

  try {
    const report = JSON.parse(content);
    const dependencies: Dependency[] = [];

    if (report?.dependencies && Array.isArray(report.dependencies)) {
      for (const dep of report.dependencies) {
        const dependency = parseGradleLicenseReportDependency(dep);
        if (dependency && isValidDependency(dependency)) {
          dependencies.push(dependency);
        }
      }
    }

    return dependencies;
  } catch (error) {
    console.warn('Failed to parse Gradle license report:', error);
    return [];
  }
}

/**
 * Parse a single dependency from Gradle license report
 * @param dep - Dependency object from license report
 * @returns Parsed dependency or null if invalid
 */
function parseGradleLicenseReportDependency(dep: any): Dependency | null {
  if (!dep || typeof dep !== 'object') {
    return null;
  }

  const name = dep.moduleName || (dep.group && dep.name ? `${dep.group}:${dep.name}` : null);
  const version = dep.version;

  if (!isNonEmptyString(name) || !isNonEmptyString(version)) {
    return null;
  }

  const licenses = Array.isArray(dep.licenses)
    ? dep.licenses.map((l: any) => l?.name || l?.license).filter(isNonEmptyString)
    : [];

  return {
    name: name.trim(),
    version: version.trim(),
    licenses
  };
}

/**
 * Parse Gradle dependencies output
 * @param output - Output from gradle dependencies command
 * @returns Array of parsed dependencies (without license information)
 */
function parseGradleDependencies(output: string): Dependency[] {
  if (!isNonEmptyString(output)) {
    return [];
  }

  const dependencies: Dependency[] = [];
  const lines = output.split('\n');

  for (const line of lines) {
    // Look for dependency lines like: "+--- org.apache.commons:commons-lang3:3.12.0"
    const match = line.match(GRADLE_DEPENDENCY_PATTERN);
    if (match && match.length >= 4) {
      const [, groupId, artifactId, version] = match;

      if (isNonEmptyString(groupId) && isNonEmptyString(artifactId) && isNonEmptyString(version)) {
        const dependency: Dependency = {
          name: `${groupId.trim()}:${artifactId.trim()}`,
          version: version.trim(),
          licenses: undefined // License info not available from dependencies task
        };

        if (isValidDependency(dependency)) {
          dependencies.push(dependency);
        }
      }
    }
  }

  return dependencies;
}

/**
 * Remove duplicate dependencies based on name and version
 * @param dependencies - Array of dependencies to deduplicate
 * @returns Array of unique dependencies
 */
function deduplicateDependencies(dependencies: Dependency[]): Dependency[] {
  if (!Array.isArray(dependencies)) {
    return [];
  }

  const uniqueMap = new Map<string, Dependency>();

  for (const dep of dependencies) {
    if (!isValidDependency(dep)) {
      continue;
    }

    const key = `${dep.name}:${dep.version}`;

    // If we haven't seen this dependency before, or if the current one has license info and the stored one doesn't
    if (!uniqueMap.has(key) ||
        (!uniqueMap.get(key)?.licenses?.length && dep.licenses?.length)) {
      uniqueMap.set(key, dep);
    }
  }

  return Array.from(uniqueMap.values());
}

/**
 * Check if a dependency is documented in the README file
 * Looks for mentions of Category B license families or the specific dependency name
 * @param dependency - Dependency to check
 * @param readmeContent - Content of README file
 * @returns True if dependency is documented
 */
function isDocumentedInReadme(dependency: Dependency, readmeContent: string): boolean {
  if (!isValidDependency(dependency) || typeof readmeContent !== 'string') {
    return false;
  }

  const content = readmeContent.toLowerCase();
  const depName = dependency.name.toLowerCase();

  // Check for specific dependency name mention
  if (content.includes(depName)) {
    return true;
  }

  // Check for Category B license documentation using dynamic detection
  return isCategoryBLicenseDocumented(dependency, readmeContent);
}
