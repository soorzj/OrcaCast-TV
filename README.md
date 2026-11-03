<img width="1097" height="119" alt="image" src="https://github.com/user-attachments/assets/27be1767-253d-45e3-bee9-7dbf5bbc76aa" />


> A living-room-friendly web launcher for Windows, with a phone remote, TV-style navigation, and voice input.

[![Release](https://img.shields.io/badge/release-source-4f8cff)](../../releases)
[![License](https://img.shields.io/badge/license-MIT-5ee0a0)](LICENSE)
[![Windows](https://img.shields.io/badge/platform-Windows-0078D4?logo=windows&logoColor=white)](#requirements)

<img width="1917" height="1078" alt="image" src="https://github.com/user-attachments/assets/c2cbd170-a9be-4da5-9428-126a82a0a744" />

***



Ever owned a extra monitor or a LED TV which you want to set up as a TV in your room? Ever ordered a TV or a 4k projector and realised it doesnt come with any software? Then OrcaCast is just for you. OrcaCast TV is open source TV Software simulations whic turns a Windows PC connected to a TV into a simple, remote-controlled entertainment hub. Launch web apps from a 10-foot interface, control them with a keyboard or phone, and keep the PC hidden behind a TV-friendly home screen.

> **Status:** OrcaCast TV is currently distributed as a open-source Windows desktop application.
> The project is under active development and has many bugs and certain features do not work and the interface may change between releases.

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Install a release](#install-a-release)
- [Build from source](#build-from-source)
- [First launch](#first-launch)
- [Phone remote](#phone-remote)
- [Keyboard shortcuts](#keyboard-shortcuts)
- [Configuration and data](#configuration-and-data)
- [Widevine and protected playback](#widevine-and-protected-playback)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Security and privacy](#security-and-privacy)
- [Contributing](#contributing)
- [License](#license)

## Features

- **TV-first home screen** with large app tiles and simple keyboard navigation.
- **Web app launcher** with YouTube TV preconfigured, plus Netflix, Prime Video,
  Spotify, and Twitch.
- **Phone remote** with QR/PIN pairing, directional controls, playback controls,
  volume, power, mouse/touchpad input, live typing, and app management.
- **Voice input** through Windows speech recognition and a phone browser's
  speech-recognition support.
- **Wallpaper controls** for themes, random photos, local images, image URLs,
  and uploads from the phone.
- **Configurable shortcuts** that work on the home screen and inside launched apps.
- **Optional Windows startup** and a user extensions folder for unpacked extensions.
- **Local-network discovery** using Bonjour/mDNS when available, with an HTTP
  fallback for remote commands.

## Requirements

- Windows 10 or later.
- Node.js 18 or newer for development and building.
- A Windows PC connected to the TV by HDMI for the full-screen experience.
- A phone and PC on the same local network for the phone remote.

OrcaCast TV opens websites inside Electron. Availability, sign-in requirements,
playback quality, and supported controls are determined by each service.

## Install a pre-built release

1. Download the latest installer from
   [GitHub Releases](../../releases).
3. Run `OrcaCast TV Setup <version>.exe`.
4. Allow the installer to add the OrcaCast TV Windows Firewall rules when prompted.
   These rules allow the phone remote to reach the PC on the local network.
5. Start OrcaCast TV and connect the PC to the TV with HDMI.

## Install a nightly build

1. Download the latest source code from this repositroy 
   [GitHub Releases](https://github.com/soorzj/OrcaCast-TV/archive/refs/heads/main.zip).
3. Run `OrcaCast TV Setup <version>.exe`.
4. Allow the installer to add the OrcaCast TV Windows Firewall rules when prompted.
   These rules allow the phone remote to reach the PC on the local network.
5. Start OrcaCast TV and connect the PC to the TV with HDMI.


The portable build can be used without installing the application, but the
installer is recommended because it configures the firewall automatically.

## Build from source

Clone the repository, install dependencies, and start the development app:

```powershell
git clone <repository-url>
cd orcacast-tv
npm install
npm start
```

Create the Windows installer and portable executable:

```powershell
npm run dist
```

The generated files are written to `dist\`. You can also double-click
[`build.bat`](build.bat), which runs the install and distribution steps for you.

For windowed testing, launch the packaged executable with:

```powershell
OrcaCast TV.exe --windowed
```

## First launch

1. Start OrcaCast TV. The splash screen opens the lock screen and then the home screen.
2. Select an app tile, or use the keyboard shortcuts below.
3. Open **Settings > Phone remote** to display the QR code, local URL, and pairing PIN.
4. Scan the QR code with a phone on the same Wi-Fi network.
5. If the phone cannot connect, choose **Fix phone connection (firewall)** in the
   same settings panel and approve the Windows elevation prompt.

## Phone remote

The phone remote is served directly by the TV application; no cloud account or
companion app is required. It provides:

| Tab | Controls |
| --- | --- |
| **Remote** | Direction pad, OK, back, home, exit, playback, volume, lock, settings, and power |
| **Mouse** | Touchpad pointer movement, click, and two-finger scrolling |
| **Type** | Search/open commands, live keyboard input, and voice input |
| **Apps** | Add a website tile, choose a thumbnail, and upload a wallpaper |

The remote uses a four-digit PIN and only accepts commands that include the current
PIN. Keep the PIN private while the app is running. The server is intended for a
trusted home network, not the public internet.

## Keyboard shortcuts

| Key | Action |
| --- | --- |
| `Esc` | Back |
| Hold `Esc` | Exit the app |
| `Home` | Return home and keep the app available to resume |
| Hold `Home` | Exit the app |
| `+` / `-` | Volume up / down |
| `*` | Mute |
| `/` | Power on / off |
| `=` | Open settings |
| `]` | Lock / unlock |
| `Page Up` / `Page Down` | Play / pause |
| `End` | Stop |
| `<` / `>` | Rewind / forward 10 seconds |
| `\` | Voice input |

Shortcut keys are ignored while typing in a text box. The complete list is also
available in **Settings > Shortcuts**.

## Configuration and data

OrcaCast TV stores its configuration and local data in Electron's per-user
`userData` directory. This includes:

- `config.json` for app tiles, theme, pairing state, and preferences.
- `wallpaper.jpg` for a locally selected or uploaded wallpaper.
- `extensions\` for unpacked extensions.
- `orcacast.log` for troubleshooting logs.

Use **Settings > System** to open the extensions and log folders. Do not put
untrusted extensions in the extensions folder: they run inside the application
environment.

## Widevine and protected playback

Some streaming services require Widevine DRM. The standard Electron build may
not provide the required DRM support. If protected playback does not work, use a
compatible Electron distribution such as the Castlabs ECS build and verify that
its licensing terms permit your use and redistribution.

OrcaCast TV does not bypass DRM, authentication, regional restrictions, or any
service's terms of use.

## Troubleshooting

### The phone cannot connect

- Confirm that both devices are on the same Wi-Fi network.
- Do not use a guest network with client/AP isolation enabled.
- Approve the Windows Firewall prompt.
- Open **Settings > Phone remote > Fix phone connection (firewall)**.
- Use the URL shown on the TV rather than a cached or old URL.
- If port `8787` is busy, OrcaCast TV tries the next ports through `8799`.

### Voice input does not work

Enable **Settings > Privacy > Microphone > Let desktop apps access your
microphone** in Windows. Install an English speech pack if Windows speech
recognition reports that one is missing. You can also use the Type tab on the
phone remote.

### Playback keys do not work in a website

Playback and seeking are sent to the page's active `<video>` or `<audio>` element.
Services such as Netflix, Prime Video, Disney+, and Hotstar may implement their
own controls, and media inside an iframe may not receive the keys.

### A website or extension behaves unexpectedly

Open the log folder from **Settings > System > Open log folder**, then attach
relevant log details when [opening an issue](../../issues).
Never include cookies, authentication tokens, or private network details.

## Development

The application is a small Electron project with these entry points:

| File | Purpose |
| --- | --- |
| [`main.js`](main.js) | Electron main process, app browser, local remote server, pairing, and IPC |
| [`index.html`](index.html) | TV home screen and settings UI |
| [`remote.html`](remote.html) | Mobile remote UI |
| [`osd.html`](osd.html) | On-screen display overlay |
| [`installer.nsh`](installer.nsh) | NSIS firewall install/uninstall hooks |

Useful commands:

```powershell
npm start       # Run the app locally
npm run dist    # Build NSIS and portable Windows packages
```

Before submitting a change, test both a keyboard-only flow and the phone remote
on a real local network. Changes that affect firewall rules, remote commands,
web content, or file uploads should include a clear security and compatibility
note in the pull request.

## Security and privacy

- The phone remote is local-network-only by design and is not an internet service.
- Commands are authenticated with the displayed four-digit PIN.
- Voice input on the PC uses Windows speech recognition; review Windows privacy
  and speech settings for your desired data handling.
- Launched websites can receive their own cookies, login data, and network access.
- Do not expose ports `8787`-`8799` to the public internet.

To report a security vulnerability, please do not open a public issue with
exploit details. Contact the repository owner privately first.

## Contributing

Contributions are welcome. Please:

1. Open an issue describing the problem or proposed change.
2. Keep changes focused and compatible with the Windows TV experience.
3. Test the affected keyboard, remote, and installer paths.
4. Update this README when user-visible behavior changes.
5. Open a pull request with reproduction steps and test results.

## License

OrcaCast TV is available under the [MIT License](LICENSE).

The MIT License applies to this repository's original source code. Electron,
`bonjour-service`, `qrcode`, `ws`, websites launched by the app, and any
third-party extensions remain subject to their own licenses and terms.
