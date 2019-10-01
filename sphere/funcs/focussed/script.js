// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

var focussed = {
    inputTypes: [],

    isInputFocussed: function() {
        return document.activeElement && focussed.inputTypes.indexOf(document.activeElement.tagName.toLowerCase()) != -1;
    }
};