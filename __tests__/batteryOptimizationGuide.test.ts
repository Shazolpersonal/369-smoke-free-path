/**
 * Tests for BatteryOptimizationGuide component utilities
 * Feature: robust-notification-system
 */

import * as fc from 'fast-check';

// ─── Mocks ────────────────────────────────────────────────────────────────────

// Minimal Platform mock — avoids TurboModuleRegistry issues
const mockPlatformConstants: Record<string, string> = { Brand: '', Manufacturer: '' };

jest.mock('react-native', () => ({
  Platform: {
    OS: 'android',
    get constants() {
      return mockPlatformConstants;
    },
  },
  StyleSheet: {
    create: (styles: Record<string, unknown>) => styles,
  },
  View: 'View',
  Text: 'Text',
  TouchableOpacity: 'TouchableOpacity',
  ScrollView: 'ScrollView',
  Linking: { openSettings: jest.fn() },
}));

// ─── Imports (after mocks) ────────────────────────────────────────────────────

import {
  detectManufacturer,
  getManufacturerGuide,
  Manufacturer,
} from '../components/BatteryOptimizationGuide';
import { Language } from '../i18n';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function setBrand(brand: string) {
  mockPlatformConstants.Brand = brand;
  mockPlatformConstants.Manufacturer = '';
}

beforeEach(() => {
  setBrand('');
});

// ─── Unit Tests: detectManufacturer ──────────────────────────────────────────

describe('detectManufacturer', () => {
  it('detects samsung from Brand', () => {
    setBrand('samsung');
    expect(detectManufacturer()).toBe('samsung');
  });

  it('detects samsung case-insensitively', () => {
    setBrand('SAMSUNG');
    expect(detectManufacturer()).toBe('samsung');
  });

  it('detects xiaomi', () => {
    setBrand('Xiaomi');
    expect(detectManufacturer()).toBe('xiaomi');
  });

  it('detects redmi as xiaomi', () => {
    setBrand('Redmi');
    expect(detectManufacturer()).toBe('xiaomi');
  });

  it('detects poco as xiaomi', () => {
    setBrand('POCO');
    expect(detectManufacturer()).toBe('xiaomi');
  });

  it('detects oneplus', () => {
    setBrand('OnePlus');
    expect(detectManufacturer()).toBe('oneplus');
  });

  it('detects huawei', () => {
    setBrand('HUAWEI');
    expect(detectManufacturer()).toBe('huawei');
  });

  it('detects honor as huawei', () => {
    setBrand('Honor');
    expect(detectManufacturer()).toBe('huawei');
  });

  it('returns generic for unknown brand', () => {
    setBrand('Google');
    expect(detectManufacturer()).toBe('generic');
  });

  it('returns generic for empty brand', () => {
    setBrand('');
    expect(detectManufacturer()).toBe('generic');
  });
});

// ─── Unit Tests: getManufacturerGuide ────────────────────────────────────────

describe('getManufacturerGuide', () => {
  const manufacturers: Manufacturer[] = ['samsung', 'xiaomi', 'oneplus', 'huawei', 'generic'];
  const languages: Language[] = ['en', 'bn'];

  for (const manufacturer of manufacturers) {
    for (const language of languages) {
      it(`returns valid guide for ${manufacturer} in ${language}`, () => {
        const guide = getManufacturerGuide(manufacturer, language);
        expect(guide.manufacturer).toBe(manufacturer);
        expect(typeof guide.displayName).toBe('string');
        expect(guide.displayName.length).toBeGreaterThan(0);
        expect(Array.isArray(guide.steps)).toBe(true);
        expect(guide.steps.length).toBeGreaterThan(0);
        expect(typeof guide.settingsPath).toBe('string');
        expect(guide.settingsPath.length).toBeGreaterThan(0);
      });
    }
  }
});

// ─── Property Tests ───────────────────────────────────────────────────────────

describe('Property 10: Manufacturer Guide Non-Empty Steps', () => {
  /**
   * Validates: Requirements 12.2
   *
   * For any Manufacturer value and any Language, getManufacturerGuide() must
   * return a guide with at least one non-empty step string.
   *
   * Feature: robust-notification-system, Property 10: Manufacturer guide non-empty steps
   */
  it('always returns at least one non-empty step for all manufacturer/language combinations', () => {
    const manufacturerArb = fc.constantFrom<Manufacturer>(
      'samsung', 'xiaomi', 'oneplus', 'huawei', 'generic'
    );
    const languageArb = fc.constantFrom<Language>('en', 'bn');

    fc.assert(
      fc.property(manufacturerArb, languageArb, (manufacturer, language) => {
        const guide = getManufacturerGuide(manufacturer, language);

        // Must have at least one step
        expect(guide.steps.length).toBeGreaterThan(0);

        // Every step must be a non-empty string
        for (const step of guide.steps) {
          expect(typeof step).toBe('string');
          expect(step.trim().length).toBeGreaterThan(0);
        }

        // displayName must be non-empty
        expect(guide.displayName.trim().length).toBeGreaterThan(0);

        // settingsPath must be non-empty
        expect(guide.settingsPath.trim().length).toBeGreaterThan(0);

        // manufacturer field must match input
        expect(guide.manufacturer).toBe(manufacturer);
      }),
      { numRuns: 100 }
    );
  });
});
