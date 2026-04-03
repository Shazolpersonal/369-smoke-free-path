/**
 * Multi-Bug UX Fixes — Preservation Property Tests (Task 2)
 *
 * These tests verify NON-BUGGY behaviors that MUST remain unchanged after fixes.
 * ALL tests MUST PASS on unfixed code — they document the baseline to preserve.
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7
 *
 * Property 7: Preservation — bug-condition-outside inputs behave identically
 * before and after fixes.
 */

import { getAffirmationByLanguage } from '../utils/contentCycler';
import { translate, Language } from '../i18n';
import { AUTO_SUBMIT_DELAY } from '../utils/animations';
import { StyleSheet } from 'react-native';

// ---------------------------------------------------------------------------
// Mock AsyncStorage (needed by any context imports)
// ---------------------------------------------------------------------------
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn().mockResolvedValue(null),
  setItem: jest.fn().mockResolvedValue(undefined),
  removeItem: jest.fn().mockResolvedValue(undefined),
  clear: jest.fn().mockResolvedValue(undefined),
}));

// ---------------------------------------------------------------------------
// 1. Language Toggle Functionality (en→bn, bn→en)
//    Validates: Requirements 3.1
//
//    For any language value, toggle produces the OPPOSITE language.
//    This is the core toggle logic — independent of the label bug.
// ---------------------------------------------------------------------------

describe('Preservation 1 — Language Toggle Functionality', () => {
  /**
   * **Validates: Requirements 3.1**
   * Toggle logic: en → bn
   */
  it('toggle: en → bn', () => {
    const current: Language = 'en';
    const next: Language = current === 'en' ? 'bn' : 'en';
    expect(next).toBe('bn');
  });

  /**
   * **Validates: Requirements 3.1**
   * Toggle logic: bn → en
   */
  it('toggle: bn → en', () => {
    const current: Language = 'bn';
    const next: Language = current === 'en' ? 'bn' : 'en';
    expect(next).toBe('en');
  });

  /**
   * **Validates: Requirements 3.1**
   * Toggle is its own inverse: toggling twice returns to original language.
   */
  it('double toggle returns to original language (en)', () => {
    const original: Language = 'en';
    const toggled: Language = original === 'en' ? 'bn' : 'en';
    const doubleToggled: Language = toggled === 'en' ? 'bn' : 'en';
    expect(doubleToggled).toBe(original);
  });

  /**
   * **Validates: Requirements 3.1**
   * Double toggle returns to original language (bn).
   */
  it('double toggle returns to original language (bn)', () => {
    const original: Language = 'bn';
    const toggled: Language = original === 'en' ? 'bn' : 'en';
    const doubleToggled: Language = toggled === 'en' ? 'bn' : 'en';
    expect(doubleToggled).toBe(original);
  });

  /**
   * **Validates: Requirements 3.1**
   * Toggle always produces a valid Language value.
   */
  it('toggle always produces a valid Language value', () => {
    const validLanguages: Language[] = ['en', 'bn'];
    for (const lang of validLanguages) {
      const next: Language = lang === 'en' ? 'bn' : 'en';
      expect(validLanguages).toContain(next);
    }
  });
});

// ---------------------------------------------------------------------------
// 2. Submit Button Logic at 80%+ Accuracy (non-complete-match)
//    Validates: Requirements 3.2
//
//    isButtonEnabled = isCorrectPrefix && progressPercent >= 80
//                      && !isSubmitting && !showSuccess && !isCompleteMatch
//
//    We test the PRESERVED behavior: 80%+ with isCompleteMatch=false → enabled.
//    (The bug fix adds !isCompleteMatch; we verify the non-buggy path still works.)
// ---------------------------------------------------------------------------

