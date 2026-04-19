# 369 Smoke-Free Path — Complete Technical Documentation

## 1. Executive Summary
This application is a React Native mobile app built with Expo, designed to help users quit smoking over a 41-day journey incorporating the 369 manifestation method and Islamic values. It supports both English and Bengali languages, uses Expo Router for file-based navigation, and persists data via AsyncStorage. It incorporates interactive features such as daily tasks, progress rings, achievements, and notifications.

## 2. Project Structure
```
./.gitignore
./APP_DOCUMENTATION.md
./BETA_QA_AUDIT_REPORT.md
./app.json
./app/(tabs)/_layout.tsx
./app/(tabs)/history.tsx
./app/(tabs)/index.tsx
./app/_layout.tsx
./app/guide.tsx
./app/onboarding.tsx
./app/task/[slot].tsx
./babel.config.js
./components/Accordion.tsx
./components/Achievements.tsx
./components/BatteryOptimizationGuide.tsx
./components/BottomSheet.tsx
./components/CalendarDay.tsx
./components/ConfettiBurst.tsx
./components/DailyQuote.tsx
./components/DonationBanner.tsx
./components/DonationPrompt.tsx
./components/ErrorBoundary.tsx
./components/JourneyProgressRing.tsx
./components/RepetitionCounter.tsx
./components/SkeletonLoader.tsx
./components/TaskCard.tsx
./components/Toast.tsx
./contexts/LanguageContext.tsx
./contexts/ProgressContext.tsx
./data/affirmations.ts
./data/affirmations_bn.ts
./data/quotes.ts
./data/quotes_bn.ts
./eas.json
./generate_docs.py
./global.css
./i18n/bn.ts
./i18n/en.ts
./i18n/index.ts
./metro.config.js
./nativewind-env.d.ts
./package-lock.json
./package.json
./pnpm-lock.yaml
./tailwind.config.js
./test_colors.js
./tsconfig.json
./types/index.ts
./utils/achievements.ts
./utils/animations.ts
./utils/appStateChecker.ts
./utils/bengaliNumber.ts
./utils/bootReceiver.ts
./utils/cn.ts
./utils/contentCycler.ts
./utils/contentRotator.ts
./utils/dayStatus.ts
./utils/donationConfig.ts
./utils/fonts.ts
./utils/logger.ts
./utils/notificationContent.ts
./utils/notificationService.ts
./utils/notifications.ts
./utils/permissionManager.ts
./utils/repetitionTarget.ts
./utils/scheduler.ts
./utils/textValidator.ts
./utils/theme.ts
./utils/timeSlotManager.ts
./utils/useResponsive.ts
./utils/useStaggeredEntry.ts
./utils/watchdog.ts
```

## 3. Technology Stack
- **Framework:** React Native, Expo
- **Language:** TypeScript
- **Navigation:** Expo Router
- **Styling:** TailwindCSS, NativeWind, Expo Linear Gradient
- **Animations:** React Native Reanimated, Expo Haptics
- **Storage:** AsyncStorage
- **Testing:** Jest

## 4. Architecture Overview
- **Pattern:** Layered architecture (UI Components, Contexts for state, Utils for domain logic, Hooks for orchestration).
- **State Management:** React Context (`ProgressContext`, `LanguageContext`).

## 5. Entry Points & Application Bootstrap
- `app/_layout.tsx`: Initializes fonts, notifications, context providers, and splash screen.
- `app/(tabs)/_layout.tsx`: Main tab navigation.

## 6. Module / Component Reference
### `./.gitignore`
- **Purpose:** Miscellaneous file.
- **Internal Logic:** N/A
- **Data Flow:** N/A
- **Side Effects:** N/A
- **Error Handling:** N/A
- **Dependencies:** None
- **Exports:** None

### `./APP_DOCUMENTATION.md`
- **Purpose:** This documentation file.
- **Internal Logic:** N/A
- **Data Flow:** N/A
- **Side Effects:** N/A
- **Error Handling:** N/A
- **Dependencies:** None
- **Exports:** None

