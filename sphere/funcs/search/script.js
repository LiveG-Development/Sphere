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

    if (userData.search == null || userData.search.engines == null || userData.search.engines.length == 0) {
        search = {
            engines: [
                {
                    name: "Google",
                    fullName: "Google (United Kingdom)",
                    website: "https://www.google.co.uk",
                    queryURL: "https://www.google.co.uk/search?q=%s"
                }
            ],
        
            selectedEngine: 0
        };

        getUserData();

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