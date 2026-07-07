## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".

## 2026-07-07 - Added accessibility to Toast notifications
**Learning:** Found that custom Toast components using Animated.View lack proper screen reader announcements by default.
**Action:** Always add accessible={true}, accessibilityRole="alert", accessibilityLiveRegion="polite", and a comprehensive accessibilityLabel to the root container of toast or alert notification components.
