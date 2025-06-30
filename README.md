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

#### Future iterations will aim to have a dmg installer

Made through planning!