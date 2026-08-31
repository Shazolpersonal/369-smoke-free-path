## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2026-08-31 - Added accessibility to Toasts and Skeleton Loaders
**Learning:** Found that temporary feedback components (Toasts) and loading states (Skeletons) lacked screen reader announcements. Toasts require `accessibilityRole="alert"` and `accessibilityLiveRegion="polite"`, while skeletons need `accessibilityRole="progressbar"` and `accessibilityState={{ busy: true }}`.
**Action:** Always verify that transient and loading states have proper ARIA roles, labels, and live region announcements to ensure screen readers provide contextual feedback.
