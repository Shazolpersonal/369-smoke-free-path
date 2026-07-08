## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2026-07-08 - Add screen reader support to Toast
**Learning:** Custom animated toast/alert components in React Native require explicit `accessibilityRole='alert'` and `accessibilityLiveRegion='polite'` to be properly announced by screen readers.
**Action:** Always verify that notification or toast components include accessibility roles and labels for screen readers.
