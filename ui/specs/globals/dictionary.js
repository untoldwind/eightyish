import Yadda from 'yadda'

export default new Yadda.Dictionary()
    .define('num', /(0x[0-9A-F]+|\d+)/, Yadda.converters.integer)
    .define('onOff', /(on|off)/, (value, next) => next(null, value === 'on'))
    .define('assembler', /([^\u0000]*)/)
