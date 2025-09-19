/**
 * ASF (Apache Software Foundation) License Policy Implementation
 *
 * This module implements the ASF 3rd Party License Policy for determining
 * license compliance categories and special exceptions.
 *
 * Configuration is loaded from external JSON files to allow non-developers
 * to update license policies without code changes.
 *
 * Categories:
 * - Category A: Licenses that are compatible with the Apache License 2.0
 * - Category B: Licenses that may be included but require appropriate labeling
 * - Category X: Licenses that are prohibited and cannot be included
 */

import * as fs from 'fs';
import * as path from 'path';
import { LicenseCategoriesConfig, SpecialExceptionsConfig, LicenseVariationsConfig } from '../types';

/**
 * License categories according to ASF policy
 */
export enum LicenseCategory {
  A = 'A', // Compatible licenses
  B = 'B', // Conditional licenses (require labeling)
  X = 'X'  // Prohibited licenses
}

/**
 * Cached configuration data
 */
let licensePolicy: Map<string, LicenseCategory> | null = null;
let licenseVariations: Map<string, string> | null = null;
let specialExceptionsConfig: SpecialExceptionsConfig | null = null;

/**
 * Get the path to the config directory
 */
function getConfigPath(): string {
  // Look for config directory relative to the current module
  const currentDir = __dirname;

  // Try multiple possible paths to handle different execution contexts
  const possiblePaths = [
    // From built JS files: dist/utils -> project root
    path.join(currentDir, '..', '..', 'config'),
    // From source TS files: src/utils -> project root
    path.join(currentDir, '..', '..', 'config'),
    // From test context
    path.join(process.cwd(), 'config'),
    // Alternative paths
    path.join(__dirname, '..', '..', '..', 'config'),
    path.join(__dirname, '..', 'config')
  ];

  for (const configPath of possiblePaths) {
    if (fs.existsSync(configPath)) {
      return configPath;
    }
  }

  // Fallback to process.cwd()/config
  return path.join(process.cwd(), 'config');
}

/**
 * Load license categories configuration from JSON file
 */
function loadLicenseCategories(): Map<string, LicenseCategory> {
  if (licensePolicy !== null) {
    return licensePolicy;
  }

  try {
    const configPath = path.join(getConfigPath(), 'license-categories.json');
    const configData = fs.readFileSync(configPath, 'utf-8');
    const config: LicenseCategoriesConfig = JSON.parse(configData);

    const policy = new Map<string, LicenseCategory>();
    for (const [licenseName, category] of Object.entries(config.categories)) {
      if (Object.values(LicenseCategory).includes(category as LicenseCategory)) {
        policy.set(licenseName, category as LicenseCategory);
      } else {
        console.warn(`Invalid license category '${category}' for license '${licenseName}'`);
      }
    }

    licensePolicy = policy;
    return policy;
  } catch (error) {
    console.error('Failed to load license categories configuration:', error);
    // Return empty map as fallback
    return new Map<string, LicenseCategory>();
  }
}


/**
 * Load special exceptions configuration from JSON file
 */
function loadSpecialExceptionsConfig(): SpecialExceptionsConfig {
  if (specialExceptionsConfig !== null) {
    return specialExceptionsConfig;
  }

  try {
    const configPath = path.join(getConfigPath(), 'special-exceptions.json');
    const configData = fs.readFileSync(configPath, 'utf-8');
    const config: SpecialExceptionsConfig = JSON.parse(configData);

    specialExceptionsConfig = config;
    return config;
  } catch (error) {
    console.error('Failed to load special exceptions configuration:', error);
    // Return minimal fallback configuration
    return {
      exceptions: [
        { name: 'org.hibernate', description: 'Hibernate ORM libraries', matchType: 'prefix' }
      ]
    };
  }
}

/**
 * Check if a dependency name matches any special exception
 * @param dependencyName The full dependency name (e.g., "org.hibernate:hibernate-core")
 * @returns true if the dependency is in the special exceptions list
 */
