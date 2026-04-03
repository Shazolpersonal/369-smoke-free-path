import React, { Component, ReactNode, ErrorInfo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../utils/theme';
import { translate } from '../i18n';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    handleReload = async () => {
        try {
            const Updates = require('expo-updates');
            await Updates.reloadAsync();
        } catch (e) {
            this.setState({ hasError: false, error: null });
        }
    };

    handleReset = () => {
        Alert.alert(
            'Reset Data / ডেটা রিসেট করুন',
            'This will clear all your progress data. Are you sure? / এটি আপনার সমস্ত অগ্রগতি ডেটা মুছে ফেলবে। আপনি কি নিশ্চিত?',
            [
                {
                    text: 'Cancel / বাতিল',
                    style: 'cancel',
                },
                {
                    text: 'Reset / রিসেট',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const keys = await AsyncStorage.getAllKeys();
                            await AsyncStorage.multiRemove(keys);
                            try {
                                const Updates = require('expo-updates');
                                await Updates.reloadAsync();
                            } catch (e) {
                                this.setState({ hasError: false, error: null });
                            }
                        } catch (e) {
                            console.error('Failed to reset app:', e);
                            this.setState({ hasError: false, error: null });
                        }
                    },
                },
            ]
        );
    };

    render() {
        if (this.state.hasError) {
            return (
                <SafeAreaView style={styles.container}>
                    <View style={styles.content}>
                        <Text style={styles.emoji}>😔</Text>
                        <Text style={styles.title}>Something went wrong / কিছু একটা সমস্যা হয়েছে</Text>
                        <Text style={styles.description}>
                            {this.state.error?.message || 'An unexpected error occurred. / একটি অপ্রত্যাশিত ত্রুটি ঘটেছে।'}
                        </Text>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.primaryButton}
                                onPress={this.handleReload}
                            >
                                <Text style={styles.primaryButtonText}>Reload / আবার চেষ্টা করুন</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.secondaryButton}
                                onPress={this.handleReset}
                            >
                                <Text style={styles.secondaryButtonText}>Reset Data / ডেটা রিসেট করুন</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </SafeAreaView>
            );
        }

        return this.props.children;
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617' },
    content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
    emoji: { fontSize: 48, marginBottom: 16 },
    title: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', textAlign: 'center', marginBottom: 12 },
    description: { fontSize: 16, color: 'rgba(255, 255, 255, 0.7)', textAlign: 'center', marginBottom: 32, lineHeight: 24 },
    buttonContainer: { width: '100%', gap: 16 },
    primaryButton: { backgroundColor: '#10B981', paddingVertical: 16, borderRadius: 16, alignItems: 'center' },
    primaryButtonText: { color: '#FFFFFF', fontWeight: '600', fontSize: 16 },
    secondaryButton: { paddingVertical: 16, borderRadius: 16, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)', backgroundColor: 'rgba(239, 68, 68, 0.05)' },
    secondaryButtonText: { color: '#EF4444', fontWeight: '600', fontSize: 16 },
});
