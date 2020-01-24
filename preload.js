// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

const {remote, ipcRenderer} = require("electron");

const id = remote.getGlobal("newTabID");

process.once("loaded", function() {
    window.addEventListener("message", function(event) {
        if (event.data._sphereKey == remote.getGlobal("messageSphereKey")) {
            ipcRenderer.send("_sphereTab", event.data);
        }
    });
});