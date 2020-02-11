// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

var menu = {};

/*
    @name menu.show

    @param items object The list of menu items to show.
    @param position ui.Vector The position at which the menu should show.

    @shortDescription Show a system menu based on the menu items given and the position of the menu.
*/
menu.show = function(items, position) {
    menu._object = remote.Menu.buildFromTemplate(items);

    menu._object.popup({
        x: position.x,
        y: position.y
    });
};

/*
    @name menu.hide

    @shortDescription Hide the currently-showing system menu.
*/
menu.hide = function() {
    if (menu._object != undefined) {
        menu._object.closePopup();

        delete menu._object;
    }
};