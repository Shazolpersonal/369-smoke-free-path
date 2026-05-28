## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".

## 2026-05-28 - Added accessibility to SVG-based progress rings
**Learning:** Found that custom SVG-based progress indicators like `JourneyProgressRing` and `RepetitionCounter` completely lacked screen reader support because they are just visual SVG paths.
**Action:** Always add `accessible={true}`, `accessibilityRole="progressbar"`, `accessibilityValue`, and a consolidated `accessibilityLabel` to the root container of custom graphical progress indicators.
