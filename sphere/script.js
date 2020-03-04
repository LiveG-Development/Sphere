// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

// Electron remote access

const remote = require("electron").remote;
const ipcRenderer = require("electron").ipcRenderer;
const path = require("path");
const fs = require("fs");
const os = require("os");

// @import https://opensource.liveg.tech/Adapt-UI/src/ui

// @import https://opensource.liveg.tech/ZaprCoreLibs/src/core/core
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/dom/dom
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/importer/importer
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/l10n/l10n

// @import funcs/focussed/script
// @import funcs/keyshorts/script
// @import funcs/eventqueue/script
// @import funcs/search/script
// @import funcs/menu/script
// @import funcs/fullscreen/script
// @import funcs/zoom/script

// @import models/tabspace/model

// Useful data to keep across files

var storagePath = "";
var userData = {};

// Locale integration configuration

// @asset locale/en_GB.json

l10n.load("en_GB", importer.getString(_assets["en_GB.json"]));

var lang = l10n.getBrowserLocale();

function _() {
    return l10n.translate(...arguments);
}

if (!(lang in l10n.locales)) {
    lang = "en_GB";
}

l10n.use(lang);

ui.mirroringDirection = l10n.languageData.direction;
ui.language = lang;

// Arguments specified can override configured locale information

if (remote.getGlobal("arguments")["lang"]) {
    ui.mirroringDirection = remote.getGlobal("arguments")["lang"];
}

if (remote.getGlobal("arguments")["mirroring-direction"]) {
    ui.mirroringDirection = remote.getGlobal("arguments")["mirroring-direction"];
}

// UI design

core.unpack(ui.components);
core.unpack(ui.models);

remote.getCurrentWindow().setTitle(_("sphere"));

tabSpaceActiveElements.tabs.push(new tabSpace.Tab());

tabSpaceActiveElements.tabs[0].selected = true;

tabSpaceActiveElements.addressBar = new tabSpace.AddressBar("", _("searchUsing", [search.engines[search.selectedEngine].name]), false, {}, {}, {
    focus: function(event) {
        event.target.select();
    },

    keyup: function(event) {
        if (event.keyCode == 13) { // Enter key
            var enteredValue = event.target.value.trim();

            var addressQualities = {
                full: !!/^[a-zA-Z]+:/g.test(enteredValue), // If has a protocol at the start, then should be a full URL
                noProtocol: !!/^([^\s])+\.[^\s]+((\/.*.)?)$/.test(enteredValue) // If is only a domain name
            };

            for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
                if (tabSpaceActiveElements.tabs[i].selected) {
                    var finalURL = "sphere://newtab";

                    if (addressQualities.full) {
                        finalURL = enteredValue;
                    } else if (addressQualities.noProtocol) {
                        finalURL = "https://" + enteredValue;
                    } else {
                        finalURL = search.queryToURL(enteredValue);
                    }

                    tabSpaceActiveElements.tabs[i].browserTab.webContents.loadURL(tabSpaceActiveElements.tabs[i]._specialToConventionalURL(finalURL));

                    tabSpaceActiveElements.tabs[i].url = tabSpaceActiveElements.tabs[i]._specialToConventionalURL(finalURL);
                }
            }

            ui.refresh();
        }
    }
});

tabSpaceActiveElements.newTabButton = new tabSpace.NewTabButton();

tabSpaceActiveElements.backButton = new tabSpace.ActionButton([new ui.components.Icon(ui.mirroringDirection == "rtl" ? "arrow_forward" : "arrow_back")], {}, {
    "title": _("goBack"),
    "aria-label": _("goBack")
}, {
    click: function() {
        for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
            if (tabSpaceActiveElements.tabs[i].selected) {
                tabSpaceActiveElements.tabs[i].browserTab.webContents.goBack();
            }
        }

        ui.refresh();
    }
});

tabSpaceActiveElements.forwardButton = new tabSpace.ActionButton([new ui.components.Icon(ui.mirroringDirection == "rtl" ? "arrow_back" : "arrow_forward")], {}, {
    "title": _("goForward"),
    "aria-label": _("goForward")
}, {
    click: function() {
        for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
            if (tabSpaceActiveElements.tabs[i].selected) {
                tabSpaceActiveElements.tabs[i].browserTab.webContents.goForward();
            }
        }

        ui.refresh();
    }
});

tabSpaceActiveElements.reloadButton = new tabSpace.ActionButton([new ui.components.Icon("refresh")], {}, {
    "title": _("reloadPage"),
    "aria-label": _("reloadPage")
}, {
    click: function() {
        for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
            if (tabSpaceActiveElements.tabs[i].selected) {
                tabSpaceActiveElements.tabs[i].browserTab.webContents.reload();
            }
        }

        ui.refresh();
    }
});

