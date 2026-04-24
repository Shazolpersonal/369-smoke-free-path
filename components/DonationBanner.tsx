import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';

import { useLanguage } from '../contexts/LanguageContext';
import { getDonationBannerMessage, PAYMENT_METHODS } from '../utils/donationConfig';
import { useProgress } from '../contexts/ProgressContext';
import { getFontFamily } from '../utils/fonts';
import { BottomSheet } from './BottomSheet';

/**
 * A gentle, beautiful donation banner shown on the home screen.
 * Tapping it opens the DonationBottomSheet with payment options.
 */
export function DonationBanner() {
    const { t, language } = useLanguage();
    const { totalElapsedDays } = useProgress();
    const [sheetVisible, setSheetVisible] = useState(false);
    const f = (weight: 'regular' | 'medium' | 'semibold' | 'bold') => getFontFamily(language, weight);

    const message = getDonationBannerMessage(totalElapsedDays, language);

    return (
        <>
            <Animated.View entering={FadeIn.delay(600).duration(500)}>
                <TouchableOpacity
                    onPress={() => setSheetVisible(true)}
                    activeOpacity={0.8}
                    style={styles.banner}
                    accessibilityRole="button"
                    accessibilityLabel={t('donation.bannerTitle')}
                    accessibilityHint={t('donation.tapToSupport')}
                >
                    <View style={styles.bannerInner}>
                        <View style={styles.iconWrap}>
                            <Heart size={18} color="#D4A847" fill="#D4A847" />
                        </View>
                        <View style={styles.textWrap}>
                            <Text style={[styles.bannerTitle, { fontFamily: f('bold') }]}>
                                {t('donation.bannerTitle')}
                            </Text>
                            <Text style={[styles.bannerMessage, { fontFamily: f('regular') }]}>
                                {message}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.tapHint}>
                        <Text style={[styles.tapHintText, { fontFamily: f('semibold') }]}>
                            {t('donation.tapToSupport')}
                        </Text>
                    </View>
                </TouchableOpacity>
            </Animated.View>

            {/* Bottom Sheet with payment options */}
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
    // ─── Banner ───
    banner: {
        marginHorizontal: 24,
        marginTop: 16,
        marginBottom: 8,
        backgroundColor: 'rgba(212, 168, 71, 0.06)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(212, 168, 71, 0.15)',
        padding: 16,
        overflow: 'hidden',
    },
    bannerInner: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: 12,
        backgroundColor: 'rgba(212, 168, 71, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    textWrap: {
        flex: 1,
    },
    bannerTitle: {
        fontSize: 13,
        color: '#D4A847',
        letterSpacing: 0.3,
        marginBottom: 4,
    },
    bannerMessage: {
        fontSize: 13,
        color: 'rgba(255, 255, 255, 0.55)',
        lineHeight: 19,
    },
    tapHint: {
        marginTop: 10,
        alignItems: 'flex-end',
    },
    tapHintText: {
        fontSize: 11,
        color: 'rgba(212, 168, 71, 0.6)',
        letterSpacing: 0.3,
    },

    // ─── Bottom Sheet ───
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
