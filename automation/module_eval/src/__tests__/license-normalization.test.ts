/**
 * Tests for license name normalization functionality
 */

import { normalizeLicenseName, getLicenseCategoryNormalized, LicenseCategory } from '../utils/license-policy';

describe('License Name Normalization', () => {
  describe('normalizeLicenseName', () => {
    // Test parenthetical extraction (Maven format)
    test('should extract license from parenthetical format', () => {
      expect(normalizeLicenseName('(The Apache Software License, Version 2.0) jackson-databind')).toBe('The Apache Software License, Version 2.0');
      expect(normalizeLicenseName('(Apache-2.0) Apache Commons IO')).toBe('Apache-2.0');
      expect(normalizeLicenseName('(The MIT License) Project Lombok')).toBe('MIT License');
      expect(normalizeLicenseName('(BSD-2-Clause) PostgreSQL JDBC Driver')).toBe('BSD-2-Clause');
    });

    // Test artifact information removal
    test('should remove trailing artifact information', () => {
      expect(normalizeLicenseName('(The Apache Software License, Version 2.0) jackson-databind (com.fasterxml.jackson.core')).toBe('The Apache Software License, Version 2.0');
      expect(normalizeLicenseName('(Apache License, Version 2.0) folio-spring-base (org.folio')).toBe('Apache License 2.0');
      expect(normalizeLicenseName('Apache License 2.0 - https://www.apache.org/licenses')).toBe('Apache License 2.0');
    });

    // Test Apache variations from real FOLIO data
    test('should normalize Apache license variations', () => {
      expect(normalizeLicenseName('Apache 2')).toBe('Apache-2.0');
      expect(normalizeLicenseName('Apache License, Version 2.0')).toBe('Apache License 2.0');
      expect(normalizeLicenseName('Apache 2.0')).toBe('Apache-2.0');
      expect(normalizeLicenseName('Apache License Version 2.0')).toBe('Apache License 2.0');
      expect(normalizeLicenseName('The Apache Software License, Version 2.0')).toBe('The Apache Software License, Version 2.0');
      expect(normalizeLicenseName('Apache Public License 2.0')).toBe('Apache-2.0');
    });

    // Test MIT variations from real FOLIO data
    test('should normalize MIT license variations', () => {
      expect(normalizeLicenseName('MIT')).toBe('MIT');
      expect(normalizeLicenseName('MIT License')).toBe('MIT License');
      expect(normalizeLicenseName('MIT-0')).toBe('MIT');
      expect(normalizeLicenseName('The MIT License')).toBe('MIT License');
    });

    // Test BSD variations from real FOLIO data
    test('should normalize BSD license variations', () => {
      expect(normalizeLicenseName('3-Clause BSD License')).toBe('BSD-3-Clause');
      expect(normalizeLicenseName('BSD')).toBe('BSD-3-Clause');
      expect(normalizeLicenseName('BSD 2-Clause License')).toBe('BSD-2-Clause');
      expect(normalizeLicenseName('BSD License')).toBe('BSD-3-Clause');
      expect(normalizeLicenseName('BSD-2-Clause')).toBe('BSD-2-Clause');
      expect(normalizeLicenseName('The 2-Clause BSD License')).toBe('BSD-2-Clause');
      expect(normalizeLicenseName('New BSD License')).toBe('BSD-3-Clause');
    });

    // Test LGPL variations from real FOLIO data
    test('should normalize LGPL license variations', () => {
      expect(normalizeLicenseName('GNU Lesser General Public License, Version 2.1')).toBe('GNU Lesser General Public License v2.1');
      expect(normalizeLicenseName('GNU LESSER GENERAL PUBLIC LICENSE, Version 2.1')).toBe('GNU Lesser General Public License v2.1');
      expect(normalizeLicenseName('GNU Library General Public License v2.1 or later')).toBe('GNU Lesser General Public License v2.1');
      expect(normalizeLicenseName('LGPL')).toBe('LGPL-2.1');
    });

    // Test Eclipse Public License variations from real FOLIO data
    test('should normalize Eclipse license variations', () => {
      expect(normalizeLicenseName('Eclipse Public License v2.0')).toBe('EPL-2.0');
      expect(normalizeLicenseName('Eclipse Distribution License - v 1.0')).toBe('EPL-1.0');
      expect(normalizeLicenseName('Eclipse Public License 1.0')).toBe('EPL-1.0');
      expect(normalizeLicenseName('Eclipse Public License, Version 2.0')).toBe('Eclipse Public License 2.0');
      expect(normalizeLicenseName('EDL 1.0')).toBe('EPL-1.0');
      expect(normalizeLicenseName('EPL')).toBe('EPL-1.0');
    });

    // Test other real FOLIO license variations
    test('should normalize other common license variations', () => {
      expect(normalizeLicenseName('Universal Permissive License, Version 1.0')).toBe('Universal Permissive License, Version 1.0');
      expect(normalizeLicenseName('CC0')).toBe('CC0-1.0');
      expect(normalizeLicenseName('Public Domain, per Creative Commons CC0')).toBe('Public Domain');
      expect(normalizeLicenseName('Mozilla Public License, Version 2.0')).toBe('Mozilla Public License 2.0');
      expect(normalizeLicenseName('MPL 2.0')).toBe('MPL-2.0');
      expect(normalizeLicenseName('ISC')).toBe('ISC');
      expect(normalizeLicenseName('Go License')).toBe('BSD-3-Clause');
    });

    // Test preservation of exact matches
    test('should preserve exact matches from license policy', () => {
      expect(normalizeLicenseName('Apache-2.0')).toBe('Apache-2.0');
      expect(normalizeLicenseName('MIT')).toBe('MIT');
      expect(normalizeLicenseName('BSD-3-Clause')).toBe('BSD-3-Clause');
      expect(normalizeLicenseName('LGPL-2.1')).toBe('LGPL-2.1');
    });

    // Test unknown licenses
    test('should return cleaned name for unknown licenses', () => {
      expect(normalizeLicenseName('Some Unknown License')).toBe('Some Unknown License');
      expect(normalizeLicenseName('(Custom License) some-artifact')).toBe('Custom License');
    });

    // Test edge cases
    test('should handle edge cases', () => {
      expect(normalizeLicenseName('')).toBe('');
      expect(normalizeLicenseName('   ')).toBe('');
      expect(normalizeLicenseName('()')).toBe('');
      expect(normalizeLicenseName('(   )')).toBe('');
    });
  });

  describe('getLicenseCategoryNormalized', () => {
    // Test mod-search license strings from the actual report
    test('should categorize mod-search license strings correctly', () => {
      // Apache 2.0 variations from mod-search
      expect(getLicenseCategoryNormalized('(The Apache Software License, Version 2.0) jackson-databind (com.fasterxml.jackson.core')).toBe(LicenseCategory.A);
      expect(getLicenseCategoryNormalized('(Apache-2.0) Apache Commons IO (commons-io')).toBe(LicenseCategory.A);
      expect(getLicenseCategoryNormalized('(Apache License, Version 2.0) folio-spring-base (org.folio')).toBe(LicenseCategory.A);
      expect(getLicenseCategoryNormalized('(Apache License 2.0) folio-service-tools-spring-dev (org.folio')).toBe(LicenseCategory.A);

      // MIT License from mod-search
      expect(getLicenseCategoryNormalized('(The MIT License) Project Lombok (org.projectlombok')).toBe(LicenseCategory.A);

      // BSD License from mod-search
      expect(getLicenseCategoryNormalized('(BSD-2-Clause) PostgreSQL JDBC Driver (org.postgresql')).toBe(LicenseCategory.A);

      // LGPL License from mod-search (should be Category B)
      expect(getLicenseCategoryNormalized('(GNU Lesser General Public License, Version 2.1) MARC4J (org.marc4j')).toBe(LicenseCategory.B);
    });

    // Test exact matches still work
    test('should handle exact matches from license policy', () => {
      expect(getLicenseCategoryNormalized('Apache-2.0')).toBe(LicenseCategory.A);
      expect(getLicenseCategoryNormalized('MIT')).toBe(LicenseCategory.A);
      expect(getLicenseCategoryNormalized('BSD-2-Clause')).toBe(LicenseCategory.A);
      expect(getLicenseCategoryNormalized('LGPL-2.1')).toBe(LicenseCategory.B);
      expect(getLicenseCategoryNormalized('GPL-2.0')).toBe(LicenseCategory.X);
    });

    // Test unknown licenses
    test('should return undefined for unknown licenses', () => {
      expect(getLicenseCategoryNormalized('Some Unknown License')).toBeUndefined();
      expect(getLicenseCategoryNormalized('(Proprietary License) some-artifact')).toBeUndefined();
    });

    // Test normalization fallback
    test('should fall back to normalization when exact match fails', () => {
      expect(getLicenseCategoryNormalized('Apache License Version 2.0')).toBe(LicenseCategory.A);
      expect(getLicenseCategoryNormalized('MIT License')).toBe(LicenseCategory.A);
      expect(getLicenseCategoryNormalized('GNU Lesser General Public License, Version 2.1')).toBe(LicenseCategory.B);
    });
  });

  describe('Integration with real Maven output', () => {
    test('should handle complex Maven license strings', () => {
      // Simulate the problematic license strings from the mod-search report
      const problematicLicenses = [
        '(The Apache Software License, Version 2.0) jackson-databind (com.fasterxml.jackson.core',
        '(Apache-2.0) Apache Commons IO (commons-io',
        '(Apache License, Version 2.0) folio-spring-base (org.folio',
        '(The MIT License) Project Lombok (org.projectlombok',
        '(BSD-2-Clause) PostgreSQL JDBC Driver (org.postgresql',
        '(GNU Lesser General Public License, Version 2.1) MARC4J (org.marc4j'
      ];

      const expectedCategories = [
        LicenseCategory.A, // Apache variations
        LicenseCategory.A,
        LicenseCategory.A,
        LicenseCategory.A, // MIT
        LicenseCategory.A, // BSD
        LicenseCategory.B  // LGPL
      ];

      problematicLicenses.forEach((license, index) => {
        const category = getLicenseCategoryNormalized(license);
        expect(category).toBe(expectedCategories[index]);
      });
    });
  });
});