### `./BETA_QA_AUDIT_REPORT.md`
- **Purpose:** QA Audit Report identifying bugs and improvements.
- **Internal Logic:** Lists i18n bugs, accessibility concerns, and architecture strengths.
- **Data Flow:** N/A
- **Side Effects:** Guides developer fixes.
- **Error Handling:** N/A
- **Dependencies:** None
- **Exports:** None

### `./app.json`
- **Purpose:** Expo application configuration.
- **Internal Logic:** Defines app name, bundle identifier, plugins (notifications, haptics).
- **Data Flow:** Parsed by Expo CLI.
- **Side Effects:** Affects native iOS/Android builds.
- **Error Handling:** N/A
- **Dependencies:** None
- **Exports:** None

### `./app/(tabs)/_layout.tsx`
- **Purpose:** React component for _layout.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Reads state from React Context (Progress or Language).
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../../utils/fonts, lucide-react-native, ../../contexts/LanguageContext, ../../utils/animations, react-native-reanimated, react, ../../utils/theme, expo-router, react-native
- **Exports:** TabLayout

### `./app/(tabs)/history.tsx`
- **Purpose:** React component for history.
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language). Receives data via React props.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../../utils/fonts, lucide-react-native, expo-linear-gradient, react-native-safe-area-context, ../../contexts/ProgressContext, ../../contexts/LanguageContext, ../../components/Achievements, ../../types, react-native-reanimated, ../../components/BottomSheet, ../../components/CalendarDay, react, ../../utils/theme, ../../utils/timeSlotManager, expo-router, react-native-svg, react-native, ../../utils/dayStatus
- **Exports:** HistoryScreen

### `./app/(tabs)/index.tsx`
- **Purpose:** React component for index.
- **Internal Logic:** Checks reduced motion accessibility preference. Uses totalElapsedDays to determine the user's progress in the 41-day cycle. Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language).
- **Side Effects:** Modifies navigation stack via Expo Router.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../../contexts/LanguageContext, expo-router, ../../components/DailyQuote, react-native-svg, ../../utils/useStaggeredEntry, react-native, ../../utils/fonts, lucide-react-native, react-native-safe-area-context, react, ../../utils/timeSlotManager, ../../components/Toast, ../../utils/contentCycler, expo-linear-gradient, react-native-reanimated, ../../components/BottomSheet, ../../components/DonationBanner, ../../utils/theme, ../../components/SkeletonLoader, ../../types, ../../contexts/ProgressContext, ../../utils/animations, ../../components/TaskCard, ../../components/JourneyProgressRing
- **Exports:** Dashboard

### `./app/_layout.tsx`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Checks reduced motion accessibility preference. Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language).
- **Side Effects:** Modifies navigation stack via Expo Router.
- **Error Handling:** Uses try/catch blocks for execution safety. Presents error feedback to user.
- **Dependencies:** ../utils/notificationService, @expo-google-fonts/inter, expo-status-bar, ../contexts/LanguageContext, expo-constants, ../utils/animations, react, ../components/Toast, expo-splash-screen, ../contexts/ProgressContext, expo-notifications, ../utils/logger, @expo-google-fonts/noto-sans-bengali, expo-router, react-native
- **Exports:** RootLayout

### `./app/guide.tsx`
- **Purpose:** Guide Screen — Dark Theme
* How-to guide explaining the app's purpose and 369 method.
Uses StyleSheet for dark theme consistency.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Reads state from React Context (Progress or Language).
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** lucide-react-native, ../utils/theme, react-native-safe-area-context, ../contexts/LanguageContext, ../utils/fonts, expo-router, react-native
- **Exports:** Guide

### `./app/onboarding.tsx`
- **Purpose:** React component for onboarding.
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language).
- **Side Effects:** Modifies navigation stack via Expo Router.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../utils/notificationService, expo-linear-gradient, ../utils/theme, react-native-safe-area-context, ../contexts/LanguageContext, react-native-reanimated, ../utils/fonts, ../utils/animations, react, ../contexts/ProgressContext, expo-router, ../components/BatteryOptimizationGuide, react-native
- **Exports:** OnboardingScreen

