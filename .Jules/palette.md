## 2026-04-20 - Add accessibility to TaskCard
**Learning:** Discovered a missing accessibility label pattern on an interactive custom card component (TaskCard) using AnimatedTouchable. Because the card has different visual states (Completed, Active, Locked), screen reader users wouldn't know the card's current status.
**Action:** Added an `accessibilityRole="button"` to the container component along with a dynamic `accessibilityLabel` and `accessibilityState={{ disabled: !isActive && !isCompleted }}` to inform screen reader users of the current interaction state.
## 2026-04-20 - Add accessibility to Donation Components
**Learning:** Found multiple instances of `TouchableOpacity` used for interactive elements (banners and buttons) in `DonationBanner` and `DonationPrompt` that were lacking accessibility roles and labels. Screen readers would not properly announce these components as buttons.
**Action:** Added `accessibilityRole="button"` and `accessibilityLabel` using the existing localization `t()` translations to ensure context is provided to screen readers. Always verify that custom touch targets explicitly pass accessibility props.
