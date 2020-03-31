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

var userData = {};
var settingsInitialised = false;

const SETTINGS_PAGES = {
    GENERAL: 0,
    ABOUT: 1
};

var selectedSettingsPage = SETTINGS_PAGES.GENERAL;

ui.screen = [
    new appLayout.Sidebar(),
    new appLayout.Content()
];

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
    var searchEngineManagementDialog = new appLayout.Dialog([], {
        height: "500px"
    });
    var searchEngineDeletionDialog = new appLayout.Dialog([], {
        height: "200px"
    });
    var searchEngineModificationDialog = new appLayout.Dialog([], {
        height: "400px"
    });
    var invalidURLDialog = new appLayout.Dialog([
        new appLayout.DialogTitle(_("invalidURL")),
        new appLayout.DialogContent([
            new appLayout.ButtonedContent(_("invalidURLDescription")),
            new appLayout.ButtonedFooter([
                new Button(_("ok"), false, {}, {}, {
                    click: function() {
                        invalidURLDialog.isOpen = false;

                        ui.refresh();

                        dom.element("#searchEngineModificationOKButton").attribute("disabled").delete();
                    }
                })
            ])
        ]),
    ], {
        height: "200px"
    });

    // @asset assets/logo.png

    if (selectedSettingsPage == SETTINGS_PAGES.GENERAL) {
        var searchEngineCandidates = [];
        var searchEngineManagementList = [];

        for (var i = 0; i < userData.search.engines.length; i++) {
            searchEngineCandidates.push(userData.search.engines[i].fullName);

            (function(i) {
                var searchEngineRadioButton = new RadioButtonInput("searchEngineManagementList", userData.search.selectedEngine == i, {
                    "top": "8px",
                    "bottom": "unset",
                    "height": "0"
                }, {}, {
                    change: function(event) {
                        if (event.target.checked) {
                            userData.search.selectedEngine = i;

                            _setUserData(userData);

                            showSettings();
                        }
                    }
                });

                searchEngineManagementList.push(new Label([
                    searchEngineRadioButton,
                    new GroupContainer(userData.search.engines[i].fullName, {
                        "display": "inline-block",
                        "position": "relative",
                        "top": "12px",
                        "height": "fit-content",
                        "flex": "1",
                        "overflow": "hidden",
                        "text-overflow": "ellipsis",
                        "white-space": "nowrap"
                    }),
                    new Button(_("delete"), true, {}, {}, {
                        click: function() {
                            if (userData.search.engines.length > 1) { // We must have at least 2 search engines already
                                searchEngineDeletionDialog.children = [
                                    new appLayout.DialogTitle(_("general_deleteSearchEngine")),
                                    new appLayout.DialogContent([
                                        new appLayout.ButtonedContent([
                                            new Text(_("general_deleteSearchEngineConfirmationStart")),
                                            new TextBoldEffect(userData.search.engines[i].fullName),
                                            new Text(_("general_deleteSearchEngineConfirmationEnd"))
                                        ]),
                                        new appLayout.ButtonedFooter([
                                            new Button(_("yes"), false, {}, {}, {
                                                click: function() {
                                                    userData.search.engines.splice(i, 1);

                                                    if (userData.search.selectedEngine == i) { // Make sure that the deleted search engine can't still be selected
                                                        userData.search.selectedEngine = 0;
                                                    }

                                                    _setUserData(userData);

                                                    searchEngineDeletionDialog.isOpen = false;
                                                    
                                                    showSettings();
                                                }
                                            }),
                                            new Button(_("no"), true, {}, {}, {
                                                click: function() {
                                                    searchEngineDeletionDialog.isOpen = false;

                                                    ui.refresh();
                                                }
                                            })
                                        ])
                                    ])
                                ];

                                searchEngineDeletionDialog.isOpen = true;

                                ui.refresh();
                            } else {
                                searchEngineDeletionDialog.children = [
                                    new appLayout.DialogTitle(_("general_cannotDeleteSearchEngine")),
                                    new appLayout.DialogContent([
                                        new appLayout.ButtonedContent(_("general_cannotDeleteSearchEngineDescription")),
                                        new appLayout.ButtonedFooter([
                                            new Button(_("ok"), false, {}, {}, {
                                                click: function() {
                                                    searchEngineDeletionDialog.isOpen = false;

                                                    ui.refresh();
                                                }
                                            })
                                        ])
                                    ])
                                ];

                                searchEngineDeletionDialog.isOpen = true;

                                ui.refresh();
                            }
                        }
                    }),
                    new Button(_("edit"), false, {}, {}, {
                        click: function() {
                            var searchEngineModificationOKButton = new Button(_("modify"), false, {}, {
                                id: "searchEngineModificationOKButton",
                                disabled: ""
                            }, {
                                click: function() {
                                    if (
                                        searchEngineModificationFullNameInput.value.trim() != "" &&
                                        searchEngineModificationShorterNameInput.value.trim() != "" &&
                                        searchEngineModificationWebsiteInput.value.trim() != "" &&
                                        searchEngineModificationQueryURLInput.value.trim() != ""
                                    ) {
                                        var enteredWebsiteURL = searchEngineModificationWebsiteInput.value.trim();

                                        var websiteAddressQualities = {
                                            full: !!/^[a-zA-Z]+:/g.test(enteredWebsiteURL), // If has a protocol at the start, then should be a full URL
                                            noProtocol: !!/^([^\s])+\.[^\s]+((\/.*.)?)$/.test(enteredWebsiteURL) // If is only a domain name
                                        };
                        
                                        var finalWebsiteURL = "";
                        
                                        if (websiteAddressQualities.full) {
                                            finalWebsiteURL = enteredWebsiteURL;
                                        } else if (websiteAddressQualities.noProtocol) {
                                            finalWebsiteURL = "https://" + enteredWebsiteURL;
                                        } else {
                                            invalidURLDialog.isOpen = true;
                        
                                            ui.refresh();
                        
                                            dom.element("#searchEngineModificationOKButton").attribute("disabled").delete();
                        
                                            return;
                                        }

                                        var enteredQueryURL = searchEngineModificationQueryURLInput.value.trim();

                                        var queryURLQualities = {
                                            full: !!/^[a-zA-Z]+:/g.test(enteredQueryURL), // If has a protocol at the start, then should be a full URL
                                            noProtocol: !!/^([^\s])+\.[^\s]+((\/.*.)?)$/.test(enteredQueryURL) // If is only a domain name
                                        };
                        
                                        var finalQueryURL = "";
                        
                                        if (queryURLQualities.full) {
                                            finalQueryURL = enteredQueryURL;
                                        } else if (queryURLQualities.noProtocol) {
                                            finalQueryURL = "https://" + enteredQueryURL;
                                        } else {
                                            invalidURLDialog.isOpen = true;
                        
                                            ui.refresh();
                        
                                            dom.element("#searchEngineModificationOKButton").attribute("disabled").delete();
                        
                                            return;
                                        }

                                        userData.search.engines[i] = {
                                            name: searchEngineModificationShorterNameInput.value.trim(),
                                            fullName: searchEngineModificationFullNameInput.value.trim(),
                                            website: finalWebsiteURL,
                                            queryURL: finalQueryURL
                                        };

                                        _setUserData(userData);

                                        searchEngineModificationDialog.isOpen = false;

                                        showSettings();
                                    }
                                }
                            });

                            function changeSearchEngineModificationOKButtonState() {
                                if (
                                    dom.element("#searchEngineModificationFullName").reference[0].value.trim() != "" &&
                                    dom.element("#searchEngineModificationShorterName").reference[0].value.trim() != "" &&
                                    dom.element("#searchEngineModificationWebsite").reference[0].value.trim() != "" &&
                                    dom.element("#searchEngineModificationQueryURL").reference[0].value.trim() != ""
                                ) {
                                    dom.element("#searchEngineModificationOKButton").attribute("disabled").delete();
                                } else {
                                    dom.element("#searchEngineModificationOKButton").attribute("disabled").set("");
                                }
                        
                                if (event.code == "Enter") {
                                    searchEngineModificationOKButton.events.click();
                                }
                            }

                            var searchEngineModificationFullNameInput = new TextInput(userData.search.engines[i].fullName, "", false, {}, {
                                id: "searchEngineModificationFullName"
                            }, {
                                keyup: changeSearchEngineModificationOKButtonState
                            });

                            var searchEngineModificationShorterNameInput = new TextInput(userData.search.engines[i].name, "", false, {}, {
                                id: "searchEngineModificationShorterName"
                            }, {
                                keyup: changeSearchEngineModificationOKButtonState
                            });

                            var searchEngineModificationWebsiteInput = new TextInput(userData.search.engines[i].website, "", false, {}, {
                                id: "searchEngineModificationWebsite"
                            }, {
                                keyup: changeSearchEngineModificationOKButtonState
                            });

                            var searchEngineModificationQueryURLInput = new TextInput(userData.search.engines[i].queryURL, "", false, {}, {
                                id: "searchEngineModificationQueryURL"
                            }, {
                                keyup: changeSearchEngineModificationOKButtonState
                            });

                            searchEngineModificationDialog.children = [
                                new appLayout.DialogTitle(_("general_modifySearchEngine")),
                                new appLayout.DialogContent([
                                    new appLayout.ButtonedContent([
                                        new Label([
                                            new Text(_("general_modifySearchEngineFullName")),
                                            searchEngineModificationFullNameInput
                                        ]),
                                        new Label([
                                            new Text(_("general_modifySearchEngineShorterName")),
                                            searchEngineModificationShorterNameInput
                                        ]),
                                        new Label([
                                            new Text(_("general_modifySearchEngineWebsite")),
                                            searchEngineModificationWebsiteInput
                                        ]),
                                        new Label([
                                            new Text(_("general_modifySearchEngineQueryURL")),
                                            searchEngineModificationQueryURLInput
                                        ]),
                                        new Container([new HTML(_("general_modifySearchEngineQueryInfo"))])
                                    ]),
                                    new appLayout.ButtonedFooter([
                                        searchEngineModificationOKButton,
                                        new Button(_("cancel"), true, {}, {}, {
                                            click: function() {
                                                searchEngineModificationDialog.isOpen = false;

                                                ui.refresh();
                                            }
                                        })
                                    ])
                                ])
                            ];

                            searchEngineModificationDialog.isOpen = true;

                            ui.refresh();
                        }
                    })
                ]));
            })(i);
        }

        var searchEngineSelectionInput = new SelectionInput(searchEngineCandidates, userData.search.selectedEngine, false, {}, {}, {
            change: function() {
                userData.search.selectedEngine = searchEngineSelectionInput.selected;

                _setUserData(userData);

                showSettings();
            }
        });

        searchEngineManagementDialog.children = [
            new appLayout.DialogTitle(_("general_manageSearchEngines")),
            new appLayout.DialogContent([
                new appLayout.ButtonedContent([
                    new GroupContainer(searchEngineManagementList),
                    new Container([
                        new NavigationButton(_("general_newSearchEngine"), "add", {}, {}, {
                            click: function() {
                                var searchEngineModificationOKButton = new Button(_("add"), false, {}, {
                                    id: "searchEngineModificationOKButton",
                                    disabled: ""
                                }, {
                                    click: function() {
                                        if (
                                            searchEngineModificationFullNameInput.value.trim() != "" &&
                                            searchEngineModificationShorterNameInput.value.trim() != "" &&
                                            searchEngineModificationWebsiteInput.value.trim() != "" &&
                                            searchEngineModificationQueryURLInput.value.trim() != ""
                                        ) {
                                            var enteredWebsiteURL = searchEngineModificationWebsiteInput.value.trim();
    
                                            var websiteAddressQualities = {
                                                full: !!/^[a-zA-Z]+:/g.test(enteredWebsiteURL), // If has a protocol at the start, then should be a full URL
                                                noProtocol: !!/^([^\s])+\.[^\s]+((\/.*.)?)$/.test(enteredWebsiteURL) // If is only a domain name
                                            };
                            
                                            var finalWebsiteURL = "";
                            
                                            if (websiteAddressQualities.full) {
                                                finalWebsiteURL = enteredWebsiteURL;
                                            } else if (websiteAddressQualities.noProtocol) {
                                                finalWebsiteURL = "https://" + enteredWebsiteURL;
                                            } else {
                                                invalidURLDialog.isOpen = true;
                            
                                                ui.refresh();
                            
                                                dom.element("#searchEngineModificationOKButton").attribute("disabled").delete();
                            
                                                return;
                                            }
    
                                            var enteredQueryURL = searchEngineModificationQueryURLInput.value.trim();
    
                                            var queryURLQualities = {
                                                full: !!/^[a-zA-Z]+:/g.test(enteredQueryURL), // If has a protocol at the start, then should be a full URL
                                                noProtocol: !!/^([^\s])+\.[^\s]+((\/.*.)?)$/.test(enteredQueryURL) // If is only a domain name
                                            };
                            
                                            var finalQueryURL = "";
                            
                                            if (queryURLQualities.full) {
                                                finalQueryURL = enteredQueryURL;
                                            } else if (queryURLQualities.noProtocol) {
                                                finalQueryURL = "https://" + enteredQueryURL;
                                            } else {
                                                invalidURLDialog.isOpen = true;
                            
                                                ui.refresh();
                            
                                                dom.element("#searchEngineModificationOKButton").attribute("disabled").delete();
                            
                                                return;
                                            }
    
                                            userData.search.engines.push({
                                                name: searchEngineModificationShorterNameInput.value.trim(),
                                                fullName: searchEngineModificationFullNameInput.value.trim(),
                                                website: finalWebsiteURL,
                                                queryURL: finalQueryURL
                                            });

                                            userData.search.selectedEngine = userData.search.engines.length - 1;
    
                                            _setUserData(userData);
    
                                            searchEngineModificationDialog.isOpen = false;
    
                                            showSettings();
                                        }
                                    }
                                });
    
                                function changeSearchEngineModificationOKButtonState() {
                                    if (
                                        dom.element("#searchEngineModificationFullName").reference[0].value.trim() != "" &&
                                        dom.element("#searchEngineModificationShorterName").reference[0].value.trim() != "" &&
                                        dom.element("#searchEngineModificationWebsite").reference[0].value.trim() != "" &&
                                        dom.element("#searchEngineModificationQueryURL").reference[0].value.trim() != ""
                                    ) {
                                        dom.element("#searchEngineModificationOKButton").attribute("disabled").delete();
                                    } else {
                                        dom.element("#searchEngineModificationOKButton").attribute("disabled").set("");
                                    }
                            
                                    if (event.code == "Enter") {
                                        searchEngineModificationOKButton.events.click();
                                    }
                                }
    
                                var searchEngineModificationFullNameInput = new TextInput("", "", false, {}, {
                                    id: "searchEngineModificationFullName"
                                }, {
                                    keyup: changeSearchEngineModificationOKButtonState
                                });
    
                                var searchEngineModificationShorterNameInput = new TextInput("", "", false, {}, {
                                    id: "searchEngineModificationShorterName"
                                }, {
                                    keyup: changeSearchEngineModificationOKButtonState
                                });
    
                                var searchEngineModificationWebsiteInput = new TextInput("", "", false, {}, {
                                    id: "searchEngineModificationWebsite"
                                }, {
                                    keyup: changeSearchEngineModificationOKButtonState
                                });
    
                                var searchEngineModificationQueryURLInput = new TextInput("", "", false, {}, {
                                    id: "searchEngineModificationQueryURL"
                                }, {
                                    keyup: changeSearchEngineModificationOKButtonState
                                });
    
                                searchEngineModificationDialog.children = [
                                    new appLayout.DialogTitle(_("general_modifySearchEngine")),
                                    new appLayout.DialogContent([
                                        new appLayout.ButtonedContent([
                                            new Label([
                                                new Text(_("general_modifySearchEngineFullName")),
                                                searchEngineModificationFullNameInput
                                            ]),
                                            new Label([
                                                new Text(_("general_modifySearchEngineShorterName")),
                                                searchEngineModificationShorterNameInput
                                            ]),
                                            new Label([
                                                new Text(_("general_modifySearchEngineWebsite")),
                                                searchEngineModificationWebsiteInput
                                            ]),
                                            new Label([
                                                new Text(_("general_modifySearchEngineQueryURL")),
                                                searchEngineModificationQueryURLInput
                                            ]),
                                            new Container([new HTML(_("general_modifySearchEngineQueryInfo"))])
                                        ]),
                                        new appLayout.ButtonedFooter([
                                            searchEngineModificationOKButton,
                                            new Button(_("cancel"), true, {}, {}, {
                                                click: function() {
                                                    searchEngineModificationDialog.isOpen = false;
    
                                                    ui.refresh();
                                                }
                                            })
                                        ])
                                    ])
                                ];
    
                                searchEngineModificationDialog.isOpen = true;
    
                                ui.refresh();
                            }
                        })
                    ], 12, {
                        "text-align": "center"
                    })
                ]),
                new appLayout.ButtonedFooter([
                    new Button(_("ok"), false, {}, {}, {
                        click: function() {
                            searchEngineManagementDialog.isOpen = false;

                            ui.refresh();
                        }
                    })
                ])
            ])
        ];

        settingsPageContents = [
            new Heading(_("settings")),
            new Heading(_("general_searchEngine"), 2),
            new Label([
                new Text(_("general_defaultSearchEngine")),
                searchEngineSelectionInput
            ]),
            new Label([
                new Text(),
                new NavigationButton(_("general_manageSearchEngines"), "", {}, {}, {
                    click: function() {
                        searchEngineManagementDialog.isOpen = true;

                        ui.refresh();
                    }
                })
            ])
        ];
    }

    if (selectedSettingsPage == SETTINGS_PAGES.ABOUT) {
        settingsPageContents = [
            new Heading(_("about")),
            new GroupContainer([
                new Container([new Image(importer.generateLink(_assets["logo.png"], "image/png"), _("about_logo"), {
                    "height": "80px",
                    "object-fit": "contain"
                })], 1),
                new Container([
                    new Heading(
                        core.parameter("version") ?
                        _("about_version", core.parameter("version")) :
                        _("about_name"),
                        2, {"margin": "0"}
                    ),
                    new Paragraph(_("about_description"))
                ], 11)
            ]),
            new Paragraph(_("about_copyright")),
            new Paragraph(_("about_copyrightExtra")),
            new Paragraph(_("about_licence")),
            new Paragraph(_("about_openSource"))
        ];
    }

    ui.screen = [
        new appLayout.Sidebar(getSidebarContents()),
        new appLayout.Content(settingsPageContents),
        searchEngineManagementDialog,
        searchEngineDeletionDialog,
        searchEngineModificationDialog,
        invalidURLDialog
    ];

    ui.refresh();
}

window.addEventListener("message", function(event) {
    if (event.data.type == "_sphereUserData") {
        userData = event.data.data;
    }

    if (!settingsInitialised) {
        showSettings();

        settingsInitialised = true;
    }
});

// Get the latest user data so that there is less overwrite collisions
setInterval(function() {
    _getUserData();
}, 3000);