
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
    },

    extractValue(value) {
        return parseInt(value);
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

export class IndexPointerPattern extends ArgumentPattern {
    constructor(indexRegister) {
        super();
        this.pattern = new RegExp(`\\(${indexRegister}([\\-\\+]\\d+)\\)`, 'i');
    }

    matches(value) {
        return value.match(this.pattern)
    }

    extractValue(value) {
        return value.match(this.pattern)[1]
    }
}