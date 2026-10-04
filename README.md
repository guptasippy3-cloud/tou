# Tou — a little triangle, a big friendship

A mobile pet-care prototype built around an animated triangle. Feed it, wash it, let it rest, teach it tricks, and make it your own with outfits and colors.

Tou explores how a small character can feel like a companion through daily care, expressive animation, sound, and remembered details.

**Status:** working prototype · Android debug APK v1.0.4 · native iOS project prepared, not signed or released.

[Product case study](docs/CASE-STUDY.md) · [Product brief](docs/PRODUCT-BRIEF.md) · [Android setup](ANDROID.md) · [iPhone setup](IOS.md) · [Verification notes](docs/TESTING.md)

## The experience

- **Pet and Talk:** two main destinations, with care actions beside the pet.
- **Care:** hunger, happiness, cleanliness, energy, daily tasks, and a care streak. Needs change with elapsed time, including time away.
- **Play:** Hop, Twirl, and Dance open directly from the pet's Play button. Tricks contribute to daily play.
- **Personalize:** four outfits, six colors, and an editable name.
- **Expressive character:** animated hands, facial expressions, visible dirt, care effects, magical twirl audio, and a voiced dance clip.
- **Conversation:** typed messages, browser-dependent voice input, spoken replies, and local memory for your name, favorite color, and food.
- **Local progress:** browser storage and Capacitor Preferences in native builds. No account required.

Conversation uses local rules, not a general-purpose AI model. Growth stages change the displayed life-stage label; a richer visual lifecycle is future work.

## Design in progress

![Earlier mobile prototype showing the triangle pet](tests/review-phone.jpg)

This screenshot documents an earlier iteration. The current interface has two main tabs, **Pet** and **Talk**, with tricks and dress-up opened in place. See the [case study](docs/CASE-STUDY.md) for the decisions behind those changes.

## Try it locally

The browser game requires no build step:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open `http://localhost:8080`. Microphone permissions and speech support vary by browser. A publicly hosted HTTPS demo has not been published yet.

## Native builds

Node.js 22+, pnpm, and the relevant native development tools are required.

```sh
pnpm install --frozen-lockfile
pnpm build
pnpm android:sync
# Or:
pnpm ios:sync
```

Android requires Java 21 and an Android SDK. iOS requires Xcode and Apple signing. Full instructions are in [ANDROID.md](ANDROID.md) and [IOS.md](IOS.md).

This public snapshot excludes the older recorded-voice samples; generated activity sounds and dynamic spoken replies remain included.

The Android test installer is generated at `android/app/build/outputs/apk/debug/app-debug.apk`. It should be distributed through a GitHub Release rather than committed to the repository. No signed iOS installer or TestFlight release is available.

## Verification

```sh
node tests/experience.cjs 1
node tests/experience.cjs 2
node tests/experience.cjs 3
```

The latest focused suite passed 34 assertions across three runs, covering navigation, care, memories, audio file contents, playback requests, mute, colors, outfits, and syntax. Tests use simulated browser APIs. They do not prove audible quality or physical-device behavior. [Read the verification limits](docs/TESTING.md).

## Built with

HTML, CSS, JavaScript, SVG animation, browser audio and speech APIs, Capacitor, Capacitor Preferences, esbuild, and locally bundled DM Sans and Manrope fonts.

```text
index.html / style.css / app.js   Browser game
public/                         Icons, fonts, and audio
scripts/                        Bundling and audio generators
android/ and ios/               Native projects
 tests/                         Automated checks and earlier review artifacts
 docs/                          Product case study and verification notes
```

## My approach

I directed the concept and product experience, reviewed iterations, and used AI coding assistance to implement and refine the prototype. The project demonstrates turning feedback into concrete interaction changes; it is not presented as entirely hand-written code.

## Next steps

- Verify audio, keyboard behavior, saved progress, and lifecycle on physical devices.
- Capture a current demo video and screenshots.
- Publish an HTTPS web demo and an Android test release.
- Build and sign iOS for device testing.
- Develop richer life-stage visuals and a more capable conversation experience.

## Assets and licensing

See [asset notes](docs/ASSETS.md). A repository license has not yet been selected; no open-source license is implied.
