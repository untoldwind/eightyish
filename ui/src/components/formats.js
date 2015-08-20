export function repeat(ch, count) {
    return new Array(count + 1).join(ch);
}

function radixPrefix(radix) {
    switch (radix) {
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

function wordRadixLength(radix) {
    switch (radix) {
    case 2:
        return 16;
    case 16:
        return 4;
    default:
        return 5;
    }
}

export function byteValueLink(radix, valueLink) {
    const prefix = radixPrefix(radix);
    const value = valueLink.value.toString(radix);
    const length = byteRadixLength(radix);
    const fill = prefix.length > 0 ? '0' : ' ';

    return {
        value: prefix + repeat(fill, length - value.length) + value,
        requestChange: str => {
            let newValue;

            if (str.startsWith(prefix)) {
                newValue = parseInt(str.substring(prefix.length), radix);
            } else {
                newValue = parseInt(str, radix);
            }
            if (typeof newValue === 'number' && newValue >= 0 && newValue <= 255) {
                valueLink.requestChange(newValue);
            }
        }
    };
}

export function wordValueLink(radix, valueLink) {
    const prefix = radixPrefix(radix);
    const value = valueLink.value.toString(radix);
    const length = wordRadixLength(radix);
    const fill = prefix.length > 0 ? '0' : ' ';

    return {
        value: prefix + repeat(fill, length - value.length) + value,
        requestChange: str => {
            let newValue;

            if (str.startsWith(prefix)) {
                newValue = parseInt(str.substring(prefix.length), radix);
            } else {
                newValue = parseInt(str, radix);
            }
            if (typeof newValue === 'number' && newValue >= 0 && newValue <= 65355) {
                valueLink.requestChange(newValue);
            }
        }
    };
}

export function byte2bin(v) {
    if (typeof v !== 'number') {
        return '';
    }
    const bin = v.toString(2);

    return repeat('0', 8 - bin.length) + bin;
}

export function byte2hex(v) {
    if (typeof v !== 'number') {
        return '';
    }
    const hex = v.toString(16);

    return repeat('0', 2 - hex.length) + hex;
}

export function word2hex(v) {
    if (typeof v !== 'number') {
        return '';
    }
    const hex = v.toString(16);

    return repeat('0', 4 - hex.length) + hex;
}
