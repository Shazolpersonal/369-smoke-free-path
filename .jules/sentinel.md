## 2025-02-28 - [Information Disclosure via ErrorBoundary]
**Vulnerability:** ErrorBoundary component was rendering unhandled application error strings directly to the UI using `this.state.error?.message`.
**Learning:** React Native applications in production can inadvertently leak stack traces, SQL errors, or sensitive internal states if error messages are directly piped to user-visible screens.
**Prevention:** Consistently use environment detection (`Constants.appOwnership !== 'expo'`) and show generic, localized error messages ("An unexpected error occurred") to end users in production, while reserving full stack traces or error strings for internal logs.

## 2025-02-28 - [Information Disclosure via console.warn]
**Vulnerability:** Core application services were using `console.warn` to log errors with full trace information directly to the console environment, bypassing the secure logger. In production environments where console outputs are aggregated, this risks leaking sensitive application states.
**Learning:** Security utilities like `logError` and `logWarn` must be used universally across the codebase; any `console.*` statements present a risk of bypassing obfuscation mechanisms. In addition, when obfuscating errors in production, it is crucial to retain the literal string prefix (e.g. `logWarn("Failed action:", error)`) to enable sufficient traceability while dropping the sensitive error object.
**Prevention:** Strictly enforce the use of the centralized `utils/logger.ts` for all application logging. The logger itself has been enhanced to safely pass string prefixes while dropping sensitive objects in production.
