// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

// @import https://opensource.liveg.tech/Adapt-UI/src/ui

// @import https://opensource.liveg.tech/ZaprCoreLibs/src/dom/dom
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/importer/importer
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/l10n/l10n

// @import models/tabspace/model

// Electron remote access

const remote = require("electron").remote;

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

// UI design

core.unpack(ui.components);
core.unpack(ui.models);

tabs.push(new tabSpace.Tab("https://liveg.tech"));

tabs[0].selected = true;

ui.screen = [
    // // new Heading(_("helloWorld"), 1)
    // new Button("Google", false, {}, {}, {
    //     click: function() {
    //         browser.newTab("https://google.com");
    //     }
    // }),
    // new Button("1", false, {}, {}, {
    //     click: function() {
    //         browser.tab(0).switch();
    //     }
    // }),
    // new Button("2", false, {}, {}, {
    //     click: function() {
    //         browser.tab(1).switch();
    //     }
    // }),
    // new Button("3", false, {}, {}, {
    //     click: function() {
    //         browser.tab(2).switch();
    //     }
    // })

    new tabSpace.TabRow([
        new tabSpace.TabStrip(tabs),
        new tabSpace.NewTabButton()
    ])
];