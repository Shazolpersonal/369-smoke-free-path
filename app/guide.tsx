/**
 * Guide Screen — Dark Theme
 *
 * How-to guide explaining the app's purpose and 369 method.
 * Uses StyleSheet for dark theme consistency.
 */

import {
  View,
  Text,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, useRouter } from "expo-router";
import { Target, Clock, BookOpen, ArrowLeft } from "lucide-react-native";
import { getFontFamily } from "../utils/fonts";
import { COLORS } from "../utils/theme";
import { useLanguage } from "../contexts/LanguageContext";

export default function Guide() {
  const { t, language } = useLanguage();
  const router = useRouter();

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.darkBg} />
      <Stack.Screen
        options={{
          headerShown: false,
        }}
      />
      <View style={s.customHeader}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={s.backBtn}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={t("common.back")}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <ArrowLeft size={22} color={COLORS.goldLight} />
        </TouchableOpacity>
        <Text
          style={[
            s.headerTitle,
            { fontFamily: getFontFamily("bold", language) },
          ]}
        >
          {t("guide.title")}
        </Text>
        <View style={{ width: 44 }} />
      </View>
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Purpose */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Target size={24} color={COLORS.success} />
            <Text
              style={[
                s.sectionTitle,
                { fontFamily: getFontFamily("bold", language) },
              ]}
            >
              {t("guide.whatIs.title") || "What is 369?"}
            </Text>
          </View>
          <View style={s.card}>
            <Text
              style={[
                s.bodyText,
                { fontFamily: getFontFamily("regular", language) },
              ]}
            >
              {t("guide.whatIs.body")}
            </Text>
          </View>
        </View>

        {/* Section 2: 369 Method */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <BookOpen size={24} color={COLORS.success} />
            <Text
              style={[
                s.sectionTitle,
                { fontFamily: getFontFamily("bold", language) },
              ]}
            >
              {t("guide.method.title")}
            </Text>
          </View>
          <View style={s.card}>
            <Text
              style={[
                s.bodyText,
                { fontFamily: getFontFamily("regular", language) },
              ]}
            >
              {t("guide.method.intro")}
            </Text>
            <View style={{ marginTop: 16, gap: 12 }}>
              <View style={s.methodRow}>
                <Text
                  style={[
                    s.methodCount,
                    { fontFamily: getFontFamily("bold", language) },
                  ]}
                >
                  3×
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      s.methodLabel,
                      { fontFamily: getFontFamily("semibold", language) },
                    ]}
                  >
                    {t("history.morningAffirmation")}
                  </Text>
                  <Text
                    style={[
                      s.methodDesc,
                      { fontFamily: getFontFamily("regular", language) },
                    ]}
                  >
                    {t("guide.method.morning.desc")}
                  </Text>
                </View>
              </View>
              <View style={s.methodRow}>
                <Text
                  style={[
                    s.methodCount,
                    { fontFamily: getFontFamily("bold", language) },
                  ]}
                >
                  6×
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      s.methodLabel,
                      { fontFamily: getFontFamily("semibold", language) },
                    ]}
                  >
                    {t("history.afternoonAffirmation")}
                  </Text>
                  <Text
                    style={[
                      s.methodDesc,
                      { fontFamily: getFontFamily("regular", language) },
                    ]}
                  >
                    {t("guide.method.noon.desc")}
                  </Text>
                </View>
              </View>
              <View style={s.methodRow}>
                <Text
                  style={[
                    s.methodCount,
                    { fontFamily: getFontFamily("bold", language) },
                  ]}
                >
                  9×
                </Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      s.methodLabel,
                      { fontFamily: getFontFamily("semibold", language) },
                    ]}
                  >
                    {t("history.eveningAffirmation")}
                  </Text>
                  <Text
                    style={[
                      s.methodDesc,
                      { fontFamily: getFontFamily("regular", language) },
                    ]}
                  >
                    {t("guide.method.night.desc")}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Section 3: Rules */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Clock size={24} color={COLORS.success} />
            <Text
              style={[
                s.sectionTitle,
                { fontFamily: getFontFamily("bold", language) },
              ]}
            >
              {t("guide.rules.title")}
            </Text>
          </View>
          <View style={s.card}>
            <Text
              style={[
                s.bodyText,
                {
                  marginBottom: 12,
                  fontFamily: getFontFamily("regular", language),
                },
              ]}
            >
              {t("guide.rules.intro")}
            </Text>
            <View style={{ gap: 8 }}>
              <View
                style={[
                  s.slotRow,
                  { backgroundColor: "rgba(16, 185, 129, 0.1)" },
                ]}
              >
                <Text
                  style={[
                    s.slotLabel,
                    {
                      color: COLORS.success,
                      fontFamily: getFontFamily("semibold", language),
                    },
                  ]}
                >
                  {t("guide.rules.morning")}
                </Text>
                <Text
                  style={[
                    s.slotTime,
                    { fontFamily: getFontFamily("regular", language) },
                  ]}
                >
                  {t("guide.rules.morningTime")}
                </Text>
              </View>
              <View
                style={[
                  s.slotRow,
                  { backgroundColor: "rgba(251, 191, 36, 0.1)" },
                ]}
              >
                <Text
                  style={[
                    s.slotLabel,
                    {
                      color: "#FBBF24",
                      fontFamily: getFontFamily("semibold", language),
                    },
                  ]}
                >
                  {t("guide.rules.noon")}
                </Text>
                <Text
                  style={[
                    s.slotTime,
                    { fontFamily: getFontFamily("regular", language) },
                  ]}
                >
                  {t("guide.rules.noonTime")}
                </Text>
              </View>
              <View
                style={[
                  s.slotRow,
                  { backgroundColor: "rgba(99, 102, 241, 0.1)" },
                ]}
              >
                <Text
                  style={[
                    s.slotLabel,
                    {
                      color: "#818CF8",
                      fontFamily: getFontFamily("semibold", language),
                    },
                  ]}
                >
                  {t("guide.rules.night")}
                </Text>
                <Text
                  style={[
                    s.slotTime,
                    { fontFamily: getFontFamily("regular", language) },
                  ]}
                >
                  {t("guide.rules.nightTime")}
                </Text>
              </View>
              <View
                style={[
                  s.slotRow,
                  { backgroundColor: "rgba(255, 255, 255, 0.05)" },
                ]}
              >
                <Text
                  style={[
                    s.slotLabel,
                    {
                      color: "rgba(255,255,255,0.5)",
                      fontFamily: getFontFamily("semibold", language),
                    },
                  ]}
                >
                  {t("guide.rules.rest")}
                </Text>
                <Text
                  style={[
                    s.slotTime,
                    { fontFamily: getFontFamily("regular", language) },
                  ]}
                >
                  {t("guide.rules.restTime")}
                </Text>
              </View>
            </View>
            <Text
              style={[
                s.italicText,
                { fontFamily: getFontFamily("regular", language) },
              ]}
            >
              {t("guide.rules.restDesc")}
            </Text>
            <Text
              style={[
                s.mutedText,
                {
                  marginTop: 12,
                  fontFamily: getFontFamily("regular", language),
                },
              ]}
            >
              {t("guide.rules.lockDesc")}
            </Text>
            <Text
              style={[
                s.mutedText,
                {
                  marginTop: 8,
                  fontFamily: getFontFamily("regular", language),
                },
              ]}
            >
              {t("guide.rules.streakDesc")}
            </Text>
          </View>
        </View>

        {/* Section 4: How to Write */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={{ fontSize: 22, marginRight: 8 }}>✍️</Text>
            <Text
              style={[
                s.sectionTitle,
                { fontFamily: getFontFamily("bold", language) },
              ]}
            >
              {t("guide.howToWrite.title")}
            </Text>
          </View>
          <View style={s.card}>
            <Text
              style={[
                s.bodyText,
                { fontFamily: getFontFamily("regular", language) },
              ]}
            >
              {t("guide.howToWrite.body")}
            </Text>
          </View>
        </View>

        {/* Final Encouragement */}
        <View style={[s.section, { paddingBottom: 16 }]}>
          <View style={s.encouragementCard}>
            <Text
              style={[
                s.encouragementText,
                { fontFamily: getFontFamily("regular", language) },
              ]}
            >
              {t("guide.encouragement")}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBg,
  },
  section: {
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.textWhite,
    marginLeft: 8,
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  bodyText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 24,
  },
  methodRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  methodCount: {
    fontSize: 18,
    color: COLORS.success,
    marginRight: 8,
    width: 30,
  },
  methodLabel: {
    fontSize: 15,
    color: COLORS.textWhite,
  },
  methodDesc: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },
  italicText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.4)",
    marginTop: 16,
    fontStyle: "italic",
  },
  mutedText: {
    fontSize: 13,
    color: "rgba(255,255,255,0.5)",
  },
  slotRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
  },
  slotLabel: {
    fontSize: 14,
  },
  slotTime: {
    fontSize: 14,
    color: "rgba(255,255,255,0.6)",
    marginLeft: 8,
  },
  colorGuide: {
    backgroundColor: "rgba(255,255,255,0.04)",
    padding: 12,
    borderRadius: 10,
    gap: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
  },
  colorRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  colorDesc: {
    fontSize: 14,
    color: "rgba(255,255,255,0.5)",
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bullet: {
    color: COLORS.success,
    marginRight: 8,
    marginTop: 2,
  },
  bulletText: {
    fontSize: 15,
    color: "rgba(255,255,255,0.7)",
    lineHeight: 24,
    flex: 1,
  },
  encouragementCard: {
    backgroundColor: "rgba(16, 185, 129, 0.08)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "rgba(16, 185, 129, 0.2)",
  },
  encouragementText: {
    fontSize: 15,
    color: COLORS.success,
    textAlign: "center",
    lineHeight: 24,
  },
  customHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.darkBg,
  },
  backBtn: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    color: "#FFFFFF",
  },
});
