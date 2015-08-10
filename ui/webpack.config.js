var path = require('path');
var webpack = require('webpack');

module.exports = {
    target: "web",
    entry: {
        main: path.join(__dirname, "src", "main")
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].bundle.js",
        publicPath: "/"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
            { test: /\.less$/, loader: "style!css!less"  },
            { test: /\.html$/, loader: 'file?name=[name].[ext]' },
            { test: /\.js$/, loader: 'babel-loader' },
            { test: /\.png$/, loader: "url-loader?limit=100000&mimetype=image/png" },
            { test: /\.gif$/, loader: "url-loader?limit=100000&mimetype=image/gif" },
            { test: /\.jpg$/, loader: "file-loader" },
            { test: /\.woff$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
            { test: /\.woff2$/, loader: "url-loader?limit=10000&minetype=application/font-woff2" },
            { test: /\.ttf$/, loader: "file-loader" },
            { test: /\.eot$/, loader: "file-loader" },
            { test: /\.svg$/, loader: "file-loader" }
        ]
    },
    plugins: [
        // Avoid publishing files when compilation failed
        new webpack.NoErrorsPlugin()
    ],
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map'

};