# ৩৬৯ ধোঁয়া-মুক্ত পথ — Beta QA Audit Report

**তারিখ:** ২০২৫  
**Auditor:** Kiro AI QA Agent  
**App Version:** 1.0.0  
**Platform:** React Native (Expo) — iOS & Android  
**Spec:** beta-test-qa-audit  

---

## Executive Summary

**সামগ্রিক রেটিং: ৭.৫ / ১০**

৩৬৯ ধোঁয়া-মুক্ত পথ অ্যাপটি একটি সুচিন্তিত ও হৃদয়গ্রাহী ধূমপান-বিরোধী সহায়ক অ্যাপ। Core logic, performance এবং architecture সবই শক্তিশালী। তবে launch-এর আগে কিছু critical i18n bug ঠিক করা আবশ্যক।

| বিভাগ | মূল্যায়ন | মন্তব্য |
|---|---|---|
| Functional Stability | ৮/১০ | Core logic সঠিক, কিছু i18n key mismatch আছে |
| UI/UX Quality | ৮/১০ | Premium design, smooth animations |
| Performance | ৯/১০ | MAX_STREAK_ITERATIONS guard, efficient rendering |
| Accessibility | ৬/১০ | Touch targets mostly good, color-only indicators concern |
| i18n Completeness | ৬/১০ | ৩টি critical key bug, ২টি minor asymmetry |
| Test Coverage | ৯/১০ | ১৬টি correctness property verified |

---

## Critical Issues — লঞ্চের আগে অবশ্যই ঠিক করতে হবে

### 1. history.tsx — Translation Key Mismatch

**Severity:** Critical  
**অবস্থান:** `app/(tabs)/history.tsx`

**সমস্যা:**  
Day detail bottom sheet-এ slot label দেখানোর সময় `history.morningNiyyah`, `history.afternoonNiyyah`, `history.eveningNiyyah` keys ব্যবহার হচ্ছে। কিন্তু এই keys `en.ts` বা `bn.ts` কোনো translation file-এই নেই।

**প্রভাব:**  
উভয় ভাষায় (English ও Bengali) slot label blank বা undefined দেখাবে। ব্যবহারকারী কোন slot complete হয়েছে তা বুঝতে পারবেন না।

**কারণ:**  
Key rename হয়েছে (`Niyyah` → `Affirmation`) কিন্তু `history.tsx` file update হয়নি।

**সমাধান:**  
```tsx
// ভুল (current code):
{ key: 'morning', label: t('history.morningNiyyah'), ... }
{ key: 'noon',    label: t('history.afternoonNiyyah'), ... }
{ key: 'night',   label: t('history.eveningNiyyah'), ... }

// সঠিক (fix):
{ key: 'morning', label: t('history.morningAffirmation'), ... }
{ key: 'noon',    label: t('history.afternoonAffirmation'), ... }
{ key: 'night',   label: t('history.eveningAffirmation'), ... }
```

---

### 2. TaskCard.tsx — Hardcoded English Locked Slot Messages

**Severity:** Critical  
**অবস্থান:** `components/TaskCard.tsx`

**সমস্যা:**  
`getLockedSlotMessage()` function সর্বদা hardcoded English string return করে। Language `bn` (Bengali) সেট থাকলেও toast notification-এ English message দেখায়।

```typescript
// বর্তমান buggy code:
const getLockedSlotMessage = () => {
    switch (slot) {
        case 'morning': return 'Morning slot opens at 8:00 AM';
        case 'noon':    return 'Noon slot opens at 1:00 PM';
        case 'night':   return 'Night slot opens at 6:00 PM';
    }
};
```

**প্রভাব:**  
Bengali ব্যবহারকারীরা locked slot tap করলে English message দেখবেন — inconsistent UX।

**কারণ:**  
Function-এ `language` parameter নেই এবং `t()` function ব্যবহার করা হয়নি।

**সমাধান:**  
```typescript
// i18n keys যোগ করুন en.ts ও bn.ts-এ:
'taskCard.lockedMorning': 'Morning slot opens at 8:00 AM',
'taskCard.lockedNoon':    'Noon slot opens at 1:00 PM',
'taskCard.lockedNight':   'Night slot opens at 6:00 PM',

// তারপর TaskCard.tsx-এ:
const getLockedSlotMessage = () => {
    switch (slot) {
        case 'morning': return t('taskCard.lockedMorning');
        case 'noon':    return t('taskCard.lockedNoon');
        case 'night':   return t('taskCard.lockedNight');
    }
};
```

---

### 3. dashboard.restPeriod Duplicate Key

**Severity:** Critical  
**অবস্থান:** `i18n/en.ts`, `i18n/bn.ts`

**সমস্যা:**  
`en.ts` ও `bn.ts` উভয় file-এ `dashboard.restPeriod` key দুইবার define করা আছে।

```typescript
// en.ts-এ দুইবার:
'dashboard.restPeriod': '😴 Rest time (5–8 AM). Morning slot opens at 8:00 AM.',
'dashboard.restPeriod': '😴 Rest time (5–8 AM). Morning slot opens at 8:00 AM.',
```

