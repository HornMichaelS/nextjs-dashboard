const { app, BrowserWindow } = require("electron");
const path = require("path");

import('electron-serve').then((serve) => {
    const appServe = app.isPackaged ? serve({
        directory: path.join(__dirname, "out")
    }) : null;
      
    const createWindow = () => {
        const win = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                preload: path.join(__dirname, "preload.js")
            }
        });
        
        if (app.isPackaged) {
            appServe(win).then(() => {
                win.loadURL("app://-");
            });
        } else {
            win.loadURL("http://localhost:3000");
            win.webContents.openDevTools();
            win.webContents.on("did-fail-load", (e, code, desc) => {
                win.webContents.reloadIgnoringCache();
            });
        }
    }
    
    app.whenReady().then(() => {
        createWindow();
    });
    
    app.on("window-all-closed", () => {
        if (process.platform !== "darwin") {
            app.quit();
        }
    });
});
