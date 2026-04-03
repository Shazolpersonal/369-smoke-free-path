/**
 * Bengali Number Utility
 * 
 * Converts English/Arabic numerals to Bengali numerals
 */

const BENGALI_DIGITS: Record<string, string> = {
  '0': '০',
  '1': '১',
  '2': '২',
  '3': '৩',
  '4': '৪',
  '5': '৫',
  '6': '৬',
  '7': '৭',
  '8': '৮',
  '9': '৯',
};

/**
 * Convert a number or string containing numbers to Bengali numerals
 * @param input Number or string to convert
 * @returns String with Bengali numerals
 */
export const toBengaliNumber = (input: number | string): string => {
  return String(input).replace(/[0-9]/g, (digit) => BENGALI_DIGITS[digit] || digit);
};

export const formatNumberByLanguage = (input: number | string, lang: 'en' | 'bn'): string => {
  if (lang === 'en') return String(input);
  return toBengaliNumber(input);
};

/**
 * Convert time string to Bengali format
 * @param hour Hour (0-23)
 * @param minute Minute (0-59)
 * @returns Formatted Bengali time string
 */
export const toBengaliTime = (hour: number, minute: number = 0): string => {
  const bengaliHour = toBengaliNumber(hour);
  const bengaliMinute = toBengaliNumber(minute.toString().padStart(2, '0'));
  return `${bengaliHour}:${bengaliMinute}`;
};

export const formatTimeByLanguage = (hour: number, minute: number = 0, lang: 'en' | 'bn'): string => {
  if (lang === 'en') {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const formattedMin = minute.toString().padStart(2, '0');
    return `${displayHour}:${formattedMin} ${period}`;
  }
  return toBengaliTime(hour, minute);
};

/**
 * Get Bengali time period name
 * @param hour Hour (0-23)
 * @returns Bengali time period (সকাল, দুপুর, বিকাল, সন্ধ্যা, রাত)
 */
export const getBengaliTimePeriod = (hour: number): string => {
  if (hour >= 5 && hour < 12) return 'সকাল';
  if (hour >= 12 && hour < 15) return 'দুপুর';
  if (hour >= 15 && hour < 17) return 'বিকাল';
  if (hour >= 17 && hour < 19) return 'সন্ধ্যা';
  return 'রাত';
};