### `./app/task/[slot].tsx`
- **Purpose:** Task Input Screen — Complete Rebuild
* The core screen where users type affirmations.
Dark theme with real-time highlighting, circular progress,
confetti animations, and donation prompt.
* Features:
- Custom header with golden back button, slot emoji, counter badge
- Affirmation display card with dark background and left accent bar
- Real-time 3-color highlighting (green/red/faded)
- Animated border color on input (green/red/neutral)
- Accuracy % display with contextual hints
- Auto-submit at 100%, manual submit at 80%+
- Brief success flash between repetitions
- Final success screen with confetti and donation prompt
- Haptic feedback on completion
- **Internal Logic:** Uses totalElapsedDays to determine the user's progress in the 41-day cycle. Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language). Receives data via React props.
- **Side Effects:** Triggers haptic feedback via expo-haptics.
- **Error Handling:** Uses try/catch blocks for execution safety.
- **Dependencies:** ../../contexts/LanguageContext, ../../components/DonationPrompt, ../../utils/bengaliNumber, expo-router, react-native, ../../utils/fonts, lucide-react-native, react-native-safe-area-context, ../../utils/textValidator, react, expo-haptics, ../../utils/contentCycler, expo-linear-gradient, react-native-reanimated, ../../components/ConfettiBurst, ../../utils/repetitionTarget, ../../utils/theme, ../../components/RepetitionCounter, ../../types, ../../contexts/ProgressContext, ../../utils/animations
- **Exports:** TaskInputScreen

### `./babel.config.js`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** None
- **Exports:** None

### `./components/Accordion.tsx`
- **Purpose:** React component for Accordion.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Receives data via React props.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** react, lucide-react-native, react-native, react-native-reanimated
- **Exports:** Accordion

### `./components/Achievements.tsx`
- **Purpose:** React component for Achievements.
- **Internal Logic:** Uses totalElapsedDays to determine the user's progress in the 41-day cycle.
- **Data Flow:** Reads state from React Context (Progress or Language).
- **Side Effects:** Triggers haptic feedback via expo-haptics.
- **Error Handling:** No specific error handling.
- **Dependencies:** ./ConfettiBurst, expo-linear-gradient, ../utils/theme, ../contexts/LanguageContext, react-native-reanimated, ../utils/fonts, ../utils/achievements, react, ../contexts/ProgressContext, expo-haptics, react-native
- **Exports:** Achievements

### `./components/BatteryOptimizationGuide.tsx`
- **Purpose:** React component for BatteryOptimizationGuide.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Receives data via React props.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../i18n, react, react-native
- **Exports:** ManufacturerGuide, Manufacturer, BatteryOptimizationGuide, getManufacturerGuide, detectManufacturer

### `./components/BottomSheet.tsx`
- **Purpose:** React component for BottomSheet.
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Receives data via React props.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../utils/theme, react-native-reanimated, ../utils/animations, react, react-native
- **Exports:** BottomSheet

### `./components/CalendarDay.tsx`
- **Purpose:** React component for CalendarDay.
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language). Receives data via React props.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../utils/theme, ../contexts/LanguageContext, react-native-reanimated, ../utils/fonts, ../utils/animations, react, ../types, react-native
- **Exports:** CalendarDay

### `./components/ConfettiBurst.tsx`
- **Purpose:** React component for ConfettiBurst.
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Receives data via React props.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** react, react-native, react-native-reanimated
- **Exports:** ConfettiBurst

### `./components/DailyQuote.tsx`
- **Purpose:** React component for DailyQuote.
- **Internal Logic:** Uses totalElapsedDays to determine the user's progress in the 41-day cycle. Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language).
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../utils/theme, ../contexts/LanguageContext, react-native-reanimated, ../utils/fonts, ../utils/animations, react, ../data/quotes, ../contexts/ProgressContext, ../data/quotes_bn, ../utils/contentCycler, react-native
- **Exports:** DailyQuote

