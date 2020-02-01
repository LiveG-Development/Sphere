// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

// @import https://opensource.liveg.tech/Adapt-UI/src/ui

// @import https://opensource.liveg.tech/ZaprCoreLibs/src/core/core

// @import models/bookmarks/model

core.unpack(ui.components);
core.unpack(ui.models);

var userBookmarks = [];
var userFavicons = {};

function showBookmarks() {
    var bookmarkIcons = [];

    for (var i = 0; i < userBookmarks.length; i++) {
        bookmarkIcons.push(new bookmarks.BookmarkIcon(
            userBookmarks[i].url,
            userBookmarks[i].siteTitle,
            userFavicons[userBookmarks[i].url.split("?")[0].replace(/\/+$/, "")]
        ))
    }

    var bookmarkNameInput = new TextInput("", "Bookmark name");
    var bookmarkURLInput = new TextInput("", "Bookmark URL");

    ui.screen = [
        new Container([
            new Heading("New Tab"),
            new Container(bookmarkIcons),
            new Container([
                bookmarkNameInput,
                bookmarkURLInput,
                new Button("Add bookmark", false, {}, {}, {
                    click: function() {
                        _newBookmark({
                            url: bookmarkURLInput.value,
                            siteTitle: bookmarkNameInput.value
                        });
    
                        _requestBookmarks();
                        _requestFavicons();
                    }
                })
            ])
        ], 12, {
            "text-align": "center"
        })
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

showBookmarks();