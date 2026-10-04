# Tou release plan

The portfolio and product documentation are published. The next milestone should make the game easy to try and clearly distinguish a demo from a store release.

## Recommended first milestone: a portfolio-ready demo

| Work | Definition of done | Current status |
|---|---|---|
| Public playable demo | HTTPS link works on a phone without the Mac running | Not published |
| Current screenshots | Show Pet, Talk, tricks, and dress-up in the current interface | Earlier screenshots only |
| Walkthrough | Short recording demonstrates setup, care, tricks, and preference recall | Not recorded |
| Browser review | Check narrow/wide screens, keyboard, audio errors, reload, and offline behavior | Current changes need rendered checks |
| Automated checks | Three focused runs pass; media has actual audio data | 34 checks passed on the published snapshot |
| Asset consistency | Public demo and native release use only included, cleared assets | Published source excludes older recordings; local build differs |
| Portfolio links | README and profile link to the verified demo and current media | Documentation links live; demo link pending |

## Native-app milestone

Android needs a fresh build from the public source, installation/update testing on a phone, background audio and save checks, and a decision on test distribution versus Play Store release.

iOS needs Xcode, Apple signing, a connected iPhone, and device testing. TestFlight or App Store distribution needs the corresponding Apple developer setup. A prepared project is not an installable iPhone release.

## Product milestone

Richer visual growth and broader conversation are new product scope. Decide what to add after watching people try the core experience. Any connected AI service would require separate backend, cost, privacy, and credential decisions; none is currently implemented.

## Release checks still needed

- Core controls fit the screen and remain reachable when the keyboard opens.
- Audio respects mute, volume, and background interruptions.
- Preferences survive browser reload and native restart.
- Microphone failures leave typed chat usable.
- Device-time changes and long absences do not break meter calculations.
- A fresh setup, sleep/wake cycle, trick, outfit/color change, and memory recall work in the target environment.

No claims of user-study outcomes or physical-device validation should be added before those checks happen.
