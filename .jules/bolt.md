## 2025-03-02 - Array Allocation Overhead in `utils/achievements.ts`
**Learning:** Multiple array allocations (`Object.keys`, `Object.values`) combined with `.filter(...).length` chains create significant memory and processing overhead when counting truthy properties, especially inside critical functions like `getAchievements` which are calculated frequently.
**Action:** Use a single `for...in` loop with ternary addition (e.g., `(bool ? 1 : 0)`) for calculating counts. This approach avoids intermediate array creation and ensures an O(N) single-pass iteration.

## 2025-04-19 - Object Creation Overhead in `utils/textValidator.ts`
**Learning:** Creating instances of `GraphemeSplitter` inside a frequently called function (like `splitIntoGraphemes` during text input) causes high memory allocation and garbage collection overhead. Since `GraphemeSplitter` has no state, it can be instantiated once globally.
**Action:** Always lift heavy or state-independent object instantiations to the module scope so they are reused across function calls.

## 2025-05-15 - Redundant Array Allocations in Date Key Parsing
**Learning:** Using `split('-').map(Number)` on date keys (e.g., "YYYY-MM-DD") causes unnecessary array allocations and closure overhead. For fixed-format strings, manual parsing with `substring` is significantly faster and more memory-efficient.
**Action:** Use manual `substring` extraction and `Number()` conversion for parsing fixed-format strings like ISO date keys. Extract this logic into a helper function to maintain readability and DRY principles.