### `./components/DonationBanner.tsx`
- **Purpose:** A gentle, beautiful donation banner shown on the home screen.
Tapping it opens the DonationBottomSheet with payment options.
- **Internal Logic:** Uses totalElapsedDays to determine the user's progress in the 41-day cycle.
- **Data Flow:** Reads state from React Context (Progress or Language).
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** lucide-react-native, ../contexts/LanguageContext, react-native-reanimated, ../utils/fonts, react, ../utils/donationConfig, ../contexts/ProgressContext, ./BottomSheet, react-native
- **Exports:** DonationBanner

### `./components/DonationPrompt.tsx`
- **Purpose:** A gentle donation prompt shown after task completion.
Appears at most ONCE per day — not on every completion.
Replaces the old interstitial ad with something meaningful.
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language).
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** lucide-react-native, ../contexts/LanguageContext, react-native-reanimated, ../utils/fonts, react, ../utils/donationConfig, ./BottomSheet, react-native
- **Exports:** DonationPrompt

### `./components/ErrorBoundary.tsx`
- **Purpose:** React component for ErrorBoundary.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Receives data via React props.
- **Side Effects:** Reads/writes to AsyncStorage. Triggers native OS alerts.
- **Error Handling:** Uses try/catch blocks for execution safety. Logs errors via centralized logger. Presents error feedback to user.
- **Dependencies:** ../i18n, @react-native-async-storage/async-storage, ../utils/theme, react-native-safe-area-context, expo-updates, expo-constants, react, ../utils/logger, react-native
- **Exports:** ErrorBoundary

### `./components/JourneyProgressRing.tsx`
- **Purpose:** React component for JourneyProgressRing.
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language). Receives data via React props.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../utils/bengaliNumber, ../utils/theme, ../contexts/LanguageContext, react-native-reanimated, ../utils/fonts, react, react-native-svg, react-native
- **Exports:** JourneyProgressRing

### `./components/RepetitionCounter.tsx`
- **Purpose:** React component for RepetitionCounter.
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language). Receives data via React props.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../utils/bengaliNumber, ../utils/theme, ../contexts/LanguageContext, react-native-reanimated, ../utils/fonts, react, react-native-svg, react-native
- **Exports:** RepetitionCounter

### `./components/SkeletonLoader.tsx`
- **Purpose:** React component for SkeletonLoader.
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Receives data via React props.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** expo-linear-gradient, ../utils/theme, react-native-reanimated, react, react-native
- **Exports:** SkeletonLoader

### `./components/TaskCard.tsx`
- **Purpose:** React component for TaskCard.
- **Internal Logic:** Checks reduced motion accessibility preference. Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language). Receives data via React props.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** lucide-react-native, expo-linear-gradient, ../utils/theme, ../contexts/LanguageContext, react-native-reanimated, ../utils/fonts, ../components/Toast, ../utils/animations, react, ../types, react-native
- **Exports:** TaskCard, TaskCardProps, styles as taskCardStyles

### `./components/Toast.tsx`
- **Purpose:** React component for Toast.
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language).
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** lucide-react-native, ../utils/theme, react-native-safe-area-context, ../contexts/LanguageContext, react-native-reanimated, ../utils/fonts, react, react-native
- **Exports:** ToastEvent, showToast, ToastConfig, ToastType, ToastProvider

### `./contexts/LanguageContext.tsx`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language). Receives data via React props.
- **Side Effects:** Reads/writes to AsyncStorage.
- **Error Handling:** Uses try/catch blocks for execution safety. Logs errors via centralized logger.
- **Dependencies:** ../utils/logger, ../i18n, react, @react-native-async-storage/async-storage
- **Exports:** LANGUAGE_STORAGE_KEY, LanguageProvider, useLanguage

