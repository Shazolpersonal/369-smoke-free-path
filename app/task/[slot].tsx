/**
 * Task Input Screen — Complete Rebuild
 * 
 * The core screen where users type affirmations.
 * Dark theme with real-time highlighting, circular progress,
 * confetti animations, and donation prompt.
 * 
 * Features:
 * - Custom header with golden back button, slot emoji, counter badge
 * - Affirmation display card with dark background and left accent bar
 * - Real-time 3-color highlighting (green/red/faded)
 * - Animated border color on input (green/red/neutral)
 * - Accuracy % display with contextual hints
 * - Auto-submit at 100%, manual submit at 80%+
 * - Brief success flash between repetitions
 * - Final success screen with confetti and donation prompt
 * - Haptic feedback on completion
 */

import {
 useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Pressable,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { useLocalSearchParams, useRouter, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
  runOnJS,
  FadeIn,
  FadeOut,
  interpolateColor,
} from 'react-native-reanimated';
import { ArrowLeft, CheckCircle } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useProgress } from '../../contexts/ProgressContext';
import { getAffirmationByLanguage } from '../../utils/contentCycler';
import { getTargetCount } from '../../utils/repetitionTarget';
import { getValidationInfo, getHighlightSegments, getDisplayText } from '../../utils/textValidator';
import { RepetitionCounter } from '../../components/RepetitionCounter';
import { ConfettiBurst } from '../../components/ConfettiBurst';
import { DonationPrompt } from '../../components/DonationPrompt';
import { TimeSlot } from '../../types';
import { formatNumberByLanguage } from '../../utils/bengaliNumber';
import { getFontFamily } from '../../utils/fonts';
import {  COLORS, GRADIENTS, SLOT_EMOJIS, SLOT_ACCENT_COLORS, SHADOWS , SPACING } from "../../utils/theme";
import { SPRING_CONFIG, AUTO_SUBMIT_DELAY, BRIEF_SUCCESS_DURATION, CONFETTI_PARTICLES, BRIEF_CONFETTI_DURATION, FINAL_CONFETTI_DURATION } from '../../utils/animations';
import { useLanguage } from '../../contexts/LanguageContext';

// Minimum accuracy percentage to enable submit button
const MIN_ACCURACY_PERCENT = 80;

