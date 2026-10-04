# Tou tech stack

I kept the browser game small and used Capacitor to package the same experience for phones. There is no application server or database service in this prototype.

| Layer | Technology | What it does |
|---|---|---|
| Interface | HTML and CSS | Screens, responsive layout, care controls, and activity panels |
| Character | SVG and CSS animations | Triangle body, hands, expressions, dirt, and tricks |
| Game logic | JavaScript | Care calculations, streaks, preferences, chat rules, and rendering |
| Browser storage | localStorage | Saves one pet on the current browser/device |
| Native container | Capacitor 8 | Runs bundled web assets inside Android and iOS WebViews |
| Native storage | Capacitor Preferences | Restores and saves the native game's progress |
| Voice input | SpeechRecognition or webkitSpeechRecognition | Converts speech to text where supported |
| Browser replies | SpeechSynthesis | Reads replies using available device voices |
| Android replies | Custom TouSpeech Capacitor plugin | Uses Android text-to-speech through native Java code |
| Activity sound | HTML Audio and local WAV files | Plays action sounds without requesting an audio service |
| Offline browser assets | Service worker and Cache API | Caches browser assets after registration on an eligible origin |
| Native lifecycle | Capacitor App | Handles background state and Android back navigation |
| Native bundling | esbuild and a Node build script | Bundles the native adapter and copies assets/fonts into www |
| Fonts | Fontsource DM Sans and Manrope | Bundles fonts locally for native builds; browser CSS uses a Google Fonts import |
| Audio generation | Python standard library | Creates original care effects, magic chimes, and a voiced dance approximation |
| Checks | Node.js test harness | Runs app logic with simulated DOM, storage, and audio APIs |

## Why these choices

A plain JavaScript app made it quick to try interaction changes without a framework or backend. Capacitor lets the browser and native versions share most of the code. Local saving means people can start without signing up.

These choices also have limits. Saves do not sync between devices. Chat understands a small set of rules. Speech input may be unavailable in a WebView, and its processing may depend on the browser or operating system. Native builds bundle assets, while browser offline support needs service-worker registration and an initial successful load.

## Files to look at

- [app.js](../app.js): state, care, chat, rendering, and audio.
- [index.html](../index.html) and [style.css](../style.css): interface and animation.
- [scripts/native-entry.js](../scripts/native-entry.js): native startup, saving, speech routing, and lifecycle.
- [scripts/build.mjs](../scripts/build.mjs): native bundling.
- [TouSpeechPlugin.java](../android/app/src/main/java/com/tou/petgame/TouSpeechPlugin.java): Android speech implementation.
- [sw.js](../sw.js): browser asset caching.

Package versions are recorded in package.json and pnpm-lock.yaml. The Android APK's version is separate from the npm package version.
