// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

// @import ../../funcs/staticpages/script

ui.models.tabSpace = {};

var tabSpaceActiveElements = {
    tabs: []
};

ui.models.tabSpace._TAB_WIDTH = 200;

ui.models.tabSpace.tabZIndex = 10; // High enough for z-index to become effective

/*
    @name ui.models.tabSpace.Component

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Component class, extends `ui.components.Component`.
*/
ui.models.tabSpace.Component = class extends ui.components.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "div";

        // @asset style.css
                
        dom.element("head").newChild(importer.generateLinkDOMElement(_assets["style.css"]));
    }
};

/*
    @name ui.models.tabSpace.TabRow

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription TabRow class, extends `ui.models.tabSpace.Component`.
    @longDescription Intended to have a `ui.models.tabSpace.TabStrip` instance as a child.
*/
ui.models.tabSpace.TabRow = class extends ui.models.tabSpace.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "div";
    }

    precompute(domObject) {
        this.attributes["tabrow"] = "";

        return domObject;
    }
};

/*
    @name ui.models.tabSpace.TabStrip

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription TabStrip class, extends `ui.models.tabSpace.Component`.
    @longDescription Intended to have `ui.models.tabSpace.Tab` instances as children.
*/
ui.models.tabSpace.TabStrip = class extends ui.models.tabSpace.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "ol";

        this._browserTabWatcher = null;

        this._previousWindowWidth = null;
        this._previousTabCount = null;
    }

    precompute(domObject) {
        this.attributes["tabstrip"] = "";
        this.attributes["aria-role"] = "tablist";

        var thisScope = this;

        var offset = null;
        var draggingTab = null;
        var tabDropTimeout = null;

        function reorderTabs() {
            var currentTabs = domObject.children().reference;
            var reorderedTabPositions = {};
            var reorderedTabs = [];

            for (var i = 0; i < currentTabs.length; i++) {
                reorderedTabPositions[currentTabs[i].getBoundingClientRect().left] = currentTabs[i];
            }

            for (var i = 0; i < Object.keys(reorderedTabPositions).length; i++) {
                reorderedTabs.push(reorderedTabPositions[Object.keys(reorderedTabPositions).sort(function(a, b) {
                    return a - b;
                })[i]]);
            }

            // When the text direction is RTL, we have to reverse the array as otherwise the tabs will be sorted in reverse
            if (ui.mirroringDirection == "rtl") {
                reorderedTabs = reorderedTabs.reverse();
            }

            offset = null;
            draggingTab = null;

            var reorderedTabsModel = [];

            for (var i = 0; i < reorderedTabs.length; i++) {
                for (var j = 0; j < thisScope.children.length; j++) {
                    if (thisScope.children[j]._key == dom.element("", [reorderedTabs[i]]).attribute("key").get()) {
                        reorderedTabsModel.push(thisScope.children[j]);
                    }
                }
            }

            if (currentTabs.length == reorderedTabs.length) {
                tabSpaceActiveElements.tabs = reorderedTabsModel;
            }

            rewriteScreen();

            ui.refresh();
        }

        function onMove(event) {
            var targetTab = event.target.closest("[tab]");

            if (targetTab != null) {
                var elementLeft = targetTab.getBoundingClientRect().left;
                var mouseLeft;

                if (event.type == "touchmove") {
                    mouseLeft = event.touches[0].pageX;
                } else if (event.type == "mousemove") {
                    mouseLeft = event.pageX;
                }

                if ((event.which == 1 || event.type == "touchmove") && mouseLeft > elementLeft && mouseLeft < elementLeft + targetTab.offsetWidth) {
                    if (offset == null) {
                        offset = mouseLeft - elementLeft;
                    }

                    if (draggingTab == null || draggingTab == targetTab) {
                        dom.element("", [targetTab]).style.setPush({
                            position: "absolute",
                            top: "8px",
                            left: (mouseLeft - offset) + "px",
                            opacity: "0.5",
                            "z-index": ui.models.tabSpace.tabZIndex
                        });

                        ui.models.tabSpace.tabZIndex++;

                        draggingTab = targetTab;

                        // Automatically drop the tab if it gets stuck whilst dragging

                        clearTimeout(tabDropTimeout);

                        tabDropTimeout = setTimeout(onUp, 1000);
                    }
                }
            }
        }

        function onUp() {
            if (draggingTab != null) {
                reorderTabs();
            }
        }

        this.events["mousemove"] = onMove;
        this.events["touchmove"] = onMove;

        this.events["mouseup"] = onUp;
        this.events["touchend"] = onUp;

        clearInterval(this._browserTabWatcher);

        this._browserTabWatcher = setInterval(function() {
            if (thisScope._previousWindowWidth != remote.getCurrentWindow().getContentSize()[0] || thisScope._previousTabCount != thisScope.children.length) {

                if (((ui.models.tabSpace._TAB_WIDTH + 50) * thisScope.children.length) + 50 >= remote.getCurrentWindow().getContentSize()[0]) {
                    // Squash tab widths to fit them all into window

                    for (var i = 0; i < thisScope.children.length; i++) {
                        thisScope.children[i].children[0].style.width = ((remote.getCurrentWindow().getContentSize()[0] / thisScope.children.length) - (50 / thisScope.children.length) - 50) + "px";
                    }
                } else {
                    // Set a constant width of all tabs to make them unsquashed

                    for (var i = 0; i < thisScope.children.length; i++) {
                        thisScope.children[i].children[0].style.width = ui.models.tabSpace._TAB_WIDTH + "px";
                    }
                }

                thisScope._previousWindowWidth = remote.getCurrentWindow().getContentSize()[0];
                thisScope._previousTabCount = thisScope.children.length;

                ui.refresh();
            }
        });

        return domObject;
    }
};

