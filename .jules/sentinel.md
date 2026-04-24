## 2024-05-16 - Prevent Affirmation Data Leakage to Mobile Keyboards
**Vulnerability:** Input fields containing potentially sensitive internal business logic or affirmations lacked restrictions, allowing third-party mobile keyboards to learn phrasing and permitting copy-paste bypassing of core task mechanics.
**Learning:** Default React Native `TextInput` components leave autocomplete, autocorrect, and context menus enabled. This can lead to sensitive phrasing leaking to learning keyboards and compromises task integrity.
**Prevention:** Apply security props (`autoComplete="off"`, `autoCorrect={false}`, `contextMenuHidden={true}`, `spellCheck={false}`, `importantForAutofill="no"`) to `TextInput` components handling sensitive internal logic or strict data entry requirements.

## 2026-04-20 - Prevent Open Redirect via Push Notification Payload
**Vulnerability:** The application was vulnerable to deep link hijacking and open redirects because it blindly passed unvalidated URL strings extracted from push notification payloads directly into the navigation router.
**Learning:** Push notification payloads are external inputs that can be spoofed or manipulated. Using `router.push(data.url)` without validation allows attackers to force the app to navigate to arbitrary internal screens, execute unintended actions, or trigger malicious external URI schemes.
**Prevention:** Always validate navigation paths from notifications. Ensure the URL is a relative path (e.g., `url.startsWith('/') && !url.startsWith('//')`) to restrict navigation to safe, internal app routes.

## 2024-05-18 - Prevent Denial of Service (DoS) via Input Length Limits
**Vulnerability:** Core interactive inputs components (`TextInput`) lacked length constraints. An attacker or malfunctioning software pasting exceptionally large payloads could exhaust application memory, freezing the UI thread, and crashing the application.
**Learning:** Default behavior of `TextInput` provides no upper boundary, permitting unbound data entry operations which scale maliciously against hardware constraints, especially on lower-end mobile devices.
**Prevention:** Apply a strictly enforced `maxLength` attribute to interactive input fields handling dynamic lengths matching the business requirements and acceptable bounds, preventing unintended resource starvation.
