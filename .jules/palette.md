## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2026-09-12 - Toast Component Accessibility
**Learning:** Discovered that global toast notifications lacked proper ARIA roles and labels, causing screen readers to ignore them.
**Action:** Always ensure toast notifications have accessible={true}, accessibilityRole="alert", accessibilityLiveRegion="polite", and a descriptive accessibilityLabel.
