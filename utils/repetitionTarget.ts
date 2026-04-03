import { TimeSlot } from '../types';

/**
 * Returns the target repetition count for a given time slot.
 * Based on the 3-6-9 method:
 * - Morning: 3 repetitions
 * - Noon: 6 repetitions
 * - Night: 9 repetitions
 */
export const getTargetCount = (slot: TimeSlot): number => {
  switch (slot) {
    case 'morning':
      return 3;
    case 'noon':
      return 6;
    case 'night':
      return 9;
    default:
      return 0;
  }
};
