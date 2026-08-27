## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2025-02-27 - Make toast notifications accessible
**Learning:** Toast components rendered absolutely at the top level in React Native need explicit `accessible={true}`, `accessibilityRole="alert"`, and `accessibilityLiveRegion="polite"` props on their root container (e.g. `Animated.View`) to ensure screen readers dynamically announce them when they appear.
**Action:** Always wrap transient notification components with comprehensive accessibility attributes targeting the root container to ensure screen reader focus is momentarily hijacked.
