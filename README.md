## Planner

This will break down tasks into your day so you have a plan to conquer them.

**A *plan* of *attack* is vital to success**

---

## Setup & Build Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) installed (v16 or higher recommended)  
- npm (comes bundled with Node.js)

### Install dependencies

```bash
npm install
```
Package the app

```bash
npx electron-packager . Planner --platform=darwin --overwrite
```
This will create a macOS app bundle in a folder named like Planner-darwin-arm64 or Planner-darwin-x64 depending on your Mac architecture.

Run the packaged app
From Finder, open the .app file inside the generated folder, e.g.:
/path/to/Planner-darwin-arm64/Planner.app
Or run via terminal:
```bash
open /path/to/Planner-darwin-arm64/Planner.app
```

Notes

By default, the app packages for your current Mac architecture (arm64 for M1, x64 for Intel).

To target a specific architecture, use the --arch flag with electron-packager:
npx electron-packager . Planner --platform=darwin --arch=arm64 --overwrite

To create a .dmg installer for easier distribution, consider using electron-builder.


Made through planning!