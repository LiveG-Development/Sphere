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

core.unpack(ui.components);

ui.screen = [
    new Container([
        new Heading("The page could not be loaded (" + core.parameter("code") + ")"),
        new Paragraph("The Error page is still work-in-progress!")
    ], 12, {
        "text-align": "center"
    })
];