**প্রভাব:**  
JavaScript object-এ duplicate key থাকলে দ্বিতীয় definition প্রথমটিকে silently override করে। এটি TypeScript compiler warning দেয় না এবং runtime-এ silent bug হিসেবে থাকে। ভবিষ্যতে দুটি definition আলাদা হলে কোনটি active তা বোঝা কঠিন হবে।

**কারণ:**  
Accidental duplication — সম্ভবত copy-paste error।

**সমাধান:**  
উভয় file থেকে duplicate line সরিয়ে একটি definition রাখুন।

---

## Minor Issues — পরেও সমাধান করা যাবে

### 1. guide.encouragement i18n Asymmetry

**Severity:** Minor  
**অবস্থান:** `i18n/bn.ts` (present), `i18n/en.ts` (absent)

`bn.ts`-এ `guide.encouragement` key আছে কিন্তু `en.ts`-এ নেই। English ব্যবহারকারীরা এই motivational message দেখবেন না। উভয় file-এ key যোগ করুন।

---

### 2. history.emptyState Missing Key

**Severity:** Minor  
**অবস্থান:** `app/(tabs)/history.tsx`, `i18n/en.ts`, `i18n/bn.ts`

`history.tsx`-এ `t('history.emptyState')` call আছে কিন্তু key কোনো translation file-এ নেই। বর্তমানে hardcoded fallback string `'Start your journey to see progress here'` ব্যবহার হচ্ছে। Proper i18n key যোগ করুন।

---

### 3. require() Inside Function Body — timeSlotManager.ts

**Severity:** Minor  
**অবস্থান:** `utils/timeSlotManager.ts` — `formatDateKeyHumanReadable()` function

`formatDateKeyHumanReadable()` function-এর ভেতরে `require()` call আছে। এটি module-level import হওয়া উচিত। Function call প্রতিবার `require()` execute করা performance anti-pattern এবং bundler optimization-এ বাধা দেয়।

**সমাধান:** File-এর top-এ `import` statement হিসেবে নিয়ে আসুন।

---

### 4. CalendarDay — Color-Only Status Indicator

**Severity:** Minor (Accessibility)  
**অবস্থান:** `components/CalendarDay.tsx`

Calendar-এ day status (complete/partial/missed/pending) শুধুমাত্র background color দিয়ে বোঝানো হয়। `accessibilityLabel` বা `accessibilityRole` নেই। Color vision deficiency আছে এমন ব্যবহারকারী এবং screen reader ব্যবহারকারীরা status বুঝতে পারবেন না।

**সমাধান:** প্রতিটি day cell-এ `accessibilityLabel` যোগ করুন, যেমন: `"Day 15, complete"` বা `"১৫ তারিখ, সম্পন্ন"`।

---

### 5. Error State — Color-Only Indicator

**Severity:** Minor (Accessibility)  
**অবস্থান:** `app/task/[slot].tsx`

Task screen-এ incorrect text `COLORS.error` (red) দিয়ে highlight হয়। `accessibilityLabel` নেই। Underline decoration আংশিক non-color cue দেয়, কিন্তু screen reader-এর জন্য যথেষ্ট নয়।

---

### 6. completedBadge Touch Target

**Severity:** Minor (Accessibility)  
**অবস্থান:** `components/TaskCard.tsx`

`completedBadge` এবং `lockedBadge` উভয়ই `40×40pt` — WCAG-recommended `44pt` minimum-এর সামান্য নিচে। পুরো `TouchableOpacity` card wrap করে থাকায় overall tap area যথেষ্ট, কিন্তু badge নিজে standalone interactive হলে সমস্যা হবে।

---

## Improvement Suggestions

### 1. 5 AM Day Boundary — ব্যবহারকারীকে স্পষ্টভাবে জানানো

রাত ১২টা থেকে ভোর ৫টার মধ্যে complete করা tasks আগের দিনের হিসাবে গণনা হয়। এই logic সঠিক, কিন্তু onboarding-এ বা guide screen-এ এটি স্পষ্টভাবে explain করা উচিত। অনেক ব্যবহারকারী রাতে task complete করে পরদিন সকালে streak miss মনে করতে পারেন।

### 2. 80% Accuracy Threshold — Onboarding-এ Explain করা

Task screen-এ ৮০% accuracy হলে Submit button active হয়। এই threshold onboarding-এ mention করা হয়েছে, কিন্তু first-time task screen-এ একটি brief tooltip বা hint দিলে ব্যবহারকারীর confusion কমবে।

### 3. Push Notification Permission Timing

Notification permission request-এর timing optimize করুন। Cold start-এ permission চাওয়ার চেয়ে প্রথম task complete করার পরে চাওয়া বেশি effective — ব্যবহারকারী তখন app-এর value বুঝতে পারেন।

### 4. Achievements "View All" Option

