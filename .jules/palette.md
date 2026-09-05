## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2026-09-05 - Added accessibility to JourneyProgressRing
**Learning:** SVG-based progress rings require explicit accessibility properties on their outer container to be announced by screen readers.
**Action:** Always add `accessible={true}`, `accessibilityRole="progressbar"`, `accessibilityValue`, and `accessibilityLabel` to custom progress ring components.
