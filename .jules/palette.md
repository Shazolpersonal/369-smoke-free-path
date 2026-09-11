## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".

## 2026-09-11 - Toast Accessibility
**Learning:** React Native custom Animated toasts are not automatically announced by screen readers when they appear.
**Action:** Always add accessible={true}, accessibilityRole="alert", accessibilityLiveRegion="polite", and a consolidated accessibilityLabel to custom toast root containers.
