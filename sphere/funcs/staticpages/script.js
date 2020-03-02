// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

var _currentDirectory = remote.getGlobal("CURRENT_DIRECTORY").replace(/\\/g, "/");

var staticPages = {
    newTab: "file:///" + _currentDirectory + "/static/newtab/build/tech.liveg.sphere.newTab-0.1.0.html",
    error: "file:///" + _currentDirectory + "/static/error/build/tech.liveg.sphere.error-0.1.0.html",
    settings: "file:///" + _currentDirectory + "/static/settings/build/tech.liveg.sphere.settings-0.1.0.html"
};