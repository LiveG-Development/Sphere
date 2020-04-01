// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

// @import https://opensource.liveg.tech/ZaprCoreLibs/src/dom/dom

// @import ../platform/script

var keyboardShortcuts = {};

keyboardShortcuts.shortcuts = {
    newTab: {
        keyCode: "KeyT",
        ctrl: true,
        action: function() {
            tabSpaceActiveElements.newTabButton.events.click();
        }
    },

    newWindow: {
        keyCode: "KeyN",
        ctrl: true,
        action: function() {
            remote.getGlobal("newWindow")();
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
    },

    previousTab: {
        keyCode: "Tab",
        ctrl: true,
        shift: true,
        action: function() {
            for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
                if (tabSpaceActiveElements.tabs[i].selected) {
                    if (i - 1 < 0) {
                        tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();
                    } else {
                        tabSpaceActiveElements.tabs[i - 1].switch();
                    }

                    ui.refresh();

                    break;
                }
            }
        }
    },

    nextTab: {
        keyCode: "Tab",
        ctrl: true,
        action: function() {
            for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
                if (tabSpaceActiveElements.tabs[i].selected) {
                    if (i + 1 >= tabSpaceActiveElements.tabs.length) {
                        tabSpaceActiveElements.tabs[0].switch();
                    } else {
                        tabSpaceActiveElements.tabs[i + 1].switch();
                    }

                    ui.refresh();

                    break;
                }
            }
        }
    },

    tab1: {
        keyCode: "Digit1",
        ctrl: true,
        action: function() {
            if (tabSpaceActiveElements.tabs.length >= 1) {
                tabSpaceActiveElements.tabs[0].switch();
            } else {
                tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();
            }

            ui.refresh();
        }
    },

    tab2: {
        keyCode: "Digit2",
        ctrl: true,
        action: function() {
            if (tabSpaceActiveElements.tabs.length >= 2) {
                tabSpaceActiveElements.tabs[1].switch();
            } else {
                tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();
            }

            ui.refresh();
        }
    },

    tab3: {
        keyCode: "Digit3",
        ctrl: true,
        action: function() {
            if (tabSpaceActiveElements.tabs.length >= 3) {
                tabSpaceActiveElements.tabs[2].switch();
            } else {
                tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();
            }

            ui.refresh();
        }
    },

    tab4: {
        keyCode: "Digit4",
        ctrl: true,
        action: function() {
            if (tabSpaceActiveElements.tabs.length >= 4) {
                tabSpaceActiveElements.tabs[3].switch();
            } else {
                tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();
            }

            ui.refresh();
        }
    },

    tab5: {
        keyCode: "Digit5",
        ctrl: true,
        action: function() {
            if (tabSpaceActiveElements.tabs.length >= 5) {
                tabSpaceActiveElements.tabs[4].switch();
            } else {
                tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();
            }

            ui.refresh();
        }
    },

    tab6: {
        keyCode: "Digit6",
        ctrl: true,
        action: function() {
            if (tabSpaceActiveElements.tabs.length >= 6) {
                tabSpaceActiveElements.tabs[5].switch();
            } else {
                tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();
            }

            ui.refresh();
        }
    },

    tab7: {
        keyCode: "Digit7",
        ctrl: true,
        action: function() {
            if (tabSpaceActiveElements.tabs.length >= 7) {
                tabSpaceActiveElements.tabs[6].switch();
            } else {
                tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();
            }

            ui.refresh();
        }
    },

    tab8: {
        keyCode: "Digit8",
        ctrl: true,
        action: function() {
            if (tabSpaceActiveElements.tabs.length >= 8) {
                tabSpaceActiveElements.tabs[7].switch();
            } else {
                tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();
            }

            ui.refresh();
        }
    },

    lastTab: {
        keyCode: "Digit9",
        ctrl: true,
        action: function() {
            tabSpaceActiveElements.tabs[tabSpaceActiveElements.tabs.length - 1].switch();

            ui.refresh();
        }
    },

    goBack: {
        keyCode: "ArrowLeft",
        alt: true,
        action: function() {
            tabSpaceActiveElements.backButton.events.click();
        }
    },

    goForward: {
        keyCode: "ArrowRight",
        alt: true,
        action: function() {
            tabSpaceActiveElements.forwardButton.events.click();
        }
    },

    reload: {
        keyCode: "KeyR",
        ctrl: true,
        action: function() {
            tabSpaceActiveElements.reloadButton.events.click();
        }
    },

    functionKeyReload: {
        keyCode: "F5",
        action: function() {
            tabSpaceActiveElements.reloadButton.events.click();
        }
    },

    addressBar: {
        keyCode: "KeyL",
        ctrl: true,
        action: function() {
            remote.getCurrentWindow().webContents.focus();
            dom.element("input[addressbar]").reference[0].focus();
        }
    },

    focusPage: {
        keyCode: "F10",
        action: function() {
            for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
                if (tabSpaceActiveElements.tabs[i].selected) {
                    tabSpaceActiveElements.tabs[i].browserTab.webContents.focus();
                }
            }
        }
    },

    menu: {
        keyCode: "KeyF",
        alt: true,
        action: function() {
            tabSpaceActiveElements.menuButton.events.click();
        }
    },

    zoomIn: {
        keyCode: "Equal",
        ctrl: true,
        action: function() {
            for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
                if (tabSpaceActiveElements.tabs[i].selected) {
                    if (zoom.getFactor(tabSpaceActiveElements.tabs[i]) < 3) { // Max zoom level is 300%
                        zoom.setFactor(tabSpaceActiveElements.tabs[i], Number(Number(zoom.getFactor(tabSpaceActiveElements.tabs[i]) + 0.25).toFixed(2))); // We fix floating-point numbers to prevent artifacting
                    }
                }
            }
        }
    },

    zoomOut: {
        keyCode: "Minus",
        ctrl: true,
        action: function() {
            for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
                if (tabSpaceActiveElements.tabs[i].selected) {
                    if (zoom.getFactor(tabSpaceActiveElements.tabs[i]) > 0.5) { // Min zoom level is 50%
                        zoom.setFactor(tabSpaceActiveElements.tabs[i], Number(Number(zoom.getFactor(tabSpaceActiveElements.tabs[i]) - 0.25).toFixed(2))); // We fix floating-point numbers to prevent artifacting
                    }
                }
            }
        }
    },

    resetZoom: {
        keyCode: "Digit0",
        ctrl: true,
        action: function() {
            for (var i = 0; i < tabSpaceActiveElements.tabs.length; i++) {
                if (tabSpaceActiveElements.tabs[i].selected) {
                    zoom.setFactor(tabSpaceActiveElements.tabs[i], 1);
                }
            }
        }
    },

    toggleFullscreen: {
        keyCode: "F11",
        action: function() {
            if (fullscreen.isFullscreen) {
                fullscreen.leave();
            } else {
                fullscreen.enter();
            }
        }
    },

    exit: {
        keyCode: "KeyW",
        ctrl: true,
        shift: true,
        action: function() {
            remote.getCurrentWindow().close();
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
    if (platform.os == platform.osTypes.MACOS) {
        return keyboardShortcuts.handleShortcut(event.code, event.metaKey, event.altKey, event.shiftKey);
    } else {
        return keyboardShortcuts.handleShortcut(event.code, event.ctrlKey, event.altKey, event.shiftKey);
    }
};

/*
    @name keyboardShortcuts.init

    @shortDescription Initialise events so that keyboard shortcuts can be detected.
*/
keyboardShortcuts.init = function() {
    dom.element("body").events.listen("keyup", function(event) {
        keyboardShortcuts.handleEvent(event);
    });
};

/*
    @name keyboardShortcuts.getRepresentation

    @param keyCode string String-based key code of main key in shortcut.
    @param ctrl boolean Whether the Ctrl key is being pressed in the shortcut. Default: `false`.
    @param alt boolean Whether the Alt key is being pressed in the shortcut. Default: `false`.
    @param shift boolean Whether the Shift key is being pressed in the shortcut. Default: `false`.

    @shortDescription Get the textual representation of a keyboard shortcut.
    @longDescription For example, the default copy command would become `Ctrl + C`.
*/
keyboardShortcuts.getRepresentation = function(keyCode, ctrl = false, alt = false, shift = false) {
    var ctrlName = _("keys_ctrl");
    var altName = _("keys_alt");
    var shiftName = _("keys_shift");
    var metaName = _("keys_meta");
    var printScreenName = _("keys_printScreen");

    var keyName = keyCode;

    if (platform.os == platform.osTypes.LIVEG) {
        metaName = _("keys_liveg");
        printScreenName = _("keys_screenshot");
    }

    if (platform.os == platform.osTypes.WINDOWS) {
        metaName = _("keys_windows");
    }

    if (platform.os == platform.osTypes.MACOS) {
        ctrlName = _("keys_command");
        altName = _("keys_option");
        metaName = _("keys_command");
    }

    if (platform.os == platform.osTypes.ANDROID) {
        metaName = _("keys_android");
    }

    var specialKeyNames = {
        "Backquote": "`",
        "Backslash": "\\",
        "BracketLeft": "[",
        "BracketRight": "]",
        "Comma": ",",
        "Equal": "=",
        "Minus": "-",
        "Period": ".",
        "Quote": "'",
        "Semicolon": ";",
        "Slash": "/",
        "AltLeft": altName,
        "AltRight": _("keys_rightAlt"),
        "CapsLock": _("keys_capsLock"),
        "ContextMenu": _("keys_menu"),
        "ControlLeft": ctrlName,
        "ControlRight": _("keys_rightCtrl"),
        "Enter": _("keys_enter"),
        "MetaLeft": metaName,
        "MetaRight": _("keys_rightMeta", [metaName]),
        "ShiftLeft": shiftName,
        "ShiftRight": _("keys_rightShift"),
        "Backspace": _("keys_backspace"),
        "Delete": _("keys_delete"),
        "Space": _("keys_space"),
        "Tab": _("keys_tab"),
        "ArrowUp": _("keys_up"),
        "ArrowDown": _("keys_down"),
        "ArrowLeft": _("keys_left"),
        "ArrowRight": _("keys_right"),
        "Home": _("keys_home"),
        "End": _("keys_end"),
        "PageUp": _("keys_pageUp"),
        "PageDown": _("keys_pageDown"),
        "Escape": _("keys_esc"),
        "PrintScreen": printScreenName,
        "Pause": _("keys_pause")
    };

    if (/Key./.test(keyCode)) {
        keyName = keyCode[3];
    } else if (/Digit./.test(keyCode)) {
        keyName = keyCode[5];
    } else if (/Numpad./.test(keyCode)) {
        keyName = _("keys_numpad", [keyCode[6]]);
    } else if (keyCode in specialKeyNames) {
        keyName = specialKeyNames[keyCode];
    }

    var finalShortcut = "";

    if (ctrl) {
        finalShortcut += ctrlName + " + ";
    }

    if (alt) {
        finalShortcut += altName + " + ";
    }

    if (shift) {
        finalShortcut += shiftName + " + ";
    }

    finalShortcut += keyName;

    return finalShortcut;
};