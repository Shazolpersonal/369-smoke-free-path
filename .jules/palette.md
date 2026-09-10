## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2026-09-10 - Added screen reader accessibility to Toast notifications
**Learning:** React Native toast/alert notification components like Toast.tsx need explicit accessibility roles and live regions to be announced by screen readers when they appear dynamically.
**Action:** Always add accessible={true}, accessibilityRole="alert", accessibilityLiveRegion="polite", and a comprehensive accessibilityLabel to the root container of toast notifications.
