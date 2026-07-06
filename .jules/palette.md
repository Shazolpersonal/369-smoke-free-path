## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2024-07-26 - Toast Accessibility
**Learning:** Found that custom Toast components lack proper screen reader announcements when dynamically shown.
**Action:** Always ensure toast notifications include `accessible={true}`, `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, and a comprehensive `accessibilityLabel` on the root container so screen readers correctly announce them as they appear.
