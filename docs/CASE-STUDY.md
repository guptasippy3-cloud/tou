# Tou: making a small pet game feel like a companion

## The idea

Create a mobile companion that feels approachable and easy to care for. A triangle character keeps the visual identity simple while giving animation, expression, and sound room to carry its personality.

The intended experience is a short daily visit: notice what the pet needs, care for it, play a little, and talk.

## My role and process

I originated the concept, directed product and interaction decisions, evaluated working versions, and gave specific feedback. Implementation and documentation were developed with AI coding assistance. This is a personal prototype; there are no claims of a team launch, formal user research, or measured business impact.

## Decisions that shaped the product

### Keep the pet on screen

The first interface required scrolling to reach activities. Feedback led to a viewport-based layout and in-place activity panels. The goal was to keep attention on the companion and make repeated actions reachable.

Current physical-device screen fit and keyboard behavior still need verification.

### Prioritize frequent actions

Tricks were initially grouped with customization. This made play difficult to discover and mixed two different intentions. Play now opens Hop, Twirl, and Dance directly from the care controls. Outfits and colors remain together in Dress up.

### Reduce navigation

A four-destination navigation felt excessive for a small game. The current design has Pet and Talk. Less frequent activities open inside the pet experience and have a Done action to return.

### Give actions a personality

Care actions first had musical tones, then foley approximations. Feedback pushed the sounds toward a more playful animated-film character: munches, bubbles, cozy rest, magical twirling, and a voiced dance phrase.

An empty dance WAV caused silence despite passing the earlier playback-request checks. The fix replaced the clip and added assertions for nonempty, nonzero audio samples. This exposed a testing lesson: checking that playback was requested is not enough to verify an audio asset.

### Remember small details

Local rules remember the user's name, favorite color, and favorite food. These details create continuity without an account. Memories can be reviewed and cleared in Talk.

## Current result

A working browser prototype and Android debug build, plus a prepared native iOS project. The latest focused automated suite passes 34 checks. Native device behavior and audio quality remain to be assessed on actual phones.

There are no retention metrics or usability-study findings yet. Existing screenshots show earlier iterations, not the final navigation.

## What I learned

- Put frequent actions where the user's attention already is.
- Organize features by user intention rather than available screen space.
- Use animation and sound to reinforce an action's meaning.
- Test the contents of media assets, not just API calls.
- Report prototype and verification limits precisely.

## What comes next

Physical-device sessions, current demo captures, public demo hosting, signed iOS testing, and a richer pet lifecycle.
