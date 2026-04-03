import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Linking,
  Platform,
} from 'react-native';
import { Language } from '../i18n';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Manufacturer = 'samsung' | 'xiaomi' | 'oneplus' | 'huawei' | 'generic';

export interface ManufacturerGuide {
  manufacturer: Manufacturer;
  displayName: string;
  steps: string[];
  settingsPath: string;
}

interface Props {
  language: Language;
  onSkip: () => void;
  onDone: () => void;
}

// ─── Guide Data ───────────────────────────────────────────────────────────────

interface GuideData {
  displayName: string;
  steps: { en: string[]; bn: string[] };
  settingsPath: { en: string; bn: string };
}

const GUIDES: Record<Manufacturer, GuideData> = {
  samsung: {
    displayName: 'Samsung',
    steps: {
      en: [
        'Open Settings → Apps',
        'Find "369 Smoke-Free Path"',
        'Tap Battery → select "Unrestricted"',
        'Also go to Settings → Battery → Background usage limits → Never sleeping apps → Add this app',
      ],
      bn: [
        'Settings → Apps খুলুন',
        '"369 Smoke-Free Path" খুঁজুন',
        'Battery → "Unrestricted" নির্বাচন করুন',
        'Settings → Battery → Background usage limits → Never sleeping apps → এই অ্যাপটি যোগ করুন',
      ],
    },
    settingsPath: {
      en: 'Settings → Apps → 369 Smoke-Free Path → Battery → Unrestricted',
      bn: 'Settings → Apps → 369 Smoke-Free Path → Battery → Unrestricted',
    },
  },
  xiaomi: {
    displayName: 'Xiaomi / Redmi / POCO',
    steps: {
      en: [
        'Open Settings → Apps → Manage apps',
        'Find "369 Smoke-Free Path"',
        'Tap Battery saver → select "No restrictions"',
        'Also go to Settings → Battery & performance → App battery saver → find this app → No restrictions',
      ],
      bn: [
        'Settings → Apps → Manage apps খুলুন',
        '"369 Smoke-Free Path" খুঁজুন',
        'Battery saver → "No restrictions" নির্বাচন করুন',
        'Settings → Battery & performance → App battery saver → এই অ্যাপ খুঁজুন → No restrictions',
      ],
    },
    settingsPath: {
      en: 'Settings → Apps → Manage apps → 369 Smoke-Free Path → Battery saver → No restrictions',
      bn: 'Settings → Apps → Manage apps → 369 Smoke-Free Path → Battery saver → No restrictions',
    },
  },
  oneplus: {
    displayName: 'OnePlus',
    steps: {
      en: [
        'Open Settings → Battery',
        'Tap Battery optimization',
        'Find "369 Smoke-Free Path"',
        'Select "Don\'t optimize"',
      ],
      bn: [
        'Settings → Battery খুলুন',
        'Battery optimization-এ ট্যাপ করুন',
        '"369 Smoke-Free Path" খুঁজুন',
        '"Don\'t optimize" নির্বাচন করুন',
      ],
    },
    settingsPath: {
      en: 'Settings → Battery → Battery optimization → 369 Smoke-Free Path → Don\'t optimize',
      bn: 'Settings → Battery → Battery optimization → 369 Smoke-Free Path → Don\'t optimize',
    },
  },
  huawei: {
    displayName: 'Huawei / Honor',
    steps: {
      en: [
        'Open Settings → Apps',
        'Find "369 Smoke-Free Path"',
        'Tap Battery',
        'Disable "Power-intensive prompt"',
        'Enable "Run in background"',
      ],
      bn: [
        'Settings → Apps খুলুন',
        '"369 Smoke-Free Path" খুঁজুন',
        'Battery-তে ট্যাপ করুন',
        '"Power-intensive prompt" বন্ধ করুন',
        '"Run in background" চালু করুন',
      ],
    },
    settingsPath: {
      en: 'Settings → Apps → 369 Smoke-Free Path → Battery',
      bn: 'Settings → Apps → 369 Smoke-Free Path → Battery',
    },
  },
  generic: {
    displayName: 'Android',
    steps: {
      en: [
        'Open Settings → Apps',
        'Find "369 Smoke-Free Path"',
        'Tap Battery → select "Unrestricted" (or similar option)',
        'Make sure background activity is allowed',
      ],
      bn: [
        'Settings → Apps খুলুন',
        '"369 Smoke-Free Path" খুঁজুন',
        'Battery → "Unrestricted" (বা অনুরূপ বিকল্প) নির্বাচন করুন',
        'Background activity অনুমোদিত আছে কিনা নিশ্চিত করুন',
      ],
    },
    settingsPath: {
      en: 'Settings → Apps → 369 Smoke-Free Path → Battery → Unrestricted',
      bn: 'Settings → Apps → 369 Smoke-Free Path → Battery → Unrestricted',
    },
  },
};

