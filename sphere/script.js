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

// @import funcs/focussed/script

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
    new tabSpace.TabRow([
        new tabSpace.TabStrip(tabs),
        new tabSpace.NewTabButton()
    ]),
    new tabSpace.ActionsRow([
        new tabSpace.AddressBar("", _("searchUsing", ["Google"]))
    ])
];