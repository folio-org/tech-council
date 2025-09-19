/**
 * Centralized definitions of all FOLIO technical council acceptance criteria
 * This file serves as the single source of truth for all criterion IDs and their organization
 *
 * Source: https://raw.githubusercontent.com/folio-org/tech-council/refs/heads/criteria-ids/MODULE_ACCEPTANCE_CRITERIA.MD
 */

/**
 * Individual criterion definition
 */
export interface CriterionDefinition {
  id: string;
  description: string;
  section: string;
}

/**
 * Administrative criteria
 */
export const ADMINISTRATIVE_CRITERIA = ['A001'] as const;

/**
 * Shared/Common criteria - apply to all FOLIO modules
 */
export const SHARED_CRITERIA = [
  'S001', 'S002', 'S003', 'S004', 'S005', 'S006', 'S007',
  'S008', 'S009', 'S010', 'S011', 'S012', 'S013', 'S014'
] as const;

/**
 * Backend criteria - specific to backend/server-side modules
 */
export const BACKEND_CRITERIA = [
  'B001', 'B002', 'B003', 'B004', 'B005', 'B006', 'B007', 'B008',
  'B009', 'B010', 'B011', 'B012', 'B013', 'B014', 'B015', 'B016'
] as const;

/**
 * Frontend criteria - specific to frontend/UI modules
 */
export const FRONTEND_CRITERIA = [
  'F001', 'F002', 'F003', 'F004', 'F005', 'F006', 'F007'
] as const;

/**
 * Complete definitions of all criteria with descriptions
 */
export const CRITERIA_DEFINITIONS: Record<string, CriterionDefinition> = {
  // Administrative
  'A001': {
    id: 'A001',
    description: 'Listed by Product Council with positive evaluation result',
    section: 'Administrative'
  },

  // Shared/Common
  'S001': {
    id: 'S001',
    description: 'Uses Apache 2.0 license',
    section: 'Shared/Common'
  },
  'S002': {
    id: 'S002',
    description: 'Module build produces valid module descriptor',
    section: 'Shared/Common'
  },
  'S003': {
    id: 'S003',
    description: 'Third-party dependencies comply with ASF license policy',
    section: 'Shared/Common'
  },
  'S004': {
    id: 'S004',
    description: 'Installation documentation included',
    section: 'Shared/Common'
  },
  'S005': {
    id: 'S005',
    description: 'Personal data form completed',
    section: 'Shared/Common'
  },
  'S006': {
    id: 'S006',
    description: 'No sensitive info in git repository',
    section: 'Shared/Common'
  },
  'S007': {
    id: 'S007',
    description: 'Written in officially supported technologies',
    section: 'Shared/Common'
  },
  'S008': {
    id: 'S008',
    description: 'Uses existing FOLIO interfaces',
    section: 'Shared/Common'
  },
  'S009': {
    id: 'S009',
    description: 'No unapproved FOLIO library dependencies',
    section: 'Shared/Common'
  },
  'S010': {
    id: 'S010',
    description: 'Handles absence of third-party systems',
    section: 'Shared/Common'
  },
  'S011': {
    id: 'S011',
    description: 'Passes Sonarqube security checks',
    section: 'Shared/Common'
  },
  'S012': {
    id: 'S012',
    description: 'Uses officially supported build tools',
    section: 'Shared/Common'
  },
  'S013': {
    id: 'S013',
    description: '80%+ unit test coverage',
    section: 'Shared/Common'
  },
  'S014': {
    id: 'S014',
    description: 'Assigned to one application descriptor',
    section: 'Shared/Common'
  },

  // Backend
  'B001': {
    id: 'B001',
    description: 'Compliant Module Descriptor',
    section: 'Backend'
  },
  'B002': {
    id: 'B002',
    description: 'API interface requirements in module descriptor',
    section: 'Backend'
  },
  'B003': {
    id: 'B003',
    description: 'Implement all endpoints in Module Descriptor',
    section: 'Backend'
  },
  'B004': {
    id: 'B004',
    description: 'Environment vars documented',
    section: 'Backend'
  },
  'B005': {
    id: 'B005',
    description: 'Provide interfaces per naming conventions',
    section: 'Backend'
  },
  'B006': {
    id: 'B006',
    description: 'OpenAPI documentation for endpoints',
    section: 'Backend'
  },
  'B007': {
    id: 'B007',
    description: 'Appropriate endpoint permissions',
    section: 'Backend'
  },
  'B008': {
    id: 'B008',
    description: 'Provide reference data',
    section: 'Backend'
  },
  'B009': {
    id: 'B009',
    description: 'Integration tests in supported technology',
    section: 'Backend'
  },
  'B010': {
    id: 'B010',
    description: 'Tenant data segregation',
    section: 'Backend'
  },
  'B011': {
    id: 'B011',
    description: 'Restricted database schema access',
    section: 'Backend'
  },
  'B012': {
    id: 'B012',
    description: 'Dependencies declared in README',
    section: 'Backend'
  },
  'B013': {
    id: 'B013',
    description: 'Respond with tenant-specific content',
    section: 'Backend'
  },
  'B014': {
    id: 'B014',
    description: 'Standard health check endpoint',
    section: 'Backend'
  },
  'B015': {
    id: 'B015',
    description: 'High Availability compliance',
    section: 'Backend'
  },
  'B016': {
    id: 'B016',
    description: 'Use only supported infrastructure technologies',
    section: 'Backend'
  },

  // Frontend
  'F001': {
    id: 'F001',
    description: 'API interface requirements in package.json',
    section: 'Frontend'
  },
  'F002': {
    id: 'F002',
    description: 'E2E tests in supported technology',
    section: 'Frontend'
  },
  'F003': {
    id: 'F003',
    description: 'i18n support via react-intl',
    section: 'Frontend'
  },
  'F004': {
    id: 'F004',
    description: 'WCAG 2.1 AA compliance',
    section: 'Frontend'
  },
  'F005': {
    id: 'F005',
    description: 'Use specified Stripes version',
    section: 'Frontend'
  },
  'F006': {
    id: 'F006',
    description: 'Follow existing UI layouts/patterns',
    section: 'Frontend'
  },
  'F007': {
    id: 'F007',
    description: 'Works in latest Chrome',
    section: 'Frontend'
  }
};

