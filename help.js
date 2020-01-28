module.exports = function() {
    return `{{ sphereMark }} {{ version }}
Copyright (C) LiveG. All Rights Reserved.

usage: sphere [--debug] [--help | -h] [--lang <locale>] [--mirroring-direction {ltr,rtl}]

List of arguments used in Sphere:
    --debug     Enter debug mode for Sphere.
    --help      Display this help screen.
    --lang      Force the UI language to be the locale specified.
                <locale>            The locale code to be used. For example, English (United Kingdom) would be \`en_GB\`.
    --mirroring-direction
                Force the UI text mirroring direction to be the direction specified.
                ltr                 Use the left-to-right (LTR) text mirroring direction.
                rtl                 Use the right-to-left (RTL) text mirroring direction.`;
};