import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter, Redirect } from "expo-router";
import { HelpCircle, Globe, Flame } from "lucide-react-native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Svg, { Path } from "react-native-svg";

import { useProgress } from "../../contexts/ProgressContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { TaskCard } from "../../components/TaskCard";
import { DailyQuote } from "../../components/DailyQuote";
import { BottomSheet } from "../../components/BottomSheet";
import { JourneyProgressRing } from "../../components/JourneyProgressRing";
import { DonationBanner } from "../../components/DonationBanner";
import { showToast } from "../../components/Toast";
import { SkeletonLoader } from "../../components/SkeletonLoader";

import {
  isSlotActive,
  getTodayEffectiveDateKey,
  getDisplayDay,
  isJourneyComplete,
} from "../../utils/timeSlotManager";
import { getAffirmationByLanguage } from "../../utils/contentCycler";
import { TimeSlot } from "../../types";
import { getFontFamily } from "../../utils/fonts";
import {
  COLORS,
  GRADIENTS,
  SHADOWS,
  TYPOGRAPHY,
  SPACING,
} from "../../utils/theme";
import { useStaggeredEntry } from "../../utils/useStaggeredEntry";
import { useReducedMotion } from "../../utils/animations";

function StaggeredView({
  children,
  index,
  delay = 0,
}: {
  children: React.ReactNode;
  index: number;
  delay?: number;
}) {
  const { animatedStyle } = useStaggeredEntry(index, delay, 100, 20);
  return <Animated.View style={animatedStyle}>{children}</Animated.View>;
}

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const router = useRouter();
  const {
    dailyProgress,
    totalElapsedDays,
    currentDayInCycle,
    currentCycle,
    trueStreak,
    isTodayComplete,
    isLoading,
    isFirstLaunch,
  } = useProgress();
  const { t, language, setLanguage } = useLanguage();
  const reducedMotion = useReducedMotion();

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAffirmation, setSelectedAffirmation] = useState("");

  const fireScale = useSharedValue(1);
  const streakScale = useSharedValue(1);
  const prevStreakRef = useRef(trueStreak);

  // Fire icon pulse animation
  useEffect(() => {
    if (trueStreak > 1) {
      fireScale.value = withRepeat(
        withSequence(
          withTiming(1.2, {
            duration: reducedMotion ? 0 : 1000,
            easing: Easing.inOut(Easing.ease),
          }),
          withTiming(1, {
            duration: reducedMotion ? 0 : 1000,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        -1,
        true,
      );
    }
  }, [trueStreak, reducedMotion]);

  // Streak bounce animation when streak increases
  useEffect(() => {
    if (trueStreak > prevStreakRef.current && !reducedMotion) {
      streakScale.value = withSequence(
        withTiming(1.3, { duration: 200 }),
        withTiming(1.0, { duration: 200 }),
      );
    }
    prevStreakRef.current = trueStreak;
  }, [trueStreak, reducedMotion]);

  const rFireStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fireScale.value }],
  }));

  const rStreakStyle = useAnimatedStyle(() => ({
    transform: [{ scale: streakScale.value }],
  }));

  if (!isLoading && isFirstLaunch) {
    return <Redirect href="/onboarding" />;
  }

  const todayKey = getTodayEffectiveDateKey();
  const todayProgress = dailyProgress[todayKey] || {
    morning: false,
    noon: false,
    night: false,
  };

  const currentHour = new Date().getHours();
  const isRestPeriod = currentHour >= 5 && currentHour < 8;
  const showRestBanner =
    isRestPeriod &&
    !isSlotActive("morning") &&
    !isSlotActive("noon") &&
    !isSlotActive("night");

  const handleTaskPress = (slot: TimeSlot) => {
    if (todayProgress[slot]) {
      const affirmation = getAffirmationByLanguage(
        totalElapsedDays,
        slot,
        language,
      );
      setSelectedAffirmation(affirmation);
      setModalVisible(true);
    } else {
      router.push(`/task/${slot}`);
    }
  };

  const toggleLanguage = () => {
    const newLang = language === "en" ? "bn" : "en";
    setLanguage(newLang);
    showToast({
      message:
        newLang === "en"
          ? "Language switched to English"
          : "ভাষা বাংলাতে পরিবর্তন করা হয়েছে",
      type: "success",
    });
  };

  const f = (weight: "regular" | "medium" | "semibold" | "bold") =>
    getFontFamily(weight, language);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <LinearGradient
          colors={["#064E3B", "#0F172A"] as any}
          style={StyleSheet.absoluteFill}
        />
        <Animated.View
          entering={FadeIn.duration(reducedMotion ? 0 : 200)}
          exiting={FadeOut.duration(reducedMotion ? 0 : 300)}
          style={styles.skeletonContainer}
        >
          <View style={styles.skeletonProgressSection}>
            <SkeletonLoader variant="progressRing" />
          </View>
          <View style={{ paddingHorizontal: SPACING.lg }}>
            <SkeletonLoader variant="taskCard" count={3} />
          </View>
          <View style={{ paddingHorizontal: SPACING.lg, marginTop: 8 }}>
            <SkeletonLoader variant="quote" />
          </View>
        </Animated.View>
      </View>
    );
  }

  return (
    <Animated.View
      entering={FadeIn.duration(reducedMotion ? 0 : 400)}
      style={{ flex: 1 }}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />

      {/* Full-page gradient background */}
      <LinearGradient
        colors={["#064E3B", "#0F766E", "#134E4A", "#1E293B", "#0F172A"] as any}
        locations={[0, 0.12, 0.22, 0.4, 0.55]}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {/* ─── Premium Header ─── */}
        <Animated.View entering={FadeIn.duration(800)}>
          <View style={styles.header}>
            {/* Islamic geometric pattern */}
            <View style={styles.headerPattern}>
              <Svg width={180} height={120} viewBox="0 0 200 80" opacity={0.06}>
                <Path
                  d="M100 0 L105 35 L140 20 L115 45 L150 50 L115 55 L140 80 L105 65 L100 100 L95 65 L60 80 L85 55 L50 50 L85 45 L60 20 L95 35 Z"
                  fill="#D4A847"
                />
                <Path
                  d="M30 10 L33 30 L50 22 L38 38 L60 40 L38 42 L50 58 L33 50 L30 70 L27 50 L10 58 L22 42 L0 40 L22 38 L10 22 L27 30 Z"
                  fill="#D4A847"
                />
              </Svg>
            </View>

            <SafeAreaView>
              <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                  <Text style={styles.headerEmoji}>🕌</Text>
                  <Text style={[styles.headerTitle, { fontFamily: f("bold") }]}>
                    {t("app.name")}
                  </Text>
                </View>
                <View style={styles.headerRight}>
                  <TouchableOpacity
                    onPress={toggleLanguage}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                    accessibilityLabel={t("dashboard.languageToggle")}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <View style={styles.langToggle}>
                      <Globe size={15} color="#D4A847" />
                      <Text
                        style={[styles.langText, { fontFamily: f("semibold") }]}
                      >
                        {language === "en" ? "EN" : "বাংলা"}
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => router.push("/guide")}
                    activeOpacity={0.7}
                    style={styles.helpBtn}
                    accessibilityRole="button"
                    accessibilityLabel={t("dashboard.helpGuide")}
                    hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                  >
                    <HelpCircle size={20} color="#D4A847" />
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={[styles.bismillah, { fontFamily: f("bold") }]}>
                {t("app.bismillah")}
              </Text>
            </SafeAreaView>
          </View>
        </Animated.View>

        {/* ─── Streak / Progress Section ─── */}
        <StaggeredView index={0}>
          <View style={styles.progressSection}>
            {isJourneyComplete(totalElapsedDays) ? (
              <>
                <Text style={[styles.mashaAllah, { fontFamily: f("bold") }]}>
                  {t("dashboard.mashaAllah")}
                </Text>
                <Text
                  style={[
                    styles.journeyCompleteText,
                    { fontFamily: f("semibold") },
                  ]}
                >
                  {t("dashboard.journeyComplete")}
                </Text>
                <Text
                  style={[
                    styles.journeyCompleteMsg,
                    { fontFamily: f("regular") },
                  ]}
                >
                  {t("dashboard.journeyCompleteMsg")}
                </Text>
              </>
            ) : (
              <>
                {trueStreak > 1 ? (
                  <View style={styles.streakRow}>
                    <Animated.View style={rStreakStyle}>
                      <Text
                        style={[styles.streakText, { fontFamily: f("bold") }]}
                      >
                        {t("dashboard.streak")} {trueStreak}
                      </Text>
                    </Animated.View>
                    <Animated.View style={rFireStyle}>
                      <Flame size={30} color="#F59E0B" fill="#F59E0B" />
                    </Animated.View>
                  </View>
                ) : isTodayComplete ? (
                  <View style={styles.todayCompleteBadge}>
                    <Text
                      style={[
                        styles.todayCompleteText,
                        { fontFamily: f("bold") },
                      ]}
                    >
                      {t("dashboard.todayComplete")} 🎉
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={[styles.startFresh, { fontFamily: f("semibold") }]}
                  >
                    {t("dashboard.startFresh")} ✨
                  </Text>
                )}
                <View style={{ marginTop: 28, alignItems: "center" }}>
                  <JourneyProgressRing currentDay={currentDayInCycle} />
                  {currentCycle > 1 && (
                    <Text
                      style={[
                        { color: "#D4A847", marginTop: 12, fontSize: 13 },
                        { fontFamily: f("semibold") },
                      ]}
                    >
                      {t("home.progress.cycle").replace(
                        "{cycle}",
                        currentCycle.toString(),
                      )}
                    </Text>
                  )}
                </View>
              </>
            )}
          </View>
        </StaggeredView>

        {/* ─── Rest Period Banner ─── */}
        {showRestBanner && (
          <View style={styles.restBanner}>
            <Text style={[styles.restBannerText, { fontFamily: f("medium") }]}>
              {t("dashboard.restPeriod")}
            </Text>
          </View>
        )}

        {/* ─── Task Cards ─── */}
        <View style={{ paddingHorizontal: SPACING.lg }}>
          <StaggeredView index={1}>
            <TaskCard
              slot="morning"
              isActive={isSlotActive("morning")}
              isCompleted={todayProgress.morning}
              onPress={() => handleTaskPress("morning")}
            />
          </StaggeredView>
          <StaggeredView index={2}>
            <TaskCard
              slot="noon"
              isActive={isSlotActive("noon")}
              isCompleted={todayProgress.noon}
              onPress={() => handleTaskPress("noon")}
            />
          </StaggeredView>
          <StaggeredView index={3}>
            <TaskCard
              slot="night"
              isActive={isSlotActive("night")}
              isCompleted={todayProgress.night}
              onPress={() => handleTaskPress("night")}
            />
          </StaggeredView>
        </View>

        {/* ─── Daily Quote ─── */}
        <StaggeredView index={4}>
          <DailyQuote />
        </StaggeredView>

        {/* ─── Donation Banner ─── */}
        <StaggeredView index={5}>
          <DonationBanner />
        </StaggeredView>
      </ScrollView>

      {/* ─── Bottom Sheet Modal ─── */}
      <BottomSheet
        key={language}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContent}>
          <Text style={[styles.modalTitle, { fontFamily: f("bold") }]}>
            {t("dashboard.completedNiyyah")}
          </Text>
          <View style={styles.modalQuoteCard}>
            <Text style={[styles.modalQuoteText, { fontFamily: f("medium") }]}>
              "{selectedAffirmation}"
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(false)}
            activeOpacity={0.8}
            style={styles.modalCloseBtn}
            accessibilityRole="button"
            accessibilityLabel={t("dashboard.close")}
          >
            <LinearGradient
              colors={GRADIENTS.emerald as any}
              style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
            />
            <Text style={[styles.modalCloseBtnText, { fontFamily: f("bold") }]}>
              {t("dashboard.close")}
            </Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  skeletonContainer: {
    flex: 1,
    paddingTop: 80,
  },
  skeletonProgressSection: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.lg,
  },

  // ─── Header ───
  header: {
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: SPACING.lg,
    position: "relative",
    overflow: "hidden",
  },
  headerPattern: {
    position: "absolute",
    top: 10,
    right: -20,
    opacity: 0.5,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 22,
    color: "#FFFFFF",
    letterSpacing: 0.5,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  langToggle: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(212, 168, 71, 0.12)",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 168, 71, 0.2)",
    minHeight: 44,
  },
  langText: {
    fontSize: 13,
    color: "#D4A847",
    marginLeft: 5,
  },
  helpBtn: {
    padding: 8,
    backgroundColor: "rgba(212, 168, 71, 0.12)",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(212, 168, 71, 0.2)",
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  bismillah: {
    textAlign: "center",
    marginTop: 12,
    fontSize: 17,
    color: "#D4A847",
    letterSpacing: 0.5,
  },

  // ─── Progress Section ───
  progressSection: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.lg,
    alignItems: "center",
  },
  mashaAllah: {
    fontSize: 28,
    color: "#10B981",
    textAlign: "center",
  },
  journeyCompleteText: {
    fontSize: 20,
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 8,
  },
  journeyCompleteMsg: {
    fontSize: 15,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    marginTop: 8,
  },
  streakRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  streakText: {
    fontSize: 30,
    color: "#FFFFFF",
    marginRight: 8,
    letterSpacing: -0.5,
  },
  todayCompleteBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.15)",
    paddingHorizontal: SPACING.lg,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.25)",
  },
  todayCompleteText: {
    fontSize: 18,
    color: "#10B981",
    textAlign: "center",
  },
  startFresh: {
    fontSize: 20,
    color: "#D4A847",
    textAlign: "center",
  },

  // ─── Rest Banner ───
  restBanner: {
    marginHorizontal: SPACING.lg,
    marginBottom: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 16,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  restBannerText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    lineHeight: 22,
  },

  // ─── Modal ───
  modalContent: {
    alignItems: "center",
    paddingBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    color: "#D4A847",
    marginBottom: 20,
  },
  modalQuoteCard: {
    width: "100%",
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    borderRadius: 16,
    padding: SPACING.lg,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.15)",
    marginBottom: SPACING.lg,
  },
  modalQuoteText: {
    fontSize: 17,
    color: "#FFFFFF",
    lineHeight: 28,
    textAlign: "center",
  },
  modalCloseBtn: {
    width: "100%",
    padding: SPACING.md,
    borderRadius: 14,
    alignItems: "center",
    overflow: "hidden",
  },
  modalCloseBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
  },
});
