## 2025-03-02 - Array Allocation Overhead in `utils/achievements.ts`
**Learning:** Multiple array allocations (`Object.keys`, `Object.values`) combined with `.filter(...).length` chains create significant memory and processing overhead when counting truthy properties, especially inside critical functions like `getAchievements` which are calculated frequently.
**Action:** Use a single `for...in` loop with ternary addition (e.g., `(bool ? 1 : 0)`) for calculating counts. This approach avoids intermediate array creation and ensures an O(N) single-pass iteration.

## 2025-04-19 - Object Creation Overhead in `utils/textValidator.ts`
**Learning:** Creating instances of `GraphemeSplitter` inside a frequently called function (like `splitIntoGraphemes` during text input) causes high memory allocation and garbage collection overhead. Since `GraphemeSplitter` has no state, it can be instantiated once globally.
**Action:** Always lift heavy or state-independent object instantiations to the module scope so they are reused across function calls.

## 2025-05-19 - Garbage Collection Overhead of `Date` Instantiation in Render Loops
**Learning:** Instantiating `new Date()` within render loops (e.g., `Array.map`) or heavy `useMemo` blocks causes unnecessary object allocations and GC overhead on mobile/React Native. Since the app already formats dates into strict `YYYY-MM-DD` formats, checking if a day is in the future by comparing instantiated dates (`new Date(year, month, day) > effectiveToday`) is significantly slower than direct lexicographical string comparison.
**Action:** For date boundary comparisons in render loops or frequent calculations, always prefer lexicographical string comparisons of ISO formatted dates (e.g., `dateKey > todayKey`) over instantiating new `Date` objects to prevent garbage collection and object allocation overhead.
