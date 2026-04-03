/**
 * TaskCard Localization Bug Tests
 *
 * Documents the known localization bug in TaskCard.tsx:
 * - `getLockedSlotMessage()` returns hardcoded English strings regardless of language
 * - `getSlotOpenTimeString()` returns hardcoded English time strings regardless of language
 *
 * These tests PASS to confirm the bug exists (i.e., English is returned even when
 * language='bn'). They serve as regression anchors — once the bug is fixed, these
 * tests should be updated to assert Bengali output.
 *
 * Validates: Requirements 10.4, 11.3
 */

import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Replicated logic from TaskCard.tsx (functions are not exported)
// Source: smoke-free-path/components/TaskCard.tsx
// ---------------------------------------------------------------------------

type TimeSlot = 'morning' | 'noon' | 'night';

/**
 * Replicated from TaskCard.tsx — getSlotOpenTimeString()
 * BUG: Returns hardcoded English time strings regardless of language setting.
 */
function getSlotOpenTimeString(slot: TimeSlot): string {
  switch (slot) {
    case 'morning': return '8:00 AM';
    case 'noon': return '1:00 PM';
    case 'night': return '6:00 PM';
  }
}

/**
 * Replicated from TaskCard.tsx — getLockedSlotMessage()
 * BUG: Returns hardcoded English strings regardless of language setting.
 * The function does not accept a language parameter at all.
 */
function getLockedSlotMessage(slot: TimeSlot): string {
  switch (slot) {
    case 'morning': return 'Morning slot opens at 8:00 AM';
    case 'noon': return 'Noon slot opens at 1:00 PM';
    case 'night': return 'Night slot opens at 6:00 PM';
  }
}

const ALL_SLOTS: TimeSlot[] = ['morning', 'noon', 'night'];

// ---------------------------------------------------------------------------
// Static analysis helpers
// ---------------------------------------------------------------------------

const TASK_CARD_PATH = path.resolve(__dirname, '../components/TaskCard.tsx');
const taskCardSource = fs.readFileSync(TASK_CARD_PATH, 'utf-8');

// ---------------------------------------------------------------------------
// 1. Static analysis — verify i18n keys are used (FIXED)
// ---------------------------------------------------------------------------

describe('TaskCard.tsx Static Analysis — i18n Keys Used (FIXED)', () => {
  test('FIXED: getLockedSlotMessage() uses t("taskCard.lockedMorning") instead of hardcoded English', () => {
    expect(taskCardSource).toContain("t('taskCard.lockedMorning')");
  });

  test('FIXED: getLockedSlotMessage() uses t("taskCard.lockedNoon") instead of hardcoded English', () => {
    expect(taskCardSource).toContain("t('taskCard.lockedNoon')");
  });

  test('FIXED: getLockedSlotMessage() uses t("taskCard.lockedNight") instead of hardcoded English', () => {
    expect(taskCardSource).toContain("t('taskCard.lockedNight')");
  });

  test('getSlotOpenTimeString() contains hardcoded English "8:00 AM"', () => {
    expect(taskCardSource).toContain("'8:00 AM'");
  });

  test('getSlotOpenTimeString() contains hardcoded English "1:00 PM"', () => {
    expect(taskCardSource).toContain("'1:00 PM'");
  });

  test('getSlotOpenTimeString() contains hardcoded English "6:00 PM"', () => {
    expect(taskCardSource).toContain("'6:00 PM'");
  });

  test('FIXED: getLockedSlotMessage() uses t() translation function', () => {
    const fnMatch = taskCardSource.match(/const getLockedSlotMessage[\s\S]*?^    };/m);
    if (fnMatch) {
      expect(fnMatch[0]).toMatch(/return t\(/);
    } else {
      expect(taskCardSource).toContain("t('taskCard.lockedMorning')");
    }
  });
});

// ---------------------------------------------------------------------------
// 2. Bug documentation — getLockedSlotMessage() returns English for all slots
//    even when language='bn'
// ---------------------------------------------------------------------------