### `./contexts/ProgressContext.tsx`
- **Purpose:** Returns YYYY-MM-DD in local timezone
- **Internal Logic:** Uses totalElapsedDays to determine the user's progress in the 41-day cycle. Computes date boundaries considering the 5 AM offset. Uses useEffect for side effects.
- **Data Flow:** Reads state from React Context (Progress or Language). Receives data via React props.
- **Side Effects:** Reads/writes to AsyncStorage. Triggers native OS alerts.
- **Error Handling:** Uses try/catch blocks for execution safety. Logs errors via centralized logger. Presents error feedback to user.
- **Dependencies:** @react-native-async-storage/async-storage, ../utils/timeSlotManager, react, ../utils/logger, ../types, react-native
- **Exports:** ProgressProvider, useProgress

### `./data/affirmations.ts`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** None
- **Exports:** affirmations

### `./data/affirmations_bn.ts`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** None
- **Exports:** affirmations

### `./data/quotes.ts`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** None
- **Exports:** Quote, quotes

### `./data/quotes_bn.ts`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ./quotes
- **Exports:** quotes_bn

### `./eas.json`
- **Purpose:** JSON data or configuration file.
- **Internal Logic:** Stores static mapping or config.
- **Data Flow:** Parsed on import.
- **Side Effects:** None.
- **Error Handling:** N/A
- **Dependencies:** None
- **Exports:** None

### `./generate_docs.py`
- **Purpose:** Miscellaneous file.
- **Internal Logic:** N/A
- **Data Flow:** N/A
- **Side Effects:** N/A
- **Error Handling:** N/A
- **Dependencies:** None
- **Exports:** None

### `./global.css`
- **Purpose:** Global CSS stylesheet.
- **Internal Logic:** Imports Tailwind base components and utilities.
- **Data Flow:** N/A
- **Side Effects:** Applies global styles via NativeWind.
- **Error Handling:** N/A
- **Dependencies:** None
- **Exports:** None

### `./i18n/bn.ts`
- **Purpose:** Bengali (বাংলা) translations for 369 Smoke-Free Path / ৩৬৯ ধোঁয়া-মুক্ত পথ
All hardcoded Bengali text migrated to key-based i18n
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** None
- **Exports:** bn

### `./i18n/en.ts`
- **Purpose:** English translations for 369 Smoke-Free Path
Context: Smoking cessation through daily affirmations
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** None
- **Exports:** en

### `./i18n/index.ts`
- **Purpose:** Get a translated string by key, with optional parameter interpolation.
Parameters use {{paramName}} syntax, e.g., t('task.needPercent', { n: 80 })
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ./en, ./bn
- **Exports:** Language, translate, en, bn

### `./metro.config.js`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** expo/metro-config
- **Exports:** None

### `./nativewind-env.d.ts`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** None
- **Exports:** None

### `./package-lock.json`
- **Purpose:** JSON data or configuration file.
- **Internal Logic:** Stores static mapping or config.
- **Data Flow:** Parsed on import.
- **Side Effects:** None.
- **Error Handling:** N/A
- **Dependencies:** None
- **Exports:** None

### `./package.json`
- **Purpose:** NPM/PNPM package configuration, defining dependencies and scripts.
- **Internal Logic:** Lists 'expo', 'react-native', 'nativewind', and 'jest' as core dependencies.
- **Data Flow:** Build system configuration.
- **Side Effects:** Used by package managers to install dependencies.
- **Error Handling:** N/A
- **Dependencies:** None
- **Exports:** None

### `./pnpm-lock.yaml`
- **Purpose:** Miscellaneous file.
- **Internal Logic:** N/A
- **Data Flow:** N/A
- **Side Effects:** N/A
- **Error Handling:** N/A
- **Dependencies:** None
- **Exports:** None

### `./tailwind.config.js`
- **Purpose:** @type {import('tailwindcss').Config}
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** None
- **Exports:** None

### `./test_colors.js`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ./utils/theme.ts
- **Exports:** None

