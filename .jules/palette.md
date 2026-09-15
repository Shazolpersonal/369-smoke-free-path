## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2024-04-18 - Added accessibility to SkeletonLoader
**Learning:** Found that custom `SkeletonLoader` components (used for loading states) lacked `accessibilityRole="progressbar"`, `accessible={true}`, `accessibilityState={{ busy: true }}`, and `accessibilityLabel` properties. Without these, screen readers either ignore the loading state entirely or attempt to read meaningless nested layout structures.
**Action:** Always verify that skeleton loaders and progress indicators have appropriate `progressbar` roles and busy states, along with a localized label (e.g., 'Loading...') so users relying on screen readers are aware the content is loading.
