import { COLORS } from "../utils/theme";
import React, { useEffect, useState, useRef, Children } from 'react';
import { View, StyleSheet, Modal, Pressable, Dimensions, KeyboardAvoidingView, Platform, PanResponder } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    FadeInDown,
} from 'react-native-reanimated';
import { SPRING_CONFIG, SPRING_CONFIG_BOUNCY } from '../utils/animations';

const { height } = Dimensions.get('window');

const SWIPE_DISMISS_THRESHOLD = 80;

interface BottomSheetProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    snapPoint?: number;
}

export function BottomSheet({ visible, onClose, children, snapPoint = height * 0.5 }: BottomSheetProps) {
    const [renderModal, setRenderModal] = useState(visible);

    const translateY = useSharedValue(height);
    const backdropOpacity = useSharedValue(0);

    useEffect(() => {
        if (visible) {
            setRenderModal(true);
            translateY.value = withSpring(0, SPRING_CONFIG_BOUNCY);
            backdropOpacity.value = withTiming(1, { duration: 400 });
        } else {
            translateY.value = withTiming(height, { duration: 300 }, (finished) => {
                if (finished) runOnJS(setRenderModal)(false);
            });
            backdropOpacity.value = withTiming(0, { duration: 300 });
        }
    }, [visible]);

    // PanResponder for swipe-to-dismiss on the drag handle
    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 5,
            onPanResponderMove: (_, gestureState) => {
                if (gestureState.dy > 0) {
                    translateY.value = gestureState.dy;
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                if (gestureState.dy > SWIPE_DISMISS_THRESHOLD) {
                    onClose();
                } else {
                    translateY.value = withSpring(0, SPRING_CONFIG_BOUNCY);
                }
            },
        })
    ).current;

    const rBottomSheetStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    const rBackdropStyle = useAnimatedStyle(() => ({
        opacity: backdropOpacity.value,
    }));

    if (!renderModal) return null;

    return (
        <Modal transparent visible={renderModal} animationType="none" onRequestClose={onClose}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                {/* Backdrop */}
                <Animated.View style={[StyleSheet.absoluteFill, styles.backdrop, rBackdropStyle]}>
                    <Pressable
                        style={StyleSheet.absoluteFill}
                        onPress={onClose}
                        accessibilityRole="button"
                        accessibilityLabel="Close bottom sheet"
                        accessibilityHint="Closes the currently open bottom sheet"
                    />
                </Animated.View>

                {/* Bottom Sheet Content */}
                <Animated.View style={[styles.sheet, rBottomSheetStyle, { maxHeight: snapPoint }]}>
                    {/* Drag handle — interactive for swipe-to-dismiss */}
                    <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
                        <View style={styles.dragHandle} />
                    </View>
                    <View style={styles.contentContainer}>
                        {Children.count(children) > 1
                            ? Children.map(children, (child, index) => (
                                <Animated.View
                                    key={index}
                                    entering={FadeInDown.delay(index * 100)}
                                >
                                    {child}
                                </Animated.View>
                            ))
                            : (
                                <Animated.View entering={FadeInDown.delay(0)}>
                                    {children}
                                </Animated.View>
                            )
                        }
                    </View>
                </Animated.View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-end',
    },
    backdrop: {
        backgroundColor: 'rgba(15, 23, 42, 0.6)',
    },
    sheet: {
        backgroundColor: COLORS.darkBg,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingBottom: 40,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 20,
    },
    dragHandleContainer: {
        alignItems: 'center',
        paddingVertical: 14,
    },
    dragHandle: {
        width: 48,
        height: 6,
        borderRadius: 3,
        backgroundColor: 'rgba(255,255,255,0.2)',
    },
    contentContainer: {
        paddingHorizontal: 24,
    }
});
