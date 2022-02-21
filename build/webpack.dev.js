'use strict';
const path = require('path');
const { merge } = require('webpack-merge');
const CopyPlugin = require('copy-webpack-plugin');
const baseWebpackConfig = require('./webpack.common');
const webpack = require('webpack');
const utils = require('./utils');
process.env.NODE_ENV = 'development';
module.exports = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    hot: true,
    open: true,
    contentBase: path.join(__dirname, '../dist'), //编译好的文件放在这里
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      ...utils.rules(),
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(), // 热更新
    // 复制静态文件到 static 文件夹
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, '../static'), to: 'static' }],
    }),
    // 多页面输出
  ].concat(utils.htmlPlugin()),
});
