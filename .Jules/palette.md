## 2024-05-08 - Added copy-to-clipboard functionality to donation numbers
**Learning:** Found an opportunity to improve the UX of the `DonationBanner` and `DonationPrompt` by making the donation numbers copyable using `expo-clipboard` to allow users to quickly copy and paste them into their mobile banking applications. The implementation used a simple `TouchableOpacity` wrapper. It is important to ensure that the localization variables and translation contexts are correctly defined before attempting to interpolate them into feedback toasts.
**Action:** When adding interactive UI elements that provide feedback using string templates, always ensure that the translation contexts are fully set up before interpolating variables into them.

## 2024-05-18 - Communicating button disabled states
**Learning:** Adding `disabled={true}` is visually and functionally correct but insufficient for screen readers unless paired with `accessibilityState={{ disabled: true }}`. Specifically found this pattern missing on navigation buttons like 'Next Month'.
**Action:** Always pair `disabled` properties with `accessibilityState={{ disabled: condition }}` for interactive elements.
