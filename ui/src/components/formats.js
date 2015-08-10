
export function repeat(ch, count) {
    var result = "";

    for(var i = 0; i < count; i++) {
        result += ch;
    }

    return result;
}

export function byte2bin(v) {
    var bin = v.toString(2);

    return repeat('0', 8 - bin.length) + bin;
}

export function byte2hex(v) {
    var hex = v.toString(16);

    return repeat('0', 2 - hex.length) + hex;
}

export function word2hex(v) {
    var hex = v.toString(16);

    return repeat('0', 4 - hex.length) + hex;
}