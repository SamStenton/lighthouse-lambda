const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: slsw.lib.entries,
    // output: set by the plugin
    target: 'node',
    externals: [nodeExternals()],
    devtool: 'source-map',
    mode: 'development',
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: [
                        ["@babel/preset-env", {
                            "targets": {
                                "node": "8.10"
                            }
                        }]
                    ]
                },
            },
        ],
    },
};