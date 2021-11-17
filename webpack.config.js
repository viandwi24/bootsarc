const path = require('path');

const outputDir = path.join(__dirname, 'dist/js');

const script = (src) => path.join(__dirname, `src/scripts/${src}.js`)

module.exports = {
    mode: "production",
    entry: {
        // 'bootsarc.bootstrap': script('bootsarc.bootstrap'),
        'bootsarc': script('bootsarc')
    },
    output: {
        path: outputDir,
        filename: '[name].js'
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