### `./tsconfig.json`
- **Purpose:** TypeScript compiler configuration.
- **Internal Logic:** Sets strict mode, path aliases.
- **Data Flow:** N/A
- **Side Effects:** Controls TSC.
- **Error Handling:** N/A
- **Dependencies:** None
- **Exports:** None

### `./types/index.ts`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** None
- **Exports:** TimeSlot, DayStatus, DailyProgress, AffirmationDay

### `./utils/achievements.ts`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Uses totalElapsedDays to determine the user's progress in the 41-day cycle.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../types
- **Exports:** Badge, getAchievements

### `./utils/animations.ts`
- **Purpose:** 369 Smoke-Free Path Core Animation System
High-quality, satisfying animation presets to achieve a premium feel.
- **Internal Logic:** Checks reduced motion accessibility preference. Uses useEffect for side effects.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** react, react-native, react-native-reanimated
- **Exports:** FINAL_CONFETTI_DURATION, getStaggerDelay, FADE_DURATION, useReducedMotion, TIMING_CONFIG_SMOOTH, triggerPulse, STAGGER_DELAY, getAnimDuration, SPRING_CONFIG_BOUNCY, AUTO_SUBMIT_DELAY, BRIEF_CONFETTI_DURATION, BRIEF_SUCCESS_DURATION, SPRING_CONFIG, TIMING_CONFIG_SLOW, CONFETTI_PARTICLES, SPRING_CONFIG_GENTLE

### `./utils/appStateChecker.ts`
- **Purpose:** Start listening for app state changes and silently recover notifications
when the app becomes active and fewer than 3 notifications are scheduled.
* Returns a cleanup function that removes the listener.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** Uses try/catch blocks for execution safety.
- **Dependencies:** ../i18n, ./permissionManager, ./scheduler, react-native
- **Exports:** startAppStateChecker

### `./utils/bengaliNumber.ts`
- **Purpose:** Bengali Number Utility
* Converts English/Arabic numerals to Bengali numerals
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** None
- **Exports:** getBengaliTimePeriod, formatTimeByLanguage, toBengaliTime, formatNumberByLanguage, toBengaliNumber

### `./utils/bootReceiver.ts`
- **Purpose:** Register the boot recovery task by defining it.
expo-task-manager handles boot automatically when the task is defined.
No-op in Expo Go.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** Reads/writes to AsyncStorage.
- **Error Handling:** Uses try/catch blocks for execution safety.
- **Dependencies:** ../i18n, @react-native-async-storage/async-storage, ./permissionManager, expo-constants, expo-task-manager, ./logger, ./scheduler
- **Exports:** registerBootReceiver, BootRecoveryLogEntry

### `./utils/cn.ts`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** tailwind-merge, clsx
- **Exports:** cn

### `./utils/contentCycler.ts`
- **Purpose:** Content Cycler for 369 Smoke-Free Path
* IMPORTANT: Always pass `totalElapsedDays` from ProgressContext, NOT `trueStreak`.
- `totalElapsedDays`: Days since journey started (ensures content progression continues even if streak breaks)
- `trueStreak`: Consecutive complete days (would reset content on streak break - NOT desired)
- **Internal Logic:** Uses totalElapsedDays to determine the user's progress in the 41-day cycle.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../i18n, ../types, ../data/affirmations, ../data/affirmations_bn
- **Exports:** getContentIndex, getAffirmationByLanguage

### `./utils/contentRotator.ts`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../types, ../i18n, ./notificationContent
- **Exports:** getNotificationContent, validateContent, NotificationContent

### `./utils/dayStatus.ts`
- **Purpose:** Determines the status of a day based on task completion.
Used for History/Calendar view color coding.
* This is the canonical implementation handling all 5 statuses:
'complete', 'partial', 'missed', 'pending', 'future'
* @param progress - The daily progress object (null if no progress recorded)
@param isToday - Whether this day is the current effective today
@param isFuture - Whether this day is in the future
@param dateKey - Optional YYYY-MM-DD date key for startDate comparison
@param startDate - Optional journey start date; days before this are treated as 'future'
@returns DayStatus
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../types
- **Exports:** getDayStatus

