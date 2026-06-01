## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2026-06-01 - Toast Notification Accessibility
**Learning:** Found that toast notifications generated in `components/Toast.tsx` were missing critical accessibility properties. Without `accessible={true}`, `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, and a comprehensive `accessibilityLabel`, screen readers might miss dynamic status updates like success or error messages.
**Action:** Always ensure custom React Native toast or alert notification components include `accessibilityRole="alert"` and `accessibilityLiveRegion="polite"` to announce dynamic updates properly to screen readers.
