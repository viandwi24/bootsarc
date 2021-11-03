const path = require('path');

const outputDir = path.resolve(__dirname, 'dist/js');
module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, 'src/scripts/bootsarc.js'),
    output: {
        path: outputDir,
        filename: 'bootsarc.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx$/,
                exclude: /node_modules/,
                use: {
                  loader: 'eslint-loader',
                }
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: ['babel-loader']
            }
        ]
    }
};