// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

document.body.addEventListener("keyup", function(event) {
    window._sphere.send({
        _sphereKey: "__KEY__", // The Sphere key will be injected here so that we know the message is genuine
        id: __ID__, // The ID will be injected here so that we know which tab is sending the message
        type: "keyup",
        event: {
            code: event.code,
            ctrlKey: event.ctrlKey,
            altKey: event.altKey,
            shiftKey: event.shiftKey
        }
    });
});