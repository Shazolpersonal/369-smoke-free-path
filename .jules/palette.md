## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".

## 2026-05-24 - Progress Ring Accessibility
**Learning:** Found that custom SVG-based progress rings (`JourneyProgressRing` and `RepetitionCounter`) had disjointed text elements rendering visually over SVG graphics. Without grouping, screen readers announce these as disconnected text snippets (e.g., "12", "slash 41") and miss the "progress bar" context.
**Action:** Always wrap custom progress components with an outer container setting `accessible={true}`, `accessibilityRole="progressbar"`, `accessibilityValue` (min, max, now), and a single descriptive `accessibilityLabel` to ensure screen readers announce them properly.
