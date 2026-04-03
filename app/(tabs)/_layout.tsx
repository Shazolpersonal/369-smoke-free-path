import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Calendar } from 'lucide-react-native';
import Animated, { useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { useLanguage } from '../../contexts/LanguageContext';
import { getFontFamily } from '../../utils/fonts';
import { COLORS } from '../../utils/theme';
import { SPRING_CONFIG_BOUNCY } from '../../utils/animations';

function TabIcon({ icon: Icon, color, focused }: { icon: any; color: string; focused: boolean }) {
    const rStyle = useAnimatedStyle(() => ({
        transform: [{ scale: withSpring(focused ? 1.15 : 1, SPRING_CONFIG_BOUNCY) }],
    }));

    return (
        <Animated.View style={[styles.iconContainer, rStyle]}>
            <Icon size={22} color={color} strokeWidth={focused ? 2.5 : 2} />
            {focused && <View style={[styles.activeDot, { backgroundColor: color }]} />}
        </Animated.View>
    );
}

export default function TabLayout() {
    const { t, language } = useLanguage();
    const f = (weight: 'regular' | 'medium' | 'semibold' | 'bold') => getFontFamily(weight, language);

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: COLORS.success,
                tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
                tabBarStyle: styles.tabBar,
                tabBarLabelStyle: {
                    fontFamily: f('semibold'),
                    fontSize: 11,
                    marginTop: -2,
                    marginBottom: Platform.OS === 'ios' ? 0 : 8,
                },
                tabBarItemStyle: {
                    paddingTop: 8,
                },
            }}
        >
            <Tabs.Screen
                key={language}
                name="index"
                options={{
                    title: t('tabs.home') || 'হোম',
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon icon={Home} color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                key={language}
                name="history"
                options={{
                    title: t('tabs.history') || 'আমার অগ্রগতি',
                    tabBarIcon: ({ color, focused }) => (
                        <TabIcon icon={Calendar} color={color} focused={focused} />
                    ),
                }}
            />
        </Tabs>
    );
}

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 85 : 65;

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: COLORS.darkCard,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.05)',
        height: TAB_BAR_HEIGHT,
        paddingBottom: Platform.OS === 'ios' ? 20 : 8,
        elevation: 0,
    },
    iconContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeDot: {
        width: 5,
        height: 5,
        borderRadius: 3,
        marginTop: 3,
    },
});
