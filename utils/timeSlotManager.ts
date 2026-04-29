import { TimeSlot } from '../types';
import { toBengaliNumber, getBengaliTimePeriod } from './bengaliNumber';

/**
 * Time Slot Manager
 * 
 * Manages time slots based on the 369 methodology:
 * - Morning: 08:00 (8 AM) to 12:59
 * - Noon: 13:00 (1 PM) to 17:59
 * - Night: 18:00 (6 PM) to 04:59 (next day)
 * 
 * Note: 05:00 - 07:59 is a rest period (returns null)
 */

/**
 * Format a Date object as YYYY-MM-DD using local timezone
 * This ensures consistent date keys regardless of UTC offset
 * @param date The date to format
 * @returns Date string in YYYY-MM-DD format (local timezone)
 */
export const formatLocalDateKey = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Slot start hours for reference
const SLOT_START_HOURS: Record<TimeSlot, number> = {
  morning: 8,
  noon: 13,
  night: 18,
};

/**
 * Get the current active time slot based on system time
 * @returns The current TimeSlot or null if outside active hours
 */
export const getCurrentSlot = (): TimeSlot | null => {
  const hour = new Date().getHours();
  
  // Morning: 08:00 - 12:59
  if (hour >= 8 && hour < 13) {
    return 'morning';
  }
  
  // Noon: 13:00 - 17:59
  if (hour >= 13 && hour < 18) {
    return 'noon';
  }
  
  // Night: 18:00 - 04:59 (handles midnight crossover)
  if (hour >= 18 || hour < 5) {
    return 'night';
  }
  
  // Rest period: 05:00 - 07:59
  return null;
};

/**
 * Get the status of a slot for today
 * @param slot The time slot to check
 * @returns 'active' if currently in this slot, 'upcoming' if slot hasn't started yet today, 'passed' if slot time has passed today
 */
export type SlotStatus = 'active' | 'upcoming' | 'passed';

export const getSlotStatus = (slot: TimeSlot): SlotStatus => {
  const currentSlot = getCurrentSlot();
  const hour = new Date().getHours();
  
  // If this is the current slot, it's active
  if (currentSlot === slot) {
    return 'active';
  }
  
  // Special handling for night slot (crosses midnight: 18:00-04:59)
  if (slot === 'night') {
    // Night is active during 18:00-23:59 OR 00:00-04:59
    if (hour >= 18 || hour < 5) {
      return 'active';
    }
    // Night is upcoming during 05:00-17:59
    return 'upcoming';
    // Note: Night slot never returns 'passed' because it spans midnight
  }
  
  const slotStartHour = SLOT_START_HOURS[slot];
  
  // For morning and noon slots
  if (hour < slotStartHour) {
    return 'upcoming';
  }
  
  return 'passed';
};

/**
 * Get colloquial Bengali time for a slot's start time
 * @param slot The time slot
 * @returns Colloquial Bengali time string like "সকাল ৮টা", "দুপুর ১টা", "সন্ধ্যা ৬টা"
 */
export const getSlotStartTimeColloquial = (slot: TimeSlot): string => {
  switch (slot) {
    case 'morning':
      return `সকাল ${toBengaliNumber(8)}টা`;
    case 'noon':
      return `দুপুর ${toBengaliNumber(1)}টা`;
    case 'night':
      return `সন্ধ্যা ${toBengaliNumber(6)}টা`;
  }
};

/**
 * Check if a specific slot is currently active
 * @param slot The time slot to check
 * @returns true if the slot matches the current time slot
 */
export const isSlotActive = (slot: TimeSlot): boolean => {
  return getCurrentSlot() === slot;
};

/**
 * Get the display time range for a slot in Bengali
 * @param slot The time slot
 * @returns A formatted Bengali string showing the time range
 */
export const getSlotTimeRange = (slot: TimeSlot): string => {
  switch (slot) {
    case 'morning':
      return `${getBengaliTimePeriod(8)} ${toBengaliNumber(8)}:${toBengaliNumber('00')} - ${getBengaliTimePeriod(13)} ${toBengaliNumber(1)}:${toBengaliNumber('00')}`;
    case 'noon':
      return `${getBengaliTimePeriod(13)} ${toBengaliNumber(1)}:${toBengaliNumber('00')} - ${getBengaliTimePeriod(18)} ${toBengaliNumber(6)}:${toBengaliNumber('00')}`;
    case 'night':
      return `${getBengaliTimePeriod(18)} ${toBengaliNumber(6)}:${toBengaliNumber('00')} - ${getBengaliTimePeriod(5)} ${toBengaliNumber(5)}:${toBengaliNumber('00')}`;
  }
};

