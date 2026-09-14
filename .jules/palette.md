## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".

## 2024-05-24 - Screen Reader Support for Transient Toasts
**Learning:** Found that custom transient toast notifications (like Toast.tsx) are completely missed by screen readers because they appear dynamically without focus management or ARIA/accessibility alerts.
**Action:** Always add accessible={true}, accessibilityRole="alert", accessibilityLiveRegion="polite", and an accessibilityLabel with the message text to the root container of custom toast components so screen readers announce them upon appearance.
