<img width="1097" height="119" alt="image" src="https://github.com/user-attachments/assets/27be1767-253d-45e3-bee9-7dbf5bbc76aa" />

***

[![Release](https://img.shields.io/badge/latest%20release-1.3.0%20beta-4f8cff)](../../releases)
[![Last](https://img.shields.io/badge/last%20updated-4%20November%202026-ff00c3)](../../releases)
[![License](https://img.shields.io/badge/license-MIT-5ee0a0)](LICENSE)
[![Windows](https://img.shields.io/badge/platform-Windows-0078D4?logo=data:image%2Fsvg%2Bxml%3Bbase64%2CPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI%2BPHBhdGggZmlsbD0iI2ZmZiIgZD0iTTEgNC4yIDEwIDN2OEgxem0xMC0xLjQgMTItMS43VjExSDExek0xIDEyaDl2OEwxIDE4Ljh6bTEwIDBoMTJ2MTAuOUwxMSAyMXoiLz48L3N2Zz4%3D)](#requirements)
[![made](https://img.shields.io/badge/made%20using-Claude%20Code-D77757?logo=claude&logoColor=white)](#requirements)
![Hits](https://img.shields.io/endpoint?url=https%3A%2F%2Fhits.dwyl.com%2Fsoorzj%2FOrcaCast-TV.json&style=rounded-square&label=hits)

  <img alt="Electron" src="https://img.shields.io/badge/Electron-47848F?style=for-the-badge&logo=electron&logoColor=white" />  <img alt="Node.js" src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white" />  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" />  <img alt="HTML5" src="https://img.shields.io/badge/HTML5_Electron-E34F26?style=for-the-badge&logo=html5&logoColor=white" />  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" />  <img alt="hls.js" src="https://img.shields.io/badge/hls.js-FF6B35?style=for-the-badge" />
        

Ever owned a extra monitor or a LED TV which you want to set up as a TV in your room? Ever ordered a TV or a 4k projector and realised it doesnt come with any software? Then OrcaCast is just for you. OrcaCast TV is open source TV Software simulations whic turns a Windows PC connected to a TV into a simple, remote-controlled entertainment hub. Launch web apps from a 10-foot interface, control them with a keyboard or phone, and keep the PC hidden behind a TV-friendly home screen. OrcaCast TV is currently distributed as a open-source Windows desktop application. The project is under active development and has many bugs and certain features do not work and the interface may change between releases.

# Latest Release
### Latest Release 1.3.0 here: <br><br>
[<img width="400" height="45" alt="image" src="https://github.com/user-attachments/assets/20ff8565-33a1-47e1-ba23-e69b06b30005" />](https://github.com/soorzj/OrcaCast-TV/releases/tag/1.3.0-beta)
<br><br>

> #### Changelog
> * Added Online Radio Station Player
> * Added Online TV Stream Player

<br>

> #### Issues
> * Some Text in YouTube at certain areas still have a absurd black background. Others have been fixed.
> * The Remote on mobile is still not working, despite giving firewall permissions.


# Older Releases
### Release 1.2.0 here: <br><br>
[<img width="400" height="45" alt="image" src="https://github.com/user-attachments/assets/b884c688-c1c9-4ec0-83bd-5b51d03102f2" />](https://github.com/soorzj/OrcaCast-TV/releases/tag/1.2.0-beta)
> #### Changelog
> * Initial Release after development and testing on local machine
> * Added Youtube for TV to spoof TizenOS
> * Added other apps like Spotify, Amazon Prime, Netflix and Twitch
> * Added ability to change wallpapers
> * Added Liquid animations
> * Added keybinds and global listeners
> * Added ability to add chromium unpacked extensions

<br>

> #### Issues
> * Youtube App exiitng at times cuases crashes
> * Text in YouTube at certain areas have a absurd black background
> * Exiting to home screen while keeping an app open and returning to it crashed the app
> * The Remote on mobile is not working, despite giving firewall permissions.

<br><br><br><br>

# About OrcaCast TV

<h2>Preview</h2>

<img width="1657" height="714" alt="home" src="https://github.com/user-attachments/assets/25ffe780-8081-44b5-a245-662e23f8acbd" />

## Contents

- [Features](#features)
- [Requirements](#requirements)
- [Install a release](#install-a-prebuilt-release)
- [Install a nightly release](#install-a-nightly-build)
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

## Install a prebuilt release

1. Download the latest installer from
   [GitHub Releases](../../releases).
3. Run `OrcaCast TV Setup <version>.exe`.
4. Select to location to install (Recommended `C://Program Files/`)
5. Allow the installer to add the OrcaCast TV Windows Firewall rules when prompted.
   These rules allow the phone remote to reach the PC on the local network.
6. Start OrcaCast TV using the shortcut on the desktop and connect the PC to the TV or Projector with HDMI.

## Install a nightly build

1. Download the latest source code from this repository [GitHub Releases](https://github.com/soorzj/OrcaCast-TV/archive/refs/heads/main.zip).
   Click on the green `Code<>` Button in the repository and click `Download ZIP` option in the bottom
   
3. Navigate to the downloaded `.zip` and extract it using a extractor like WinRAR or 7Z
4. Navigate to the extracted files and open the `build.bat`, click run if safety net is triggered.
5. Let the Node js make the installer
6. After Node js finishes, open a `dist` folder have been created. Open it and run `OrcaCast TV Setup 1.2.0.exe`.
7. If SmartScreen is triggered, click on `More Options` and click on `Run Anyway`
8. Allow the installer to install OrcaCast TV add the OrcaCast TV Windows Firewall rules when prompted.
   These rules allow the phone remote to reach the PC on the local network.
9. Start OrcaCast TV and connect the PC to the TV with HDMI.


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

## Adding Apps
<img width="425" height="307" alt="image" src="https://github.com/user-attachments/assets/22908107-948e-4893-aae5-a1e20ed1c640" />

## Changing Wallpapers
<img width="425" height="307" alt="image" src="https://github.com/user-attachments/assets/d334408e-2be5-4838-88d3-3e098cca5524" />

## Connecting the phone remote
<img width="425" height="307" alt="image" src="https://github.com/user-attachments/assets/670a5ed1-638b-404c-a27e-8213e433b63e" />




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

### The Remote Doesnt Work
I'm working on a fix, it doesnt seem to work equally on all devices

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
