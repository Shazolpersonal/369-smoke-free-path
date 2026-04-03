import React, { useEffect } from 'react';
import { View, Dimensions, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    Easing,
    cancelAnimation,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS } from '../utils/theme';

const { width: screenWidth } = Dimensions.get('window');

interface SkeletonLoaderProps {
    variant: 'taskCard' | 'progressRing' | 'quote';
    count?: number;
}

// Animated LinearGradient wrapper
const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

function ShimmerOverlay() {
    const translateX = useSharedValue(-screenWidth);

    useEffect(() => {
        translateX.value = withRepeat(
            withTiming(screenWidth, {
                duration: 1200,
                easing: Easing.linear,
            }),
            -1,
            false
        );
        return () => {
            cancelAnimation(translateX);
        };
    }, []);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    return (
        <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
            <LinearGradient
                colors={[
                    'transparent',
                    'rgba(255,255,255,0.06)',
                    'rgba(255,255,255,0.12)',
                    'rgba(255,255,255,0.06)',
                    'transparent',
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1, width: screenWidth }}
            />
        </Animated.View>
    );
}

function TaskCardSkeleton() {
    return (
        <View style={styles.taskCard}>
            <View style={styles.taskCardInner}>
                <View style={styles.taskCardCircle} />
                <View style={styles.taskCardLines}>
                    <View style={styles.taskCardLineWide} />
                    <View style={styles.taskCardLineNarrow} />
                </View>
            </View>
            <ShimmerOverlay />
        </View>
    );
}

function ProgressRingSkeleton() {
    return (
        <View style={styles.progressRingWrapper}>
            <View style={styles.progressRing}>
                <ShimmerOverlay />
            </View>
        </View>
    );
}

function QuoteSkeleton() {
    return (
        <View style={styles.quoteCard}>
            <View style={styles.quoteLine1} />
            <View style={styles.quoteLine2} />
            <ShimmerOverlay />
        </View>
    );
}

export function SkeletonLoader({ variant, count = 1 }: SkeletonLoaderProps) {
    if (variant === 'taskCard') {
        return (
            <View>
                {Array.from({ length: count }).map((_, i) => (
                    <TaskCardSkeleton key={i} />
                ))}
            </View>
        );
    }

    if (variant === 'progressRing') {
        return <ProgressRingSkeleton />;
    }

    return <QuoteSkeleton />;
}

const styles = StyleSheet.create({
    // taskCard variant
    taskCard: {
        height: 80,
        borderRadius: 12,
        backgroundColor: COLORS.darkInput,
        borderWidth: 1,
        borderColor: COLORS.darkBorder,
        marginBottom: 12,
        overflow: 'hidden',
    },
    taskCardInner: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        gap: 12,
    },
    taskCardCircle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.darkBorder,
    },
    taskCardLines: {
        flex: 1,
        gap: 8,
    },
    taskCardLineWide: {
        height: 12,
        borderRadius: 6,
        backgroundColor: COLORS.darkBorder,
        width: '70%',
    },
    taskCardLineNarrow: {
        height: 10,
        borderRadius: 5,
        backgroundColor: COLORS.darkBorder,
        width: '45%',
    },

    // progressRing variant
    progressRingWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressRing: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: COLORS.darkInput,
        borderWidth: 2,
        borderColor: COLORS.darkBorder,
        overflow: 'hidden',
    },

    // quote variant
    quoteCard: {
        borderRadius: 12,
        backgroundColor: COLORS.darkInput,
        borderWidth: 1,
        borderColor: COLORS.darkBorder,
        padding: 16,
        overflow: 'hidden',
        gap: 10,
    },
    quoteLine1: {
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.darkBorder,
        width: '90%',
    },
    quoteLine2: {
        height: 14,
        borderRadius: 7,
        backgroundColor: COLORS.darkBorder,
        width: '65%',
    },
});
