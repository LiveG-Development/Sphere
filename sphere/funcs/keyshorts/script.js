// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

// @import https://opensource.liveg.tech/ZaprCoreLibs/src/dom/dom

var keyboardShortcuts = {};

keyboardShortcuts.shortcuts = {
    newTab: {
        keyCode: "KeyT",
        ctrl: true,
        action: function() {
            tabSpaceActiveElements.newTabButton.events.click();
        }
    },

    closeTab: {
        keyCode: "KeyW",
        ctrl: true,
        action: function() {
            for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
                if (tabSpaceActiveElements.tabs[i].selected) {
                    tabSpaceActiveElements.tabs[i].close();
                }
            }
        }
    }
};

/*
    @name keyboardShortcuts.handleShortcut

    @param keyCode string String-based key code of main key in shortcut.
    @param ctrl boolean Whether the Ctrl key is being pressed in the shortcut. Default: `false`.
    @param alt boolean Whether the Alt key is being pressed in the shortcut. Default: `false`.
    @param shift boolean Whether the Shift key is being pressed in the shortcut. Default: `false`.

    @return boolean Whether the keyboard shortcut is still uncaptured.

    @shortDescription Handle the key combination specified as a shortcut action.
*/
keyboardShortcuts.handleShortcut = function(keyCode, ctrl = false, alt = false, shift = false) {
    for (var i = 0; i < Object.keys(keyboardShortcuts.shortcuts).length; i++) {
        var shortcut = keyboardShortcuts.shortcuts[Object.keys(keyboardShortcuts.shortcuts)[i]];

        if (shortcut.keyCode == keyCode && (shortcut.ctrl || false) == ctrl && (shortcut.alt || false) == alt && (shortcut.shift || false) == shift) {
            shortcut.action();

            return false;
        }
    }

    return true;
};

/*
    @name keyboardShortcuts.handleEvent

    @param event object Event data to handle.

    @shortDescription Handle the event as a keyboard shortcut.
*/
keyboardShortcuts.handleEvent = function(event) {
    return keyboardShortcuts.handleShortcut(event.code, event.ctrlKey, event.altKey, event.shiftKey);
};

/*
    @name keyboardShortcuts.init

    @shortDescription Initialise events so that keyboard shortcuts can be detected.
*/
keyboardShortcuts.init = function() {
    dom.element("body").events.listen("keypress", function(event) {
        keyboardShortcuts.handleEvent(event);
    });
};