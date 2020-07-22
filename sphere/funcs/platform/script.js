// Sphere
// 
// Copyright (C) LiveG. All Rights Reserved.
// Copying is not a victimless crime. Anyone caught copying LiveG software may
// face sanctions.
// 
// https://liveg.tech
// Licensed by the LiveG Open-Source Licence, which can be found at LICENCE.md.

var platform = {};

platform.osTypes = {
    OTHER: -1,
    LIVEG: 0,
    LINUX: 1,
    WINDOWS: 2,
    MACOS: 3,
    ANDROID: 4,
    SUNOS: 5,
    OPENBSD: 6,
    AIX: 7
};

// Used for interfacing with Node.JS `os` module
platform._osMap = {
    linux: platform.osTypes.LINUX,
    win32: platform.osTypes.WINDOWS,
    darwin: platform.osTypes.MACOS,
    android: platform.osTypes.ANDROID,
    sunos: platform.osTypes.SUNOS,
    openbsd: platform.osTypes.OPENBSD,
    aix: platform.osTypes.AIX
};

if (fs.existsSync("/usr/share/liveg-info/name")) {
    platform.os = platform.osTypes.LIVEG;
} else {
    if (os.platform() in platform._osMap) {
        platform.os = platform._osMap[os.platform()];
    } else {
        platform.os = platform.osTypes.OTHER;
    }
}