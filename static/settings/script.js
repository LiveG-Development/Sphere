// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

// @import https://opensource.liveg.tech/Adapt-UI/src/ui
// @import https://opensource.liveg.tech/Adapt-UI/src/models/applayout/model

// @import https://opensource.liveg.tech/ZaprCoreLibs/src/core/core
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/dom/dom
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/l10n/l10n
// @import https://opensource.liveg.tech/ZaprCoreLibs/src/importer/importer

// @import models/bookmarks/model

// Locale integration configuration

// @asset locale/en_GB.json

l10n.load("en_GB", importer.getString(_assets["en_GB.json"]));

var lang = l10n.getBrowserLocale();

function _() {
    return l10n.translate(...arguments);
}

if (core.parameter("lang") != null) {
    lang = core.parameter("lang");
}

if (!(lang in l10n.locales)) {
    lang = "en_GB";
}

l10n.use(lang);

ui.mirroringDirection = l10n.languageData.direction;
ui.language = lang;

// Favicon link generation

// @asset assets/favicon.png

dom.element("head").newChild(importer.generateLinkDOMElement(_assets["favicon.png"], "image/png", "shortcut icon"));

// UI design

core.unpack(ui.components);
core.unpack(ui.models);