/**
 * Get the effective date key for progress tracking
 * Handles midnight crossover for night slot (00:00-04:59 belongs to previous day)
 * @param slot Optional time slot - if 'night' and hour is 00:00-04:59, returns previous day
 * @returns Date string in YYYY-MM-DD format (local timezone)
 */
export const getEffectiveDateKey = (slot?: TimeSlot): string => {
  const now = new Date();
  const hour = now.getHours();
  
  // If we're past midnight (00:00-04:59), use previous day's date for ALL slots
  if (hour >= 0 && hour < DAY_BOUNDARY_HOUR) {
    const previousDay = new Date(now);
    previousDay.setDate(previousDay.getDate() - 1);
    return formatLocalDateKey(previousDay);
  }
  
  return formatLocalDateKey(now);
};

/**
 * Get today's effective date key for dashboard display
 * If current time is 00:00-04:59, we're still in "yesterday's" night slot context
 * @returns Date string in YYYY-MM-DD format (local timezone)
 */
export const getTodayEffectiveDateKey = (): string => {
  const now = new Date();
  const hour = now.getHours();
  
  // During 00:00-04:59, we're still in the previous day's night slot
  if (hour >= 0 && hour < 5) {
    const previousDay = new Date(now);
    previousDay.setDate(previousDay.getDate() - 1);
    return formatLocalDateKey(previousDay);
  }
  
  return formatLocalDateKey(now);
};

/**
 * Get today's effective Date object for calendar/history views
 * Handles midnight crossover: during 00:00-04:59, returns previous day's Date
 * This ensures calendar loops don't include "tomorrow" (in effective terms)
 * @returns Date object representing the effective "today"
 */
export const getEffectiveTodayDate = (): Date => {
  const now = new Date();
  const hour = now.getHours();
  
  // During 00:00-04:59, we're still in the previous day's night slot
  if (hour >= 0 && hour < 5) {
    const previousDay = new Date(now);
    previousDay.setDate(previousDay.getDate() - 1);
    return previousDay;
  }
  
  return now;
};

/**
 * Get the effective start date for first-time app initialization
 * This ensures that when the app is installed during midnight crossover hours (00:00-04:59),
 * the startDate aligns with getTodayEffectiveDateKey() to prevent content/progress misalignment
 * @returns Date string in YYYY-MM-DD format representing the effective start date
 */
export const getEffectiveStartDate = (): string => {
  return getTodayEffectiveDateKey();
};

/**
 * Get the effective start date from a specific reference time.
 * This prevents race conditions during initialization at day boundary (5:00 AM).
 * 
 * By capturing the time ONCE at the start of initialization and using this function,
 * we ensure all date calculations within a single operation use the same reference point.
 * 
 * @param referenceTime The captured Date object to use for calculations
 * @returns Date string in YYYY-MM-DD format representing the effective start date
 */
export const getEffectiveStartDateFromTime = (referenceTime: Date): string => {
  const hour = referenceTime.getHours();
  
  // During 00:00-04:59, we're still in the previous day's night slot
  if (hour >= 0 && hour < DAY_BOUNDARY_HOUR) {
    const previousDay = new Date(referenceTime);
    previousDay.setDate(previousDay.getDate() - 1);
    return formatLocalDateKey(previousDay);
  }
  
  return formatLocalDateKey(referenceTime);
};

/**
 * Helper to parse YYYY-MM-DD date keys into numeric components.
 * Optimized parsing: avoid split() and map() array allocations.
 *
 * @param dateKey Date string in YYYY-MM-DD format
 * @returns Object with year, month, and day as numbers
 */
const parseDateKey = (dateKey: string): { year: number; month: number; day: number } => {
  return {
    year: Number(dateKey.substring(0, 4)),
    month: Number(dateKey.substring(5, 7)),
    day: Number(dateKey.substring(8, 10)),
  };
};

/**
 * DAY_BOUNDARY_HOUR defines when a new "effective day" begins.
 * Days transition at 5:00 AM local time, not midnight.
 * This means:
 * - 00:00-04:59 belongs to the previous effective day
 * - 05:00-23:59 belongs to the current calendar day
 */
export const DAY_BOUNDARY_HOUR = 5;