### `./utils/donationConfig.ts`
- **Purpose:** Configure your payment methods here.
Each entry will appear as a button in the DonationBottomSheet.
- **Internal Logic:** Uses totalElapsedDays to determine the user's progress in the 41-day cycle.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** Reads/writes to AsyncStorage.
- **Error Handling:** Uses try/catch blocks for execution safety.
- **Dependencies:** @react-native-async-storage/async-storage
- **Exports:** PAYMENT_METHODS, DONATION_BANNER_MESSAGES_BN, DONATION_BANNER_MESSAGES_EN, getDonationBannerMessage

### `./utils/fonts.ts`
- **Purpose:** Shared font family utility for 369 Smoke-Free Path
Centralizes font selection logic based on language.
Uses Inter (EN) + NotoSansBengali (BN) — language-aware dual font system.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** None
- **Exports:** getFontFamily, FontWeight

### `./utils/logger.ts`
- **Purpose:** Log error safely based on environment.
In production, it obfuscates the error to prevent sensitive data leakage.
* @param messageOrError The error object, string message, or any data to log
@param args Additional arguments to log in development
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** expo-constants
- **Exports:** logWarn, logError

### `./utils/notificationContent.ts`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../types, ../i18n
- **Exports:** getDynamicNotificationMessage, getGentleNudgeMessage

### `./utils/notificationService.ts`
- **Purpose:** Initialize the notification system.
Sets up the Android channel, requests permission, schedules daily reminders,
registers the watchdog and boot receiver, and starts the app state checker.
* No-op in Expo Go and on web.
* Requirements: 1.1, 15.1, 15.6
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../i18n, ./appStateChecker, ./permissionManager, expo-constants, ./watchdog, ./scheduler, react-native, ./bootReceiver
- **Exports:** None

### `./utils/notifications.ts`
- **Purpose:** Request notification permissions and set up Android channel
- **Internal Logic:** Schedules local notifications.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ./notificationService, expo-notifications, react-native
- **Exports:** None

### `./utils/permissionManager.ts`
- **Purpose:** Request notification permission from the OS.
Returns 'granted' immediately on web or Expo Go to avoid crashes.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** Reads/writes to AsyncStorage.
- **Error Handling:** Uses try/catch blocks for execution safety.
- **Dependencies:** @react-native-async-storage/async-storage, expo-constants, expo-notifications, ./logger, react-native
- **Exports:** PermissionState, PermissionStatus

### `./utils/repetitionTarget.ts`
- **Purpose:** Returns the target repetition count for a given time slot.
Based on the 3-6-9 method:
- Morning: 3 repetitions
- Noon: 6 repetitions
- Night: 9 repetitions
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../types
- **Exports:** getTargetCount

### `./utils/scheduler.ts`
- **Purpose:** Utility logic or types.
- **Internal Logic:** Schedules local notifications.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** Reads/writes to AsyncStorage.
- **Error Handling:** Uses try/catch blocks for execution safety.
- **Dependencies:** ../i18n, @react-native-async-storage/async-storage, expo-constants, expo-notifications, ../types, ./contentRotator, react-native
- **Exports:** ScheduleResult

### `./utils/textValidator.ts`
- **Purpose:** Text Validator Utility
Handles normalization and validation of user input against target affirmation text.
Supports Bengali text with proper Unicode normalization and grapheme handling.
* Requirements: 4.5, 5.1, 5.2, 5.3, 5.4
- **Internal Logic:** Splits Bengali text properly using grapheme-splitter to support conjunct characters.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** grapheme-splitter
- **Exports:** getDisplayText, normalize, getHighlightSegments, getValidationInfo, validate, HighlightSegments, ValidationInfo, splitIntoGraphemes

