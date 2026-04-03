import appJson from '../app.json';
import easJson from '../eas.json';

describe('Production Configuration', () => {
    it('app.json has dark userInterfaceStyle', () => {
        expect(appJson.expo.userInterfaceStyle).toBe('dark');
    });

    it('app.json has android.versionCode as positive integer', () => {
        expect(typeof appJson.expo.android.versionCode).toBe('number');
        expect(appJson.expo.android.versionCode).toBeGreaterThan(0);
    });

    it('app.json has POST_NOTIFICATIONS permission', () => {
        expect(appJson.expo.android.permissions).toContain('POST_NOTIFICATIONS');
    });

    it('eas.json has production android buildType', () => {
        const buildType = (easJson as any).build?.production?.android?.buildType;
        expect(['apk', 'app-bundle']).toContain(buildType);
    });
});
