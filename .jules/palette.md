## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2024-04-18 - Added accessibility to Progress Rings
**Learning:** Found that custom SVG-based progress rings/counters (`JourneyProgressRing` and `RepetitionCounter`) were visually distinct but lacked screen reader support.
**Action:** When implementing custom SVG-based progress rings or counters in React Native, ensure the outer container sets `accessible={true}`, `accessibilityRole="progressbar"`, `accessibilityValue` (with min, max, and now), and a consolidated `accessibilityLabel` to provide proper context to screen readers.
