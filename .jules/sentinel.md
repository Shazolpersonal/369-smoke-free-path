## 2024-05-16 - Prevent Affirmation Data Leakage to Mobile Keyboards
**Vulnerability:** Input fields containing potentially sensitive internal business logic or affirmations lacked restrictions, allowing third-party mobile keyboards to learn phrasing and permitting copy-paste bypassing of core task mechanics.
**Learning:** Default React Native `TextInput` components leave autocomplete, autocorrect, and context menus enabled. This can lead to sensitive phrasing leaking to learning keyboards and compromises task integrity.
**Prevention:** Apply security props (`autoComplete="off"`, `autoCorrect={false}`, `contextMenuHidden={true}`, `spellCheck={false}`, `importantForAutofill="no"`) to `TextInput` components handling sensitive internal logic or strict data entry requirements.
