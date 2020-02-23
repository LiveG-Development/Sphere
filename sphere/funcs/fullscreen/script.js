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

    isFullscreen: false,

    enter: function() {
        fullscreen.isFullscreen = true;

        fullscreen._normalTabspaceHeight = remote.getGlobal("tabspaceHeight");

        remote.getGlobal("setFullscreen")(true);
        remote.getGlobal("setTabspaceHeight")(0);

        rewriteScreen();
        ui.refresh();
    },

    leave: function() {
        fullscreen.isFullscreen = false;

        remote.getGlobal("setFullscreen")(false);
        remote.getGlobal("setTabspaceHeight")(fullscreen._normalTabspaceHeight);
    
        rewriteScreen();
        ui.refresh();
    }
};