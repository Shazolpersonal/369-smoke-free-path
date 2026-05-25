## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".

## 2024-05-25 - Added accessibility to SVG Progress Rings
**Learning:** Found that custom SVG-based progress rings and counters (`JourneyProgressRing`, `RepetitionCounter`) are completely ignored or read disjointedly by screen readers because they lack semantic structure.
**Action:** Always wrap custom visual progress indicators (like SVGs) in a container with `accessible={true}`, `accessibilityRole="progressbar"`, `accessibilityValue={{min, max, now}}`, and a descriptive `accessibilityLabel`.
