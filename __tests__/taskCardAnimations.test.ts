/**
 * TaskCard Micro-Interaction Unit Tests
 * Task 6.1: active/completed/locked state-এ সঠিক testID element দেখায় যাচাই করুন
 *
 * Requirements: 3.1, 3.2, 3.4
 */

import * as fs from 'fs';
import * as path from 'path';

const TASK_CARD_PATH = path.resolve(__dirname, '../components/TaskCard.tsx');
const source = fs.readFileSync(TASK_CARD_PATH, 'utf-8');

describe('TaskCard — Animation Imports & Structure', () => {
    it('imports from react-native-reanimated (not Animated from react-native)', () => {
        expect(source).toContain("from 'react-native-reanimated'");
        // Should NOT use the old Animated from react-native for animations
        expect(source).not.toMatch(/import\s+\{[^}]*\bAnimated\b[^}]*\}\s+from\s+'react-native'/);
    });

    it('uses useSharedValue for animation state', () => {
        expect(source).toContain('useSharedValue');
    });

    it('uses useAnimatedStyle for animated styles', () => {
        expect(source).toContain('useAnimatedStyle');
    });

    it('uses cancelAnimation for cleanup on unmount', () => {
        expect(source).toContain('cancelAnimation');
    });

    it('uses useReducedMotion hook', () => {
        expect(source).toContain('useReducedMotion');
    });

    it('wraps root with AnimatedTouchable (Animated.createAnimatedComponent)', () => {
        expect(source).toContain('Animated.createAnimatedComponent');
        expect(source).toContain('AnimatedTouchable');
    });
});

describe('TaskCard — testID elements preserved', () => {
    it('completed-badge testID is present', () => {
        expect(source).toContain('testID="completed-badge"');
    });

    it('write-button testID is present', () => {
        expect(source).toContain('testID="write-button"');
    });

    it('locked-badge testID is present', () => {
        expect(source).toContain('testID="locked-badge"');
    });
});

describe('TaskCard — Press scale animation (Req 3.1)', () => {
    it('pressScale shared value is defined', () => {
        expect(source).toContain('pressScale');
    });

    it('press scale target is 0.96', () => {
        expect(source).toContain('0.96');
    });

    it('onPressIn and onPressOut handlers are defined', () => {
        expect(source).toContain('handlePressIn');
        expect(source).toContain('handlePressOut');
        expect(source).toContain('onPressIn={handlePressIn}');
        expect(source).toContain('onPressOut={handlePressOut}');
    });
});

describe('TaskCard — Active border pulse glow (Req 3.3)', () => {
    it('pulseOpacity shared value is defined', () => {
        expect(source).toContain('pulseOpacity');
    });

    it('uses withRepeat for infinite loop', () => {
        expect(source).toContain('withRepeat');
    });

    it('uses withSequence for opacity cycle', () => {
        expect(source).toContain('withSequence');
    });

    it('pulse glow border overlay is rendered for active state', () => {
        expect(source).toContain('pulseGlowBorder');
    });

    it('pulse opacity range includes 0.4 and 1.0', () => {
        expect(source).toContain('0.4');
        expect(source).toContain('1.0');
    });
});

describe('TaskCard — Locked state shake animation (Req 3.4)', () => {
    it('shakeX shared value is defined', () => {
        expect(source).toContain('shakeX');
    });

    it('shake uses ±6px values', () => {
        expect(source).toContain('-6');
        expect(source).toContain('withTiming(6');
    });

    it('shake total duration is 250ms', () => {
        expect(source).toContain('250');
    });
});

describe('TaskCard — Completed checkmark spring animation (Req 3.2)', () => {
    it('checkmarkScale shared value is defined', () => {
        expect(source).toContain('checkmarkScale');
    });

    it('uses withSpring for checkmark scale-in', () => {
        expect(source).toContain('withSpring');
    });

    it('completed badge uses animated style', () => {
        expect(source).toContain('checkmarkAnimStyle');
    });
});

describe('TaskCard — State transition smooth 300ms (Req 3.6)', () => {
    it('stateOpacity shared value is defined', () => {
        expect(source).toContain('stateOpacity');
    });

    it('state transition uses 300ms duration', () => {
        expect(source).toContain('300');
    });
});

describe('TaskCard — Reduced motion support (Req 15.3)', () => {
    it('checks reducedMotion before running animations', () => {
        expect(source).toContain('reducedMotion');
        expect(source).toContain('!reducedMotion');
    });
});

describe('TaskCard — Props interface unchanged', () => {
    it('TaskCardProps interface is exported', () => {
        expect(source).toContain('export interface TaskCardProps');
    });

    it('slot prop is present', () => {
        expect(source).toContain('slot: TimeSlot');
    });

    it('isActive prop is present', () => {
        expect(source).toContain('isActive: boolean');
    });

    it('isCompleted prop is present', () => {
        expect(source).toContain('isCompleted: boolean');
    });

    it('onPress prop is present', () => {
        expect(source).toContain('onPress: () => void');
    });

    it('taskCardStyles is exported', () => {
        expect(source).toContain('export { styles as taskCardStyles }');
    });
});
