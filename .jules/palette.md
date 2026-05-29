## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2025-02-17 - Added screen reader accessibility to Toast component
**Learning:** Found that custom `Animated.View` used for Toast notifications was not announcing the text to screen readers. React Native needs `accessible={true}`, `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, and `accessibilityLabel` on a root container to announce updates like "01977-752579 has been copied to clipboard." dynamically.
**Action:** Always ensure that transient or dynamically appearing text elements (like Toasts or Alerts) explicitly include `accessibilityRole="alert"` and `accessibilityLiveRegion` properties to provide essential context to screen reader users.
