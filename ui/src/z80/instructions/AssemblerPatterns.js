
export class AssemblerPattern {
    matches(value) {
        return false;
    }
}

export class RegisterPattern extends AssemblerPattern {
    constructor(allowedRegisters) {
        this.allowedRegisters = allowedRegisters;
    }

    matches(value) {
        return this.allowedRegisters.indexOf(value.toUpperCase()) >= 0;
    }
}


export class ByteValuePattern extends AssemblerPattern {
    matches(value) {
        var b = parseInt(value);

        return typeof b == 'number' && b >= 0 && b <= 255;
    }
}

export class WordValuePattern extends AssemblerPattern {
    matches(value) {
        var w = parseInt(value);

        return typeof w == 'number' && w >= 0 && w <= 65355;
    }
}

export class AddressOrLabelPattern extends AssemblerPattern {
    matches(value) {
        if(value.startsWith('.')) {
            return true;
        }
        var w = parseInt(value);

        return typeof w == 'number' && w >= 0 && w <= 65355;
    }
}
