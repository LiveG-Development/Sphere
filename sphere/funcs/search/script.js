// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

var search = {};

/*
    @name search.load

    @shortDescription Load in user data for configuring search settings.
*/
search.load = function() {
    getUserData();

    if (userData.search == undefined || userData.search.engines == undefined || userData.search.engines.length == 0) {
        search = {
            engines: [
                {
                    name: "Google",
                    fullName: "Google",
                    website: "https://www.google.com",
                    queryURL: "https://www.google.com/search?q=%s"
                },
                {
                    name: "Bing",
                    fullName: "Bing",
                    website: "https://bing.com",
                    queryURL: "https://bing.com/search?q=%s"
                },
                {
                    name: "Yahoo!",
                    fullName: "Yahoo!",
                    website: "https://search.yahoo.com",
                    queryURL: "https://search.yahoo.com/search?q=%s"
                },
                {
                    name: "DuckDuckGo",
                    fullName: "DuckDuckGo",
                    website: "https://duckduckgo.com",
                    queryURL: "https://duckduckgo.com/?q=%s"
                },
                {
                    name: "Ecosia",
                    fullName: "Ecosia",
                    website: "https://ecosia.org",
                    queryURL: "https://ecosia.org/search?q=%s"
                }
            ],
        
            selectedEngine: 0
        };

        getUserData();

        if (userData.search == undefined) {
            userData.search = {};
        }

        userData.search.engines = search.engines;
        userData.search.selectedEngine = search.selectedEngine;

        saveUserData();
    } else {
        getUserData();

        search.engines = userData.search.engines;
        search.selectedEngine = userData.search.selectedEngine;
    }
}

/*
    @name search.queryToURL

    @param query string Search query to insert into URL.
    @param engine object Search engine to use for final URL. Default: `search.engines[0]`.

    @return string The search engine's URL containing the query.

    @shortDescription Insert search query into a URL specified by the search engine.
*/
search.queryToURL = function(query, engine = search.engines[search.selectedEngine || 0]) {
    return engine.queryURL.replace(/%s/g, encodeURIComponent(query));
};

search.load();