## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2024-04-18 - Accessibility for Progress Indicators and Toasts
**Learning:** Found that custom progress rings (`JourneyProgressRing`, `RepetitionCounter`), loading skeletons (`SkeletonLoader`), and notifications (`Toast`) lacked appropriate screen reader roles, states, and consolidated accessibility labels.
**Action:** When implementing custom SVG-based progress rings, skeletons, or alerts, ensure the outer container sets `accessible={true}`, an appropriate `accessibilityRole` (like "progressbar" or "alert"), and a comprehensive `accessibilityLabel` with state/values to provide proper context to screen readers.
