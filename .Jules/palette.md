## 2026-04-20 - Add accessibility to TaskCard
**Learning:** Discovered a missing accessibility label pattern on an interactive custom card component (TaskCard) using AnimatedTouchable. Because the card has different visual states (Completed, Active, Locked), screen reader users wouldn't know the card's current status.
**Action:** Added an `accessibilityRole="button"` to the container component along with a dynamic `accessibilityLabel` and `accessibilityState={{ disabled: !isActive && !isCompleted }}` to inform screen reader users of the current interaction state.
