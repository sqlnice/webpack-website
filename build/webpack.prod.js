'use strict';
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.common');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const path = require('path');
const utils = require('./utils');
process.env.NODE_ENV = 'production';
module.exports = merge(baseWebpackConfig, {
  mode: 'production',
  devtool: 'cheap-module-source-map', // 关闭源码
  // 输出路径
  output: {
    path: path.resolve(__dirname, '../dist'),
    publicPath: './',
    filename: utils.assetsPath('js/[name].[chunkhash].js'),
    chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
  },
  optimization: {
    splitChunks: {
      chunks: 'async', // 代码块类型 必须三选一： "initial"（初始化） | "all"(默认就是all) | "async"（动态加载）
    },
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // 解决css中背景图片路径问题
              publicPath: '../../',
            },
          },
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [['autoprefixer', { overrideBrowserslist: ['last 5 version', '>1%', 'ios 7'] }]],
              },
            },
          },
          'less-loader',
        ],
      },
      {
        test: /\.js$/,
        use: [{ loader: 'babel-loader', options: { presets: ['@babel/preset-env'] } }],
        exclude: '/node_modules/',
      },
      ...utils.rules(),
    ],
  },
  plugins: [
    new CleanWebpackPlugin(),
    // 单独提取css 配合utils.rules
    new MiniCssExtractPlugin({
      filename: utils.assetsPath('css/[name].[contenthash].css'),
      chunkFilename: utils.assetsPath('css/[id].[contenthash].css'),
    }),
    // 压缩CSS
    new CssMinimizerPlugin(),
    // 复制静态文件到 static 文件夹
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, '../static'), to: 'static' }],
    }),
    // 打包文件分析
    new BundleAnalyzerPlugin(),
    // 多页面输出
  ].concat(utils.htmlPlugin()),
});
