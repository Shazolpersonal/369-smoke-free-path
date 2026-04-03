import { useState, useEffect } from 'react';
import { AccessibilityInfo } from 'react-native';
import {
    withSpring,
    withTiming,
    withSequence,
    withDelay,
    Easing,
    WithSpringConfig,
    WithTimingConfig,
} from 'react-native-reanimated';

/**
 * 369 Smoke-Free Path Core Animation System
 * High-quality, satisfying animation presets to achieve a premium feel.
 */

export const SPRING_CONFIG: WithSpringConfig = {
    damping: 14,
    stiffness: 120,
    mass: 0.8,
};

export const SPRING_CONFIG_BOUNCY: WithSpringConfig = {
    damping: 10,
    stiffness: 150,
    mass: 1,
};

export const TIMING_CONFIG_SMOOTH: WithTimingConfig = {
    duration: 300,
    easing: Easing.bezier(0.25, 0.1, 0.25, 1),
};

export const TIMING_CONFIG_SLOW: WithTimingConfig = {
    duration: 600,
    easing: Easing.out(Easing.cubic),
};

export const SPRING_CONFIG_GENTLE: WithSpringConfig = {
    damping: 18,
    stiffness: 100,
    mass: 1,
};

/**
 * Hook that returns true if the user has enabled reduced motion in accessibility settings.
 * Uses AccessibilityInfo.isReduceMotionEnabled() from react-native.
 */
export function useReducedMotion(): boolean {
    const [reducedMotion, setReducedMotion] = useState(false);

    useEffect(() => {
        AccessibilityInfo.isReduceMotionEnabled().then(setReducedMotion);

        const subscription = AccessibilityInfo.addEventListener(
            'reduceMotionChanged',
            setReducedMotion
        );

        return () => subscription.remove();
    }, []);

    return reducedMotion;
}

/**
 * Returns 0 if reducedMotion is true, otherwise returns the normal duration.
 */
export function getAnimDuration(normal: number, reducedMotion: boolean): number {
    return reducedMotion ? 0 : normal;
}

/**
 * Stagger delay constants
 */
export const STAGGER_DELAY = 100;
export const FADE_DURATION = 400;

/**
 * Task screen timing
 */
export const AUTO_SUBMIT_DELAY = 300;
export const BRIEF_SUCCESS_DURATION = 1000;
export const FINAL_CONFETTI_DURATION = 3000;
export const BRIEF_CONFETTI_DURATION = 1500;

export const CONFETTI_PARTICLES = {
    brief: 30,
    final: 60,
};

/**
 * Staggered delay utility for list items appearing sequentially
 */
export const getStaggerDelay = (index: number, baseDelay: number = 0, staggerMs: number = 100) => {
    return baseDelay + index * staggerMs;
};

/**
 * Trigger a pulse effect on a shared value
 */
export const triggerPulse = (sharedValue: any, targetScale: number = 1.05) => {
    'worklet';
    sharedValue.value = withSequence(
        withTiming(targetScale, { duration: 150, easing: Easing.ease }),
        withTiming(1, { duration: 250, easing: Easing.ease })
    );
};
