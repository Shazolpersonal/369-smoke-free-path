## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".

## 2026-06-02 - Toast Notifications Accessibility
**Learning:** Found that toast/alert notifications using `Animated.View` or similar generic containers lack proper screen reader context when they appear.
**Action:** Always ensure that toast notifications are properly announced by adding `accessible={true}`, `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, and a comprehensive `accessibilityLabel`.
