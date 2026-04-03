import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
    useAnimatedProps,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
    withSequence,
    cancelAnimation,
    Easing,
    interpolate,
    Extrapolation,
} from 'react-native-reanimated';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { COLORS } from '../utils/theme';
import { useLanguage } from '../contexts/LanguageContext';
import { getFontFamily } from '../utils/fonts';
import { formatNumberByLanguage } from '../utils/bengaliNumber';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface JourneyProgressRingProps {
    currentDay: number;
    totalDays?: number;
    size?: number;
    strokeWidth?: number;
}

export function JourneyProgressRing({
    currentDay,
    totalDays = 41,
    size = 150,
    strokeWidth = 10,
}: JourneyProgressRingProps) {
    const { t, language } = useLanguage();
    const f = (weight: 'regular' | 'medium' | 'semibold' | 'bold') => getFontFamily(language, weight);

    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    const progress = useSharedValue(0);
    const glowOpacity = useSharedValue(0);

    useEffect(() => {
        const targetProgress = totalDays > 0 ? currentDay / totalDays : 0;
        progress.value = withTiming(Math.min(Math.max(targetProgress, 0), 1), {
            duration: 1500,
            easing: Easing.out(Easing.cubic),
        });

        if (totalDays > 0 && currentDay >= totalDays) {
            glowOpacity.value = withSequence(
                withTiming(1, { duration: 300, easing: Easing.out(Easing.cubic) }),
                withTiming(0, { duration: 300, easing: Easing.in(Easing.cubic) })
            );
        }
    }, [currentDay, totalDays]);

    useEffect(() => {
        return () => {
            cancelAnimation(progress);
            cancelAnimation(glowOpacity);
        };
    }, []);

    const animatedProps = useAnimatedProps(() => {
        const strokeDashoffset = interpolate(
            progress.value,
            [0, 1],
            [circumference, 0],
            Extrapolation.CLAMP
        );
        return { strokeDashoffset };
    });

    const glowStyle = useAnimatedStyle(() => ({
        opacity: glowOpacity.value,
    }));

    return (
        <View style={[{ width: size, height: size }, styles.container]}>
            {/* Dark background circle */}
            <View style={[StyleSheet.absoluteFillObject, styles.bgCircle]} />

            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ transform: [{ rotate: '-90deg' }] }}>
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                        <Stop offset="0%" stopColor="#0D9488" />
                        <Stop offset="100%" stopColor="#10B981" />
                    </LinearGradient>
                </Defs>
                {/* Track */}
                <Circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="rgba(255, 255, 255, 0.08)"
                    strokeWidth={strokeWidth}
                    fill="none"
                />
                {/* Progress */}
                <AnimatedCircle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="url(#grad)"
                    strokeWidth={strokeWidth}
                    fill="none"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                />
            </Svg>

            <View style={styles.textContainer}>
                <Text style={[{ fontFamily: f('bold') }, styles.dayText]}>
                    {formatNumberByLanguage(currentDay, language)}
                </Text>
                <Text style={[{ fontFamily: f('medium') }, styles.totalText]}>
                    / {formatNumberByLanguage(totalDays, language)}
                </Text>
            </View>

            {/* Glow pulse overlay — visible when progress reaches 100% */}
            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    styles.glowOverlay,
                    glowStyle,
                ]}
                pointerEvents="none"
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        borderRadius: 999,
    },
    bgCircle: {
        borderRadius: 999,
        backgroundColor: '#0F172A',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.06)',
    },
    textContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
    },
    dayText: {
        fontSize: 32,
        color: '#FFFFFF',
        marginBottom: -4,
    },
    totalText: {
        fontSize: 15,
        color: 'rgba(255, 255, 255, 0.4)',
    },
    glowOverlay: {
        borderRadius: 999,
        backgroundColor: '#D4A847',
        opacity: 0,
    },
});
