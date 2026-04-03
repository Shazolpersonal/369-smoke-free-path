import { DailyProgress, DayStatus } from '../types';

/**
 * Determines the status of a day based on task completion.
 * Used for History/Calendar view color coding.
 *
 * This is the canonical implementation handling all 5 statuses:
 * 'complete', 'partial', 'missed', 'pending', 'future'
 *
 * @param progress - The daily progress object (null if no progress recorded)
 * @param isToday - Whether this day is the current effective today
 * @param isFuture - Whether this day is in the future
 * @param dateKey - Optional YYYY-MM-DD date key for startDate comparison
 * @param startDate - Optional journey start date; days before this are treated as 'future'
 * @returns DayStatus
 */
export const getDayStatus = (
  progress: DailyProgress | null,
  isToday: boolean = false,
  isFuture: boolean = false,
  dateKey?: string,
  startDate?: string | null
): DayStatus => {
  if (isFuture) return 'future';
  if (startDate && dateKey && dateKey < startDate) return 'future';
  if (!progress) return isToday ? 'pending' : 'missed';

  const completed = [progress.morning, progress.noon, progress.night].filter(Boolean).length;
  if (completed === 3) return 'complete';
  if (completed > 0) return isToday ? 'pending' : 'partial';
  return isToday ? 'pending' : 'missed';
};
