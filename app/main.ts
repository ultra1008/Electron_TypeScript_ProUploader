import * as fs from 'fs';
import * as path from 'path';
import {
  app,
  BrowserWindow,
  clipboard,
  ipcMain,
  shell,
  screen
} from 'electron';
import { imageSize } from 'image-size';

let myWindow: BrowserWindow = null;
const args = process.argv.slice(1);
const serve = args.some(val => val === '--serve');
const dev = args.some(arg => arg === '--dev');

function createWindow(): BrowserWindow {
  const electronScreen = screen;
  const size = electronScreen.getPrimaryDisplay().workAreaSize;

  myWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: size.width,
    height: size.height,
    resizable: true,
    center: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: __dirname + '/preload.js'
    },
    show: false
  });

  myWindow.setMenu(null);

  if (serve) {
    const debug = require('electron-debug');
    debug();

    require('electron-reloader')(module);
    myWindow.loadURL('http://localhost:4200');
  } else {
    // Path when running electron executable
    let indexPath = './pro-uploader/index.html';

    if (fs.existsSync(path.join(__dirname, '../dist/pro-uploader/index.html'))) {
      // Path when running electron in local folder
      indexPath = '../dist/pro-uploader/index.html';
    }

    myWindow.loadFile(path.join(__dirname, indexPath));
  }

  if (dev) {
    // open dev tools for debugging
    myWindow.webContents.openDevTools();

    // open maximized
    myWindow.maximize();
  }

  // Emitted when the window is closed.
  myWindow.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    myWindow = null;
  });

  myWindow.show();

  return myWindow;
}

try {
  const additionalData = { myKey: 'PRO Uploader' };
  const gotTheLock = app.requestSingleInstanceLock(additionalData);
  
  if (!gotTheLock) {
    app.quit();
  } else {
    app.on('second-instance', (event, commandLine, workingDirectory, additionalData) => {
      // Print out data received from the second instance.
      console.log(additionalData);
  
      // Someone tried to run a second instance, we should focus our window.
      if (myWindow) {
        if (myWindow.isMinimized()) {
          myWindow.restore();
        }
        myWindow.focus();
      }
    });
  
    // Create myWindow, load the rest of the app, etc...
    app.whenReady().then(() => {
      myWindow = createWindow();
    });
  
    app.on('window-all-closed', () => {
      // On OS X it is common for applications and their menu bar
      // to stay active until the user quits explicitly with Cmd + Q
      if (process.platform !== 'darwin') {
        app.quit()
        myWindow = null;
      }
    });
  
    app.on('activate', () => {
      // On OS X it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) {
        myWindow = createWindow()
      }
    });
  }
} catch (e) {
}

ipcMain.handle("app:getInfo", (event) => {
  return {
    name: app.getName(),
    version: app.getVersion(),
  };
});

ipcMain.handle("app:readFile", (event, path) => {
  return new Promise((resolve, reject) => {
    //console.log(`reading file ${path}`);
    fs.readFile(path, (error, data) => {
      if (error) {
        return resolve(error);
      }

      const info = imageSize(data);
      //console.log(info);
      return resolve({ data, info });
    });
  });
});

ipcMain.on("app:copyToClipboard", (event, text) => {
  clipboard.writeText(text);
});

ipcMain.on("app:openExternal", (event, url) => {
  shell.openExternal(url);
});

