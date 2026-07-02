## 2024-05-08 - Added copy-to-clipboard functionality to donation numbers
**Learning:** Found an opportunity to improve the UX of the `DonationBanner` and `DonationPrompt` by making the donation numbers copyable using `expo-clipboard` to allow users to quickly copy and paste them into their mobile banking applications. The implementation used a simple `TouchableOpacity` wrapper. It is important to ensure that the localization variables and translation contexts are correctly defined before attempting to interpolate them into feedback toasts.
**Action:** When adding interactive UI elements that provide feedback using string templates, always ensure that the translation contexts are fully set up before interpolating variables into them.

## 2024-05-18 - Communicating button disabled states
**Learning:** Adding `disabled={true}` is visually and functionally correct but insufficient for screen readers unless paired with `accessibilityState={{ disabled: true }}`. Specifically found this pattern missing on navigation buttons like 'Next Month'.
**Action:** Always pair `disabled` properties with `accessibilityState={{ disabled: condition }}` for interactive elements.

## 2024-05-18 - TextInput Keyboard Appearance in Forced Dark Mode
**Learning:** Found an opportunity to improve the UX for iOS users. The app forces a dark theme across the board, but on iOS, `TextInput` components default to the system theme's keyboard appearance. If a user is using a light system theme, the keyboard will appear as light, causing a jarring visual clash with the app's dark background.
**Action:** When working on an application that enforces a specific theme (like dark mode), always ensure that `TextInput` components have the `keyboardAppearance` prop set appropriately (e.g., `keyboardAppearance="dark"`) so the keyboard matches the app's enforced theme rather than defaulting to the system theme.
## 2025-05-12 - Adding Copy Icons to Donation Forms\n**Learning:** By adding explicit copy icons using lucide-react-native inside the TouchableOpacity, and setting hitSlop correctly, we significantly improve the intuitive nature of copy-to-clipboard interactions.\n**Action:** Use icon combinations combined with sufficient hitSlop areas for any custom text-based actionable item to clearly communicate intent.
## 2025-05-12 - Making Toasts Accessible
**Learning:** Custom toast notifications created with `Animated.View` are functionally great but totally silent to screen readers without specific accessibility attributes (e.g. `accessibilityRole="alert"` and `accessibilityLiveRegion="polite"`).
**Action:** Always add `accessible={true}`, `accessibilityRole="alert"`, `accessibilityLiveRegion="polite"`, and `accessibilityLabel` to the root container of custom toast or alert notification components.
