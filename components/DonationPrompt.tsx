import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn, SlideInUp } from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';

import { useLanguage } from '../contexts/LanguageContext';
import { shouldShowDonationPrompt, markDonationPromptShown, PAYMENT_METHODS } from '../utils/donationConfig';
import { getFontFamily } from '../utils/fonts';
import { BottomSheet } from './BottomSheet';

/**
 * A gentle donation prompt shown after task completion.
 * Appears at most ONCE per day — not on every completion.
 * Replaces the old interstitial ad with something meaningful.
 */
export function DonationPrompt() {
    const { t, language } = useLanguage();
    const [visible, setVisible] = useState(false);
    const [sheetVisible, setSheetVisible] = useState(false);
    const f = (weight: 'regular' | 'medium' | 'semibold' | 'bold') => getFontFamily(language, weight);

    useEffect(() => {
        let mounted = true;
        (async () => {
            const shouldShow = await shouldShowDonationPrompt();
            if (mounted && shouldShow) {
                setVisible(true);
                await markDonationPromptShown();
            }
        })();
        return () => { mounted = false; };
    }, []);

    if (!visible) return null;

    return (
        <>
            <Animated.View entering={SlideInUp.delay(800).duration(500).springify()} style={styles.container}>
                <View style={styles.divider} />
                <View style={styles.iconRow}>
                    <Heart size={16} color="#D4A847" fill="#D4A847" />
                </View>
                <Text style={[styles.message, { fontFamily: f('regular') }]}>
                    {t('donation.completionMessage')}
                </Text>
                <TouchableOpacity
                    onPress={() => setSheetVisible(true)}
                    activeOpacity={0.7}
                    style={styles.supportButton}
                    accessibilityRole="button"
                    accessibilityLabel={t('donation.supportButton')}
                >
                    <Heart size={14} color="#D4A847" />
                    <Text style={[styles.supportButtonText, { fontFamily: f('bold') }]}>
                        {t('donation.supportButton')}
                    </Text>
                </TouchableOpacity>
            </Animated.View>

            <BottomSheet visible={sheetVisible} onClose={() => setSheetVisible(false)}>
                <View style={styles.sheetContent}>
                    <View style={styles.sheetIconWrap}>
                        <Heart size={28} color="#D4A847" fill="#D4A847" />
                    </View>
                    <Text style={[styles.sheetTitle, { fontFamily: f('bold') }]}>
                        {t('donation.sheetTitle')}
                    </Text>
                    <Text style={[styles.sheetDescription, { fontFamily: f('regular') }]}>
                        {t('donation.sheetDescription')}
                    </Text>

                    <View style={styles.methodsContainer}>
                        {PAYMENT_METHODS.map((method) => (
                            <View key={method.id} style={styles.methodCard}>
                                <View style={styles.methodHeader}>
                                    <Text style={styles.methodEmoji}>{method.emoji}</Text>
                                    <Text style={[styles.methodLabel, { fontFamily: f('semibold') }]}>
                                        {language === 'bn' ? method.labelBn : method.label}
                                    </Text>
                                </View>
                                <Text 
                                    style={[styles.methodNumber, { fontFamily: f('bold') }]} 
                                    selectable={true}
                                >
                                    {method.number}
                                </Text>
                                <Text style={[styles.methodType, { fontFamily: f('medium') }]}>
                                    ({language === 'bn' ? method.typeBn : method.type})
                                </Text>
                            </View>
                        ))}
                    </View>

                    <Text style={[styles.howToText, { fontFamily: f('semibold') }]}>
                        {t('donation.howToSend')}
                    </Text>

                    <Text style={[styles.sheetDua, { fontFamily: f('medium') }]}>
                        {t('donation.dua')}
                    </Text>

                    <TouchableOpacity
                        onPress={() => setSheetVisible(false)}
                        activeOpacity={0.8}
                        style={styles.closeButton}
                        accessibilityRole="button"
                        accessibilityLabel={t('donation.close')}
                    >
                        <Text style={[styles.closeButtonText, { fontFamily: f('bold') }]}>
                            {t('donation.close')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </BottomSheet>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    divider: {
        width: 40,
        height: 2,
        backgroundColor: 'rgba(212, 168, 71, 0.2)',
        borderRadius: 1,
        marginBottom: 16,
    },
    iconRow: {
        marginBottom: 8,
    },
    message: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.45)',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 12,
        paddingHorizontal: 12,
    },
    supportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(212, 168, 71, 0.1)',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(212, 168, 71, 0.2)',
    },
    supportButtonText: {
        fontSize: 13,
        color: '#D4A847',
    },

    // ─── Bottom Sheet (shared styling with DonationBanner) ───
    sheetContent: {
        alignItems: 'center',
        paddingBottom: 8,
    },
    sheetIconWrap: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: 'rgba(212, 168, 71, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    sheetTitle: {
        fontSize: 20,
        color: '#D4A847',
        marginBottom: 12,
        textAlign: 'center',
    },
    sheetDescription: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        lineHeight: 22,
        textAlign: 'center',
        paddingHorizontal: 8,
        marginBottom: 20,
    },
    methodsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: 12,
        width: '100%',
        marginBottom: 16,
    },
    methodCard: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1E293B',
        paddingVertical: 14,
        paddingHorizontal: 8,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    methodHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        marginBottom: 8,
    },
    methodEmoji: {
        fontSize: 16,
    },
    methodLabel: {
        fontSize: 14,
        color: '#FFFFFF',
    },
    methodNumber: {
        fontSize: 15,
        color: '#D4A847',
        marginBottom: 2,
        letterSpacing: 0.5,
    },
    methodType: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.5)',
    },
    howToText: {
        fontSize: 13,
        color: 'rgba(255,255,255,0.5)',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    sheetDua: {
        fontSize: 13,
        color: '#94A3B8',
        textAlign: 'center',
        fontStyle: 'italic',
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    closeButton: {
        width: '100%',
        padding: 14,
        borderRadius: 14,
        alignItems: 'center',
        backgroundColor: 'rgba(212, 168, 71, 0.1)',
    },
    closeButtonText: {
        color: '#D4A847',
        fontSize: 15,
    },
});