### `./utils/theme.ts`
- **Purpose:** 369 Smoke-Free Path Core Theme System
Contains constants, gradients, and semantic colors.
Mirrors Niyyah's design tokens with smoke-free context.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** react-native
- **Exports:** SPACING, TYPOGRAPHY, COLORS, SLOT_ACCENT_COLORS, SLOT_EMOJIS, GRADIENTS, SHADOWS, BORDER_RADIUS

### `./utils/timeSlotManager.ts`
- **Purpose:** Time Slot Manager
* Manages time slots based on the 369 methodology:
- Morning: 08:00 (8 AM) to 12:59
- Noon: 13:00 (1 PM) to 17:59
- Night: 18:00 (6 PM) to 04:59 (next day)
* Note: 05:00 - 07:59 is a rest period (returns null)
- **Internal Logic:** Uses totalElapsedDays to determine the user's progress in the 41-day cycle. Computes date boundaries considering the 5 AM offset.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ../types, ./bengaliNumber
- **Exports:** getSlotTimeRange, getCurrentSlot, getDisplayDay, SlotStatus, isSlotActive, MAX_DISPLAY_DAY, getEffectiveTodayDate, getEffectiveStartDate, getSlotStatus, DAY_BOUNDARY_HOUR, calculateEffectiveElapsedDays, isJourneyComplete, getTodayEffectiveDateKey, formatLocalDateKey, getNextDayBoundaryTimestamp, getEffectiveStartDateFromTime, getEffectiveDateKey, getSlotStartTimeColloquial, formatDateKeyHumanReadable

### `./utils/useResponsive.ts`
- **Purpose:** Responsive flags based on screen width.
Validates: Requirements 11.1
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** react, react-native
- **Exports:** ResponsiveFlags, useResponsive

### `./utils/useStaggeredEntry.ts`
- **Purpose:** Reusable hook for staggered entry animations
* @param index - Index of the item in the list
@param baseDelay - Base delay before starting the animation sequence
@param staggerMs - Milliseconds to delay per index step
@param translateYDistance - Distance to slide up from (default 20px)
- **Internal Logic:** Uses useEffect for side effects.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** None explicitly noted.
- **Error Handling:** No specific error handling.
- **Dependencies:** ./animations, react, react-native-reanimated
- **Exports:** useStaggeredEntry

### `./utils/watchdog.ts`
- **Purpose:** Register the background watchdog task.
No-op in Expo Go.
- **Internal Logic:** Executes sequential script logic or defines constants.
- **Data Flow:** Standard function arguments and returns.
- **Side Effects:** Reads/writes to AsyncStorage.
- **Error Handling:** Uses try/catch blocks for execution safety.
- **Dependencies:** ../i18n, @react-native-async-storage/async-storage, expo-constants, expo-task-manager, ./logger, ./scheduler, expo-background-fetch
- **Exports:** None

## 7. Data Models & Schemas
Types are located in `types/index.ts`. Includes `TimeSlot`, `DayStatus`, `DailyProgress`.

## 8. API Reference
No external API routes. App works fully offline with local storage.

## 9. State Management
Managed via `ProgressContext` (tracks days, streaks, completion) and `LanguageContext` (i18n).

## 10. Configuration & Environment
Configured via `app.json`, `metro.config.js`, `babel.config.js`, `tailwind.config.js`.

## 11. External Services & Integrations
None strictly, other than Expo services (e.g. expo-notifications).

## 12. Authentication & Security
Offline app, no authentication. Security considerations include obfuscating sensitive data inputs in forms via keyboard rules (`autoComplete="off"`, etc.).

## 13. Build, Test & Deployment
Built with Expo EAS. Testing via Jest (`jest-expo`). Use `pnpm install` and `npx pnpm test`.

## 14. Known Issues & Technical Debt
BETA_QA_AUDIT_REPORT.md flags i18n key mismatches and hardcoded strings.

## 15. Glossary
- **369 Method:** Writing affirmations 3 times in morning, 6 in afternoon, 9 at night.
- **Niyyah/Affirmation:** The phrase being written.
