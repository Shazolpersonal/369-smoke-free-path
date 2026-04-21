import { useEffect, useCallback } from "react";
import { View, ActivityIndicator, Platform } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Constants from 'expo-constants';
import { useReducedMotion } from '../utils/animations';
import * as SplashScreen from "expo-splash-screen";
import {
    useFonts,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
    useFonts as useBengaliFonts,
    NotoSansBengali_400Regular,
    NotoSansBengali_500Medium,
    NotoSansBengali_600SemiBold,
    NotoSansBengali_700Bold,
} from "@expo-google-fonts/noto-sans-bengali";
import { ProgressProvider, useProgress } from "../contexts/ProgressContext";
import { LanguageProvider, useLanguage } from "../contexts/LanguageContext";
import { ToastProvider, showToast } from '../components/Toast';
import { initNotificationSystem, teardownNotificationSystem } from '../utils/notificationService';
import { logWarn } from '../utils/logger';

// Keep splash screen visible while loading fonts
SplashScreen.preventAutoHideAsync();

// Safely configure notifications only for production builds (not Expo Go)
const IS_EXPO_GO = Constants.appOwnership === 'expo';

if (!IS_EXPO_GO && Platform.OS !== 'web') {
    try {
        const Notifications = require('expo-notifications');
        Notifications.setNotificationHandler({
            handleNotification: async (notification: any) => {
                showToast({
                    message: notification.request.content.body ?? '',
                    type: 'info',
                });
                return {
                    shouldShowAlert: false,
                    shouldPlaySound: false,
                    shouldSetBadge: false,
                    shouldShowBanner: false,
                    shouldShowList: false,
                };
            },
        });
    } catch (e) {
        logWarn("Failed to configure expo-notifications", e);
    }
}

export default function RootLayout() {
    const router = useRouter();
    const reducedMotion = useReducedMotion();
    const [interLoaded, interError] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    const [bengaliLoaded, bengaliError] = useBengaliFonts({
        NotoSansBengali_400Regular,
        NotoSansBengali_500Medium,
        NotoSansBengali_600SemiBold,
        NotoSansBengali_700Bold,
    });

    const fontsLoaded = interLoaded && bengaliLoaded;
    const fontError = interError || bengaliError;

    const onLayoutRootView = useCallback(async () => {
        if (fontsLoaded || fontError) {
            await SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    useEffect(() => {
        if (IS_EXPO_GO || Platform.OS === 'web') return;

        try {
            const Notifications = require('expo-notifications');
            const responseListener = Notifications.addNotificationResponseReceivedListener((response: any) => {
                const data = response.notification.request.content.data;
                const url = data?.url;

                // Security: Validate the incoming URL to prevent arbitrary navigation/deep link hijacking.
                // We ensure the URL is a relative path to keep navigation internal.
                const isSafeRelativeRoute = typeof url === 'string' && url.startsWith('/') && !url.startsWith('//');

                if (isSafeRelativeRoute) {
                    router.push(url as any);
                } else {
                    router.push('/' as any);
                }
            });

            return () => {
                responseListener.remove();
            };
        } catch (e) {
            logWarn("Failed to attach notification listener", e);
        }
    }, []);

    if (!fontsLoaded && !fontError) {
        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A' }}>
                <ActivityIndicator size="large" color="#10B981" />
            </View>
        );
    }

    return (
        <ProgressProvider>
            <LanguageProvider>
                <View style={{ flex: 1, backgroundColor: '#0F172A' }} onLayout={onLayoutRootView}>
                    <StatusBar style="light" />
                    <AuthRedirect />
                    <NotificationInitializer />
                    <Stack
                        screenOptions={{
                            headerShown: false,
                            contentStyle: { backgroundColor: "#0F172A" },
                        }}
                    >
                        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                        <Stack.Screen name="onboarding" options={{ animation: "fade_from_bottom" }} />
                        <Stack.Screen name="guide" options={{ presentation: "modal", animation: "slide_from_bottom", animationDuration: reducedMotion ? 0 : 400 }} />
                        <Stack.Screen name="task/[slot]" options={{ animation: "slide_from_right", animationDuration: reducedMotion ? 0 : 350 }} />
                    </Stack>
                    <ToastProvider />
                </View>
            </LanguageProvider>
        </ProgressProvider>
    );
}

function AuthRedirect() {
    const router = useRouter();
    const segments = useSegments();
    const { isFirstLaunch, isLoading } = useProgress();

    useEffect(() => {
        if (isLoading) return;

        const inOnboarding = segments[0] === "onboarding";

        const timer = setTimeout(() => {
            if (isFirstLaunch && !inOnboarding) {
                router.replace("/onboarding");
            } else if (!isFirstLaunch && inOnboarding) {
                router.replace("/");
            }
        }, 50);

        return () => clearTimeout(timer);
    }, [isFirstLaunch, isLoading, segments]);

    return null;
}

function NotificationInitializer() {
    const { isFirstLaunch, isLoading } = useProgress();
    const { language } = useLanguage();

    useEffect(() => {
        if (isLoading || isFirstLaunch) return;

        initNotificationSystem({ language });

        return () => {
            teardownNotificationSystem();
        };
    }, [isLoading, isFirstLaunch, language]);

    return null;
}
