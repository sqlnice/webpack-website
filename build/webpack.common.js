'use strict';
const utils = require('./utils.js');
const path = require('path');
module.exports = {
  entry: utils.entries(),
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/'
  },
  resolve: {
    alias: {
      '@': path.join(__dirname, '../src')
    },
    extensions: ['.js']
  }
};
