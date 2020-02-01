// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

// @import https://opensource.liveg.tech/ZaprCoreLibs/src/importer/importer

ui.models.bookmarks = {};

/*
    @name ui.models.bookmarks.BookmarkIcon

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription BookmarkIcon class, extends `ui.components.Button`.
*/
ui.models.bookmarks.BookmarkIcon = class extends ui.components.Button {
    constructor(url, siteTitle = url, siteFavicon = "", style = {}, attributes = {}, events = {}) {
        super([
            new ui.components.Image(siteFavicon, siteTitle),
            new ui.components.Text(siteTitle)
        ], false, style, attributes, {
            ...events,
            click: function() {
                window.location.href = url;
            }
        });

        // // @asset style.css
                
        // dom.element("head").newChild(importer.generateLinkDOMElement(_assets["style.css"]));
    }
};