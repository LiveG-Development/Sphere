// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

const {app, BrowserWindow, BrowserView, ipcMain} = require("electron");
const minimist = require("minimist");
const path = require("path");
const nodeConsole = require("console");
const help = require("./help.js");

function generateKey(length = 16, digits = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_") {
    var key = "";

    for (var i = 0; i < length; i++) {
        key += digits.charAt(Math.floor(Math.random() * digits.length));
    }

    return key;
}

global.VERSION_NUMBER = "0.1.0";
global.CURRENT_DIRECTORY = __dirname;

global.arguments = minimist(process.argv, {
    alias: {h: "help"}
});

global.console = new nodeConsole.Console(process.stdout, process.stderr);

global.messageSphereKey = generateKey();
global.tabspaceHeight = 104;
global.newTabID = -1;

global.tabInformation = {
    events: []
};

global.newTab = function(window, url, privasphere, newTabCallback = function() {}) {
    global.newTabID++;

    var tab = new BrowserView({
        webPreferences: {
            nodeIntegration: false,
            nodeIntegrationInSubFrames: false,
            nodeIntegrationInWorker: false,
            enableRemoteModule: true,
            contextIsolation: true,
            preload: path.join(__dirname, "preload.js"),
            devTools: false,
            nativeWindowOpen: false,
            partition: privasphere ? "privasphere" : undefined
        }
    });

    tab.webContents.on("new-window", function(event, url) {
        event.preventDefault();

        newTabCallback(event, url);
    });

    tab.setBounds({x: 0, y: global.tabspaceHeight, width: window.getContentSize()[0], height: window.getContentSize()[1] - global.tabspaceHeight});
    tab.setBackgroundColor("#ffffff");
    tab.webContents.setVisualZoomLevelLimits(1, 3);
    tab.webContents.zoomFactor = 1;
    tab.webContents.loadURL(url);

    return {tab: tab, id: global.newTabID};
};

global.setTabspaceHeight = function(height) {
    global.tabspaceHeight = height;
};

global.setFullscreen = function(window, state = true) {
    window.setFullScreen(state);
    window.setMenuBarVisibility(false); // Force menu bar to hide, especially when exiting fullscreen
};

global.newWindow = function() {
    global.mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        fullscreenable: true,
        webPreferences: {
            title: "Sphere",
            nodeIntegration: true,
            enableRemoteModule: true,
            devTools: global.arguments["debug"] ? true : false
        },
        useContentSize: true
    });

    global.mainWindow.removeMenu();
    global.mainWindow.setMenuBarVisibility(false);

    global.mainWindow.loadFile(path.join("sphere", "build", "tech.liveg.sphere-" + global.VERSION_NUMBER + ".html"));

    global.mainWindow.on("closed", function() {
        global.mainWindow = null;
    });

    if (global.arguments["debug"]) {
        global.mainWindow.webContents.openDevTools();
    }
}

if (global.arguments["help"] || process.argv.indexOf("/?") > -1) {
    global.console.log(
        help()
            .replace(/{{ version }}/g, global.VERSION_NUMBER)
            .replace(/{{ sphereMark }}/g, "\x1b[34mSphere\x1b[39m")
    );

    process.exit();
} else {
    app.userAgentFallback = app.userAgentFallback
        .replace("Electron/" + process.versions.electron, "")
        .replace("sphere/" + global.VERSION_NUMBER, "Sphere/" + global.VERSION_NUMBER)
    ;

    app.on("ready", function() {
        ipcMain.on("_sphereTab", function(event, message) {
            if (message.event != null) {
                global.tabInformation.events.push(message);
            }
        });

        global.newWindow();
    });

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
        
        if (global.mainWindow == null) {
            global.newWindow();
        }
    });
}