import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  Dimensions,
  FlatList,
  ViewToken,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  FadeIn,
  SlideInUp,
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useProgress } from '../contexts/ProgressContext';
import { useLanguage } from '../contexts/LanguageContext';
import { getFontFamily } from '../utils/fonts';
import { GRADIENTS } from '../utils/theme';
import { SPRING_CONFIG } from '../utils/animations';
import BatteryOptimizationGuide from '../components/BatteryOptimizationGuide';
import { initNotificationSystem } from '../utils/notificationService';

const { width } = Dimensions.get('window');

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

interface Slide {
  id: string;
  emoji: string;
  title: string;
  description: string;
  showSchedule?: boolean;
  showBatteryGuide?: boolean;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useProgress();
  const { t, language, setLanguage } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  // Button press scale
  const buttonScale = useSharedValue(1);
  // Language toggle scale
  const langScale = useSharedValue(1);

  const slides: Slide[] = [
    {
      id: '1',
      emoji: '🌿',
      title: t('onboarding.slide1.title') || 'Welcome',
      description: t('onboarding.slide1.description') || 'Welcome to the path of a smoke-free life.',
    },
    {
      id: '2',
      emoji: '✨',
      title: t('onboarding.slide2.title') || '369 Method',
      description: t('onboarding.slide2.description') || 'Write positive affirmations daily.',
    },
    {
      id: '3',
      emoji: '🚀',
      title: t('onboarding.slide3.title') || '41 Days Transformation',
      description: t('onboarding.slide3.description') || 'Start your journey today.',
    },
    {
      id: '4',
      emoji: '🕐',
      title: t('onboarding.slide4.title') || 'Your Daily Schedule',
      description: t('onboarding.slide4.description') || 'Three sessions unlock at set times each day.',
      showSchedule: true,
    },
    {
      id: '5',
      emoji: '🔔',
      title: language === 'bn' ? 'নোটিফিকেশান সক্রিয় রাখুন' : 'Keep Notifications Active',
      description: '',
      showBatteryGuide: true,
    },
  ];

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    }
  ).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const toggleLanguage = () => {
    // withSpring scale feedback on language toggle
    langScale.value = withSpring(0.9, SPRING_CONFIG, () => {
      langScale.value = withSpring(1, SPRING_CONFIG);
    });
    setLanguage(language === 'en' ? 'bn' : 'en');
  };

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    }
  };

  const handleStart = async () => {
    await completeOnboarding();
    await initNotificationSystem({ language });
    router.replace('/');
  };

  const handleSkip = async () => {
    await completeOnboarding();
    await initNotificationSystem({ language });
    router.replace('/');
  };

  const handleButtonPressIn = () => {
    buttonScale.value = withSpring(0.96, SPRING_CONFIG);
  };

  const handleButtonPressOut = () => {
    buttonScale.value = withSpring(1, SPRING_CONFIG);
  };

  const buttonAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const langAnimStyle = useAnimatedStyle(() => ({
    transform: [{ scale: langScale.value }],
  }));

  const renderSlide = ({ item, index }: { item: Slide; index: number }) => {
    // First slide uses FadeIn + SlideInUp (600ms); subsequent slides use FadeIn with delay
    const isFirstSlide = index === 0;

    // Battery guide slide fills the full slide area
    if (item.showBatteryGuide) {
      return (
        <View style={[styles.slide, { width }]}>
          <BatteryOptimizationGuide
            language={language}
            onSkip={handleSkip}
            onDone={handleStart}
          />
        </View>
      );
    }

    return (
      <View style={[styles.slide, { width }]}>
        {isFirstSlide ? (
          <>
            <Animated.Text
              entering={FadeIn.duration(600).delay(0).withInitialValues({ opacity: 0 })}
              style={styles.emoji}
            >
              {item.emoji}
            </Animated.Text>
            <Animated.Text
              entering={SlideInUp.duration(600).delay(100)}
              style={[styles.title, { fontFamily: getFontFamily('bold', language) }]}
            >
              {item.title}
            </Animated.Text>
            <Animated.Text
              entering={SlideInUp.duration(600).delay(200)}
              style={[styles.description, { fontFamily: getFontFamily('regular', language) }]}
            >
              {item.description}
            </Animated.Text>
          </>
        ) : (
          <Animated.View entering={FadeIn.duration(600).delay(index * 100)} style={{ alignItems: 'center', width: '100%' }}>
            <Text style={styles.emoji}>{item.emoji}</Text>
            <Text style={[styles.title, { fontFamily: getFontFamily('bold', language) }]}>{item.title}</Text>
            <Text style={[styles.description, { fontFamily: getFontFamily('regular', language) }]}>{item.description}</Text>
            {item.showSchedule && (
              <View style={styles.scheduleContainer}>
                <Animated.View
                  entering={FadeInDown.duration(400).delay(0)}
                  style={[styles.timeChip, { borderColor: 'rgba(251, 191, 36, 0.4)', backgroundColor: 'rgba(251, 191, 36, 0.08)' }]}
                >
                  <Text style={styles.timeChipText}>🌅  {t('onboarding.slide4.morning') || '8:00 AM — Morning (3×)'}</Text>
                </Animated.View>
                <Animated.View
                  entering={FadeInDown.duration(400).delay(150)}
                  style={[styles.timeChip, { borderColor: 'rgba(16, 185, 129, 0.4)', backgroundColor: 'rgba(16, 185, 129, 0.08)' }]}
                >
                  <Text style={styles.timeChipText}>☀️  {t('onboarding.slide4.noon') || '1:00 PM — Afternoon (6×)'}</Text>
                </Animated.View>
                <Animated.View
                  entering={FadeInDown.duration(400).delay(300)}
                  style={[styles.timeChip, { borderColor: 'rgba(99, 102, 241, 0.4)', backgroundColor: 'rgba(99, 102, 241, 0.08)' }]}
                >
                  <Text style={styles.timeChipText}>🌙  {t('onboarding.slide4.night') || '6:00 PM — Evening (9×)'}</Text>
                </Animated.View>
              </View>
            )}
          </Animated.View>
        )}
      </View>
    );
  };

  const isLastSlide = currentIndex === slides.length - 1;

  return (
    <LinearGradient colors={GRADIENTS.dashboardBg} style={{ flex: 1 }}>
      <SafeAreaView style={styles.container}>
        {/* Language Toggle */}
        <View style={styles.langRow}>
          <Animated.View style={langAnimStyle}>
            <TouchableOpacity onPress={toggleLanguage} activeOpacity={0.7}>
              <View style={styles.langToggle}>
                <Text style={[styles.langText, { fontFamily: getFontFamily('semibold', language) }]}>
                  {language === 'en' ? 'বাংলা' : 'English'}
                </Text>
              </View>
            </TouchableOpacity>
          </Animated.View>
        </View>

        <View style={styles.listContainer}>
          <FlatList
            ref={flatListRef}
            data={slides}
            renderItem={renderSlide}
            keyExtractor={(item) => item.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={viewabilityConfig}
            bounces={false}
          />
        </View>

        {/* Pagination Dots */}
        <View style={styles.dotsContainer}>
          {slides.map((_, index) => (
            <AnimatedDot key={index} isActive={index === currentIndex} />
          ))}
        </View>

        {/* Button */}
        <View style={styles.buttonContainer}>
          <AnimatedTouchable
            onPress={isLastSlide ? handleStart : handleNext}
            onPressIn={handleButtonPressIn}
            onPressOut={handleButtonPressOut}
            activeOpacity={1}
            style={[styles.primaryButton, buttonAnimStyle]}
          >
            <Text style={[styles.primaryButtonText, { fontFamily: getFontFamily('semibold', language) }]}>
              {isLastSlide ? t('onboarding.getStarted') || 'Start' : t('onboarding.next') || 'Next'}
            </Text>
          </AnimatedTouchable>

          {!isLastSlide && (
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Text style={[styles.skipButtonText, { fontFamily: getFontFamily('regular', language) }]}>
                {t('onboarding.skip') || 'Skip'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

// Animated pagination dot component
function AnimatedDot({ isActive }: { isActive: boolean }) {
  const scale = useSharedValue(isActive ? 1.5 : 1);
  const colorProgress = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    scale.value = withSpring(isActive ? 1.5 : 1, SPRING_CONFIG);
    colorProgress.value = withTiming(isActive ? 1 : 0, { duration: 300 });
  }, [isActive]);

  const animStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      colorProgress.value,
      [0, 1],
      ['#CBD5E1', '#10B981']
    );
    return {
      transform: [{ scale: scale.value }],
      backgroundColor,
    };
  });

  return <Animated.View style={[styles.dot, animStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  langRow: {
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    paddingTop: 8,
  },
  langToggle: {
    backgroundColor: 'rgba(212, 168, 71, 0.12)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(212, 168, 71, 0.2)',
  },
  langText: {
    fontSize: 14,
    color: '#D4A847',
  },
  listContainer: {
    flex: 1,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 32,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    textAlign: 'center',
    marginBottom: 16,
    marginTop: 32,
  },
  description: {
    color: '#CBD5E1',
    fontSize: 17,
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 28,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginHorizontal: 8,
  },
  buttonContainer: {
    paddingHorizontal: 32,
    paddingBottom: 32,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 20,
    textAlign: 'center',
  },
  skipButton: {
    paddingVertical: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  skipButtonText: {
    color: '#64748B',
    textAlign: 'center',
    fontSize: 15,
  },
  scheduleContainer: {
    marginTop: 24,
    width: '100%',
    gap: 10,
  },
  timeChip: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    alignItems: 'center',
  },
  timeChipText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    fontWeight: '500',
  },
});