/*
    @name ui.models.tabSpace.Tab

    @param url string URL of tab body. Default: `"about:blank"`.
    @param loading boolean Whether the tab body is loading. Default: `false`.
    @param title string Document title of tab body. Default: `url`.
    @param favicon string Document favicon URL of tab body. Default: `""`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Tab class, extends `ui.models.tabSpace.Component`.
*/
ui.models.tabSpace.Tab = class extends ui.models.tabSpace.Component {
    constructor(url = "sphere://newtab", style = {}, attributes = {}, events = {}) {
        super([
            new ui.components.Button(url, false, {}, {"title": url}),
            new ui.components.Button([new ui.components.Icon("close")], false, {}, {
                "aria-label": l10n.translate("closeTab"),
                "title": l10n.translate("closeTab")
            })
        ], style, attributes, events);

        this.HTMLTagName = "li";

        this.browserTab = new remote.BrowserView();
        
        this.browserTab.webContents.loadURL(this._specialToConventionalURL(url));

        this.browserTabObject = remote.getGlobal("newTab")(this._specialToConventionalURL(url));
        this.browserTab = this.browserTabObject.tab;
        this.browserTabID = this.browserTabObject.id;

        this._browserTabWatcher = null;
        this._key = core.generateKey();

        this.url = this._specialToConventionalURL(url);
        this.displayedURL = url;
        this.loading = true;
        this.title = this.url;
        this.favicon = "";
        this.selected = false;

        var thisScope = this;

        this.browserTab.webContents.on("dom-ready", function() {
            thisScope._injectJavaScript();
            
            thisScope.title = "";

            ui.refresh();

            if (thisScope._removeProtocol(thisScope.url.split("?")[0]) == thisScope._removeProtocol(staticPages.newTab)) {
                // Focus the address bar if we're on a new tab

                remote.getGlobal("mainWindow").webContents.focus();
                dom.element("input[addressbar]").reference[0].focus();
            }

            if (thisScope._removeProtocol(thisScope.browserTab.webContents.getURL().split("?")[0]) != thisScope._removeProtocol(staticPages.newTab)) {
                // Remove focus if we're loading a non-new tab so that we can update the tab information

                dom.element("input[addressbar]").reference[0].blur();
            }
        });

        this.browserTab.webContents.on("page-favicon-updated", function(event, favicons) {
            getUserData();

            var faviconStorage = userData.favicons || {};

            faviconStorage[thisScope.browserTab.webContents.getURL().split("?")[0].replace(/\/+$/, "")] = favicons[0];
            userData.favicons = faviconStorage;

            saveUserData();
        });

        function unconventionalLoad(event, errorCode) {
            // Handle loads that may be erroneous destinations

            if (errorCode != -3) { // Some pages end up causing error -3 so we ignore it
                thisScope.browserTab.webContents.stop();
                thisScope.browserTab.webContents.loadURL(staticPages.error + "?lang=" + encodeURIComponent(ui.language) + "&code=" + encodeURIComponent(errorCode));
            }
        }

        this.browserTab.webContents.on("did-fail-load", unconventionalLoad);
        this.browserTab.webContents.on("did-fail-provisional-load", unconventionalLoad);

        this.browserTab.webContents.on("new-window", function(event, url) {
            tabSpaceActiveElements.tabs.push(new ui.models.tabSpace.Tab(url));
            tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();

            ui.refresh();

            event.preventDefault();
        });
    }

    _specialToConventionalURL(url) {
        // Convert a special sphere:// URL to a conventional one

        if (url == "sphere://newtab") {
            return staticPages.newTab + "?lang=" + encodeURIComponent(ui.language);
        } else {
            return url;
        }
    }

    _injectJavaScript() {
        // @asset ../../injections/tab.js

        this.browserTab.webContents.executeJavaScript(
            importer
                .getString(_assets["tab.js"])
                .replace(/__KEY__/g, remote.getGlobal("messageSphereKey"))
                .replace(/__ID__/g, this.browserTabID)
        );

        if (this._removeProtocol(this.url.split("?")[0]) == this._removeProtocol(staticPages.newTab)) {
            // @asset ../../injections/newtab.js

            this.browserTab.webContents.executeJavaScript(
                importer
                    .getString(_assets["newtab.js"])
                    .replace(/__KEY__/g, remote.getGlobal("messageSphereKey"))
                    .replace(/__ID__/g, this.browserTabID)
            );
        }
    }

    _removeProtocol(url) {
        return url.replace(/.*:(\/)*/g, "");
    }

    _formatURL(url) {
        // When setting address bar value, we remove trailing slashes to make sure that the address displays correctly in RTL
        return url.replace(/\/+$/, "");
    }

    _setAddressBar(url = this.url) {
        url = this._formatURL(url);

        var urlWithoutQuery = url.split("?")[0];

        if (this._removeProtocol(urlWithoutQuery) == this._removeProtocol(staticPages.newTab)) {
            this.displayedURL = "";
        } else if (this._removeProtocol(urlWithoutQuery) != this._removeProtocol(staticPages.error)) {
            this.displayedURL = this._formatURL(url);
        }

        tabSpaceActiveElements.addressBar.value = this.displayedURL;
    }

    switch() {
        for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
            if (tabSpaceActiveElements.tabs[i] != this) {
                tabSpaceActiveElements.tabs[i].selected = false;
            }
        }

        this.selected = true;

        this._setAddressBar();

        remote.getGlobal("mainWindow").webContents.focus();
    }

    close() {
        remote.getCurrentWindow().removeBrowserView(this.browserTab);
        
        this.browserTab.destroy();

        this.browserTab = null;

        var tabPosition = tabSpaceActiveElements.tabs.indexOf(this);

        if (tabSpaceActiveElements.tabs.length == 1) {
            remote.getCurrentWindow().close();
        } else if (tabPosition - 1 < 0 && this.selected) {
            tabSpaceActiveElements.tabs[tabPosition + 1].switch();
        } else if (this.selected) {
            tabSpaceActiveElements.tabs[tabPosition - 1].switch();
        }

        tabSpaceActiveElements.tabs.splice(tabPosition, 1);
    }

    precompute(domObject) {
        this.attributes["tab"] = "";
        this.attributes["aria-role"] = "tab";
        this.attributes["key"] = this._key;
        
        clearInterval(this._browserTabWatcher);

        var thisScope = this;

        this.children[0].events["click"] = function() {
            thisScope.switch();

            ui.refresh();
        };

        this.children[0].events["auxclick"] = function() {
            if (event.button == 1) {
                thisScope.close();

                ui.refresh();
            }
        };

        this.children[0].text = this.title;

        this.children[1].events["click"] = function() {
            thisScope.close();

            ui.refresh();
        };
        
        if (this.selected) {
            remote.getCurrentWindow().addBrowserView(this.browserTab);            

            this.attributes["selected"] = "";
            this.attributes["aria-selected"] = "true";
        } else {
            remote.getCurrentWindow().removeBrowserView(this.browserTab);

            delete this.attributes["selected"];
            delete this.attributes["aria-selected"];
        }

        this.browserTab.setBounds({x: 0, y: remote.getGlobal("TABSPACE_HEIGHT"), width: remote.getCurrentWindow().getContentSize()[0], height: remote.getCurrentWindow().getContentSize()[1] - remote.getGlobal("TABSPACE_HEIGHT")});

        this._browserTabWatcher = setInterval(function() {
            if (thisScope.browserTab != null && remote.getCurrentWindow() != null) {
                thisScope.browserTab.setBounds({x: 0, y: remote.getGlobal("TABSPACE_HEIGHT"), width: remote.getCurrentWindow().getContentSize()[0], height: remote.getCurrentWindow().getContentSize()[1] - remote.getGlobal("TABSPACE_HEIGHT")});

                if ((
                    thisScope.url != thisScope.browserTab.webContents.getURL() ||
                    thisScope.loading != thisScope.browserTab.webContents.isLoading() ||
                    thisScope.title != thisScope.browserTab.webContents.getTitle()
                ) && !focussed.isInputFocussed()) {
                    thisScope.url = thisScope.browserTab.webContents.getURL();
                    thisScope.loading = thisScope.browserTab.webContents.isLoading();
                    thisScope.title = thisScope.browserTab.webContents.getTitle();

                    thisScope.children[0].children[0].text = thisScope.title;
                    thisScope.children[0].attributes["title"] = thisScope.title;

                    if (thisScope.selected && !focussed.isInputFocussed()) {
                        thisScope._setAddressBar();
                    }

                    ui.refresh();
                }
            } else {
                clearInterval(thisScope._browserTabWatcher);
            }
        });

        return domObject;
    }
};

