const path = require('path');

const mode = process.env.NODE_ENV || 'development';
const prod = mode === 'production';

module.exports = {
  mode,
  entry: {
    bundle: ['./src/main.js'],
  },
  resolve: {
    alias: {
      svelte: path.resolve('../../node_modules/svelte'),
    },
    extensions: ['.mjs', '.js', '.svelte', '.json'],
    mainFields: ['svelte', 'browser', 'module', 'main'],
  },
  output: {
    path: __dirname + '/public/dist',
    publicPath: 'dist/',
    filename: '[name].js',
    chunkFilename: '[name].[id].js',
  },
  module: {
    rules: [
      {
        test: /\.svelte$/,
        use: {
          loader: 'svelte-loader',
          options: {
            emitCss: true,
            hotReload: true,
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(ttf|woff2?)$/,
        use: {
          loader: 'file-loader',
          options: {
            esModule: false,
          },
        },
      },
    ],
  },
  devtool: prod ? false : 'source-map',
};
