# Plan: Add New Screens to CallerID App

## Task
Add 4 new screens to the CallerID React Native app:
1. **IncomingCallScreen** — full-screen incoming call UI with caller info, accept/reject
2. **ActiveCallScreen** — ongoing call UI with timer, mute/speaker/end controls
3. **SpamAlertScreen** — alert shown when a spam caller is detected
4. **BlockedNumbersScreen** — list of user-blocked numbers with unblock option

## Design Constraints
- Match existing dark theme: `#0F1724` bg, `#5EE7DF` accent, `#F4F7FB` text
- Use existing design patterns: cards, badges, Ionicons, SafeAreaView
- Consistent with existing `TRUST_CONFIG` color scheme
- Reuse `src/data/index.js` constants where possible

## Screen Specifications

### 1. IncomingCallScreen
- Full-screen modal overlay style
- Caller name, number, avatar/initials, location, carrier
- Trust badge (verified safe / spam likely / unknown)
- Pulsing ring animation around avatar
- Two action buttons: **Decline** (red, left) and **Accept** (green, right)
- Optional: "Answer as SMS" secondary action
- Auto-reject countdown timer for spam callers

### 2. ActiveCallScreen
- Top: caller name/number, call duration timer (increments every second)
- Middle: animated waveform / call status indicator
- Bottom: action row — Mute toggle, Speaker toggle, Dialpad, End Call
- Trust badge still visible
- Background: same dark theme as the rest of the app

### 3. SpamAlertScreen
- Full-screen warning style (red accent)
- Spam category and report count
- "Block Now" primary CTA
- "Ignore" / "Report" secondary actions
- Dismiss on ignore or block

### 4. BlockedNumbersScreen
- FlatList of blocked numbers with avatar, name, number, blocked date
- Search/filter bar at top
- Swipe-to-unblock or tap-to-unblock button per row
- Empty state when no blocked numbers
- Add blocked number manually via FAB or button

## Implementation Order
1. Write plan → `plans/plan-callerid-new-screens.md`
2. Create `IncomingCallScreen.jsx`
3. Create `ActiveCallScreen.jsx`
4. Create `SpamAlertScreen.jsx`
5. Create `BlockedNumbersScreen.jsx`
6. Update `App.tsx` to register new routes
7. Run plan-gap check
8. Self-critique

## Acceptance Criteria
- [ ] All 4 screens render without crashes
- [ ] All screens match the dark theme
- [ ] All 4 screens are registered in App.tsx stack navigator
- [ ] Navigation flows work between screens
- [ ] No TypeScript errors (plain JSX)
