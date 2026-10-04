# Tou for iPhone

The Capacitor iOS project is at `ios/App/App.xcodeproj`. It bundles the game, local fonts, animations and cleaned recording. Minimum iOS version: 15. It stores pet colors, streaks, meters, outfits, memories and voice settings locally using Capacitor Preferences. Browser progress is separate from the native app's save.

## Install the native app

1. Install Xcode 26 or newer on a compatible Mac. Xcode is not installed on the Mac used to prepare this project.
2. Install Node 22+ and the project dependencies (`npm install` or `pnpm install`).
3. Run `npm run ios:sync`, then `npm run ios:open`.
4. In Xcode, select the App target → Signing & Capabilities. Enable automatic signing and choose your Apple Account's team.
5. Connect your iPhone, select it as the run destination, and run the app. Follow Apple's pairing/Developer Mode steps on the phone.

A Personal Team supports personal device testing; distributing through TestFlight/App Store requires Apple Developer Program membership. Signing is tied to your Apple account. No signed IPA was generated in this environment.

## Browser version

Run the browser game locally as described in README.md. A public HTTPS demo is not published yet.

## Voice

The recording is bundled and playable offline. Dynamic replies use iOS WebKit speech synthesis and the device's available voices, rather than Android's custom speech plugin or a voice API. Spoken voice quality and availability must be checked on the phone. Typed chat remains available when voice input is unsupported.

## Verified and remaining

Capacitor iOS generation/sync and game logic tests passed. Native saved progress is wired through Preferences independently of Android speech. iOS compilation, code signing, physical-device voice/audio, safe areas, keyboard and background behavior remain unverified until Xcode and an iPhone are available.

References: https://capacitorjs.com/docs/getting-started/environment-setup · https://developer.apple.com/help/account/basics/about-your-developer-account · https://support.apple.com/en-lamr/guide/iphone/iphea86e5236/ios
