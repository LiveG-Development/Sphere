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

// @asset style.css

ui.models.bookmarks._styleAsset = _assets["style.css"];

/*
    @name ui.models.bookmarks.BookmarkContainer

    @param children any Children or content to include in component. Default: `[]`.
    @param split number Numerator of a twelth fraction used to split container by width. Must be between 1 and 12 inclusive. Default: `12`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription BookmarkContainer class, extends `ui.components.Container`.
*/
ui.models.bookmarks.BookmarkContainer = class extends ui.components.Container {
    constructor(children = [], split = 12, style = {}, attributes = {}, events = {}) {
        super(children, split, style, attributes, events);

        dom.element("head").newChild(importer.generateLinkDOMElement(ui.models.bookmarks._styleAsset));
    }
    
    precompute(domObject) {
        domObject = super.precompute(domObject);

        this.attributes["bookmarkcontainer"] = "";

        return domObject;
    }
};

/*
    @name ui.models.bookmarks.BookmarkIcon

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.
    @param deleteButtonEvents object Events to listen to on component's delete button. Default: `{}`.

    @shortDescription BookmarkIcon class, extends `ui.components.Component`.
*/
ui.models.bookmarks.BookmarkIcon = class extends ui.components.Component {
    constructor(url, siteTitle = url, siteFavicon = importer.generateLink(_assets["defaultFavicon.png"], "image/png"), style = {}, attributes = {}, events = {}, deleteButtonEvents = {}) {
        // @asset ../../assets/defaultFavicon.png
                
        super([
            new ui.components.Button([
                new ui.components.Image(siteFavicon, siteTitle, {}, {}, {
                    error: function(event) {
                        event.target.src = importer.generateLink(_assets["defaultFavicon.png"], "image/png");
                    }
                }),
                new ui.components.Text(siteTitle)
            ], false, {}, {
                title: siteTitle + "\n" + url
            }, {
                click: function() {
                    window.location.href = url;
                }
            }),
            new ui.components.Button([
                new ui.components.Icon("delete", _("deleteBookmark"))
            ], false, {}, {
                title: _("deleteBookmark")
            }, deleteButtonEvents)
        ], false, style, attributes, events);

        dom.element("head").newChild(importer.generateLinkDOMElement(ui.models.bookmarks._styleAsset));
    }

    precompute(domObject) {
        domObject = super.precompute(domObject);

        this.attributes["bookmarkicon"] = "";

        return domObject;
    }
};

/*
    @name ui.models.bookmarks.AddBookmarkIcon

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription AddBookmarkIcon class, extends `ui.components.Component`.
*/
ui.models.bookmarks.AddBookmarkIcon = class extends ui.components.Component {
    constructor(style = {}, attributes = {}, events = {}) {
        // @asset ../../assets/add.png

        super([
            new ui.components.Button([
                new ui.components.Image(importer.generateLink(_assets["add.png"], "image/png"), _("addBookmark")),
                new ui.components.Text(_("addBookmark"))
            ], false, {}, {}, events)
        ], false, style, attributes, {});

        dom.element("head").newChild(importer.generateLinkDOMElement(ui.models.bookmarks._styleAsset));
    }

    precompute(domObject) {
        domObject = super.precompute(domObject);

        this.attributes["bookmarkicon"] = "";

        return domObject;
    }
};