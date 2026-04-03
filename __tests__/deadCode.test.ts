import * as fs from 'fs';
import * as path from 'path';

describe('Dead Code Removal', () => {
    it('AnimatedSplash component file should not exist', () => {
        const filePath = path.join(__dirname, '../components/AnimatedSplash.tsx');
        expect(fs.existsSync(filePath)).toBe(false);
    });

    it('backgroundTasks utility file should not exist', () => {
        const filePath = path.join(__dirname, '../utils/backgroundTasks.ts');
        expect(fs.existsSync(filePath)).toBe(false);
    });
});