tabSpaceActiveElements.menuButton = new tabSpace.ActionButton([new ui.components.Icon("menu")], {}, {
    "title": _("menu"),
    "aria-label": _("menu")
}, {
    click: function() {
        var menuItems = [];

        var currentSelectedTab = null;

        for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
            if (tabSpaceActiveElements.tabs[i].selected) {
                currentSelectedTab = tabSpaceActiveElements.tabs[i];
            }
        }

        menuItems.push(
            {
                label: _("newTab"),
                toolTip: keyboardShortcuts.getRepresentation(
                    keyboardShortcuts.shortcuts.newTab.keyCode,
                    keyboardShortcuts.shortcuts.newTab.ctrl,
                    keyboardShortcuts.shortcuts.newTab.alt,
                    keyboardShortcuts.shortcuts.newTab.shift
                ),
                click: function() {
                    tabSpaceActiveElements.tabs.push(new ui.models.tabSpace.Tab());
                    tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();

                    ui.refresh();
                }
            },
            {type: "separator"}
        );

        if (zoom.getFactor(currentSelectedTab) != 1) {
            menuItems.push({
                label: _("zoomIsAtPercent", [Math.round(zoom.getFactor(currentSelectedTab) * 100)]),
                enabled: false
            });
        }

        menuItems.push(
            {
                label: _("zoomIn"),
                toolTip: keyboardShortcuts.getRepresentation(
                    keyboardShortcuts.shortcuts.zoomIn.keyCode,
                    keyboardShortcuts.shortcuts.zoomIn.ctrl,
                    keyboardShortcuts.shortcuts.zoomIn.alt,
                    keyboardShortcuts.shortcuts.zoomIn.shift
                ),
                click: function() {
                    if (zoom.getFactor(currentSelectedTab) < 3) { // Max zoom level is 300%
                        zoom.setFactor(currentSelectedTab, Number(Number(zoom.getFactor(currentSelectedTab) + 0.25).toFixed(2))); // We fix floating-point numbers to prevent artifacting
                    }
                }
            },
            {
                label: _("zoomOut"),
                toolTip: keyboardShortcuts.getRepresentation(
                    keyboardShortcuts.shortcuts.zoomOut.keyCode,
                    keyboardShortcuts.shortcuts.zoomOut.ctrl,
                    keyboardShortcuts.shortcuts.zoomOut.alt,
                    keyboardShortcuts.shortcuts.zoomOut.shift
                ),
                click: function() {
                    if (zoom.getFactor(currentSelectedTab) > 0.5) { // Min zoom level is 50%
                        zoom.setFactor(currentSelectedTab, Number(Number(zoom.getFactor(currentSelectedTab) - 0.25).toFixed(2))); // We fix floating-point numbers to prevent artifacting
                    }
                }
            }
        );

        if (zoom.getFactor(currentSelectedTab) != 1) {
            menuItems.push({
                label: _("resetZoom"),
                toolTip: keyboardShortcuts.getRepresentation(
                    keyboardShortcuts.shortcuts.resetZoom.keyCode,
                    keyboardShortcuts.shortcuts.resetZoom.ctrl,
                    keyboardShortcuts.shortcuts.resetZoom.alt,
                    keyboardShortcuts.shortcuts.resetZoom.shift
                ),
                click: function() {
                    zoom.setFactor(currentSelectedTab, 1);
                }
            });
        }

        menuItems.push(
            {
                label: !fullscreen.isFullscreen ? _("enterFullscreen") : _("leaveFullscreen"),
                toolTip: keyboardShortcuts.getRepresentation(
                    keyboardShortcuts.shortcuts.toggleFullscreen.keyCode,
                    keyboardShortcuts.shortcuts.toggleFullscreen.ctrl,
                    keyboardShortcuts.shortcuts.toggleFullscreen.alt,
                    keyboardShortcuts.shortcuts.toggleFullscreen.shift
                ),
                click: function() {
                    if (fullscreen.isFullscreen) {
                        fullscreen.leave();
                    } else {
                        fullscreen.enter();
                    }
                }
            },
            {type: "separator"}
        );

        menuItems.push(
            {
                label: _("settings"),
                click: function() {
                    tabSpaceActiveElements.tabs.push(new ui.models.tabSpace.Tab("sphere://settings"));
                    tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();

                    ui.refresh();
                }
            }
        );

        menuItems.push({
            label: _("exit"),
            toolTip: keyboardShortcuts.getRepresentation(
                keyboardShortcuts.shortcuts.exit.keyCode,
                keyboardShortcuts.shortcuts.exit.ctrl,
                keyboardShortcuts.shortcuts.exit.alt,
                keyboardShortcuts.shortcuts.exit.shift
            ),
            click: function() {
                remote.getCurrentWindow().close();
            }
        });

        menu.show(menuItems, new ui.Vector(
            ui.mirroringDirection == "rtl" ? 0 : remote.getCurrentWindow().getContentSize()[0] - 50, // Subtract 50px to make the menu show more on the inside of the browser
            remote.getGlobal("tabspaceHeight")
        ));
    }
});

function initialiseUserData() {
    storagePath = path.join(remote.app.getPath("userData"), "userData.json");

    // Create the user storage file if it doesn't exist yet
    if (!fs.existsSync(storagePath)) {
        fs.writeFileSync(storagePath, "{}");
    }
}

function getUserData() {
    initialiseUserData();

    userData = JSON.parse(fs.readFileSync(storagePath));
}

function saveUserData() {
    initialiseUserData();

    fs.writeFileSync(storagePath, JSON.stringify(userData));
}

function rewriteScreen() {
    if (!fullscreen.isFullscreen) {
        ui.screen = [
            new tabSpace.TabRow([
                new tabSpace.TabStrip(tabSpaceActiveElements.tabs),
                tabSpaceActiveElements.newTabButton
            ]),
            new tabSpace.ActionsRow([
                tabSpaceActiveElements.backButton,
                tabSpaceActiveElements.forwardButton,
                tabSpaceActiveElements.reloadButton,
                tabSpaceActiveElements.addressBar,
                tabSpaceActiveElements.menuButton
            ])
        ];
    } else {
        ui.screen = [];
    }
}

rewriteScreen();

getUserData();

ui.events.loaded(function() {
    keyboardShortcuts.init();
    eventQueue.init();
});