/**
 * Get the effective day boundary timestamp for a given date key.
 * The effective day starts at 5:00 AM on that calendar date.
 * 
 * For example, for date "2025-12-01":
 * - Returns timestamp for 2025-12-01 05:00:00 local time
 * - This is when "Day 1" (if startDate is 2025-12-01) ends and "Day 2" begins
 * 
 * @param dateKey Date string in YYYY-MM-DD format
 * @returns Timestamp (ms) representing 5:00 AM on the NEXT calendar day
 */
export const getNextDayBoundaryTimestamp = (dateKey: string): number => {
  const { year, month, day } = parseDateKey(dateKey);

  // Create date at 5:00 AM on the NEXT calendar day
  // This is when the effective day transitions
  const nextDay = new Date(year, month - 1, day + 1, DAY_BOUNDARY_HOUR, 0, 0, 0);
  return nextDay.getTime();
};

/**
 * Calculate elapsed effective days since start date.
 * 
 * This handles the midnight crossover edge case properly:
 * - Day 1 starts when the user installs the app
 * - Day 1 ends at 5:00 AM on the next calendar day after startDate
 * - Each subsequent day also transitions at 5:00 AM
 * 
 * Uses calendar date comparison instead of millisecond arithmetic to handle
 * DST transitions correctly (days with 23 or 25 hours).
 * 
 * Examples:
 * - Install at 11:59 PM on Dec 1 → Day 1 until 5:00 AM Dec 2
 * - Install at 2:00 AM on Dec 1 → Day 1 until 5:00 AM Dec 2 (not Dec 1!)
 * - Install at 6:00 AM on Dec 1 → Day 1 until 5:00 AM Dec 2
 * 
 * @param startDateKey The start date in YYYY-MM-DD format (effective date when app was installed)
 * @returns Number of elapsed days (1-based: Day 1, Day 2, etc.)
 */
export const calculateEffectiveElapsedDays = (startDateKey: string): number => {
  // Get the current effective date key (respects 5:00 AM boundary)
  const currentEffectiveDateKey = getTodayEffectiveDateKey();
  
  // Parse dates using optimized helper
  const { year: startYear, month: startMonth, day: startDay } = parseDateKey(startDateKey);
  const { year: currentYear, month: currentMonth, day: currentDay } = parseDateKey(currentEffectiveDateKey);
  
  // Create Date objects at noon (12:00) to avoid any DST edge cases during comparison
  // Using noon ensures we're safely in the middle of the day regardless of DST transitions
  const startDate = new Date(startYear, startMonth - 1, startDay, 12, 0, 0, 0);
  const currentDate = new Date(currentYear, currentMonth - 1, currentDay, 12, 0, 0, 0);
  
  // Calculate difference in calendar days
  // Using Math.round to handle any floating point imprecision from DST
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysDifference = Math.round((currentDate.getTime() - startDate.getTime()) / msPerDay);
  
  // Day 1 is the start date, so elapsed days = difference + 1
  // Ensure minimum of 1 (in case of any edge cases)
  return Math.max(1, daysDifference + 1);
};

/**
 * Maximum day number for the 369 methodology branding.
 * After this day, the display caps at 369 while internal tracking continues.
 */
export const MAX_DISPLAY_DAY = 369;

/**
 * Get the display day number, capped at 369 for UI purposes.
 * This preserves the "369 ধোঁয়া-মুক্ত পথ" branding while allowing
 * internal tracking to continue beyond day 369.
 * 
 * @param totalElapsedDays The actual number of elapsed days
 * @returns Display day number (1-369)
 */
export const getDisplayDay = (totalElapsedDays: number): number => {
  return Math.min(totalElapsedDays, MAX_DISPLAY_DAY);
};

/**
 * Check if the user has completed the 369-day journey.
 * 
 * @param totalElapsedDays The actual number of elapsed days
 * @returns true if user has reached or exceeded 369 days
 */
export const isJourneyComplete = (totalElapsedDays: number): boolean => {
  return totalElapsedDays >= MAX_DISPLAY_DAY;
};

/**
 * Format a YYYY-MM-DD date key as a human-readable string.
 * @param dateKey Date string in YYYY-MM-DD format
 * @param language 'en' or 'bn'
 * @returns e.g. "January 15, 2025" for 'en'
 */
export const formatDateKeyHumanReadable = (dateKey: string, language: string): string => {
  const { year, month, day } = parseDateKey(dateKey);

  const date = new Date(year, month - 1, day);
  if (language === 'bn') {
    const bnMonths = ['জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর'];
    return `${bnMonths[date.getMonth()]} ${toBengaliNumber(date.getDate())}, ${toBengaliNumber(date.getFullYear())}`;
  }
  const enMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${enMonths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
};
