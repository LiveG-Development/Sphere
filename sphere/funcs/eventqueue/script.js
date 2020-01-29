// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

// @import ../keyshorts/script

var eventQueue = {};

/*
    @name keyboardShortcuts.handleQueue

    @param queue object Queue to handle.

    @shortDescription Handle the specified queue of event requests.
*/
eventQueue.handleQueue = function(queue) {
    for (var i = 0; i < queue.length; i++) {
        var eventRequest = queue[i];

        if (eventRequest.type == "keyup") {
            keyboardShortcuts.handleEvent(eventRequest.event);
        }
    }
};

/*
    @name keyboardShortcuts.init

    @shortDescription Initialise events so that keyboard shortcuts can be detected.
*/
eventQueue.init = function() {
    setInterval(function() {
        eventQueue.handleQueue(remote.getGlobal("tabInformation").events);

        remote.getGlobal("tabInformation").events = [];
    });
};