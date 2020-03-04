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

function getUserData() {
    userData = JSON.parse(fs.readFileSync(storagePath));
}

function saveUserData() {
    fs.writeFileSync(storagePath, JSON.stringify(userData));
}

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
            } else if (data.type == "favicons") {
                window.postMessage({
                    type: "_sphereFavicons",
                    data: userData.favicons || {}
                });
            } else if (data.type == "newBookmark") {
                getUserData();

                userData.bookmarks = [...(userData.bookmarks || []), data.bookmark];

                saveUserData();
            } else if (data.type == "deleteBookmark") {
                getUserData();

                userData.bookmarks.splice(data.bookmarkID, 1);

                saveUserData();
            } else if (data.type == "setUserData") {
                getUserData();

                userData = data.userData;

                saveUserData();
            } else if (data.type == "getUserData") {
                getUserData();

                window.postMessage({
                    type: "_sphereUserData",
                    data: userData || {}
                });
            } else {
                ipcRenderer.send("_sphereTab", data);
            }
        }
    }
});

storagePath = path.join(remote.app.getPath("userData"), "userData.json");

getUserData();