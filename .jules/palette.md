## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2024-09-09 - Accessible Skeleton Loaders
**Learning:** React Native skeleton loaders without accessibility properties are invisible to screen readers, leaving users confused about app state.
**Action:** When creating or updating React Native skeleton loaders, ensure they are accessible to screen readers by wrapping them in a container with `accessible={true}`, `accessibilityRole="progressbar"`, `accessibilityState={{ busy: true }}`, and an appropriate localized `accessibilityLabel`.
