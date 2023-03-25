const { app, ipc, BrowserWindow } = require('electron');
const path = require('path');
const ipcMain = require('electron').ipcMain;
const electron = require('electron')

const nativeImage = require('electron').nativeImage;
var image = nativeImage.createFromPath(path.join(__dirname, '../tk.png')); 
 // where public folder on the root dir
image.setTemplateImage(true);

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

let window;

function createWindow() {
  const win = new BrowserWindow({
      show: false,
      icon: image,
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
          //devTools: false,
      }
  });
  //win.setIcon(path.join(__dirname, '/tk.png'));
  win.maximize();
  return win;
}

function showUserLoginWindow() {
  window.loadFile(path.join(__dirname, '/user/login.html'))
      .then(() => { window.show(); })
}

function showUserHomeWindow() {
  window.loadFile(path.join(__dirname, '/user/index.html'))
      .then(() => { window.show(); })
}

function showNewWindow(msg, data, dir) {
  app.quit();
  window = createWindow();
  window.loadFile(path.join(__dirname, dir)) 
      .then(() => { 
        window.webContents.send(msg, data);
        window.show(); })
}

function showLoadWindow() {
  window.loadFile(path.join(__dirname, 'load.html'))
      .then(() => { window.show(); })
}

function showTestWindow(page) {
  window.loadFile(path.join(__dirname, page))
      .then(() => { window.show(); })
}


app.on('ready', () => {
  window = createWindow();
  showUserLoginWindow();
  //showUserHomeWindow();
  //showTestWindow('/user/program.html');
});


app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});


// in main process, outside of app.on:
ipcMain.on('changeWindow', (event, arg) => {
    //mainWindow.loadURL(arg);
    let win = new BrowserWindow({width:800, height:600, icon: image,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        enableRemoteModule: true,
        devTools: false,
      }});
    //win.setIcon(path.join(__dirname, '/tk.png'));
    win.maximize();
    win.loadFile(path.join(__dirname, arg + '.html'));
});

ipcMain.on('message:home', (event, session) => {
  showUserHomeWindow();
});

ipcMain.on('message:load', (event, session) => {
  showLoadWindow();
});

ipcMain.on('userlogin', function(event, x) {
  showNewWindow('userlogin', x, '/user/index.html');
});

ipcMain.on('loadProgress', function(event, x) {
  showNewWindow('loadProgress', x, '/user/program.html');
});

ipcMain.on('message:close', (event, session) => {
  app.quit();
});