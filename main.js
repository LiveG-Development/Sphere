// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

const {app, BrowserWindow, BrowserView} = require("electron");

const VERSION_NUMBER = "0.1.0";
const TABSPACE_HEIGHT = 80;

var mainWindow;
var browser;
var resizeInterval;

function newWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        fullscreenable: false,
        webPreferences: {
            nodeIntegration: true,
            devTools: false
        }
    });

    mainWindow.removeMenu();
    mainWindow.setMenuBarVisibility(false);

    mainWindow.loadFile("sphere/build/tech.liveg.sphere-" + VERSION_NUMBER + ".html");

    mainWindow.on("closed", function() {
        mainWindow = null;
    });

    browser = new BrowserView();

    mainWindow.setBrowserView(browser);

    browser.setBounds({x: 0, y: TABSPACE_HEIGHT, width: 1200, height: 800 - TABSPACE_HEIGHT});
    browser.webContents.loadURL("https://opensource.liveg.tech/Adapt-UI/tests/all/build/tech.liveg.opensource.allTests-0.1.0.html?lang=en_GB");

    resizeInterval = setInterval(function() {
        if (mainWindow != null) {
            var size = mainWindow.getSize();
            
            browser.setBounds({x: 0, y: TABSPACE_HEIGHT, width: size[0], height: size[1] - TABSPACE_HEIGHT});
        } else {
            clearInterval(resizeInterval);
        }
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