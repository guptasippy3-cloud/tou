# Tou native test builds

## Android v1.0.6

This is a debug-signed test installer, not a Google Play release. Transfer the APK to an Android phone, open it, and allow installation from that file-opening app if prompted. Keep the existing app installed when updating if you want to preserve its save.

Version 1.0.6/code 7 includes the two-tab interface, generated activity sounds, populated Dance audio, and a fix that stops activity audio when the app backgrounds. Older recorded-voice samples are excluded from the bundle.

No Android phone was connected during packaging. Installation, upgrade persistence, speech, keyboard layout, and restart behavior still need real-device checks.

## iPhone

The iOS source project is prepared at version 1.0.6/build 7, with bundled game assets and voice-permission descriptions. It has not been compiled or signed.

The preparation Mac runs macOS 14.6.1 and has no Xcode. Capacitor 8's current Xcode setup needs a newer compatible Mac environment. Apple lists Xcode 26 as requiring macOS 15.6 or newer: https://developer.apple.com/xcode/system-requirements/

On a compatible Mac:

1. Install Xcode and complete its first-run setup yourself.
2. Install Node.js 22+ and pnpm, then run `pnpm install --frozen-lockfile` from the project root.
3. Run `pnpm ios:sync`, then open `ios/App/App.xcodeproj` in Xcode.
4. Select App → Signing & Capabilities → automatic signing, and select your Apple Account's team.
5. Connect your iPhone, choose it as the destination, and run. Complete any pairing or Developer Mode prompts on your device.

For your own phone, Apple account signing may be sufficient, subject to Apple's personal-team limits. TestFlight distribution needs Apple Developer Program membership, App Store Connect configuration, and an uploaded signed build. The project ZIP is source, not an IPA and not installable by tapping it on an iPhone.

## Device checklist

- Complete setup and a care round.
- Try all three tricks with sound on, then muted.
- Background the app while a sound plays; it should stop.
- Change appearance and a remembered preference, then restart the app and verify both.
- Check keyboard layout and typed chat.
- Confirm spoken replies and microphone behavior supported by that device.
