## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2024-09-04 - Make Toast Notifications Accessible
**Learning:** React Native toast/alert notifications rendered as absolutely positioned views are not automatically announced by screen readers when they mount. They require explicit accessibility roles (like `alert`), live regions (like `polite`), and descriptive labels containing the dynamic message content on their outermost animated container.
**Action:** When implementing or modifying transient notification components (e.g., Toasts, Snackbars) in React Native, always verify that the root container has `accessible={true}`, `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, and `accessibilityLabel` mapping to the notification text.
