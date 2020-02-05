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
    var errorCodeInformation = new Paragraph(_("errorCode", errorCode), {}, {
        class: "errorCode"
    })

    if (errorCode == -6) { // FILE_NOT_FOUND
        return [
            new Heading(_("fileNotFound")),
            new Paragraph(_("fileNotFoundDescription")),
            new Paragraph(_("solutions")),
            new UnorderedList([
                new ListItem(_("fileNotFoundSolution1")),
                new ListItem(_("fileNotFoundSolution2")),
                new ListItem(_("fileNotFoundSolution3"))
            ]),
            errorCodeInformation
        ];
    }
    
    if (errorCode == -7) { // TIMED_OUT
        return [
            new Heading(_("timedOut")),
            new Paragraph(_("timedOutDescription")),
            new Paragraph(_("solutions")),
            new UnorderedList([
                new ListItem(_("timedOutSolution1")),
                new ListItem(_("timedOutSolution2")),
                new ListItem(_("timedOutSolution3"))
            ]),
            errorCodeInformation
        ];
    }

    if (errorCode == -7) { // FILE_TOO_BIG
        return [
            new Heading(_("memory")),
            new Paragraph(_("memoryDescription")),
            errorCodeInformation
        ];
    }

    if (errorCode == -10) { // ACCESS_DENIED
        return [
            new Heading(_("accessDenied")),
            new Paragraph(_("accessDeniedDescription")),
            new Paragraph(_("solutions")),
            new UnorderedList([
                new ListItem(_("accessDeniedSolution1")),
                new ListItem(_("accessDeniedSolution2")),
                new ListItem(_("accessDeniedSolution3"))
            ]),
            errorCodeInformation
        ];
    }

    if (errorCode == -12) { // INSUFFICIENT_RESOURCES
        return [
            new Heading(_("memory")),
            new Paragraph(_("memoryDescription")),
            errorCodeInformation
        ];
    }

    if (errorCode == -13) { // OUT_OF_MEMORY
        return [
            new Heading(_("memory")),
            new Paragraph(_("memoryDescription")),
            errorCodeInformation
        ];
    }

    if (errorCode == -19) { // FILE_VIRUS_DETECTED
        return [
            new Heading(_("virusDetected")),
            new Paragraph(_("virusDetectedDescription")),
            errorCodeInformation
        ];
    }

    if (errorCode == -21) { // NETWORK_CHANGED
        return [
            new Heading(_("networkChanged")),
            new Paragraph(_("networkChangedDescription")),
            new Paragraph(_("solutions")),
            new UnorderedList([
                new ListItem(_("networkChangedSolution1")),
                new ListItem(_("networkChangedSolution2")),
                new ListItem(_("networkChangedSolution3"))
            ]),
            errorCodeInformation
        ];
    }

    if (errorCode == -100 || errorCode == -101 || errorCode == -102 || errorCode == -103 || errorCode == -104) { // CONNECTION_CLOSED, CONNECTION_RESET, CONNECTION_REFUSED, CONNECTION_ABORTED, CONNECTION_FAILED
        return [
            new Heading(_("connection")),
            new Paragraph(_("connectionDescription")),
            new Paragraph(_("solutions")),
            new UnorderedList([
                new ListItem(_("connectionSolution1")),
                new ListItem(_("connectionSolution2")),
                new ListItem(_("connectionSolution3"))
            ]),
            errorCodeInformation
        ];
    }

    if (errorCode == -105) { // NAME_NOT_RESOLVED
        return [
            new Heading(_("nameNotResolved")),
            new Paragraph(_("nameNotResolvedDescription")),
            new Paragraph(_("solutions")),
            new UnorderedList([
                new ListItem(_("nameNotResolvedSolution1")),
                new ListItem(_("nameNotResolvedSolution2")),
                new ListItem(_("nameNotResolvedSolution3"))
            ]),
            errorCodeInformation
        ];
    }

    if (errorCode == -105) { // INTERNET_DISCONNECTED
        return [
            new Heading(_("internetDisconnected")),
            new Paragraph(_("internetDisconnectedDescription")),
            new Paragraph(_("solutions")),
            new UnorderedList([
                new ListItem(_("internetDisconnectedSolution1")),
                new ListItem(_("internetDisconnectedSolution2")),
                new ListItem(_("internetDisconnectedSolution3"))
            ]),
            errorCodeInformation
        ];
    }

    if (errorCode == -118) { // CONNECTION_TIMED_OUT
        return [
            new Heading(_("timedOut")),
            new Paragraph(_("timedOutDescription")),
            new Paragraph(_("solutions")),
            new UnorderedList([
                new ListItem(_("timedOutSolution1")),
                new ListItem(_("timedOutSolution2")),
                new ListItem(_("timedOutSolution3"))
            ]),
            errorCodeInformation
        ];
    }

    if (errorCode == -137) { // NAME_RESOLUTION_FAILED
        return [
            new Heading(_("nameResolution")),
            new Paragraph(_("nameResolutionDescription")),
            new Paragraph(_("solutions")),
            new UnorderedList([
                new ListItem(_("nameResolutionSolution1")),
                new ListItem(_("nameResolutionSolution2")),
                new ListItem(_("nameResolutionSolution3"))
            ]),
            errorCodeInformation
        ];
    }

    if (errorCode <= -200 && errorCode >= -219) { // Certitficate errors
        return [
            new Heading(_("security")),
            new Paragraph(_("securityDescription")),
            new Paragraph(_("solutions")),
            new UnorderedList([
                new ListItem(_("securitySolution1")),
                new ListItem(_("securitySolution2")),
                new ListItem(_("securitySolution3"))
            ]),
            errorCodeInformation
        ];
    }

    if (errorCode == -310) { // TOO_MANY_REDIRECTS
        return [
            new Heading(_("tooManyRedirects")),
            new Paragraph(_("tooManyRedirectsDescription")),
            new Paragraph(_("solutions")),
            new UnorderedList([
                new ListItem(_("tooManyRedirectsSolution1")),
                new ListItem(_("tooManyRedirectsSolution2")),
                new ListItem(_("tooManyRedirectsSolution3"))
            ]),
            errorCodeInformation
        ];
    }

    if (errorCode <= -800 && errorCode >= -803) { // DNS errors
        return [
            new Heading(_("dns")),
            new Paragraph(_("dnsDescription")),
            new Paragraph(_("solutions")),
            new UnorderedList([
                new ListItem(_("dnsSolution1")),
                new ListItem(_("dnsSolution2")),
                new ListItem(_("dnsSolution3"))
            ]),
            errorCodeInformation
        ];
    }
    
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
        errorCodeInformation
    ];
};