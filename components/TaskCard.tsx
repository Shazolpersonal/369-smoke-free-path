import React, { useEffect } from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withSpring,
    withSequence,
    withRepeat,
    cancelAnimation,
    Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Lock, ArrowRight } from 'lucide-react-native';
import { getFontFamily } from '../utils/fonts';
import {   COLORS, GRADIENTS , TYPOGRAPHY , SPACING } from "../utils/theme";
import { TimeSlot } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { showToast } from '../components/Toast';
import { useReducedMotion } from '../utils/animations';

export interface TaskCardProps {
    slot: TimeSlot;
    isActive: boolean;
    isCompleted: boolean;
    onPress: () => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function TaskCard({ slot, isActive, isCompleted, onPress }: TaskCardProps) {
    const { t, language } = useLanguage();
    const reducedMotion = useReducedMotion();

    // Shared values for animations
    const pressScale = useSharedValue(1);
    const pulseOpacity = useSharedValue(0.4);
    const shakeX = useSharedValue(0);
    const checkmarkScale = useSharedValue(isCompleted ? 1 : 0);
    const stateOpacity = useSharedValue(1);

    // Active border pulse glow: opacity 0.4→1.0, 2s cycle
    useEffect(() => {
        if (isActive && !isCompleted && !reducedMotion) {
            pulseOpacity.value = withRepeat(
                withSequence(
                    withTiming(1.0, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(0.4, { duration: 1000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                false
            );
        } else {
            cancelAnimation(pulseOpacity);
            pulseOpacity.value = withTiming(isActive ? 0.4 : 0, { duration: 300 });
        }
        return () => {
            cancelAnimation(pulseOpacity);
        };
    }, [isActive, isCompleted, reducedMotion]);

    // Checkmark scale-in when completed
    useEffect(() => {
        if (isCompleted) {
            checkmarkScale.value = reducedMotion
                ? 1
                : withSpring(1, { damping: 14, stiffness: 120, mass: 0.8 });
        } else {
            checkmarkScale.value = 0;
        }
    }, [isCompleted, reducedMotion]);

    // State transition opacity (smooth 300ms)
    useEffect(() => {
        stateOpacity.value = withTiming(1, {
            duration: reducedMotion ? 0 : 300,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
        });
    }, [isActive, isCompleted, reducedMotion]);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cancelAnimation(pressScale);
            cancelAnimation(pulseOpacity);
            cancelAnimation(shakeX);
            cancelAnimation(checkmarkScale);
            cancelAnimation(stateOpacity);
        };
    }, []);

    const getSlotLabel = () => {
        switch (slot) {
            case 'morning': return t('slot.morning.label');
            case 'noon': return t('slot.noon.label');
            case 'night': return t('slot.night.label');
        }
    };

    const getSlotSubtitle = () => {
        switch (slot) {
            case 'morning': return t('slot.morning.timeRange');
            case 'noon': return t('slot.noon.timeRange');
            case 'night': return t('slot.night.timeRange');
        }
    };

    const getSlotIcon = () => {
        switch (slot) {
            case 'morning': return '🌅';
            case 'noon': return '☀️';
            case 'night': return '🌙';
        }
    };

    // Card Colors Based on State
    const getCardGradients = () => {
        if (isCompleted) {
            return ['rgba(16, 185, 129, 0.12)', 'rgba(16, 185, 129, 0.25)'];
        }
        if (isActive) {
            return GRADIENTS.emerald;
        }
        return [COLORS.darkCard, COLORS.darkCard];
    };

    const SLOT_OPEN_HOURS: Record<TimeSlot, number> = { morning: 8, noon: 13, night: 18 };

    const getMinutesUntilSlot = (slot: TimeSlot): number => {
        const now = new Date();
        const openHour = SLOT_OPEN_HOURS[slot];
        const openMinutes = openHour * 60;
        const nowMinutes = now.getHours() * 60 + now.getMinutes();
        let diff = openMinutes - nowMinutes;
        if (diff < 0) diff += 24 * 60;
        return diff;
    };

    const getSlotOpenTimeString = (slot: TimeSlot): string => {
        switch (slot) {
            case 'morning': return '8:00 AM';
            case 'noon': return '1:00 PM';
            case 'night': return '6:00 PM';
        }
    };

    const getLockedSlotMessage = () => {
        switch (slot) {
            case 'morning': return t('taskCard.lockedMorning');
            case 'noon': return t('taskCard.lockedNoon');
            case 'night': return t('taskCard.lockedNight');
        }
    };

    const handlePress = () => {
        if (!isActive && !isCompleted) {
            // Locked state: horizontal shake ±6px × 3, 250ms total
            if (!reducedMotion) {
                const stepDuration = 250 / 6;
                shakeX.value = withSequence(
                    withTiming(-6, { duration: stepDuration }),
                    withTiming(6, { duration: stepDuration }),
                    withTiming(-6, { duration: stepDuration }),
                    withTiming(6, { duration: stepDuration }),
                    withTiming(-6, { duration: stepDuration }),
                    withTiming(0, { duration: stepDuration })
                );
            }
            showToast({ message: getLockedSlotMessage(), type: 'info' });
        } else {
            onPress();
        }
    };

    const handlePressIn = () => {
        if (isActive && !reducedMotion) {
            pressScale.value = withTiming(0.96, { duration: 100 });
        }
    };

    const handlePressOut = () => {
        if (isActive && !reducedMotion) {
            pressScale.value = withTiming(1, { duration: 150 });
        }
    };

    // Animated styles
    const containerAnimStyle = useAnimatedStyle(() => ({
        transform: [
            { scale: pressScale.value },
            { translateX: shakeX.value },
        ],
        opacity: stateOpacity.value,
    }));

    const pulseGlowStyle = useAnimatedStyle(() => ({
        opacity: pulseOpacity.value,
    }));

    const checkmarkAnimStyle = useAnimatedStyle(() => ({
        transform: [{ scale: checkmarkScale.value }],
    }));

    const getAccessibilityLabel = () => {
        const slotName = getSlotLabel();
        if (isCompleted) return `${slotName}. ${t('taskCard.completedTapToView')}`;
        if (isActive) return `${slotName}. ${t('taskCard.write') || 'Write'}`;
        const minutesUntil = getMinutesUntilSlot(slot);
        if (minutesUntil <= 60) return `${slotName}. ${t('taskCard.opensInMin').replace('{{n}}', String(minutesUntil))}`;
        return `${slotName}. ${t('taskCard.opensAt').replace('{{time}}', getSlotOpenTimeString(slot))}`;
    };

    return (
        <AnimatedTouchable
            activeOpacity={0.8}
            onPress={handlePress}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            style={[styles.container, containerAnimStyle]}
            accessibilityRole="button"
            accessibilityState={{ disabled: !isActive && !isCompleted }}
            accessibilityLabel={getAccessibilityLabel()}
        >
            <LinearGradient
                colors={getCardGradients() as readonly [string, string, ...string[]]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[
                    styles.card,
                    isActive && !isCompleted && styles.cardActive,
                    isCompleted && styles.cardCompleted,
                ]}
            >
                {/* Active pulse glow overlay on border */}
                {isActive && !isCompleted && (
                    <Animated.View style={[styles.pulseGlowBorder, pulseGlowStyle]} />
                )}

                <View style={styles.leftSection}>
                    <View style={styles.iconContainer}>
                        <Text style={styles.emoji}>{getSlotIcon()}</Text>
                    </View>
                    <View style={styles.textContainer}>
                        <Text style={[styles.title, { fontFamily: getFontFamily('bold', language) }]}>
                            {getSlotLabel()}
                        </Text>
                        <Text style={[styles.subtitle, { fontFamily: getFontFamily('regular', language) }]}>
                            {getSlotSubtitle()}
                        </Text>
                        {isCompleted && (
                            <Text style={[styles.tapToViewText, { fontFamily: getFontFamily('regular', language) }]}>
                                {t('taskCard.completedTapToView')}
                            </Text>
                        )}
                        {!isActive && !isCompleted && (() => {
                            const minutesUntil = getMinutesUntilSlot(slot);
                            if (minutesUntil <= 60) {
                                return (
                                    <Text style={[styles.lockedTimingText, { fontFamily: getFontFamily('regular', language) }]}>
                                        {t('taskCard.opensInMin').replace('{{n}}', String(minutesUntil))}
                                    </Text>
                                );
                            }
                            return (
                                <Text style={[styles.lockedTimingText, { fontFamily: getFontFamily('regular', language) }]}>
                                    {t('taskCard.opensAt').replace('{{time}}', getSlotOpenTimeString(slot))}
                                </Text>
                            );
                        })()}
                    </View>
                </View>

                <View style={styles.rightSection}>
                    {isCompleted ? (
                        <Animated.View testID="completed-badge" style={[styles.completedBadge, checkmarkAnimStyle]}>
                            <Check size={20} color={COLORS.success} strokeWidth={3} />
                        </Animated.View>
                    ) : isActive ? (
                        <View testID="write-button" style={styles.actionButton}>
                            <Text style={[styles.actionText, { fontFamily: getFontFamily('semibold', language) }]}>
                                {t('taskCard.write') || 'Write'}
                            </Text>
                            <ArrowRight size={18} color={COLORS.textWhite} />
                        </View>
                    ) : (
                        <View testID="locked-badge" style={styles.lockedBadge}>
                            <Lock size={18} color="rgba(255,255,255,0.4)" />
                        </View>
                    )}
                </View>
            </LinearGradient>
        </AnimatedTouchable>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 6,
        borderRadius: 20,
        overflow: 'hidden',
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    cardActive: {
        borderColor: 'rgba(16, 185, 129, 0.4)',
        shadowColor: COLORS.success,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
    },
    cardCompleted: {
        borderColor: 'rgba(16, 185, 129, 0.2)',
    },
    pulseGlowBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'rgba(16, 185, 129, 0.8)',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    emoji: {
        fontSize: 24,
    },
    textContainer: {
        flex: 1,
        flexShrink: 1,
    },
    title: {
        fontSize: 18,
        color: COLORS.textWhite,
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.6)',
        flexWrap: 'wrap',
    },
    tapToViewText: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
        marginTop: 2,
    },
    lockedTimingText: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        marginTop: 2,
    },
    rightSection: {
        paddingLeft: 12,
        alignItems: 'flex-end',
        justifyContent: 'center',
        flexShrink: 0,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: SPACING.md,
        paddingVertical: 10,
        borderRadius: 12,
        gap: 6,
    },
    actionText: {
        color: COLORS.textWhite,
        fontSize: 14,
    },
    completedBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    lockedBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export { styles as taskCardStyles };
