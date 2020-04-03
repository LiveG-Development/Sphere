// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

var zoom = {};

/*
    @name zoom.getFactor

    @param tab object Tab to get zoom factor of, of type `ui.models.tabSpace.Tab`.

    @return number The zoom factor of the tab.

    @shortDescription Get the zoom factor of the specified tab.
    @longDescription For example, factor 0.5 would be a zoom factor at 50%, 1 would be 100% and 2 would be 200%.
*/
zoom.getFactor = function(tab) {
    return tab.browserTab.webContents.zoomFactor;
};

/*
    @name zoom.setFactor

    @param tab object Tab to zoom with, of type `ui.models.tabSpace.Tab`.
    @param factor number The zoom factor to zoom in at. Default: `1`.

    @shortDescription Set the zoom factor of the specified tab.
    @longDescription For example, factor 0.5 would set the zoom factor to 50%, 1 would be 100% and 2 would be 200%.
*/
zoom.setFactor = function(tab, factor) {
    tab.browserTab.webContents.zoomFactor = factor;
};