export function isSpecialException(dependencyName: string): boolean {
  const config = loadSpecialExceptionsConfig();

  for (const exception of config.exceptions) {
    if (exception.matchType === 'exact') {
      if (dependencyName === exception.name) {
        return true;
      }
    } else if (exception.matchType === 'prefix') {
      if (dependencyName.startsWith(exception.name)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Get the license category for a given license name
 * @param licenseName The license name to categorize
 * @returns LicenseCategory or undefined if not found
 */
export function getLicenseCategory(licenseName: string): LicenseCategory | undefined {
  const policy = loadLicenseCategories();
  return policy.get(licenseName);
}

/**
 * Check if a license is in a specific category
 * @param licenseName The license name to check
 * @param category The category to check against
 * @returns true if the license is in the specified category
 */
export function isLicenseInCategory(licenseName: string, category: LicenseCategory): boolean {
  const policy = loadLicenseCategories();
  return policy.get(licenseName) === category;
}

/**
 * Get all licenses in a specific category
 * @param category The category to filter by
 * @returns Array of license names in the specified category
 */
export function getLicensesInCategory(category: LicenseCategory): string[] {
  const licenses: string[] = [];
  const policy = loadLicenseCategories();
  for (const [license, cat] of policy.entries()) {
    if (cat === category) {
      licenses.push(license);
    }
  }
  return licenses;
}

/**
 * Load license variations configuration from JSON file
 */
function loadLicenseVariations(): Map<string, string> {
  if (licenseVariations !== null) {
    return licenseVariations;
  }

  try {
    const configPath = path.join(getConfigPath(), 'license-variations.json');
    const configData = fs.readFileSync(configPath, 'utf-8');
    const config: LicenseVariationsConfig = JSON.parse(configData);

    const variations = new Map<string, string>();
    for (const [variation, canonical] of Object.entries(config.variations)) {
      variations.set(variation, canonical);
    }

    licenseVariations = variations;
    return variations;
  } catch (error) {
    console.error('Failed to load license variations configuration:', error);
    // Return empty map as fallback
    return new Map<string, string>();
  }
}

/**
 * Normalize license name by extracting clean license and applying comprehensive mapping
 * @param licenseName The raw license name to normalize
 * @returns The normalized license name that should match ASF_LICENSE_POLICY keys
 */
export function normalizeLicenseName(licenseName: string): string {
  if (!licenseName) {
    return licenseName;
  }

  // Step 1: Extract license from parenthetical format (License Name) artifact-info
  let cleanName = licenseName.trim();

  // Extract from (license-name) format if present (common in Maven output)
  const parenthesesMatch = cleanName.match(/^\((.*?)\)/);
  if (parenthesesMatch) {
    cleanName = parenthesesMatch[1].trim();
  }

  // Step 2: Remove any trailing artifact information after the license name
  // Common patterns: "license name (artifact-info", "license name - url", etc.
  const trailingPatterns = [
    /\s+\([^)]*$/,  // Remove trailing (...
    /\s+-\s+.*$/,   // Remove trailing - ...
    /\s+\([\w\.-]+:[\w\.-]+.*$/  // Remove (groupId:artifactId...
  ];

  for (const pattern of trailingPatterns) {
    cleanName = cleanName.replace(pattern, '');
  }

  // Step 3: Clean up whitespace
  cleanName = cleanName.trim();

  // Step 4: Try direct mapping from comprehensive license variation map
  const variations = loadLicenseVariations();
  if (variations.has(cleanName)) {
    return variations.get(cleanName)!;
  }

  // Step 5: Return the cleaned name if no mapping was found
  // This preserves unknown licenses while still cleaning formatting
  return cleanName;
}

/**
 * Get the license category for a given license name with normalization
 * @param licenseName The license name to categorize
 * @returns LicenseCategory or undefined if not found
 */
export function getLicenseCategoryNormalized(licenseName: string): LicenseCategory | undefined {
  const policy = loadLicenseCategories();

  // Try exact match first
  const exactMatch = policy.get(licenseName);
  if (exactMatch) {
    return exactMatch;
  }

  // Try normalized match
  const normalizedName = normalizeLicenseName(licenseName);
  return policy.get(normalizedName);
}
