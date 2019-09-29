// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

const {app, BrowserWindow} = require("electron");

const VERSION_NUMBER = "0.1.0";

var mainWindow;

function newWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600
    });

    mainWindow.loadFile("sphere/build/tech.liveg.sphere-" + VERSION_NUMBER + ".html");

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