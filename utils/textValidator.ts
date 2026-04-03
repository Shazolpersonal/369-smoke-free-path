/**
 * Text Validator Utility
 * Handles normalization and validation of user input against target affirmation text.
 * Supports Bengali text with proper Unicode normalization and grapheme handling.
 * 
 * Requirements: 4.5, 5.1, 5.2, 5.3, 5.4
 */

import GraphemeSplitter from 'grapheme-splitter';

/**
 * Shared punctuation regex used by both normalize() and getDisplayText().
 * MUST be identical in both to ensure character position mapping works correctly.
 * 
 * Includes:
 * - Standard punctuation: . , ; : ! ? ' " ( ) - — –
 * - Smart quotes: \u201c \u201d \u2018 \u2019
 * - Bengali dari: । (U+0964) and ॥ (U+0965)
 */
const PUNCTUATION_REGEX = /[.,;:!?'"()\-—–\u201c\u201d\u2018\u2019।॥]/g;

/**
 * Normalizes text for comparison by:
 * - Applying Unicode NFC normalization (handles different keyboard outputs)
 * - Converting to lowercase (for case-insensitive comparison)
 * - Removing all punctuation (Bengali dari, commas, periods, etc.)
 * - Trimming whitespace from start and end
 * - Replacing multiple spaces with a single space
 * 
 * @param text - The input text to normalize
 * @returns The normalized text string
 */
export const normalize = (text: string): string => {
  return text
    .normalize('NFC')       // Unicode NFC normalization for consistent encoding
    .toLowerCase()
    .replace(PUNCTUATION_REGEX, '')  // Remove all punctuation including Bengali dari
    .replace(/\s+/g, ' ')   // Replace multiple spaces with single space
    .trim();                // Trim leading/trailing whitespace
};

/**
 * Creates display-ready text by removing punctuation but preserving case and spacing.
 * This ensures what user sees is exactly what they need to type.
 * Uses the SAME regex as normalize() to ensure character positions map correctly.
 * 
 * @param text - The original target text
 * @returns Display text without punctuation
 */
export const getDisplayText = (text: string): string => {
  return text
    .normalize('NFC')
    .replace(PUNCTUATION_REGEX, '')  // Same regex as normalize for consistent mapping
    .replace(/\s+/g, ' ')   // Multiple spaces → single space
    .trim();
};

/**
 * Splits text into grapheme clusters using grapheme-splitter library.
 * This correctly handles Bengali conjuncts (যুক্তাক্ষর) and combining characters.
 * Works reliably across all React Native environments (including Hermes).
 * 
 * @param text - The text to split into graphemes
 * @returns Array of grapheme strings
 */
export const splitIntoGraphemes = (text: string): string[] => {
  const splitter = new GraphemeSplitter();
  return splitter.splitGraphemes(text);
};

/**
 * Validates user input against a target affirmation string.
 * Both strings are normalized before comparison.
 * 
 * @param input - The user's typed input
 * @param target - The target affirmation text to match
 * @returns true if normalized input matches normalized target, false otherwise
 */
export const validate = (input: string, target: string): boolean => {
  const normalizedInput = normalize(input);
  const normalizedTarget = normalize(target);
  return normalizedInput === normalizedTarget;
};

/**
 * Grapheme-aware validation result interface
 */
export interface ValidationInfo {
  isCorrectSoFar: boolean;
  isCompleteMatch: boolean;
  percent: number;
  inputGraphemes: string[];
  targetGraphemes: string[];
}

/**
 * Performs grapheme-aware validation of input against target.
 * This is the single source of truth for all validation states.
 * 
 * @param input - The user's typed input (raw)
 * @param target - The target affirmation text (raw)
 * @returns ValidationInfo object with all validation states
 */
export const getValidationInfo = (input: string, target: string): ValidationInfo => {
  const normalizedInput = normalize(input);
  const normalizedTarget = normalize(target);
  
  const inputGraphemes = splitIntoGraphemes(normalizedInput);
  const targetGraphemes = splitIntoGraphemes(normalizedTarget);
  
  // Check if input is a valid prefix of target (grapheme by grapheme)
  let isCorrectSoFar = true;
  for (let i = 0; i < inputGraphemes.length; i++) {
    if (i >= targetGraphemes.length || inputGraphemes[i] !== targetGraphemes[i]) {
      isCorrectSoFar = false;
      break;
    }
  }
  
  // Calculate progress percentage based on grapheme count
  const percent = targetGraphemes.length > 0 
    ? Math.min(100, Math.floor((inputGraphemes.length / targetGraphemes.length) * 100))
    : 0;
  
  // Complete match requires correct prefix AND same length
  const isCompleteMatch = isCorrectSoFar && inputGraphemes.length === targetGraphemes.length;
  
  return {
    isCorrectSoFar,
    isCompleteMatch,
    percent,
    inputGraphemes,
    targetGraphemes,
  };
};

/**
 * Highlight segments for target text display
 */
export interface HighlightSegments {
  correct: string;    // Green - correctly typed portion
  incorrect: string;  // Red - from first error to end of input length
  remaining: string;  // Default - not yet typed
}

/**
 * Gets highlight segments for display text based on user input.
 * Simplified version - works directly with displayText (punctuation already removed).
 * 
 * @param input - The user's typed input (raw)
 * @param displayTarget - The display text (already processed by getDisplayText)
 * @returns HighlightSegments with correct, incorrect, and remaining portions
 */
export const getHighlightSegments = (input: string, displayTarget: string): HighlightSegments => {
  if (input.length === 0) {
    return { correct: '', incorrect: '', remaining: displayTarget };
  }

  const normalizedInput = normalize(input);
  // Normalize displayTarget for comparison only — preserves original codepoints for output
  // We add .toLowerCase() here to match the behavior of normalize(input)
  const normalizedDisplayTarget = displayTarget.normalize('NFC').toLowerCase();

  const inputGraphemes = splitIntoGraphemes(normalizedInput);
  const normalizedTargetGraphemes = splitIntoGraphemes(normalizedDisplayTarget);
  // Original graphemes for output — preserves original codepoints (e.g. U+09DC stays U+09DC)
  const originalTargetGraphemes = splitIntoGraphemes(displayTarget);

  // Find first mismatch using normalized graphemes for comparison
  let correctCount = 0;
  for (let i = 0; i < inputGraphemes.length; i++) {
    const targetGrapheme = i < normalizedTargetGraphemes.length ? normalizedTargetGraphemes[i] : '';
    // Comparing NFC-normalized and lowercased graphemes
    if (inputGraphemes[i] !== targetGrapheme) {
      break;
    }
    correctCount++;
  }

  // Slice from ORIGINAL graphemes to preserve original codepoints in output
  // NFC normalization and lowercase preserve grapheme count, so indices align
  const correct = originalTargetGraphemes.slice(0, correctCount).join('');
  const incorrectEnd = Math.min(inputGraphemes.length, originalTargetGraphemes.length);
  const incorrect = originalTargetGraphemes.slice(correctCount, incorrectEnd).join('');
  const remaining = originalTargetGraphemes.slice(incorrectEnd).join('');

  return { correct, incorrect, remaining };
};
