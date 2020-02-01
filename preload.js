// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

const {remote, ipcRenderer, contextBridge} = require("electron");
const path = require("path");
const fs = require("fs");

const id = remote.getGlobal("newTabID");

var storagePath = "";
var userData = {};

process.once("loaded", function() {
    // Sending messages from Sphere to the tab

    ipcRenderer.on("_sphereBookmarks", function(event, message) {
        _sphereBookmarks = message;
    });
});

contextBridge.exposeInMainWorld("_sphere", {
    send: function(data) {
        if (data._sphereKey == remote.getGlobal("messageSphereKey")) {
            if (data.type == "bookmarks") {
                window.postMessage({
                    type: "_sphereBookmarks",
                    data: userData.bookmarks || []
                }, "*");
            } else if (data.type == "newBookmark") {
                userData.bookmarks = [...(userData.bookmarks || []), data.bookmark];

                fs.writeFileSync(storagePath, JSON.stringify(userData));
            } else {
                ipcRenderer.send("_sphereTab", data);
            }
        }
    }
});

storagePath = path.join(remote.app.getPath("userData"), "userData.json");
userData = JSON.parse(fs.readFileSync(storagePath));