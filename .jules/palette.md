## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2024-05-31 - React Native Dynamic Toast Accessibility
**Learning:** In React Native, absolute-positioned dynamic notification components (like Toasts) will often be ignored by screen readers because they appear outside the normal focus flow. Adding `accessibilityLiveRegion="polite"` or `accessibilityRole="alert"` is critical for ensuring these notifications are announced when they dynamically appear.
**Action:** Whenever creating or updating a dynamic notification overlay (Toast, Alert, Snackbar), always ensure the root container has `accessible={true}`, `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, and a complete `accessibilityLabel` with the message content so screen readers announce it immediately.
