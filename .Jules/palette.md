## 2026-04-20 - Add accessibility to TaskCard
**Learning:** Discovered a missing accessibility label pattern on an interactive custom card component (TaskCard) using AnimatedTouchable. Because the card has different visual states (Completed, Active, Locked), screen reader users wouldn't know the card's current status.
**Action:** Added an `accessibilityRole="button"` to the container component along with a dynamic `accessibilityLabel` and `accessibilityState={{ disabled: !isActive && !isCompleted }}` to inform screen reader users of the current interaction state.
## 2026-04-20 - Add accessibility to Donation Components
**Learning:** Found multiple instances of `TouchableOpacity` used for interactive elements (banners and buttons) in `DonationBanner` and `DonationPrompt` that were lacking accessibility roles and labels. Screen readers would not properly announce these components as buttons.
**Action:** Added `accessibilityRole="button"` and `accessibilityLabel` using the existing localization `t()` translations to ensure context is provided to screen readers. Always verify that custom touch targets explicitly pass accessibility props.
## 2024-05-02 - Ensure adequate touch targets for icon-only buttons
**Learning:** React Native `TouchableOpacity` components wrapping small icons can be difficult to tap accurately on mobile screens, leading to a frustrating user experience.
**Action:** Always add a `hitSlop` property (e.g., `hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}`) to small, icon-only buttons to increase their interactive area without altering the visual layout.