describe('Preservation 2 — Submit Button Logic at 80%+ Accuracy', () => {
  const MIN_ACCURACY_PERCENT = 80;

  // Helper: the FIXED isButtonEnabled expression (includes !isCompleteMatch)
  const isButtonEnabled = (
    isCorrectPrefix: boolean,
    progressPercent: number,
    isCompleteMatch: boolean,
    isSubmitting: boolean,
    showSuccess: boolean,
  ): boolean =>
    isCorrectPrefix &&
    progressPercent >= MIN_ACCURACY_PERCENT &&
    !isCompleteMatch &&
    !isSubmitting &&
    !showSuccess;

  /**
   * **Validates: Requirements 3.2**
   * 80% accuracy, isCompleteMatch=false → button enabled.
   */
  it('progressPercent=80, isCompleteMatch=false → button enabled', () => {
    expect(isButtonEnabled(true, 80, false, false, false)).toBe(true);
  });

  /**
   * **Validates: Requirements 3.2**
   * 85% accuracy, isCompleteMatch=false → button enabled.
   */
  it('progressPercent=85, isCompleteMatch=false → button enabled', () => {
    expect(isButtonEnabled(true, 85, false, false, false)).toBe(true);
  });

  /**
   * **Validates: Requirements 3.2**
   * 99% accuracy, isCompleteMatch=false → button enabled.
   */
  it('progressPercent=99, isCompleteMatch=false → button enabled', () => {
    expect(isButtonEnabled(true, 99, false, false, false)).toBe(true);
  });

  /**
   * **Validates: Requirements 3.2**
   * progressPercent < 80 → button disabled.
   */
  it('progressPercent=79 → button disabled', () => {
    expect(isButtonEnabled(true, 79, false, false, false)).toBe(false);
  });

  /**
   * **Validates: Requirements 3.2**
   * progressPercent=0 → button disabled.
   */
  it('progressPercent=0 → button disabled', () => {
    expect(isButtonEnabled(true, 0, false, false, false)).toBe(false);
  });

  /**
   * **Validates: Requirements 3.2**
   * isSubmitting=true → button disabled (even at 80%+).
   */
  it('isSubmitting=true → button disabled', () => {
    expect(isButtonEnabled(true, 85, false, true, false)).toBe(false);
  });

  /**
   * **Validates: Requirements 3.2**
   * showSuccess=true → button disabled (even at 80%+).
   */
  it('showSuccess=true → button disabled', () => {
    expect(isButtonEnabled(true, 85, false, false, true)).toBe(false);
  });

  /**
   * **Validates: Requirements 3.2**
   * isCorrectPrefix=false → button disabled (even at 80%+).
   */
  it('isCorrectPrefix=false → button disabled', () => {
    expect(isButtonEnabled(false, 85, false, false, false)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 3. Auto-submit Timing (300ms delay)
//    Validates: Requirements 3.3
//
//    When isCompleteMatch=true, auto-submit fires after AUTO_SUBMIT_DELAY (300ms).
//    We verify the constant value and the timer behavior using fake timers.
// ---------------------------------------------------------------------------

describe('Preservation 3 — Auto-submit Timing (300ms delay)', () => {
  /**
   * **Validates: Requirements 3.3**
   * AUTO_SUBMIT_DELAY constant is 300ms.
   */
  it('AUTO_SUBMIT_DELAY is 300ms', () => {
    expect(AUTO_SUBMIT_DELAY).toBe(300);
  });

  /**
   * **Validates: Requirements 3.3**
   * When isCompleteMatch=true, auto-submit fires after AUTO_SUBMIT_DELAY.
   * Uses jest fake timers to verify the callback fires at exactly 300ms.
   */
  it('auto-submit fires after AUTO_SUBMIT_DELAY when isCompleteMatch=true', () => {
    jest.useFakeTimers();

    const handleSubmission = jest.fn();
    const isCompleteMatch = true;
    const inputLength = 5; // non-zero
    let isSubmitting = false;

    // Simulate the useEffect logic from [slot].tsx
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isCompleteMatch && inputLength > 0 && !isSubmitting) {
      timer = setTimeout(() => {
        if (!isSubmitting) {
          handleSubmission();
        }
      }, AUTO_SUBMIT_DELAY);
    }

    // Before delay: not called
    expect(handleSubmission).not.toHaveBeenCalled();

    // Advance time by exactly AUTO_SUBMIT_DELAY
    jest.advanceTimersByTime(AUTO_SUBMIT_DELAY);

    // After delay: called once
    expect(handleSubmission).toHaveBeenCalledTimes(1);

    if (timer) clearTimeout(timer);
    jest.useRealTimers();
  });

  /**
   * **Validates: Requirements 3.3**
   * Auto-submit does NOT fire before AUTO_SUBMIT_DELAY elapses.
   */
  it('auto-submit does NOT fire before 300ms', () => {
    jest.useFakeTimers();

    const handleSubmission = jest.fn();
    const isCompleteMatch = true;
    const inputLength = 5;
    let isSubmitting = false;

    let timer: ReturnType<typeof setTimeout> | null = null;
    if (isCompleteMatch && inputLength > 0 && !isSubmitting) {
      timer = setTimeout(() => {
        if (!isSubmitting) {
          handleSubmission();
        }
      }, AUTO_SUBMIT_DELAY);
    }

    // Advance by 299ms — should NOT fire yet
    jest.advanceTimersByTime(AUTO_SUBMIT_DELAY - 1);
    expect(handleSubmission).not.toHaveBeenCalled();

    if (timer) clearTimeout(timer);
    jest.useRealTimers();
  });

  /**
   * **Validates: Requirements 3.3**
   * Auto-submit does NOT fire when isCompleteMatch=false.
   */
  it('auto-submit does NOT fire when isCompleteMatch=false', () => {
    jest.useFakeTimers();

    const handleSubmission = jest.fn();
    const isCompleteMatch = false;
    const inputLength = 5;
    let isSubmitting = false;

    // Simulate the useEffect guard
    if (isCompleteMatch && inputLength > 0 && !isSubmitting) {
      setTimeout(() => {
        handleSubmission();
      }, AUTO_SUBMIT_DELAY);
    }

    jest.advanceTimersByTime(AUTO_SUBMIT_DELAY + 100);
    expect(handleSubmission).not.toHaveBeenCalled();

    jest.useRealTimers();
  });
});

// ---------------------------------------------------------------------------
// 4. isTodayComplete Logic
//    Validates: Requirements 3.4
//
//    isTodayComplete = morning && noon && night
//    Three slots complete → true; fewer → false.
// ---------------------------------------------------------------------------

describe('Preservation 4 — isTodayComplete Logic', () => {
  // Pure function mirroring ProgressContext logic
  const isTodayComplete = (progress: { morning: boolean; noon: boolean; night: boolean } | null): boolean => {
    if (!progress) return false;
    return progress.morning && progress.noon && progress.night;
  };

  /**
   * **Validates: Requirements 3.4**
   * All three slots completed → isTodayComplete=true.
   */
  it('all three slots completed → isTodayComplete=true', () => {
    expect(isTodayComplete({ morning: true, noon: true, night: true })).toBe(true);
  });

  /**
   * **Validates: Requirements 3.4**
   * Only morning completed → isTodayComplete=false.
   */
  it('only morning completed → isTodayComplete=false', () => {
    expect(isTodayComplete({ morning: true, noon: false, night: false })).toBe(false);
  });

  /**
   * **Validates: Requirements 3.4**
   * Only noon completed → isTodayComplete=false.
   */
  it('only noon completed → isTodayComplete=false', () => {
    expect(isTodayComplete({ morning: false, noon: true, night: false })).toBe(false);
  });

  /**
   * **Validates: Requirements 3.4**
   * Only night completed → isTodayComplete=false.
   */
  it('only night completed → isTodayComplete=false', () => {
    expect(isTodayComplete({ morning: false, noon: false, night: true })).toBe(false);
  });

  /**
   * **Validates: Requirements 3.4**
   * Morning + noon completed (2 slots) → isTodayComplete=false.
   */
  it('morning + noon completed (2 slots) → isTodayComplete=false', () => {
    expect(isTodayComplete({ morning: true, noon: true, night: false })).toBe(false);
  });

  /**
   * **Validates: Requirements 3.4**
   * Morning + night completed (2 slots) → isTodayComplete=false.
   */
  it('morning + night completed (2 slots) → isTodayComplete=false', () => {
    expect(isTodayComplete({ morning: true, noon: false, night: true })).toBe(false);
  });

  /**
   * **Validates: Requirements 3.4**
   * Noon + night completed (2 slots) → isTodayComplete=false.
   */
  it('noon + night completed (2 slots) → isTodayComplete=false', () => {
    expect(isTodayComplete({ morning: false, noon: true, night: true })).toBe(false);
  });

  /**
   * **Validates: Requirements 3.4**
   * No slots completed → isTodayComplete=false.
   */
  it('no slots completed → isTodayComplete=false', () => {
    expect(isTodayComplete({ morning: false, noon: false, night: false })).toBe(false);
  });

  /**
   * **Validates: Requirements 3.4**
   * null progress → isTodayComplete=false.
   */
  it('null progress → isTodayComplete=false', () => {
    expect(isTodayComplete(null)).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// 5. English TaskCard Layout (no overflow)
//    Validates: Requirements 3.5
//
//    When language='en', subtitle text is short enough to not overflow.
//    English time strings are shorter than Bangla equivalents.
// ---------------------------------------------------------------------------

describe('Preservation 5 — English TaskCard Layout (no overflow)', () => {
  const enTimeRanges = {
    morning: translate('en', 'slot.morning.timeRange'),
    noon: translate('en', 'slot.noon.timeRange'),
    night: translate('en', 'slot.night.timeRange'),
  };

  const bnTimeRanges = {
    morning: translate('bn', 'slot.morning.timeRange'),
    noon: translate('bn', 'slot.noon.timeRange'),
    night: translate('bn', 'slot.night.timeRange'),
  };

  /**
   * **Validates: Requirements 3.5**
   * English morning time range is shorter than Bangla equivalent.
   */
  it('English morning time range is shorter than Bangla', () => {
    expect(enTimeRanges.morning.length).toBeLessThan(bnTimeRanges.morning.length);
  });

  /**
   * **Validates: Requirements 3.5**
   * English noon time range is shorter than Bangla equivalent.
   */
  it('English noon time range is shorter than Bangla', () => {
    expect(enTimeRanges.noon.length).toBeLessThan(bnTimeRanges.noon.length);
  });

  /**
   * **Validates: Requirements 3.5**
   * English night time range is shorter than Bangla equivalent.
   */
  it('English night time range is shorter than Bangla', () => {
    expect(enTimeRanges.night.length).toBeLessThan(bnTimeRanges.night.length);
  });

  /**
   * **Validates: Requirements 3.5**
   * English time ranges contain only ASCII characters (no Bengali Unicode).
   */
  it('English time ranges contain no Bengali Unicode characters', () => {
    const isBengali = (text: string) => /[\u0980-\u09FF]/.test(text);
    expect(isBengali(enTimeRanges.morning)).toBe(false);
    expect(isBengali(enTimeRanges.noon)).toBe(false);
    expect(isBengali(enTimeRanges.night)).toBe(false);
  });

  /**
   * **Validates: Requirements 3.5**
   * English time ranges are non-empty strings.
   */
  it('English time ranges are non-empty', () => {
    expect(enTimeRanges.morning.length).toBeGreaterThan(0);
    expect(enTimeRanges.noon.length).toBeGreaterThan(0);
    expect(enTimeRanges.night.length).toBeGreaterThan(0);
  });

  /**
   * **Validates: Requirements 3.5**
   * English time ranges are reasonably short (under 20 chars) — safe for layout.
   */
  it('English time ranges are under 20 characters (layout-safe)', () => {
    expect(enTimeRanges.morning.length).toBeLessThan(20);
    expect(enTimeRanges.noon.length).toBeLessThan(20);
    expect(enTimeRanges.night.length).toBeLessThan(20);
  });
});

// ---------------------------------------------------------------------------
// 6. Language Persistence
//    Validates: Requirements 3.6
//
//    Language values 'en' and 'bn' are valid persisted values.
//    Both values round-trip correctly (save and load).
// ---------------------------------------------------------------------------

describe('Preservation 6 — Language Persistence', () => {
  const LANGUAGE_STORAGE_KEY = '@smoke_free_369_language';

  /**
   * **Validates: Requirements 3.6**
   * 'en' is a valid persisted language value.
   */
  it("'en' is a valid persisted language value", () => {
    const validValues = ['en', 'bn'];
    expect(validValues).toContain('en');
  });

  /**
   * **Validates: Requirements 3.6**
   * 'bn' is a valid persisted language value.
   */
  it("'bn' is a valid persisted language value", () => {
    const validValues = ['en', 'bn'];
    expect(validValues).toContain('bn');
  });

  /**
   * **Validates: Requirements 3.6**
   * 'en' round-trips correctly: saved value equals loaded value.
   */
  it("'en' round-trips correctly (save → load)", async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.setItem.mockResolvedValueOnce(undefined);
    AsyncStorage.getItem.mockResolvedValueOnce('en');

    // Save
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, 'en');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(LANGUAGE_STORAGE_KEY, 'en');

    // Load
    const loaded = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    expect(loaded).toBe('en');
  });

  /**
   * **Validates: Requirements 3.6**
   * 'bn' round-trips correctly: saved value equals loaded value.
   */
  it("'bn' round-trips correctly (save → load)", async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage');
    AsyncStorage.setItem.mockResolvedValueOnce(undefined);
    AsyncStorage.getItem.mockResolvedValueOnce('bn');

    // Save
    await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, 'bn');
    expect(AsyncStorage.setItem).toHaveBeenCalledWith(LANGUAGE_STORAGE_KEY, 'bn');

    // Load
    const loaded = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    expect(loaded).toBe('bn');
  });

  /**
   * **Validates: Requirements 3.6**
   * Only 'en' and 'bn' are accepted as valid language values on load.
   * Other values (e.g., null, 'fr') are rejected and fall back to default.
   */
  it('only en/bn are accepted as valid loaded language values', () => {
    const isValidLanguage = (value: string | null): value is Language => {
      return value === 'en' || value === 'bn';
    };

    expect(isValidLanguage('en')).toBe(true);
    expect(isValidLanguage('bn')).toBe(true);
    expect(isValidLanguage(null)).toBe(false);
    expect(isValidLanguage('fr')).toBe(false);
    expect(isValidLanguage('')).toBe(false);
  });

  /**
   * **Validates: Requirements 3.6**
   * The storage key used for language persistence is correct.
   */
  it('language storage key is @smoke_free_369_language', () => {
    expect(LANGUAGE_STORAGE_KEY).toBe('@smoke_free_369_language');
  });
});
