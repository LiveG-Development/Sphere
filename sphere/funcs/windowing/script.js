// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

var windowing = {
    isWindowed: false
};

/*
    @name windowing.init

    @shortDescription Activate windowing mode, if applicable.
*/
windowing.init = function() {
    if (remote.getGlobal("arguments")["window"]) {
        windowing.isWindowed = true;

        remote.getGlobal("setTabspaceHeight")(0);
    }
    
    rewriteScreen();
    ui.refresh();
};