// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

var historyControl = {
    listing: []
};

/*
    @name historyControl.load

    @shortDescription Load in user data for history storage.
*/
historyControl.load = function() {
    getUserData();

    if (userData.history == undefined || userData.history.listing == undefined) {
        getUserData();

        if (userData.history == undefined) {
            userData.history = {};
        }

        userData.history.listing = historyControl.listing;

        saveUserData();
    } else {
        getUserData();

        historyControl.listing = userData.history.listing;
    }
};

/*
    @name historyControl.add

    @param url string URL of page to add to history listing.
    @param title any Title of page to add to history listing in form of a string. If there is no title, then the value should be `null`. Default: `null`.
    @param date Date Date at point of page load to add to history listing. Default: `new Date()`.
    @param removeDuplicates boolean Whether to remove recent duplicates in the history listing (for example, to prevent page refreshes from being stored). Default: `true`.

    @shortDescription Add page to history listing.
*/
historyControl.add = function(url, title = null, date = new Date(), removeDuplicates = true) {
    getUserData();

    if (removeDuplicates) {
        if (historyControl.listing.length != 0 && historyControl.listing[historyControl.listing.length - 1].url == url) {
            return;
        }
    }

    historyControl.listing = userData.history.listing;

    historyControl.listing.push({
        url: url,
        title: title,
        date: date.getTime()
    });

    userData.history.listing = historyControl.listing;

    saveUserData();
};