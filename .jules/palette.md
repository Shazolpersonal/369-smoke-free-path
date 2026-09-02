## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2024-05-14 - Accessible Skeleton Loaders
**Learning:** Screen readers often ignore empty decorative skeleton loader components or misinterpret their internal views. In React Native, standard `accessibilityState={{ busy: true }}` isn't always enough if the parent isn't explicitly grouped.
**Action:** When building loading skeletons in React Native, explicitly wrap them in a container with `accessible={true}`, `accessibilityRole="progressbar"`, `accessibilityState={{ busy: true }}`, and a localized `accessibilityLabel` (e.g., "Loading...") to ensure proper announcement and prevent the reader from parsing internal skeleton lines/shapes.
