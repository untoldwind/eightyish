export default {
    toBeValidArgument: function () {
        if (typeof this.actual !== 'object') {
            this.message = () => `Expected ${this.actual} to be object`
            return false
        }
        if (typeof this.actual.matches !== 'function') {
            this.message = () => `Expected .matches to be function`
            return false
        }
        if (typeof this.actual.matches('something') !== 'boolean') {
            this.message = () => `Expected .matches to return boolean`
            return false
        }
        if (typeof this.actual.extractValue !== 'function') {
            this.message = () => `Expected .extractValue to be function`
            return false
        }
        if (typeof this.actual.formatValue !== 'function') {
            this.message = () => `Expected .formatValue to be function`
            return false
        }
        if (typeof this.actual.extraOpcodes !== 'function') {
            this.message = () => `Expected .extraOpcodes to be function`
            return false
        }
        if (typeof this.actual.extraSize !== 'number') {
            this.message = () => `Expected .extraSize to be number`
            return false
        }
        if (typeof this.actual.example !== 'string') {
            this.message = () => `Expected .example to be string`
            return false
        }
        if (typeof this.actual.loader !== 'function') {
            this.message = () => `Expected .loader to be function`
            return false
        }
        if (typeof this.actual.storer !== 'function') {
            this.message = () => `Expected .storer to be function`
            return false
        }
        return true
    }
}
