## 2025-03-02 - Array Allocation Overhead in `utils/achievements.ts`
**Learning:** Multiple array allocations (`Object.keys`, `Object.values`) combined with `.filter(...).length` chains create significant memory and processing overhead when counting truthy properties, especially inside critical functions like `getAchievements` which are calculated frequently.
**Action:** Use a single `for...in` loop with ternary addition (e.g., `(bool ? 1 : 0)`) for calculating counts. This approach avoids intermediate array creation and ensures an O(N) single-pass iteration.

## 2025-04-19 - Object Creation Overhead in `utils/textValidator.ts`
**Learning:** Creating instances of `GraphemeSplitter` inside a frequently called function (like `splitIntoGraphemes` during text input) causes high memory allocation and garbage collection overhead. Since `GraphemeSplitter` has no state, it can be instantiated once globally.
**Action:** Always lift heavy or state-independent object instantiations to the module scope so they are reused across function calls.

## 2025-04-20 - Inline Object Creation in Render Loops in `history.tsx`
**Learning:** Creating `Date` objects inside loops like `calendarDays.map` and `useMemo` hooks solely for date boundary comparisons causes significant and unnecessary object allocation and garbage collection overhead during every render.
**Action:** Exploit the lexicographical order of ISO string dates (`YYYY-MM-DD`). Replace inline date creation (e.g., `new Date(...) > effectiveToday`) with string comparisons (`dateKey > todayKey`) where `todayKey` is globally accessible or generated once per component lifecycle.
