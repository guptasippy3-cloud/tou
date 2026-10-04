# Tou features and rules

This list describes the current prototype. Items marked as planned are not shipped features.

| Feature | What someone can do | Current behavior |
|---|---|---|
| First setup | Choose a name and one of six colors | Saves locally; name is limited to 20 characters |
| Pet screen | See needs and care for the pet | Four care controls stay beside the character |
| Talk | Type a message or use supported voice input | Scripted responses, spoken replies, and local preferences |
| Feed | Give the pet a snack | Fills hunger; adds 4 happiness; blocks feeding at 100 hunger |
| Clean | Wash the pet | Fills cleanliness; adds 5 happiness; blocks washing at 100 cleanliness |
| Rest and wake | Put the pet to sleep or wake it | Rest fills energy; wake changes the sleeping flag |
| Play | Open Hop, Twirl, and Dance | Play button opens the panel; selecting a trick performs it |
| Tricks | Hop, twirl, or dance | Requires energy of at least 10; costs 2 energy and 3 cleanliness; fills happiness |
| Sounds | Hear care and trick feedback | Hop movement, magical Twirl, voiced Dance, and playful care sounds |
| Mute | Turn sounds and replies off | Saves the setting and stops current activity audio |
| Dress up | Choose four outfits or six colors | Changes appearance and saves the choice |
| Daily checklist | See completed care tasks | Tracks feed, play, wash, and sleep by local date |
| Care streak | Care on consecutive days | One increment per local day; a missed day resets the active streak; best is retained |
| Preferences | Tell the pet a name, favorite color, or food | Rule matching saves supported details; later questions can recall them |
| Forget memories | Clear remembered preferences | Leaves the pet's care state and appearance intact |
| Expressions | Notice dirt, fatigue, or an unhappy pet | Appearance and text respond to care values |
| Growth | See a life-stage label | Tiny on days 1–3, growing on days 4–13, grown-up from day 14 |
| Saving | Return to the same pet | localStorage in the browser; Preferences in native builds; no cross-device sync |
| Offline assets | Use bundled native assets | Native assets are local; browser caching depends on service-worker availability |

## Elapsed time

Care is recalculated on load, once per minute, when the page becomes visible, and before relevant actions. It does not run a background timer while the app is closed.

| Meter | Change per elapsed hour |
|---|---|
| Hunger | Minus 4 |
| Happiness | Minus 2 |
| Cleanliness | Minus 2.5 |
| Energy while awake | Minus 3 |
| Energy while sleeping | Plus 12 |

All meters stay within 0–100. Successful feed, wash, or rest starts a ten-minute grace period during which elapsed-time changes pause. Tricks do not start a new grace period. There is no pet death.

## Important implementation detail

The code still contains an older `care('play')` branch: it fills happiness, costs 9 energy, 4 hunger, and 8 cleanliness, and starts the grace period. The visible Play control now opens tricks instead, so normal play uses the lighter performTrick rules above.

## Planned

Richer visual growth stages, broader conversation, account-based syncing, notifications, public demo hosting, and a signed iOS release are possible future work. Their priority should follow user testing.