/**
 * All Java module criteria (combines administrative, shared, and backend)
 */
export const JAVA_CRITERIA = [
  ...ADMINISTRATIVE_CRITERIA,
  ...SHARED_CRITERIA,
  ...BACKEND_CRITERIA
] as const;

/**
 * All available criteria across all module types
 */
export const ALL_CRITERIA = [
  ...ADMINISTRATIVE_CRITERIA,
  ...SHARED_CRITERIA,
  ...BACKEND_CRITERIA,
  ...FRONTEND_CRITERIA
] as const;

/**
 * Type definitions for criterion IDs
 */
export type AdministrativeCriterionId = typeof ADMINISTRATIVE_CRITERIA[number];
export type SharedCriterionId = typeof SHARED_CRITERIA[number];
export type BackendCriterionId = typeof BACKEND_CRITERIA[number];
export type FrontendCriterionId = typeof FRONTEND_CRITERIA[number];
export type JavaCriterionId = typeof JAVA_CRITERIA[number];
export type CriterionId = typeof ALL_CRITERIA[number];

/**
 * Criteria organized by section for easy lookup
 */
export const CRITERIA_BY_SECTION = {
  administrative: ADMINISTRATIVE_CRITERIA,
  shared: SHARED_CRITERIA,
  backend: BACKEND_CRITERIA,
  frontend: FRONTEND_CRITERIA
} as const;

/**
 * Get all criteria IDs for a specific language/module type
 * @param language The programming language or module type
 * @returns Array of criterion IDs applicable to that language
 */
export function getCriteriaForLanguage(language: string): readonly string[] {
  switch (language.toLowerCase()) {
    case 'java':
      return JAVA_CRITERIA;
    case 'javascript':
    case 'typescript':
    case 'react':
      return [...ADMINISTRATIVE_CRITERIA, ...SHARED_CRITERIA, ...FRONTEND_CRITERIA];
    default:
      return SHARED_CRITERIA; // Default to shared criteria for unknown languages
  }
}

/**
 * Check if a criterion ID is valid
 * @param criterionId The criterion ID to validate
 * @returns true if the criterion ID exists
 */
export function isValidCriterionId(criterionId: string): criterionId is CriterionId {
  return ALL_CRITERIA.includes(criterionId as CriterionId);
}

/**
 * Get the section name for a given criterion ID
 * @param criterionId The criterion ID
 * @returns The section name or 'unknown' if not found
 */
export function getSectionForCriterion(criterionId: string): string {
  const definition = CRITERIA_DEFINITIONS[criterionId];
  return definition ? definition.section : 'Unknown';
}

/**
 * Get the description for a given criterion ID
 * @param criterionId The criterion ID
 * @returns The description or 'Unknown criterion' if not found
 */
export function getDescriptionForCriterion(criterionId: string): string {
  const definition = CRITERIA_DEFINITIONS[criterionId];
  return definition ? definition.description : 'Unknown criterion';
}

/**
 * Get the full definition for a given criterion ID
 * @param criterionId The criterion ID
 * @returns The criterion definition or undefined if not found
 */
export function getCriterionDefinition(criterionId: string): CriterionDefinition | undefined {
  return CRITERIA_DEFINITIONS[criterionId];
}