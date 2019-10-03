// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

const {app, BrowserWindow, BrowserView} = require("electron");

global.VERSION_NUMBER = "0.1.0";
global.TABSPACE_HEIGHT = 104;

global.newTab = function(url) {
    var tab = new BrowserView();

    tab.setBounds({x: 0, y: global.TABSPACE_HEIGHT, width: mainWindow.getSize()[0], height: mainWindow.getSize()[1] - global.TABSPACE_HEIGHT});
    tab.webContents.loadURL(url);

    return tab;
};

var mainWindow;

function newWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        fullscreenable: false,
        webPreferences: {
            title: "Sphere",
            nodeIntegration: true,
            devTools: false
        }
    });

    mainWindow.removeMenu();
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadFile("sphere/build/tech.liveg.sphere-" + global.VERSION_NUMBER + ".html");

    mainWindow.on("closed", function() {
        mainWindow = null;
    });
}

app.on("ready", newWindow);

// When all windows of Sphere are closed, this function is triggered
app.on("window-all-closed", function() {
    // On macOS, the window should stay alive when all windows are closed for
    // easy access from the dock and menu bar
    if (process.platform != "darwin") {
        app.quit();
    }
});

app.on("activate", function() {
    // On macOS, a new window should be created if there already isn't a window
    // open so that the user is not confused by switching to a windowless app
    if (mainWindow == null) {
        newWindow();
    }
});