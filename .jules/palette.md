## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2024-05-18 - Toast Accessibility
**Learning:** React Native custom toast/alert components need `accessible={true}`, `accessibilityRole="alert"`, and `accessibilityLiveRegion="polite"` applied to their outermost `Animated.View` so that screen readers correctly detect and announce them asynchronously.
**Action:** Always verify that custom notification popups include standard ARIA-equivalent roles rather than just relying on internal Text components.
