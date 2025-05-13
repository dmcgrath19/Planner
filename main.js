const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

// Detect the platform and set the appropriate icon format
function getIconPath() {
  const iconBasePath = path.join(__dirname, 'assets');
  switch (process.platform) {
    default:
      return path.join(iconBasePath, 'icon.png');  // Default to PNG
  }
}

function createWindow () {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: getIconPath()
  });

  win.loadFile('views/taskEntry.html');
}

app.whenReady().then(() => {
  // Set the Dock icon on macOS
  if (process.platform === 'darwin') {
    const dockIcon = nativeImage.createFromPath(getIconPath());
    app.dock.setIcon(dockIcon);
  }

  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
