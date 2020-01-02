// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

ui.models.tabSpace = {};

var tabSpaceActiveElements = {
    tabs: []
};

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
    }

    precompute(domObject) {
        this.attributes["tabstrip"] = "";
        this.attributes["aria-role"] = "tablist";

        var thisScope = this;

        var offset = null;
        var draggingTab = null;

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

            tabSpaceActiveElements.tabs = reorderedTabsModel;

            rewriteScreen();

            ui.refresh();
        }

        this.events["mousemove"] = function(event) {
            var targetTab = event.target.closest("[tab]");

            var elementLeft = targetTab.getBoundingClientRect() == null ? 0 : targetTab.getBoundingClientRect().left;
            var mouseLeft = event.pageX;

            if (event.which == 1 && mouseLeft > elementLeft && mouseLeft < elementLeft + targetTab.offsetWidth) {
                if (offset == null) {
                    offset = mouseLeft - elementLeft;
                }

                if (draggingTab == null || draggingTab == targetTab) {
                    dom.element("", [targetTab]).style.setPush({
                        position: "absolute",
                        top: "8px",
                        left: (mouseLeft - offset) + "px",
                        opacity: "0.5"
                    });

                    draggingTab = targetTab;
                }
            }
        };

        this.events["mouseup"] = function() {
            if (draggingTab != null) {
                reorderTabs();
            }
        };

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
    constructor(url = "about:blank", style = {}, attributes = {}, events = {}) {
        super([
            new ui.components.Button(url, false, {}, {"title": url}),
            new ui.components.Button([new ui.components.Icon("close")], false, {}, {
                "aria-label": l10n.translate("closeTab"),
                "title": l10n.translate("closeTab")
            })
        ], style, attributes, events);

        this.HTMLTagName = "li";

        this.browserTab = new remote.BrowserView();
        
        this.browserTab.webContents.loadURL(url);

        this._browserTabWatcher = null;
        this._key = core.generateKey();

        this.url = url;
        this.loading = true;
        this.title = this.url;
        this.favicon = "";
        this.selected = false;
    }

    switch() {
        for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
            if (tabSpaceActiveElements.tabs[i] != this) {
                tabSpaceActiveElements.tabs[i].selected = false;
            }
        }

        this.selected = true;

        tabSpaceActiveElements.addressBar.value = this.url;
    }

    close() {
        this.browserTab.destroy();

        this.browserTab = null;

        var tabPosition = tabSpaceActiveElements.tabs.indexOf(this);

        if (tabSpaceActiveElements.tabs.length == 1) {
            remote.getCurrentWindow().close();
        } else if (tabPosition - 1 < 0) {
            tabSpaceActiveElements.tabs[tabPosition + 1].switch();
        } else {
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

        this._browserTabWatcher = setInterval(function() {
            if (thisScope.browserTab != null && remote.getCurrentWindow() != null) {
                thisScope.browserTab.setBounds({x: 0, y: remote.getGlobal("TABSPACE_HEIGHT"), width: remote.getCurrentWindow().getSize()[0], height: remote.getCurrentWindow().getSize()[1] - remote.getGlobal("TABSPACE_HEIGHT")});
            
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
                        tabSpaceActiveElements.addressBar.value = thisScope.url;
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
            tabSpaceActiveElements.tabs.push(new ui.models.tabSpace.Tab("https://google.com"));

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

        return domObject;
    }
};

tabSpaceActiveElements.addressBar = new ui.models.tabSpace.AddressBar();