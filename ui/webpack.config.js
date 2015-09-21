var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var DEBUG = process.env.NODE_ENV === 'development';
var TEST = process.env.NODE_ENV === 'test';

var plugins = [
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('[name].css')
];

if (DEBUG) {
} else if (!TEST) {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify('production')
            }
        })
    );
}

module.exports = {
    target: 'web',
    entry: {
        main: path.join(__dirname, 'src', 'main')
    },
    output: {
        path: path.join(__dirname, 'dist'),
        filename: '[name].bundle.js',
        publicPath: ''
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css')},
            {test: /\.less$/, loader: ExtractTextPlugin.extract('style-loader', 'css!less')},
            {test: /\.html$/, loader: 'file?name=[name].[ext]'},
            {test: /\.js$/, loader: 'babel-loader'},
            {test: /\.png$/, loader: 'url-loader?limit=100000&mimetype=image/png'},
            {test: /\.gif$/, loader: 'url-loader?limit=100000&mimetype=image/gif'},
            {test: /\.jpg$/, loader: 'file-loader'},
            {test: /\.woff$/, loader: 'url-loader?limit=10000&minetype=application/font-woff'},
            {test: /\.woff2$/, loader: 'url-loader?limit=10000&minetype=application/font-woff2'},
            {test: /\.ttf$/, loader: 'file-loader'},
            {test: /\.eot$/, loader: 'file-loader'},
            {test: /\.svg$/, loader: 'file-loader'}
        ]
    },
    plugins: plugins,
    stats: {
        // Nice colored output
        colors: true
    },
    // Create Sourcemaps for the bundle
    devtool: 'source-map',
    devServer: {
        contentBase: './dist'
    }
};
