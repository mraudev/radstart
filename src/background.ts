"use strict";
/* global __static */
declare const __static: string;
import {
   app,
   protocol,
   BrowserWindow,
   ipcMain,
   dialog,
   Rectangle,
   Tray,
   Menu,
} from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import path from "path";
import appSettings from "./classes/appSettings";
import { autoUpdater } from "electron-updater";
const isDevelopment: boolean = process.env.NODE_ENV !== "production";

process.env.FORCE_COLOR = "1";

// keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow;

// scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
   { scheme: "app", privileges: { secure: true, standard: true } },
]);

function getAppName(): string {
   return "RadStart";
}
function getAppTitle(): string {
   return getAppName() + " V" + app.getVersion();
}

function getAppIconPath(): string {
   return path.join(__static, "icon.png");
}

function checkSettingTrue(key: string) {
   if (appSettings.get(key) && appSettings.get(key) === true) {
      return true;
   }
   return false;
}
function getSkipIconInTaskbar(): boolean {
   return checkSettingTrue("skipIconInTaskbar");
}
function getMaximized(): boolean {
   return checkSettingTrue("maximized");
}

function getWindowBounds(): Rectangle {
   let bounds: any = appSettings.get("windowBounds");
   if (bounds) {
      return {
         x: bounds.x,
         y: bounds.y,
         width: bounds.width,
         height: bounds.height,
      };
   }
   return { x: 100, y: 100, width: 800, height: 600 };
}
process.env.ELECTRON_NODE_INTEGRATION;
function createWindow(): void {
   // create the browser window.
   win = new BrowserWindow({
      frame: false,
      title: getAppTitle(),
      webPreferences: {
         nodeIntegration: true,
      },
      icon: getAppIconPath(),
      minWidth: 800,
      minHeight: 600,
   });
   win.setBounds(getWindowBounds());

   if (getMaximized()) {
      win.maximize();
   }

   win.setMenuBarVisibility(false);

   win.setSkipTaskbar(getSkipIconInTaskbar());

   win.setThumbarButtons([]);

   if (process.env.WEBPACK_DEV_SERVER_URL) {
      // Load the url of the dev server if in development mode
      win.loadURL(process.env.WEBPACK_DEV_SERVER_URL);
      if (!process.env.IS_TEST) win.webContents.openDevTools();
   } else {
      createProtocol("app");
      // Load the index.html when not in development
      win.loadURL("app://./index.html");
      autoUpdater.checkForUpdatesAndNotify();
   }
   win.on("close", () => {
      appSettings.set("windowBounds", win.getNormalBounds() as any);
      appSettings.set("maximized", win.isMaximized() as any);
   });
   win.on("closed", () => {
      win.destroy();
   });

   ipcMain.handle("close-window", () => {
      win.close();
   });
   ipcMain.handle("maximize-window", () => {
      if (win.isMaximized()) {
         win.unmaximize();
      } else {
         win.maximize();
      }
   });
   ipcMain.handle("minimize-window", () => {
      win.setSkipTaskbar(true);
      win.minimize();
   });

   ipcMain.handle("get-window-title", async () => {
      return win.title;
   });
   ipcMain.handle("get-window-icon", async () => {
      return getAppIconPath();
   });
   ipcMain.handle("get-window-maximized", async () => {
      return win.isMaximized();
   });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
   // On macOS it is common for applications and their menu bar
   // to stay active until the user quits explicitly with Cmd + Q
   if (process.platform !== "darwin") {
      app.quit();
   }
});

app.on("activate", () => {
   // On macOS it's common to re-create a window in the app when the
   // dock icon is clicked and there are no other windows open.
   if (win === null) {
      createWindow();
      app.setAppUserModelId("mrau.radstart");
   }
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
let tray: Electron.Tray;
app.on("ready", async () => {
   tray = new Tray(getAppIconPath());
   tray.setTitle(getAppName());
   tray.setToolTip(getAppName());

   tray.on("double-click", async function() {
      if (win.isMinimized()) {
         win.setSkipTaskbar(getSkipIconInTaskbar());
         win.restore();
      } else {
         win.setSkipTaskbar(true);
         win.minimize();
      }
   });
   tray.on("click", async function() {
      if (win.isMinimized()) {
         win.setSkipTaskbar(getSkipIconInTaskbar());
         win.restore();
      } else {
         win.restore();
      }
   });

   const menu = Menu.buildFromTemplate([
      {
         label: "Beenden",
         click() {
            app.quit();
         },
      },
   ]);
   tray.setContextMenu(menu);

   createWindow();
});

app.on("before-quit", function(evt) {
   tray.destroy();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
   if (process.platform === "win32") {
      process.on("message", data => {
         if (data === "graceful-exit") {
            app.quit();
         }
      });
   } else {
      process.on("SIGTERM", () => {
         app.quit();
      });
   }
}

ipcMain.handle("show-directory-dialog", async (event, defaultPath) => {
   return dialog.showOpenDialogSync({
      defaultPath: defaultPath,
      properties: ["openDirectory"],
   });
});

ipcMain.handle("show-file-dialog", async (event, defaultPath) => {
   return dialog.showOpenDialogSync({
      defaultPath: defaultPath,
      properties: ["openFile"],
   });
});

ipcMain.handle("setShowIconInTaskbar", async (event, showIcon) => {
   win.setSkipTaskbar(!showIcon);
});
