import Constants from 'expo-constants';

/**
 * Log error safely based on environment.
 * In production, it obfuscates the error to prevent sensitive data leakage.
 *
 * @param messageOrError The error object, string message, or any data to log
 * @param args Additional arguments to log in development
 */
export const logError = (messageOrError: any, ...args: any[]) => {
    // Standard environment detection for this project
    const isProduction = Constants.appOwnership !== 'expo';

    if (isProduction) {
        // Retain string prefix for traceability, but drop the sensitive args
        if (typeof messageOrError === 'string') {
            console.error(messageOrError, 'An unexpected error occurred');
        } else {
            console.error('An unexpected error occurred');
        }
    } else {
        // Full logging in development (Expo Go) for debugging
        console.error(messageOrError, ...args);
    }
};

/**
 * Log warning safely based on environment.
 * In production, it obfuscates the warning details to prevent sensitive data leakage.
 *
 * @param messageOrError The warning object, string message, or any data to log
 * @param args Additional arguments to log in development
 */
export const logWarn = (messageOrError: any, ...args: any[]) => {
    // Standard environment detection for this project
    const isProduction = Constants.appOwnership !== 'expo';

    if (isProduction) {
        // Retain string prefix for traceability, but drop the sensitive args
        if (typeof messageOrError === 'string') {
            console.warn(messageOrError, 'An unexpected warning occurred');
        } else {
            console.warn('An unexpected warning occurred');
        }
    } else {
        // Full logging in development (Expo Go) for debugging
        console.warn(messageOrError, ...args);
    }
};