Achievements section-এ অনেক badge থাকলে scroll করতে হয়। একটি "সব দেখুন" / "View All" option যোগ করলে UX উন্নত হবে।

### 5. accessibilityLabel on CalendarDay and Error States

CalendarDay-এ `accessibilityLabel={`${day} তারিখ, ${statusLabel}`}` এবং error text-এ `accessibilityHint` যোগ করুন। এটি screen reader ব্যবহারকারীদের জন্য app সম্পূর্ণ accessible করবে।

---

## Positive Observations — ভালো যা আছে

### 1. grapheme-splitter Integration — Bengali Conjunct Handling

`grapheme-splitter` library ব্যবহার করে Bengali conjunct characters (যুক্তাক্ষর) সঠিকভাবে handle করা হয়েছে। এটি Bengali text validation-এর জন্য একটি sophisticated এবং correct approach। অনেক app এই সমস্যা ignore করে।

### 2. Error Recovery Flow — AsyncStorage Corruption Handling

`ProgressContext.tsx`-এ AsyncStorage corruption-এর জন্য graceful error recovery আছে। Corrupted data পেলে app crash করে না, বরং clean state-এ reset হয়। Production-ready resilience।

### 3. Day Boundary Logic — 5 AM Boundary Correctly Implemented

`getEffectiveTodayDate()` function-এ ভোর ৫টার boundary সঠিকভাবে implement করা হয়েছে। রাতের session (6 PM – 5 AM) midnight cross করলেও সঠিক দিনে count হয়। এটি একটি non-trivial edge case যা সঠিকভাবে handle করা হয়েছে।

### 4. MAX_STREAK_ITERATIONS Guard — Performance Protection

Streak calculation-এ `MAX_STREAK_ITERATIONS` guard আছে যা infinite loop থেকে রক্ষা করে। এটি একটি thoughtful defensive programming practice।

### 5. Touch Targets — helpBtn, langToggle, navButton সবই 44pt Minimum পূরণ করে

- `helpBtn`: `minWidth: 44, minHeight: 44` ✅
- `langToggle`: `minHeight: 44` ✅
- `navButton` (history): `width: 44, height: 44` ✅

WCAG touch target guidelines মেনে চলা হয়েছে।

### 6. i18n Architecture — Flat Key System, Easy to Maintain

Flat dot-notation key system (`'history.morningAffirmation'`) nested object-এর চেয়ে সহজে maintain করা যায়। TypeScript `Record<string, string>` type সঠিক।

### 7. Property-Based Testing — 16 Correctness Properties Verified

`fast-check` library ব্যবহার করে ১৬টি correctness property verify করা হয়েছে। এটি unit test-এর চেয়ে অনেক বেশি edge case cover করে এবং app-এর logic-এর উপর আস্থা বাড়ায়।

---

## Prioritized Action List

### Priority 1 — Critical (Launch Blocker)

| # | সমস্যা | File | Action |
|---|---|---|---|
| 1 | history.tsx key mismatch | `app/(tabs)/history.tsx` | `morningNiyyah` → `morningAffirmation` (এবং noon, evening) |
| 2 | TaskCard hardcoded English | `components/TaskCard.tsx` | `getLockedSlotMessage()` → `t()` ব্যবহার করুন |
| 3 | dashboard.restPeriod duplicate | `i18n/en.ts`, `i18n/bn.ts` | Duplicate line সরিয়ে দিন |

### Priority 2 — Minor (Post-Launch)

| # | সমস্যা | File | Action |
|---|---|---|---|
| 4 | guide.encouragement asymmetry | `i18n/en.ts` | Key যোগ করুন |
| 5 | history.emptyState missing | `i18n/en.ts`, `i18n/bn.ts` | Key যোগ করুন |
| 6 | require() inside function | `utils/timeSlotManager.ts` | Top-level import-এ নিয়ে আসুন |
| 7 | completedBadge 40x40 | `components/TaskCard.tsx` | 44x44-এ বাড়ান |

### Priority 3 — Improvement (Future Sprint)

| # | সমস্যা | Action |
|---|---|---|
| 8 | CalendarDay color-only | `accessibilityLabel` যোগ করুন |
| 9 | Error state color-only | `accessibilityHint` যোগ করুন |
| 10 | 5 AM boundary UX | Onboarding-এ explain করুন |
| 11 | Notification permission timing | First task complete-এর পরে চান |
| 12 | Achievements view all | "সব দেখুন" button যোগ করুন |

---

## সারসংক্ষেপ

অ্যাপটি launch-এর কাছাকাছি। ৩টি critical bug fix করলে এটি production-ready হবে। Architecture, performance এবং Bengali language support সবই উচ্চমানের। Property-based testing coverage বিশেষভাবে প্রশংসনীয়।

> **সুপারিশ:** Critical issues (Priority 1) fix করে beta release করুন। Minor ও improvement items পরবর্তী sprint-এ নিন।

---

*এই report beta-test-qa-audit spec-এর Task 16 হিসেবে generate করা হয়েছে।*
