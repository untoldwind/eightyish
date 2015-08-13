
export class ArgumentPattern {
    matches(value) {
        return false;
    }
}

export const ByteValuePattern = {
    __proto__: ArgumentPattern.prototype,

    matches(value) {
        var b = parseInt(value);

        return typeof b == 'number' && b >= 0 && b <= 255;
    }
};

export const WordValuePattern = {
    __proto__: ArgumentPattern.prototype,

    matches(value) {
        var w = parseInt(value);

        return typeof w == 'number' && w >= 0 && w <= 65355;
    }
};

export const AddressOrLabelPattern = {
    __proto__: ArgumentPattern.prototype,

    matches(value) {
        if(value.startsWith('.')) {
            return true;
        }
        var w = parseInt(value);

        return typeof w == 'number' && w >= 0 && w <= 65355;
    }
};
