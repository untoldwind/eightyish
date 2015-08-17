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

export const PointerPattern = {
    __proto__: ArgumentPattern.prototype,

    matches(value) {
        if (value.startsWith('(.') && value.endsWith(')')) {
            return true
        }
        if (value.startsWith('(') && value.endsWith(')')) {
            var w = parseInt(value.substring(1, value.length - 1));

            return typeof w == 'number' && w >= 0 && w <= 65355
        }
        return false
    },

    extractValue(value) {
        if (value.startsWith('(.') && value.endsWith(')')) {
            return value.substring(1, value.length - 1)
        }
        if (value.startsWith('(') && value.endsWith(')')) {
            return parseInt(value.substring(1, value.length - 1));
        }
        return 0
    }
};

export const AddressOrLabelPattern = {
    __proto__: ArgumentPattern.prototype,

    matches(value) {
        if (value.startsWith('.')) {
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