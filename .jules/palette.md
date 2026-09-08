## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2026-09-08 - Added Accessibility to Skeleton Loaders
**Learning:** Found that skeleton loaders visually indicate loading but are completely invisible to screen readers, leaving those users without context during async operations.
**Action:** Always wrap skeleton loader components in a container with accessible={true}, accessibilityRole="progressbar", accessibilityState={{ busy: true }}, and a localized accessibilityLabel.