// ─── Manufacturer Detection ───────────────────────────────────────────────────

export function detectManufacturer(): Manufacturer {
  if (Platform.OS !== 'android') return 'generic';

  const constants = Platform.constants as Record<string, unknown>;
  const brand = (
    (constants.Brand as string | undefined) ||
    (constants.Manufacturer as string | undefined) ||
    ''
  ).toLowerCase();

  if (brand.includes('samsung')) return 'samsung';
  if (brand.includes('xiaomi') || brand.includes('redmi') || brand.includes('poco')) return 'xiaomi';
  if (brand.includes('oneplus') || brand.includes('one plus')) return 'oneplus';
  if (brand.includes('huawei') || brand.includes('honor')) return 'huawei';

  return 'generic';
}

// ─── Guide Getter ─────────────────────────────────────────────────────────────

export function getManufacturerGuide(
  manufacturer: Manufacturer,
  language: Language
): ManufacturerGuide {
  const data = GUIDES[manufacturer];
  return {
    manufacturer,
    displayName: data.displayName,
    steps: data.steps[language],
    settingsPath: data.settingsPath[language],
  };
}

// ─── UI Text ──────────────────────────────────────────────────────────────────

const UI_TEXT = {
  title: { en: 'Keep Notifications Active', bn: 'নোটিফিকেশান সক্রিয় রাখুন' },
  subtitle: {
    en: 'To ensure you never miss a reminder, please allow this app to run in the background.',
    bn: 'কোনো রিমাইন্ডার মিস না করতে, এই অ্যাপটিকে background-এ চলার অনুমতি দিন।',
  },
  openSettings: { en: 'Open Battery Settings', bn: 'ব্যাটারি সেটিংস খুলুন' },
  skip: { en: 'Skip', bn: 'এড়িয়ে যান' },
  done: { en: 'Done', bn: 'সম্পন্ন' },
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function BatteryOptimizationGuide({ language, onSkip, onDone }: Props) {
  const manufacturer = detectManufacturer();
  const guide = getManufacturerGuide(manufacturer, language);

  const handleOpenSettings = () => {
    Linking.openSettings().catch(() => {
      // Fallback: silently ignore if openSettings is unavailable
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Title */}
        <Text style={styles.title}>{UI_TEXT.title[language]}</Text>

        {/* Subtitle */}
        <Text style={styles.subtitle}>{UI_TEXT.subtitle[language]}</Text>

        {/* Manufacturer badge */}
        <View style={styles.manufacturerBadge}>
          <Text style={styles.manufacturerText}>{guide.displayName}</Text>
        </View>

        {/* Steps */}
        <View style={styles.stepsContainer}>
          {guide.steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.openSettingsButton}
          onPress={handleOpenSettings}
          activeOpacity={0.8}
        >
          <Text style={styles.openSettingsText}>{UI_TEXT.openSettings[language]}</Text>
        </TouchableOpacity>

        <View style={styles.secondaryRow}>
          <TouchableOpacity
            style={styles.skipButton}
            onPress={onSkip}
            activeOpacity={0.7}
          >
            <Text style={styles.skipText}>{UI_TEXT.skip[language]}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.doneButton}
            onPress={onDone}
            activeOpacity={0.8}
          >
            <Text style={styles.doneText}>{UI_TEXT.done[language]}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#F8FAFC',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  manufacturerBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 24,
  },
  manufacturerText: {
    color: '#10B981',
    fontSize: 14,
    fontWeight: '600',
  },
  stepsContainer: {
    gap: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: 1,
  },
  stepNumberText: {
    color: '#0F172A',
    fontSize: 13,
    fontWeight: '700',
  },
  stepText: {
    flex: 1,
    color: '#CBD5E1',
    fontSize: 14,
    lineHeight: 22,
  },
  buttonContainer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
    gap: 12,
  },
  openSettingsButton: {
    backgroundColor: '#10B981',
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
  },
  openSettingsText: {
    color: '#0F172A',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: 12,
  },
  skipButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#334155',
  },
  skipText: {
    color: '#64748B',
    fontSize: 15,
    fontWeight: '500',
  },
  doneButton: {
    flex: 1,
    paddingVertical: 13,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  doneText: {
    color: '#10B981',
    fontSize: 15,
    fontWeight: '600',
  },
});
