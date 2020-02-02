// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

function _newBookmark(bookmark) {
    window._sphere.send({
        _sphereKey: "__KEY__", // The Sphere key will be injected here so that we know the message is genuine
        id: __ID__, // The ID will be injected here so that we know which tab is sending the message
        type: "newBookmark",
        bookmark: bookmark
    });
}

function _deleteBookmark(bookmarkID) {
    window._sphere.send({
        _sphereKey: "__KEY__", // The Sphere key will be injected here so that we know the message is genuine
        id: __ID__, // The ID will be injected here so that we know which tab is sending the message
        type: "deleteBookmark",
        bookmarkID: bookmarkID
    })
}

function _requestBookmarks() {
    window._sphere.send({
        _sphereKey: "__KEY__", // The Sphere key will be injected here so that we know the message is genuine
        id: __ID__, // The ID will be injected here so that we know which tab is sending the message
        type: "bookmarks"
    });
}

function _requestFavicons() {
    window._sphere.send({
        _sphereKey: "__KEY__", // The Sphere key will be injected here so that we know the message is genuine
        id: __ID__, // The ID will be injected here so that we know which tab is sending the message
        type: "favicons"
    });
}

_requestBookmarks();
_requestFavicons();