## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".

## 2024-05-19 - Grouping Empty State Text Elements for Screen Readers
**Learning:** Found an opportunity to improve the screen reader experience for empty states in `app/(tabs)/history.tsx`. Screen readers often read out individual text elements sequentially, which can be disjointed and less meaningful.
**Action:** When creating empty states or complex components containing multiple pieces of related text, wrap them in a container view with `accessible={true}` and a descriptive `accessibilityLabel` to group them into a single, cohesive announcement for screen readers.
