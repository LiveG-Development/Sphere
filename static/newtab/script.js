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

// UI design

core.unpack(ui.components);
core.unpack(ui.models);

var userBookmarks = [];
var userFavicons = {};

function showBookmarks() {
    var bookmarkIcons = [];

    var deleteBookmarkDialog = new appLayout.Dialog([], {
        height: "200px"
    });

    var deleteBookmarkDialogTarget = 0;
    var deleteBookmarkDialogName = "";

    function setDeleteBookmarkDialog() {
        deleteBookmarkDialog.children = [
            new appLayout.DialogTitle(_("deleteBookmark")),
            new appLayout.DialogContent([
                new appLayout.ButtonedContent([
                    new Text(_("deleteBookmarkConfirmationStart")),
                    new TextBoldEffect(deleteBookmarkDialogName),
                    new Text(_("deleteBookmarkConfirmationEnd"))
                ]),
                new appLayout.ButtonedFooter([
                    new Button(_("yes"), false, {}, {}, {
                        click: function() {
                            _deleteBookmark(deleteBookmarkDialogTarget);

                            userBookmarks.splice(deleteBookmarkDialogTarget, 1);

                            deleteBookmarkDialog.isOpen = false;

                            showBookmarks();

                            ui.refresh();
                        }
                    }),
                    new Button(_("no"), true, {}, {}, {
                        click: function() {
                            deleteBookmarkDialog.isOpen = false;

                            ui.refresh();
                        }
                    })
                ])
            ])
        ];
    }

    for (var i = 0; i < userBookmarks.length; i++) {
        (function(i) {
            bookmarkIcons.push(new bookmarks.BookmarkIcon(
                userBookmarks[i].url,
                userBookmarks[i].siteTitle,
                userFavicons[userBookmarks[i].url.split("?")[0].replace(/\/+$/, "")],
                {}, {}, {}, {
                    click: function() {
                        deleteBookmarkDialogTarget = i;
                        deleteBookmarkDialogName = userBookmarks[i].siteTitle;

                        setDeleteBookmarkDialog();

                        deleteBookmarkDialog.isOpen = true;

                        ui.refresh();
                    }
                }
            ));
        })(i);
    }

    bookmarkIcons.push(new bookmarks.AddBookmarkIcon({}, {}, {
        click: function() {
            bookmarkNameInput.value = "";
            bookmarkURLInput.value = "";

            addBookmarkDialog.isOpen = true;

            ui.refresh();
        }
    }));

    var invalidBookmarkDialog = new appLayout.Dialog([
        new appLayout.DialogTitle(_("invalidBookmark")),
        new appLayout.DialogContent([
            new appLayout.ButtonedContent(_("invalidBookmarkDescription")),
            new appLayout.ButtonedFooter([
                new Button(_("ok"), false, {}, {}, {
                    click: function() {
                        invalidBookmarkDialog.isOpen = false;

                        ui.refresh();

                        dom.element("#addBookmarkDialogOKButton").attribute("disabled").delete();
                    }
                })
            ])
        ])
    ], {
        height: "200px"
    });

    var addBookmarkDialogOKButton = new Button(_("add"), false, {}, {
        id: "addBookmarkDialogOKButton",
        disabled: ""
    }, {
        click: function() {
            if (bookmarkNameInput.value.trim() != "" && bookmarkURLInput.value.trim() != "") {
                var enteredURL = bookmarkURLInput.value.trim();

                var addressQualities = {
                    full: !!/^[a-zA-Z]+:/g.test(enteredURL), // If has a protocol at the start, then should be a full URL
                    noProtocol: !!/^([^\s])+\.[^\s]+((\/.*.)?)$/.test(enteredURL) // If is only a domain name
                };

                var finalURL = "";

                if (addressQualities.full) {
                    finalURL = enteredURL;
                } else if (addressQualities.noProtocol) {
                    finalURL = "https://" + enteredURL;
                } else {
                    invalidBookmarkDialog.isOpen = true;

                    ui.refresh();

                    dom.element("#addBookmarkDialogOKButton").attribute("disabled").delete();

                    return;
                }

                _newBookmark({
                    url: finalURL,
                    siteTitle: bookmarkNameInput.value.trim()
                });

                _requestBookmarks();
                _requestFavicons();

                addBookmarkDialog.isOpen = false;

                ui.refresh();
            }
        }
    });

    function changeAddBookmarkDialogOKButtonState() {
        if (dom.element("#bookmarkName").reference[0].value.trim() != "" && dom.element("#bookmarkURL").reference[0].value.trim() != "") {
            dom.element("#addBookmarkDialogOKButton").attribute("disabled").delete();
        } else {
            dom.element("#addBookmarkDialogOKButton").attribute("disabled").set("");
        }
    }

    var bookmarkNameInput = new TextInput("", "", false, {}, {
        id: "bookmarkName"
    }, {
        keyup: changeAddBookmarkDialogOKButtonState
    });

    var bookmarkURLInput = new FormattedInput(ui.enums.formats.URL, "", "", false, {}, {
        id: "bookmarkURL"
    }, {
        keyup: changeAddBookmarkDialogOKButtonState
    });

    var addBookmarkDialog = new appLayout.Dialog([
        new appLayout.DialogTitle(_("addBookmark")),
        new appLayout.DialogContent([
            new appLayout.ButtonedContent([
                new Paragraph(_("addBookmarkDescription")),
                new Label([
                    new Text(_("bookmarkName")),
                    bookmarkNameInput
                ]),
                new Label([
                    new Text(_("bookmarkAddress")),
                    bookmarkURLInput
                ])
            ]),
            new appLayout.ButtonedFooter([
                addBookmarkDialogOKButton,
                new Button(_("cancel"), true, {}, {}, {
                    click: function() {
                        addBookmarkDialog.isOpen = false;

                        ui.refresh();
                    }
                })
            ])
        ])
    ], {
        height: "320px"
    });

    ui.screen = [
        new bookmarks.BookmarkContainer(bookmarkIcons),
        addBookmarkDialog,
        invalidBookmarkDialog,
        deleteBookmarkDialog
    ];
}

window.addEventListener("message", function(event) {
    if (event.data.type == "_sphereBookmarks") {
        userBookmarks = event.data.data;
    } else if (event.data.type == "_sphereFavicons") {
        userFavicons = event.data.data;
    }

    showBookmarks();
    ui.refresh();
});

ui.events.loaded(function() {
    showBookmarks(); 
});