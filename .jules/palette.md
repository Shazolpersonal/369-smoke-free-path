## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2024-05-18 - Skeleton Loader Screen Reader Accessibility
**Learning:** Skeleton loaders, by default, are completely ignored by screen readers, which can leave visually impaired users unaware that the UI is in a busy/loading state.
**Action:** When creating or updating skeleton loaders in React Native, ensure they are wrapped in an accessible container with `accessibilityRole="progressbar"`, `accessibilityState={{ busy: true }}`, and an appropriately translated `accessibilityLabel` (e.g., using `useLanguage()`).