export default function TaskInputScreen() {
  const { slot } = useLocalSearchParams<{ slot: string }>();
  const router = useRouter();
  const { totalElapsedDays, completeTask } = useProgress();
  const { t, language } = useLanguage();

  // ===== 1. DATA & STATE SETUP =====
  const timeSlot = slot as TimeSlot;
  const targetCount = getTargetCount(timeSlot);
  // Memoize targetText with language as explicit dependency so affirmation
  // always reflects the current app language (Bug 3 fix: language prop propagation)
  const targetText = useMemo(
    () => getAffirmationByLanguage(totalElapsedDays, timeSlot, language),
    [totalElapsedDays, timeSlot, language]
  );

  // Core states
  const [inputText, setInputText] = useState('');
  const [completedCount, setCompletedCount] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showBriefFlash, setShowBriefFlash] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFinalConfetti, setShowFinalConfetti] = useState(false);

  // Ref to prevent duplicate submissions
  const isSubmitting = useRef(false);

  // Animation values
  const successOpacity = useSharedValue(0);
  const successScale = useSharedValue(0.5);
  const contentOpacity = useSharedValue(1);
  const borderColorProgress = useSharedValue(0); // 0=neutral, 1=green, 2=red

  // ===== 2. SINGLE SOURCE OF TRUTH (useMemo) =====
  const displayText = useMemo(() => getDisplayText(targetText), [targetText]);

  const validation = useMemo(() => {
    const info = getValidationInfo(inputText, displayText);
    return {
      isCorrectPrefix: info.isCorrectSoFar,
      isCompleteMatch: info.isCompleteMatch,
      progressPercent: info.percent,
    };
  }, [inputText, displayText]);

  const highlightSegments = useMemo(() => {
    return getHighlightSegments(inputText, displayText);
  }, [inputText, displayText]);

  // Shake animation for incorrect input
  const shakeOffset = useSharedValue(0);
  const triggerShake = useCallback(() => {
    shakeOffset.value = withSequence(
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(-8, { duration: 50 }),
      withTiming(8, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  }, [shakeOffset]);

  useEffect(() => {
    if (!validation.isCorrectPrefix && inputText.length > 0) {
      triggerShake();
    }
  }, [validation.isCorrectPrefix, inputText.length, triggerShake]);


  // ===== BORDER COLOR ANIMATION =====
  useEffect(() => {
    if (inputText.length === 0) {
      borderColorProgress.value = withTiming(0, { duration: 200 });
    } else if (!validation.isCorrectPrefix) {
      borderColorProgress.value = withTiming(2, { duration: 200 });
    } else {
      borderColorProgress.value = withTiming(1, { duration: 200 });
    }
  }, [inputText, validation.isCorrectPrefix]);

  const inputBorderStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      borderColorProgress.value,
      [0, 1, 2],
      [COLORS.darkBorder, COLORS.success, COLORS.error]
    );
    return { 
      borderColor,
      transform: [{ translateX: shakeOffset.value }]
    };
  });

  // ===== NAVIGATION CALLBACK =====
  const navigateBack = useCallback(() => {
    router.back();
  }, [router]);

  // ===== 4. SUBMISSION LOGIC =====
  const handleSubmission = useCallback(async () => {
    const newCount = completedCount + 1;
    isSubmitting.current = true;

    // Clear input
    setInputText('');

    // Haptic feedback
    try {
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } catch {
      // Haptics not available (e.g., simulator)
    }

    // ===== 5. FINAL COMPLETION FLOW =====
    if (newCount >= targetCount) {
      // Final completion — dismiss keyboard only here
      Keyboard.dismiss();

      setShowSuccess(true);
      setShowFinalConfetti(true);

      // Fade out content and show success
      contentOpacity.value = withTiming(0, { duration: 300 });
      successOpacity.value = withTiming(1, { duration: 400 });
      successScale.value = withSpring(1, SPRING_CONFIG);

      // Mark task as complete
      await completeTask(timeSlot);

      // Update count
      setCompletedCount(newCount);
    } else {
      // Brief success flash — keyboard stays up
      setShowBriefFlash(true);
      setShowConfetti(true);
      setCompletedCount(newCount);

      // Hide flash after duration
      setTimeout(() => {
        setShowBriefFlash(false);
        setShowConfetti(false);
        isSubmitting.current = false;
      }, BRIEF_SUCCESS_DURATION);
    }
  }, [completedCount, targetCount, timeSlot, completeTask, contentOpacity, successOpacity, successScale]);

  // ===== AUTO-SUBMIT ON COMPLETE MATCH =====
  useEffect(() => {
    if (validation.isCompleteMatch && inputText.length > 0 && !isSubmitting.current) {
      const timer = setTimeout(() => {
        if (!isSubmitting.current) {
          handleSubmission();
        }
      }, AUTO_SUBMIT_DELAY);
      return () => clearTimeout(timer);
    }
  }, [validation.isCompleteMatch, inputText.length, handleSubmission]);

  // Button enabled at >= 80%, but disabled when complete match triggers auto-submit
  const isButtonEnabled = validation.isCorrectPrefix && validation.progressPercent >= MIN_ACCURACY_PERCENT && !isSubmitting.current && !showSuccess && !validation.isCompleteMatch;

  // ===== MANUAL SUBMIT =====
  const handleManualSubmit = () => {
    if (isButtonEnabled && !isSubmitting.current) {
      handleSubmission();
    }
  };

  // ===== HINT MESSAGE =====
  const getHintMessage = () => {
    if (validation.progressPercent === 100 && validation.isCompleteMatch) {
      return t('task.autoSubmitting');
    }
    if (validation.progressPercent >= MIN_ACCURACY_PERCENT) {
      return t('task.readyToSubmit');
    }
    if (inputText.length === 0) {
      return t('task.accuracyHint');
    }
    return t('task.needPercent', { n: formatNumberByLanguage(MIN_ACCURACY_PERCENT, language) });
  };

  // ===== ACCENT COLORS =====
  const accentColors = SLOT_ACCENT_COLORS[timeSlot];

  return (
    <>
      <LinearGradient
        colors={GRADIENTS.taskScreenBg}
        style={{ flex: 1 }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {/* ===== CUSTOM HEADER ===== */}
          <View style={styles.header}>
            <TouchableOpacity onPress={navigateBack} style={styles.backButton}>
              <ArrowLeft size={24} color={COLORS.goldLight} />
            </TouchableOpacity>
            <View style={styles.headerCenter}>
              <Text style={styles.headerEmoji}>{SLOT_EMOJIS[timeSlot]}</Text>
              <Text style={[styles.headerTitle, { fontFamily: getFontFamily('semibold', language) }]}>
                {timeSlot === 'morning' ? t('task.morningAffirmation') : timeSlot === 'noon' ? t('task.afternoonAffirmation') : t('task.eveningAffirmation')}
              </Text>
            </View>
            <View style={styles.counterBadge}>
              <Text style={[styles.counterText, { fontFamily: getFontFamily('bold', language) }]}>
                {formatNumberByLanguage(completedCount, language)}/{formatNumberByLanguage(targetCount, language)}
              </Text>
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
            keyboardVerticalOffset={0}
          >
            <ScrollView
              style={{ flex: 1 }}
              contentContainerStyle={{ flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {/* ===== MAIN CONTENT ===== */}
              {!showSuccess && (
                <Animated.View style={[{ flex: 1, opacity: contentOpacity }]}>
                  
                  {/* Circular Progress Ring */}
                  <RepetitionCounter completed={completedCount} total={targetCount} />

                  {/* Affirmation Display Card */}
                  <View style={styles.cardContainer}>
                    <View style={styles.affirmationCard}>
                      {/* Left accent bar */}
                      <LinearGradient
                        colors={[accentColors.start, accentColors.end]}
                        style={styles.cardAccentBar}
                      />
                      <View style={styles.cardContent}>
                        <Text style={[styles.cardLabel, { fontFamily: getFontFamily('regular', language) }]}>
                          {t('task.instruction')}
                        </Text>
                        {inputText.length > 0 ? (
                          <Text style={[styles.affirmationText, { fontFamily: getFontFamily('medium', language) }]}>
                            <Text style={styles.correctText}>{highlightSegments.correct}</Text>
                            {highlightSegments.incorrect ? (
                              <Text
                                style={styles.incorrectText}
                                accessibilityHint={t('task.errorHint')}
                              >
                                {highlightSegments.incorrect}
                              </Text>
                            ) : null}
                            <Text style={styles.remainingText}>{highlightSegments.remaining}</Text>
                          </Text>
                        ) : (
                          <Text style={[styles.affirmationText, { fontFamily: getFontFamily('medium', language) }]}>
                            {displayText}
                          </Text>
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Progress Feedback */}
                  {inputText.length > 0 && (
                    <Animated.View
                      entering={FadeIn.duration(200)}
                      style={styles.progressFeedback}
                    >
                      {validation.isCorrectPrefix ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                          {validation.progressPercent >= MIN_ACCURACY_PERCENT && (
                            <Animated.View entering={FadeIn}>
                              <CheckCircle size={14} color={COLORS.success} />
                            </Animated.View>
                          )}
                          <Text style={[styles.progressCorrect, { fontFamily: getFontFamily('medium', language) }]}>
                            {t('task.accuracy')} {formatNumberByLanguage(validation.progressPercent, language)}%
                          </Text>
                        </View>
                      ) : (
                        <Text style={[styles.progressError, { fontFamily: getFontFamily('medium', language) }]}>
                          {t('task.errorHint')}
                        </Text>
                      )}
                    </Animated.View>
                  )}

                  {/* Text Input */}
                  <View style={styles.inputContainer}>
                    <Animated.View style={[styles.inputWrapper, inputBorderStyle]}>
                      <TextInput
                        style={[styles.textInput, { fontFamily: getFontFamily('medium', language) }]}
                        placeholder={t('task.placeholder')}
                        placeholderTextColor="rgba(255,255,255,0.35)"
                        value={inputText}
                        onChangeText={setInputText}
                        multiline
                        textAlignVertical="top"
                        autoFocus
                        editable={!showSuccess}
                      />
                    </Animated.View>
                  </View>

                  {/* Accuracy & Submit */}
                  <View style={styles.submitArea}>
                    <View style={styles.hintContainer}>
                      <Text style={[styles.hintText, { fontFamily: getFontFamily('regular', language) }]}>
                        {getHintMessage()}
                      </Text>
                    </View>

                    <Pressable
                      onPress={handleManualSubmit}
                      disabled={!isButtonEnabled}
                      style={({ pressed }) => [
                        styles.submitButton,
                        !isButtonEnabled && styles.submitButtonDisabled,
                        pressed && isButtonEnabled && styles.submitButtonPressed,
                        isButtonEnabled && SHADOWS.glow,
                      ]}
                    >
                      {isButtonEnabled ? (
                        <LinearGradient
                          colors={GRADIENTS.emerald}
                          style={styles.submitGradient}
                        >
                          <Text style={[styles.submitText, { fontFamily: getFontFamily('semibold', language) }]}>
                            {t('task.submit')}
                          </Text>
                        </LinearGradient>
                      ) : (
                        <View style={styles.submitGradientDisabled}>
                          <Text style={[styles.submitTextDisabled, { fontFamily: getFontFamily('semibold', language) }]}>
                            {t('task.submit')}
                          </Text>
                        </View>
                      )}
                    </Pressable>
                  </View>
                </Animated.View>
              )}

              {/* Deleted duplicate success screens from inside ScrollView */}
            </ScrollView>
          </KeyboardAvoidingView>

          {/* ===== BRIEF SUCCESS FLASH ===== */}
          {showBriefFlash && (
            <Animated.View
              entering={FadeIn.duration(200)}
              exiting={FadeOut.duration(200)}
              style={styles.briefFlash}
            >
              <Text style={styles.briefFlashEmoji}>✨</Text>
              <Text style={[styles.briefFlashTitle, { fontFamily: getFontFamily('bold', language) }]}>
                {t('task.mashaAllah')}
              </Text>
              <Text style={[styles.briefFlashCounter, { fontFamily: getFontFamily('medium', language) }]}>
                {formatNumberByLanguage(completedCount, language)}/{formatNumberByLanguage(targetCount, language)} {t('task.completedNiyyah')}
              </Text>
            </Animated.View>
          )}

          {/* ===== FINAL SUCCESS SCREEN ===== */}
          {showSuccess && (
            <Animated.View
              entering={FadeIn.duration(400)}
              style={[StyleSheet.absoluteFill, styles.successContainer, { opacity: successOpacity, transform: [{ scale: successScale }], backgroundColor: COLORS.primary }]}
            >
              <LinearGradient
                colors={GRADIENTS.emerald}
                style={styles.successCircle}
              >
                <CheckCircle size={50} color="#FFFFFF" strokeWidth={2.5} />
              </LinearGradient>

              <Text style={[styles.successTitle, { fontFamily: getFontFamily('bold', language) }]}>
                {t('task.alhamdulillahComplete')}
              </Text>

              <Text style={[styles.successMessage, { fontFamily: getFontFamily('medium', language) }]}>
                {t('task.completeDua')}
              </Text>

              <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 24, width: '100%', alignItems: 'center' }}>
                <DonationPrompt />
                <TouchableOpacity
                  style={styles.dashboardButton}
                  onPress={navigateBack}
                  activeOpacity={0.8}
                >
                  <LinearGradient
                    colors={GRADIENTS.emerald}
                    style={styles.dashboardButtonGradient}
                  >
                    <Text style={[styles.dashboardButtonText, { fontFamily: getFontFamily('bold', language) }]}>
                      {t('task.backToDashboard')}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* ===== CONFETTI ===== */}
          {showConfetti && (
            <ConfettiBurst
              count={CONFETTI_PARTICLES.brief}
              duration={BRIEF_CONFETTI_DURATION}
            />
          )}
          {showFinalConfetti && (
            <ConfettiBurst
                count={CONFETTI_PARTICLES.final}
                duration={FINAL_CONFETTI_DURATION}
            />
          )}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  // ===== HEADER =====
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  headerEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  headerTitle: {
    fontSize: 16,
    color: COLORS.textWhite,
  },
  counterBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  counterText: {
    fontSize: 14,
    color: COLORS.success,
  },

  // ===== AFFIRMATION CARD =====
  cardContainer: {
    paddingHorizontal: 20,
    paddingTop: 4,
  },
  affirmationCard: {
    backgroundColor: COLORS.darkCard,
    borderRadius: 16,
    flexDirection: 'row',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    ...SHADOWS.md,
  },
  cardAccentBar: {
    width: 5,
  },
  cardContent: {
    flex: 1,
    padding: 20,
  },
  cardLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 12,
  },
  affirmationText: {
    fontSize: 19,
    color: COLORS.textWhite,
    lineHeight: 32,
  },
  correctText: {
    color: COLORS.success,
  },
  incorrectText: {
    color: COLORS.error,
    textDecorationLine: 'underline',
  },
  remainingText: {
    color: COLORS.textFadedWhite,
  },

  // ===== PROGRESS FEEDBACK =====
  progressFeedback: {
    paddingHorizontal: SPACING.lg,
    paddingTop: 8,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  progressCorrect: {
    fontSize: 14,
    color: COLORS.success,
  },
  progressError: {
    fontSize: 14,
    color: COLORS.error,
  },

  // ===== INPUT =====
  inputContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  inputWrapper: {
    backgroundColor: COLORS.darkInput,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.darkBorder,
  },
  textInput: {
    fontSize: 17,
    color: COLORS.textWhite,
    padding: 20,
    minHeight: 130,
    textAlignVertical: 'top',
  },

  // ===== SUBMIT AREA =====
  submitArea: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    marginTop: 'auto' as any,
  },
  hintContainer: {
    marginBottom: 12,
  },
  hintText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonPressed: {
    transform: [{ scale: 0.96 }],
  },
  submitGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: 16,
    minHeight: 52,
    justifyContent: 'center',
  },
  submitGradientDisabled: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    minHeight: 52,
    justifyContent: 'center',
  },
  submitText: {
    fontSize: 18,
    color: COLORS.textWhite,
  },
  submitTextDisabled: {
    fontSize: 18,
    color: 'rgba(255,255,255,0.3)',
  },

  // ===== FINAL SUCCESS =====
  successContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.lg,
  },
  successCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontSize: 28,
    color: COLORS.textWhite,
    marginTop: SPACING.lg,
    textAlign: 'center',
  },
  successMessage: {
    fontSize: 17,
    color: COLORS.textMuted,
    marginTop: 12,
    textAlign: 'center',
    lineHeight: 26,
  },
  dashboardButton: {
    marginTop: 32,
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  dashboardButtonGradient: {
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: 16,
  },
  dashboardButtonText: {
    fontSize: 18,
    color: COLORS.textWhite,
  },

  // ===== BRIEF FLASH =====
  briefFlash: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(16, 185, 129, 0.92)',
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    gap: 10,
  },
  briefFlashEmoji: {
    fontSize: 20,
  },
  briefFlashTitle: {
    fontSize: 16,
    color: COLORS.textWhite,
  },
  briefFlashCounter: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
  },
});
