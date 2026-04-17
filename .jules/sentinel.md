## 2025-02-28 - [Information Disclosure via ErrorBoundary]
**Vulnerability:** ErrorBoundary component was rendering unhandled application error strings directly to the UI using `this.state.error?.message`.
**Learning:** React Native applications in production can inadvertently leak stack traces, SQL errors, or sensitive internal states if error messages are directly piped to user-visible screens.
**Prevention:** Consistently use environment detection (`Constants.appOwnership !== 'expo'`) and show generic, localized error messages ("An unexpected error occurred") to end users in production, while reserving full stack traces or error strings for internal logs.
