# DeskFit Privacy Policy

Applies to DeskFit 2.0 and later.

DeskFit keeps your exercise data on your Mac. It shares a small amount of diagnostics to find bugs and see which features get used. This is on by default, and you can turn it off at any time.

## When collection starts

Nothing is collected or sent until you finish or dismiss onboarding. A crash during first-run onboarding is not reported.

## What is sent

Usage counts, sent to TelemetryDeck. Each is a named event:

- `appLaunched`
- `onboardingCompleted`
- `sessionStarted` (with whether it started automatically or manually)
- `sessionStopped`
- `exerciseCompleted` and `exerciseSkipped` (with the exercise's original name if it came with DeskFit, or just "custom" if you added it)
- `exercisePostponed`
- `exerciseHeld` (with whether it was held for a meeting or a locked screen)
- `badgeUnlocked` (with which badge)
- `settingsChanged` (with the name of the setting, never its value)
- `customExerciseAdded` (with the name you gave the exercise, see below)

When you add an exercise, its name is sent in lowercase once, so we can see which exercises people want that DeskFit doesn't include yet. It is sent as you typed it, so please keep personal details out of exercise names. A name is not sent if it is longer than 40 characters or contains anything other than letters, spaces, hyphens and apostrophes (so digits, email addresses and web addresses are left out). In that case only the fact that you added an exercise is sent. Renaming an exercise later sends nothing.

Every usage event also carries:

- the DeskFit version
- the macOS version, major and minor only (for example 15.2)
- a random session ID, new each launch
- a hashed install ID: a random identifier generated on your Mac and stored only as a one-way SHA-256 hash, so the ID itself cannot be traced back to you or your Mac

Crash reports, sent to Sentry:

- crashes
- hangs, where the app stops responding for more than 2 seconds
- release health sessions, so each version has a crash-free rate
- save-failure kinds: which store failed to save (for example progress), never the error text

A crash report includes:

- the stack trace, including thread names and the libraries DeskFit had loaded
- the DeskFit version and build, and the macOS version and build
- your Mac's model, processor architecture, memory figures and low power mode state
- your language and region setting (for example en_AR)
- a hashed identifier for your Mac, created by the crash reporting software, which lets reports from the same Mac be grouped. It stays the same if you turn diagnostics off and on again, and it is not the install ID described above
- recent DeskFit session states (for example running or snoozed), never exercise names
- your approximate location (city, region and country), which Sentry works out from your IP address when it receives a report

Error messages are replaced with "<redacted>".

## Update check

Checking for updates is manual only: DeskFit contacts GitHub's public API only when you choose "Check for Updates" in Settings. The request sends only the DeskFit version, in the User-Agent header. As with any web request, GitHub can see your IP address. No diagnostics data is included. GitHub's privacy statement: https://docs.github.com/site-policy/privacy-policies/github-general-privacy-statement

## What is never sent

- the steps you write for an exercise, or the new name when you rename one
- your files, or your user name: it is replaced in any file path in a stack trace
- your name or the computer name
- your IP address as part of a report: like any web request, sending one reveals it to the server. Sentry is configured not to store it, and uses it only for the approximate location above (see Update check for the GitHub request)
- screenshots or view hierarchies
- the contents of your settings, progress or streaks

## Turning it off

Diagnostics are on by default. You can turn them off in onboarding step 1, or later in Settings > General under "Share diagnostics".

Turning it off takes effect immediately and deletes:

- queued usage events that were not yet sent
- the install ID
- Sentry's local cache of crash reports waiting to be sent

DeskFit also deletes these again at the next launch before anything else runs, so data from before you turned it off is never sent.

Turning it on again resumes usage counts at once with a new install ID and a new session ID. If you turned it off since DeskFit started, crash reporting resumes the next time DeskFit starts. If DeskFit started with it off, crash reporting starts right away.

## Who processes the data

- TelemetryDeck, for usage counts: https://telemetrydeck.com/privacy/
- Sentry, for crash reports: https://sentry.io/privacy/

DeskFit does not sell data and has no advertising or other analytics.

## Data stored on your Mac

Your settings, exercise library, progress and streaks are stored only on your Mac, in:

`~/Library/Containers/com.francofalaschi.DeskFit/Data/Library/Application Support/DeskFit/v2/`

Delete the folder to remove them.

## Contact

Questions or requests: https://github.com/FFalaschi/deskfit-releases/issues
