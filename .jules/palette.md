## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2024-04-18 - Toast Accessibility
**Learning:** React Native toast/alert popups require `accessible={true}`, `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, and a comprehensive `accessibilityLabel` at the root container to ensure screen readers reliably interrupt and announce them.
**Action:** Always verify that dynamic non-modal alerts (like Toast) have proper alert roles and live regions defined on the wrapper component.
