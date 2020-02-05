// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

var errors = {};

/*
    @name errors.getErrorInformation

    @param errorCode number Code for error to get information from.

    @return object UI object containing information about the specified error.

    @shortDescription Get a UI object containing information about an error code.
*/
errors.getErrorInformation = function(errorCode) {
    // Fallback, when the error code cannot be identified
    return [
        new Heading(_("pageNotLoaded")),
        new Paragraph(_("pageNotLoadedDescription")),
        new Paragraph(_("solutions")),
        new UnorderedList([
            new ListItem(_("pageNotLoadedSolution1")),
            new ListItem(_("pageNotLoadedSolution2")),
            new ListItem(_("pageNotLoadedSolution3"))
        ]),
        new Paragraph(_("errorCode", errorCode), {}, {
            class: "errorCode"
        })
    ];
};