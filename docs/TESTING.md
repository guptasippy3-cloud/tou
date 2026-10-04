# Verification status

The latest focused suite contains 34 assertions across three runs: 8 experience checks, 17 audio checks, and 9 care/feature checks. It executes the actual app JavaScript with simulated DOM, storage, and audio APIs.

Covered: main navigation, direct tricks, care streak recording, conversation memories, WAV data existence and nonzero samples, playback requests, mute/unmute, no-audio fallback, tired-pet feedback, feeding, cleaning, rest/wake, colors, outfits, text-triggered tricks, and service-worker syntax.

Android v1.0.4 compiled successfully. Its packaged HTML, JavaScript, and populated dance audio were inspected inside the APK. The native web assets were also copied to the iOS project.

Not verified by this suite: rendered layout, audible realism, microphone accuracy, installation on physical phones, keyboard and safe-area behavior, background audio interruptions, app restart persistence, or iOS compilation/signing.

Earlier test files and screenshots document earlier versions. `tests/run.cjs` is a historical broader suite; some assertions describe superseded navigation and should be updated before treating it as a current release gate. Use the three `tests/experience.cjs` runs for the documented current checks.

The published snapshot excludes earlier broader suites and unknown-provenance recordings. Historical test artifacts remain in the local working project.
