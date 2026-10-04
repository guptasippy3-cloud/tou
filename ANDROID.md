# Tou Android game

Tou is packaged with Capacitor as an Android game (`com.tou.petgame`). The APK includes the screens, SVG pet, animations, fonts and voice recordings. It does not load the game from a website, call a voice API, or require the Mac to stay on.

## Install the test build

Copy `downloads/tou-android.apk` to an Android phone, open it, and allow installation from the app used to open the file if Android asks. This is a debug-signed test build, not a Google Play release. Minimum Android version: Android 7 (API 24).

## Offline features

Care, outfits, tricks, rule-based typed chat, memories and recorded audio work offline. Pet progress is stored with Capacitor Preferences and mirrored to local storage. Uninstalling the app clears progress. Existing Safari/browser progress is not automatically imported into this separately installed app.

Dynamic spoken replies use Android's installed offline text-to-speech voices, not the uploaded voice recording. Voice availability varies by phone. Install an offline English voice in Android's text-to-speech settings if necessary. Speech input may be unavailable in Android WebView; typed chat remains available. No cloud account or general-purpose AI chat is included.

## Build again

Install Node 22+ and Android Studio with Java 21, Android SDK Platform 36 and Build Tools 36.0.0. Configure `android/local.properties` with your SDK path, for example `sdk.dir=/Users/YOUR_NAME/Library/Android/sdk` on macOS.

```sh
npm install
npm test
npm run android:apk
```

APK output: `android/app/build/outputs/apk/debug/app-debug.apk`.

For Android Studio: run `npm run android:sync`, then `npm run android:open`.

The initial build in this chat used temporary tool paths under `/tmp/tou-android-tools`; set your permanent SDK and JDK paths before rebuilding after a restart. To publish on Google Play, create a release signing key and build a signed Android App Bundle in Android Studio. Keep the signing key private.

## Validation

The web game checks and Android compilation are run during packaging. Actual Android phone behavior (speech quality, keyboard resizing, audio interruptions and offline persistence across process termination) still requires device testing.
