# Tou: building a little pet companion

## Where it started

I wanted to make a pet game that someone could open on their phone for a few minutes each day. They would care for a little character, play together, and have a short conversation.

I chose a triangle because it was simple and gave the pet a distinct look. Its expressions, movements, and sounds would give it personality.

## My role

I came up with the concept, decided what the app should do, and reviewed each working version. I used AI coding assistance for implementation and documentation, then gave feedback on what needed to change.

This is a personal prototype. I haven’t launched it commercially or carried out formal user research yet.

## What changed as I tried it

### I wanted the pet to stay in view

The first version needed scrolling to reach some activities. That felt awkward for a small game, so I asked for a layout that kept the pet and its controls on screen. Activities now open in the same space.

I still need to check this properly on phones, especially when the keyboard is open.

### Tricks were in the wrong place

Hop, Twirl, and Dance were hidden inside customization. When I wanted to play with the pet, that wasn’t where I expected to find them.

I moved tricks under Play and kept outfits and colors together in Dress up. The controls now follow what someone is trying to do.

### There were too many tabs

Four main destinations felt like too much navigation for such a small app. I reduced them to Pet and Talk. Tricks and dress-up open within the pet screen, with a Done button to return.

### The sounds needed more personality

The early sounds were musical tones. I wanted eating to feel like eating, washing to feel bubbly, and tricks to feel playful. I refined them into softer care sounds, magical chimes for Twirl, and a “la la la” clip for Dance.

Dance was silent at one point because the WAV file contained no audio samples. The tests had only checked whether playback was requested. We replaced the file and added checks for actual audio data. That was a useful reminder to test the asset itself, not just the code that plays it.

### Small details made it feel more personal

The pet remembers your name, favorite color, and favorite food on the device. You can review or clear those memories in Talk. Conversation is rule-based, so it handles these simple exchanges rather than open-ended chat.

## Where the project is now

Tou works in a browser and has an Android test build. The native iOS project is prepared but still needs signing and device testing.

The focused automated suite passes 34 checks. Those checks use simulated browser APIs, so they don’t tell me how the sounds feel or how well the app works on a real phone. The screenshots in this repository show an earlier version.

I don’t have retention data or user-study results yet.

## What I’m taking away

- Keep everyday actions easy to find.
- Group features around what people want to do.
- Use sound and movement to make feedback clearer.
- Check media files as well as playback logic.
- Be clear about what has been tested and what is still an assumption.

## My next step

I want to watch people try the main tasks on their phones, capture the current experience, and publish a playable demo. That will help me decide whether to improve the pet’s lifecycle or its conversation next.