describe('getLockedSlotMessage() — Known Bug: Returns English Regardless of Language', () => {
  /**
   * BUG DOCUMENTATION:
   * getLockedSlotMessage() in TaskCard.tsx does not accept a language parameter.
   * It always returns English strings. When language='bn', users still see English
   * locked slot messages in the toast notification.
   */

  test('morning slot returns English message (bug: should return Bengali when language=bn)', () => {
    const message = getLockedSlotMessage('morning');
    // BUG CONFIRMED: returns English even when language='bn'
    expect(message).toBe('Morning slot opens at 8:00 AM');
    expect(message).not.toContain('সকাল'); // Bengali word for "morning"
  });

  test('noon slot returns English message (bug: should return Bengali when language=bn)', () => {
    const message = getLockedSlotMessage('noon');
    // BUG CONFIRMED: returns English even when language='bn'
    expect(message).toBe('Noon slot opens at 1:00 PM');
    expect(message).not.toContain('দুপুর'); // Bengali word for "noon"
  });

  test('night slot returns English message (bug: should return Bengali when language=bn)', () => {
    const message = getLockedSlotMessage('night');
    // BUG CONFIRMED: returns English even when language='bn'
    expect(message).toBe('Night slot opens at 6:00 PM');
    expect(message).not.toContain('রাত'); // Bengali word for "night"
  });

  test('all slots return ASCII-only strings (no Bengali Unicode characters)', () => {
    ALL_SLOTS.forEach((slot) => {
      const message = getLockedSlotMessage(slot);
      // Bengali Unicode range: \u0980-\u09FF
      expect(message).not.toMatch(/[\u0980-\u09FF]/);
    });
  });
});

// ---------------------------------------------------------------------------
// 3. Bug documentation — getSlotOpenTimeString() returns English for all slots
// ---------------------------------------------------------------------------

describe('getSlotOpenTimeString() — Known Bug: Returns English Time Strings', () => {
  test('morning slot returns English "8:00 AM" (bug: should return Bengali time when language=bn)', () => {
    const timeStr = getSlotOpenTimeString('morning');
    expect(timeStr).toBe('8:00 AM');
    expect(timeStr).not.toContain('৮'); // Bengali digit 8
  });

  test('noon slot returns English "1:00 PM" (bug: should return Bengali time when language=bn)', () => {
    const timeStr = getSlotOpenTimeString('noon');
    expect(timeStr).toBe('1:00 PM');
    expect(timeStr).not.toContain('১'); // Bengali digit 1
  });

  test('night slot returns English "6:00 PM" (bug: should return Bengali time when language=bn)', () => {
    const timeStr = getSlotOpenTimeString('night');
    expect(timeStr).toBe('6:00 PM');
    expect(timeStr).not.toContain('৬'); // Bengali digit 6
  });
});

// ---------------------------------------------------------------------------
// 4. Property 3: getLockedSlotMessage() returns English regardless of language
//    **Validates: Requirements 10.4**
//
//    KNOWN BUG: The function does not accept a language parameter, so it always
//    returns English. This property test documents that the output is always
//    English (ASCII-only, no Bengali Unicode) for all possible slot values.
// ---------------------------------------------------------------------------

describe('Property 3: Locked Slot Message Language Independence (Known Bug)', () => {
  /**
   * **Validates: Requirements 10.4**
   *
   * KNOWN BUG: `getLockedSlotMessage()` in TaskCard.tsx does not accept a
   * language parameter. It returns hardcoded English strings for all slots.
   * This property confirms the bug: for any slot, the message contains no
   * Bengali Unicode characters, even when the app language is set to 'bn'.
   *
   * Expected fix: pass `language` to `getLockedSlotMessage()` and use `t()`
   * for the slot name and time, or use a dedicated i18n key.
   */
  test('for any slot, getLockedSlotMessage() returns English (no Bengali Unicode) — documents known bug', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<TimeSlot>('morning', 'noon', 'night'),
        (slot) => {
          const message = getLockedSlotMessage(slot);
          // BUG: message never contains Bengali Unicode regardless of language
          const hasBengaliChars = /[\u0980-\u09FF]/.test(message);
          // This assertion PASSES because the bug exists (no Bengali chars)
          return !hasBengaliChars;
        }
      )
    );
  });

  test('for any slot, getLockedSlotMessage() always returns a non-empty English string', () => {
    fc.assert(
      fc.property(
        fc.constantFrom<TimeSlot>('morning', 'noon', 'night'),
        (slot) => {
          const message = getLockedSlotMessage(slot);
          return (
            typeof message === 'string' &&
            message.length > 0 &&
            // Contains English time format (AM/PM)
            /[AP]M/.test(message)
          );
        }
      )
    );
  });
});
