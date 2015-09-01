var WebpackDevServer = require("webpack-dev-server")
var webpack = require("webpack")

var compiler = webpack(require("../webpack.config"))
var server = new WebpackDevServer(compiler, {})

// conf.js
exports.config = {
    framework: 'jasmine2',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    specs: ['spec.js'],
    beforeLaunch: function () {
        server.listen(8080, "localhost", function () {
        })
    },
    afterLaunch: function () {
    },
    onPrepare: function() {
        browser.ignoreSynchronization = true;
    }
}
