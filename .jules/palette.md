## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".

## 2026-07-04 - Accessible Toast Notifications
**Learning:** React Native toast/alert components need explicit `accessible={true}`, `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, and a comprehensive `accessibilityLabel` on the root container to ensure they are properly announced to screen readers when they appear dynamically.
**Action:** Always add these specific accessibility props to any custom notification or alert component.
