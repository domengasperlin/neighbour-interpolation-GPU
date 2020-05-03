const webpack = require('webpack');
const path = require('path');

const APP_DIR = path.resolve(__dirname, 'src');
const BUILD_DIR = path.resolve(__dirname, 'public');
const NODE_ENV = process.env.NODE_ENV;

const config = {
  entry: `${APP_DIR}/index.js`,
  output: {
    path: BUILD_DIR,
    filename: 'assets/js/bundle.js',
  },
  resolve: {
    extensions: ['.js', '.json'],
    modules: [APP_DIR, 'node_modules'],
    alias: {
      // https://github.com/webpack/webpack/issues/4666
      constants: `${APP_DIR}/constants`,
    },
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
        include: APP_DIR,
      },
      {
        test: [/\.vert$/, /\.frag$/, /\.glsl$/],
        use: ['raw-loader'],
      },
      {
        test: /\.(jpg|png)$/,
        use: {
          loader: 'url-loader',
        },
      },
    ],
  },
  devServer: {
    contentBase: BUILD_DIR,
    port: 8080,
    stats: 'minimal',
  },
};

module.exports = config;
