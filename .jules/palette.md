## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2025-02-12 - Accessible Skeleton Loaders
**Learning:** React Native skeleton loaders without accessibility properties remain silent to screen readers, leaving visually impaired users unaware that content is loading.
**Action:** When implementing or updating SkeletonLoader components, always wrap them in a container with `accessible={true}`, `accessibilityRole="progressbar"`, `accessibilityState={{ busy: true }}`, and pass down a localized `accessibilityLabel` (e.g., 'Loading...').
