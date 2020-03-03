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

const SETTINGS_PAGES = {
    GENERAL: 0,
    ABOUT: 1
};

var selectedSettingsPage = SETTINGS_PAGES.GENERAL;

function getSidebarContents() {
    var settingsPageInformation = [
        {id: SETTINGS_PAGES.GENERAL, name: _("general"), icon: "settings"},
        {id: SETTINGS_PAGES.ABOUT, name: _("about"), icon: "info"}
    ];

    var sidebarContents = [];

    for (var i = 0; i < settingsPageInformation.length; i++) {
        sidebarContents.push((function(page) {
            return new appLayout.MenuButton(page.name, selectedSettingsPage == page.id, {}, {}, {
                click: function() {
                    selectedSettingsPage = page.id;

                    showSettings();
                }
            });
        })(settingsPageInformation[i]));
    }

    return sidebarContents;
}

function showSettings() {
    var settingsPageContents = [];

    // @asset assets/logo.png

    if (selectedSettingsPage == SETTINGS_PAGES.GENERAL) {
        // TODO: Add more parts to Settings page, such as ability to change search engine

        settingsPageContents = [
            new Heading(_("settings")),
            new Paragraph("Coming soon! Expect some new features coming your way, such as changing your search engine and configuring keyboard shortcuts.")
        ];
    }

    if (selectedSettingsPage == SETTINGS_PAGES.ABOUT) {
        settingsPageContents = [
            new Heading(_("about")),
            new GroupContainer([
                new Container([new Image(importer.generateLink(_assets["logo.png"], "image/png"), _("aboutLogo"), {
                    "height": "80px",
                    "object-fit": "contain"
                })], 1),
                new Container([
                    new Heading(
                        core.parameter("version") ?
                        _("aboutVersion", core.parameter("version")) :
                        _("aboutName"),
                        2, {"margin": "0"}
                    ),
                    new Paragraph(_("aboutDescription"))
                ], 11)
            ]),
            new Paragraph(_("aboutCopyright")),
            new Paragraph(_("aboutCopyrightExtra")),
            new Paragraph(_("aboutLicence")),
            new Paragraph(_("aboutOpenSource"))
        ];
    }

    ui.screen = [
        new appLayout.Sidebar(getSidebarContents()),
        new appLayout.Content(settingsPageContents)
    ];

    ui.refresh();
}

showSettings();