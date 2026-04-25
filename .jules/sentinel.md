## 2024-05-16 - Prevent Affirmation Data Leakage to Mobile Keyboards
**Vulnerability:** Input fields containing potentially sensitive internal business logic or affirmations lacked restrictions, allowing third-party mobile keyboards to learn phrasing and permitting copy-paste bypassing of core task mechanics.
**Learning:** Default React Native `TextInput` components leave autocomplete, autocorrect, and context menus enabled. This can lead to sensitive phrasing leaking to learning keyboards and compromises task integrity.
**Prevention:** Apply security props (`autoComplete="off"`, `autoCorrect={false}`, `contextMenuHidden={true}`, `spellCheck={false}`, `importantForAutofill="no"`) to `TextInput` components handling sensitive internal logic or strict data entry requirements.

## 2026-04-20 - Prevent Open Redirect via Push Notification Payload
**Vulnerability:** The application was vulnerable to deep link hijacking and open redirects because it blindly passed unvalidated URL strings extracted from push notification payloads directly into the navigation router.
**Learning:** Push notification payloads are external inputs that can be spoofed or manipulated. Using `router.push(data.url)` without validation allows attackers to force the app to navigate to arbitrary internal screens, execute unintended actions, or trigger malicious external URI schemes.
**Prevention:** Always validate navigation paths from notifications. Ensure the URL is a relative path (e.g., `url.startsWith('/') && !url.startsWith('//')`) to restrict navigation to safe, internal app routes.

## 2026-04-25 - Prevent Denial of Service (DoS) via Excessive Input Length
**Vulnerability:** The `TextInput` components lacked a `maxLength` property, exposing the application to Denial of Service (DoS) risks where an attacker (or user pasting excessively large strings) could exhaust device memory or freeze the rendering thread.
**Learning:** React Native's `TextInput` does not impose a default maximum length. Offline applications are still susceptible to performance degradation or crashes caused by excessively large inputs being processed by the JS thread.
**Prevention:** Always enforce a reasonable `maxLength` on all `TextInput` components to limit the buffer size and prevent memory exhaustion.
