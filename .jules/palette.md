## 2024-04-18 - Added accessibility to back buttons
**Learning:** Found that custom `TouchableOpacity` buttons used as back navigation in `app/guide.tsx` and `app/task/[slot].tsx` lacked `accessibilityRole="button"` and `accessibilityLabel`.
**Action:** Always verify that custom icon-only or text buttons have proper accessibility roles and labels, especially for critical navigation like "Back" and "Back to Dashboard".
## 2024-05-22 - Enhanced Tap Targets on Modal Close Buttons
**Learning:** Found an opportunity to improve the UX and accessibility of `BottomSheet` modals across the app (`DonationBanner`, `DonationPrompt`, `index`, and `history`) by adding `hitSlop` to their close buttons. Since these buttons exist at the bottom of the screen or sheet, increasing their tappable area prevents frustrating mis-taps.
**Action:** Always verify that interactive elements, especially those serving critical functions like dismissing modals or navigating, have an adequate tap target area using `hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}`.
