export function repeat(ch, count) {
    return new Array(count + 1).join(ch);
}

function radixPrefix(radix) {
    switch(radix) {
        case 2:
            return '0b';
        case 16:
            return '0x';
        default:
            return '';
    }
}

function byteRadixLength(radix) {
    switch (radix) {
        case 2:
            return 8;
        case 16:
            return 2;
        default:
            return 3;
    }
}

export function byteValueLink(radix, valueLink) {
    var prefix = radixPrefix(radix);
    var value = valueLink.value.toString(radix);
    var length = byteRadixLength(radix);
    var fill = prefix.length > 0 ? '0' : ' ';

    return {
        value: prefix + repeat(fill, length - value.length) + value,
        requestChange: str => {
            var newValue;

            if(str.startsWith(prefix)) {
                newValue = parseInt(str.substring(prefix.length), radix);
            } else {
                newValue = parseInt(str, radix);
            }
            if(newValue != NaN && newValue >= 0 && newValue <= 255) {
                valueLink.requestChange(newValue);
            }
        }
    }
}

export function byte2bin(v) {
    if (v == undefined) {
        return '';
    }
    var bin = v.toString(2);

    return repeat('0', 8 - bin.length) + bin;
}

export function byte2hex(v) {
    if (v == undefined) {
        return '';
    }
    var hex = v.toString(16);

    return repeat('0', 2 - hex.length) + hex;
}

export function word2hex(v) {
    if (v == undefined) {
        return '';
    }
    var hex = v.toString(16);

    return repeat('0', 4 - hex.length) + hex;
}