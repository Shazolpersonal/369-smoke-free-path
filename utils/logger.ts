import Constants from 'expo-constants';

/**
 * Log error safely based on environment.
 * In production, it obfuscates the error to prevent sensitive data leakage.
 *
 * @param error The error object, message, or any data to log
 * @param args Additional arguments to log in development
 */
export const logError = (error: any, ...args: any[]) => {
    // Standard environment detection for this project
    const isProduction = Constants.appOwnership !== 'expo';

    if (isProduction) {
        // Log a generic message in production to prevent sensitive data leakage
        // This addresses the security vulnerability of leaking stack traces or state
        console.error('An unexpected error occurred');
    } else {
        // Full logging in development (Expo Go) for debugging
        console.error(error, ...args);
    }
};
