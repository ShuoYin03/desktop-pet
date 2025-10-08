import { app, BrowserWindow } from 'electron';
import path from 'node:path';

const isDev = process.env.NODE_ENV === 'development';

async function createWindow(): Promise<void> {
  const window = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    transparent: true,
    resizable: false,
    webPreferences: {
      preload: path.join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false
    }
  });

  if (isDev) {
    await window.loadURL('http://localhost:5173');
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    await window.loadFile(path.join(__dirname, '../renderer/index.html'));
  }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    void createWindow();
  }
});