/*
    @name ui.models.tabSpace.NewTabButton

    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription NewTabButton class, extends `ui.models.tabSpace.Component`.
*/
ui.models.tabSpace.NewTabButton = class extends ui.models.tabSpace.Component {
    constructor(style = {}, attributes = {}, events = {}) {
        super([
            new ui.components.Icon("add")
        ], style, attributes, events);

        this.HTMLTagName = "button";
    }

    precompute(domObject) {
        this.attributes["newtab"] = "";
        this.attributes["title"] = l10n.translate("newTab");
        this.attributes["aria-label"] = l10n.translate("newTab");

        this.events["click"] = function() {
            tabSpaceActiveElements.tabs.push(new ui.models.tabSpace.Tab());
            tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();

            ui.refresh();
        };

        return domObject;
    }
};

/*
    @name ui.models.tabSpace.ActionsRow

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription ActionsRow class, extends `ui.models.tabSpace.Component`.
*/
ui.models.tabSpace.ActionsRow = class extends ui.models.tabSpace.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "div";
    }

    precompute(domObject) {
        this.attributes["actionsrow"] = "";

        return domObject;
    }
};

/*
    @name ui.models.tabSpace.ActionButton

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription ActionButton class, extends `ui.models.tabSpace.Component`.
*/
ui.models.tabSpace.ActionButton = class extends ui.models.tabSpace.Component {
    constructor(children = [], style = {}, attributes = {}, events = {}) {
        super(children, style, attributes, events);

        this.HTMLTagName = "button";
    }

    precompute(domObject) {
        domObject = super.precompute(domObject);

        this.attributes["actionbutton"] = "";

        return domObject;
    }
};

/*
    @name ui.models.tabSpace.AddressBar

    @param children any Children or content to include in component. Default: `[]`.
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription AddressBar class, extends `ui.components.TextInput`.
*/
ui.models.tabSpace.AddressBar = class extends ui.components.TextInput {
    precompute(domObject) {
        domObject = super.precompute(domObject);

        this.attributes["addressbar"] = "";
        this.attributes["type"] = "url";

        var thisScope = this;

        domObject.events.listen("drop", function(event) {
            // Make sure that any text dragged into the input replaces the current input's text
            event.target.value = event.dataTransfer.getData("text");

            // We should also fire the keyup event so that the text can be interpreted
            event.keyCode = 13;

            (thisScope.events["keyup"] || function() {})(event);
        });

        return domObject;
    }
};

tabSpaceActiveElements.addressBar = new ui.models.tabSpace.AddressBar();