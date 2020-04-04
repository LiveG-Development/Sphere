// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

var fullscreen = {
    _normalTabspaceHeight: remote.getGlobal("tabspaceHeight"),

    isFullscreen: false
};

/*
    @name fullscreen.enter

    @shortDescription Enter fullscreen, hiding Sphere's main UI.
*/
fullscreen.enter = function() {
    fullscreen.isFullscreen = true;

    fullscreen._normalTabspaceHeight = remote.getGlobal("tabspaceHeight");

    remote.getGlobal("setFullscreen")(remote.getCurrentWindow(), true);
    remote.getGlobal("setTabspaceHeight")(0);

    rewriteScreen();
    ui.refresh();
};

/*
    @name fullscreen.leave

    @shortDescription Leave fullscreen, showing Sphere's main UI.
*/
fullscreen.leave = function() {
    fullscreen.isFullscreen = false;

    remote.getGlobal("setFullscreen")(remote.getCurrentWindow(), false);
    remote.getGlobal("setTabspaceHeight")(fullscreen._normalTabspaceHeight);

    rewriteScreen();
    ui.refresh();
};