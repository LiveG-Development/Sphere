// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

// @import ../../funcs/staticpages/script
// @import ../../funcs/menu/script
// @import ../../funcs/keyshorts/script
// @import ../../funcs/search/script
// @import ../../funcs/fullscreen/script
// @import ../../funcs/zoom/script

ui.models.tabSpace = {};

var tabSpaceActiveElements = {
    tabs: []
};

ui.models.tabSpace._TAB_WIDTH = 220;

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
    @param style object Styling to use on component. Default: `{}`.
    @param attributes object HTML attributes to use on component. Default: `{}`.
    @param events object Events to listen to on component. Default: `{}`.

    @shortDescription Tab class, extends `ui.models.tabSpace.Component`.
*/
ui.models.tabSpace.Tab = class extends ui.models.tabSpace.Component {
    constructor(url = "sphere://newtab", style = {}, attributes = {}, events = {}) {
        // @asset ../../assets/defaultFavicon.png

        super([
            new ui.components.Button([
                new ui.components.Image(importer.generateLink(_assets["defaultFavicon.png"], "image/png"), "", {}, {
                    "aria-hidden": "true",
                    "draggable": "false"
                }, {
                    error: function(event) {
                        event.target.src = importer.generateLink(_assets["defaultFavicon.png"], "image/png");
                    }
                }),
                new ui.components.Text(url)
            ], false, {}, {"title": url}),
            new ui.components.Button([new ui.components.Icon("close")], false, {}, {
                "aria-label": l10n.translate("closeTab"),
                "title": l10n.translate("closeTab")
            })
        ], style, attributes, events);

        this.HTMLTagName = "li";

        this.browserTab = new remote.BrowserView();

        this.browserTab.webContents.loadURL(this._specialToConventionalURL(url));

        this.browserTabObject = remote.getGlobal("newTab")(remote.getCurrentWindow(), this._specialToConventionalURL(url), function(event, url) {
            var newTab = new ui.models.tabSpace.Tab(url);

            event.newGuest = newTab.browserTab;

            tabSpaceActiveElements.tabs.push(newTab);
            tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();

            ui.refresh();
        });

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

        this.browserTab.webContents.on("did-navigate", function() {
            thisScope._injectTabCode();
            
            thisScope.title = "";

            ui.refresh();

            if (thisScope._removeProtocol(thisScope.url.split("?")[0]) == thisScope._removeProtocol(staticPages.newTab)) {
                // Focus the address bar if we're on a new tab, but allow time for page to load etc.

                setTimeout(function() {
                    remote.getCurrentWindow().webContents.focus();
                    dom.element("input[addressbar]").reference[0].focus();
                }, 1000);
            }

            if (thisScope._removeProtocol(thisScope.browserTab.webContents.getURL().split("?")[0]) != thisScope._removeProtocol(staticPages.newTab)) {
                // Remove focus if we're loading a non-new tab so that we can update the tab information

                dom.element("input[addressbar]").reference[0].blur();
            }
        });

        this.browserTab.webContents.on("dom-ready", function() {
            thisScope._injectTabCSS();
        });

        this.browserTab.webContents.on("page-favicon-updated", function(event, favicons) {
            thisScope.children[0].children[0].source = favicons[0];

            getUserData();

            var faviconStorage = userData.favicons || {};

            faviconStorage[thisScope.browserTab.webContents.getURL().split("?")[0].replace(/\/+$/, "")] = favicons[0];
            userData.favicons = faviconStorage;

            saveUserData();

            if (!focussed.isInputFocussed()) {
                ui.refresh();
            }
        });

        function unconventionalLoad(event, errorCode) {
            // Handle loads that may be erroneous destinations

            if (errorCode != -3) { // Some pages end up causing error -3 so we ignore it
                thisScope.browserTab.webContents.stop();
                thisScope.browserTab.webContents.loadURL(staticPages.error + "?lang=" + encodeURIComponent(ui.language) + "&url=" + encodeURIComponent(thisScope.browserTab.webContents.getURL()) + "&code=" + encodeURIComponent(errorCode));
            }
        }

        this.browserTab.webContents.on("context-menu", function(event, params) {
            var menuItems = [];

            if (params.linkURL != "") { // If is a link
                menuItems.push(
                    {
                        label: _("openLinkInNewTab"),
                        click: function() {
                            var newTab = new ui.models.tabSpace.Tab(params.linkURL);

                            tabSpaceActiveElements.tabs.push(newTab);
                            tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();
                        }
                    },
                    {
                        label: _("copyLinkAddress"),
                        click: function() {
                            remote.clipboard.writeText(params.linkURL);
                        }
                    },
                    {type: "separator"}
                );
            }

            if (
                params.editFlags.canCut ||
                params.editFlags.canCopy ||
                params.editFlags.canPaste ||
                params.editFlags.canSelectAll ||
                params.editFlags.canDelete ||
                params.mediaType == "image") { // If can do basic editing commands such as copy and paste
                if (params.editFlags.canCut) {
                    menuItems.push({
                        label: _("cut"),
                        toolTip: keyboardShortcuts.getRepresentation("KeyX", true),
                        role: "cut"
                    });
                }

                if (params.editFlags.canCopy) {
                    if (params.mediaType == "image") {
                        menuItems.push({
                            label: _("copyImage"),
                            toolTip: keyboardShortcuts.getRepresentation("KeyC", true),
                            role: "copy"
                        });
                    } else {
                        menuItems.push({
                            label: _("copy"),
                            toolTip: keyboardShortcuts.getRepresentation("KeyC", true),
                            role: "copy"
                        });

                        if (params.titleText != "") {
                            menuItems.push({
                                label: _("copyDescription"),
                                click: function() {
                                    remote.clipboard.writeText(params.titleText);
                                }
                            });
                        }
                    }
                }

                if (params.mediaType == "image" && params.hasImageContents) {
                    menuItems.push({
                        label: _("copyImageAddress"),
                        click: function() {
                            remote.clipboard.writeText(params.srcURL);
                        }
                    });
                }

                if (params.editFlags.canPaste) {
                    menuItems.push({
                        label: _("paste"),
                        toolTip: keyboardShortcuts.getRepresentation("KeyV", true),
                        role: "paste"
                    });

                    menuItems.push({
                        label: _("pasteWithoutFormatting"),
                        role: "pasteAndMatchStyle"
                    });
                }

                if (params.editFlags.canSelectAll) {
                    menuItems.push({
                        label: _("selectAll"),
                        toolTip: keyboardShortcuts.getRepresentation("KeyA", true),
                        role: "selectAll"
                    });
                }

                if (params.editFlags.canDelete) {
                    menuItems.push({
                        label: _("delete"),
                        toolTip: keyboardShortcuts.getRepresentation("Delete"),
                        role: "delete"
                    });
                }

                menuItems.push({type: "separator"});
            }

            if (params.editFlags.canCopy && params.selectionText.trim() != "") { // If can do special browser actions
                menuItems.push({
                    label: _("searchForOn", [params.selectionText, search.engines[search.selectedEngine].name]),
                    click: function() {
                        var newTab = new ui.models.tabSpace.Tab(search.queryToURL(params.selectionText.trim()));

                        tabSpaceActiveElements.tabs.push(newTab);
                        tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();
                    }
                });

                menuItems.push({type: "separator"});
            }

            if (params.editFlags.canUndo || params.editFlags.canRedo) { // If can undo and redo
                if (params.editFlags.canUndo) {
                    menuItems.push({
                        label: _("undo"),
                        toolTip: keyboardShortcuts.getRepresentation("KeyZ", true),
                        role: "undo"
                    });
                }

                if (params.editFlags.canRedo) {
                    menuItems.push({
                        label: _("redo"),
                        toolTip: keyboardShortcuts.getRepresentation("KeyZ", true, false, true),
                        role: "redo"
                    });
                }

                menuItems.push({type: "separator"});
            }

            menuItems.push(
                {
                    label: _("goBack"),
                    toolTip: keyboardShortcuts.getRepresentation(
                        keyboardShortcuts.shortcuts.goBack.keyCode,
                        keyboardShortcuts.shortcuts.goBack.ctrl,
                        keyboardShortcuts.shortcuts.goBack.alt,
                        keyboardShortcuts.shortcuts.goBack.shift
                    ),
                    click: function() {
                        thisScope.browserTab.webContents.goBack();
                    }
                },
                {
                    label: _("goForward"),
                    toolTip: keyboardShortcuts.getRepresentation(
                        keyboardShortcuts.shortcuts.goForward.keyCode,
                        keyboardShortcuts.shortcuts.goForward.ctrl,
                        keyboardShortcuts.shortcuts.goForward.alt,
                        keyboardShortcuts.shortcuts.goForward.shift
                    ),
                    click: function() {
                        thisScope.browserTab.webContents.goForward();
                    }
                },
                {
                    label: _("reloadPage"),
                    toolTip: keyboardShortcuts.getRepresentation(
                        keyboardShortcuts.shortcuts.reload.keyCode,
                        keyboardShortcuts.shortcuts.reload.ctrl,
                        keyboardShortcuts.shortcuts.reload.alt,
                        keyboardShortcuts.shortcuts.reload.shift
                    ),
                    click: function() {
                        thisScope.browserTab.webContents.reload();
                    }
                }
            );

            menu.show(menuItems, new ui.Vector(event.x, event.y));
        });

        var timesFullscreenCalled = 0;
        var lastTimeFullscreenCalled = new Date().getTime();

        this.browserTab.webContents.on("enter-html-full-screen", function() {
            if (timesFullscreenCalled > 3 || lastTimeFullscreenCalled < new Date().getTime() - (10 * 1000)) { // To prevent abuse of the fullscreen API, we impose a 10-second cooldown period after 3 fullscreen calls.
                fullscreen.enter();
            }

            timesFullscreenCalled++;
            lastTimeFullscreenCalled = new Date().getTime();
        });

        this.browserTab.webContents.on("leave-html-full-screen", function() {
            fullscreen.leave();
        });

        this.browserTab.webContents.on("did-fail-load", unconventionalLoad);
        this.browserTab.webContents.on("did-fail-provisional-load", unconventionalLoad);
    }

    _specialToConventionalURL(url) {
        // Convert a special sphere:// URL to a conventional one

        if (url == "sphere://newtab") {
            return staticPages.newTab + "?lang=" + encodeURIComponent(ui.language);
        } else if (url == "sphere://settings") {
            return staticPages.settings + "?lang=" + encodeURIComponent(ui.language) + "&version=" + encodeURIComponent(remote.getGlobal("VERSION_NUMBER"));
        } else {
            return url;
        }
    }

    _injectTabCSS() {
        // @asset ../../injections/tab.css

        this.browserTab.webContents.insertCSS(
            importer
                .getString(_assets["tab.css"])
        );
    }

    _injectTabJS() {
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
        } else if (this._removeProtocol(this.url.split("?")[0]) == this._removeProtocol(staticPages.settings)) {
            // @asset ../../injections/settings.js

            this.browserTab.webContents.executeJavaScript(
                importer
                    .getString(_assets["settings.js"])
                    .replace(/__KEY__/g, remote.getGlobal("messageSphereKey"))
                    .replace(/__ID__/g, this.browserTabID)
            );
        }
    }

    _injectTabCode() {
        this._injectTabCSS();
        this._injectTabJS();
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
        } else if (this._removeProtocol(urlWithoutQuery) == this._removeProtocol(staticPages.settings)) {
            this.displayedURL = "sphere://settings";
        } else if (this._removeProtocol(urlWithoutQuery) != this._removeProtocol(staticPages.error)) {
            this.displayedURL = this._formatURL(url);
        }

        search.load();

        tabSpaceActiveElements.addressBar.placeholder = _("searchUsing", [search.engines[search.selectedEngine].name]);
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

        remote.getCurrentWindow().webContents.focus();
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

        this.children[0].children[1].text = this.title;

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

        this.browserTab.setBounds({x: 0, y: remote.getGlobal("tabspaceHeight"), width: remote.getCurrentWindow().getContentSize()[0], height: remote.getCurrentWindow().getContentSize()[1] - remote.getGlobal("tabspaceHeight")});

        this._browserTabWatcher = setInterval(function() {
            if (thisScope.browserTab != null && remote.getCurrentWindow() != null) {
                thisScope.browserTab.setBounds({x: 0, y: remote.getGlobal("tabspaceHeight"), width: remote.getCurrentWindow().getContentSize()[0], height: remote.getCurrentWindow().getContentSize()[1] - remote.getGlobal("tabspaceHeight")});

                if ((
                    thisScope.url != thisScope.browserTab.webContents.getURL() ||
                    thisScope.loading != thisScope.browserTab.webContents.isLoading() ||
                    thisScope.title != thisScope.browserTab.webContents.getTitle()
                ) && !focussed.isInputFocussed()) {
                    thisScope.url = thisScope.browserTab.webContents.getURL();
                    thisScope.loading = thisScope.browserTab.webContents.isLoading();
                    thisScope.title = thisScope.browserTab.webContents.getTitle();

                    thisScope.children[0].children[1].text = thisScope.title;
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