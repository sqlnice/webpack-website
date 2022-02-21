const glob = require('glob');
const path = require('path');
const { merge } = require('webpack-merge');
// 解析HTMl
const htmlWebpackPlugin = require('html-webpack-plugin');

/**
 * @description 多入口配置，通过glob模块读取pages文件夹下的所有对应文件夹下的js后缀文件
 */
exports.entries = () => {
  const entryFiles = glob.sync(path.resolve(__dirname, '../src/assets/js') + '/*.js');
  let map = {};
  entryFiles.forEach((filePath) => {
    var filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
    map[filename] = filePath;
  });
  return map;
};

/**
 * @description 多页面输出配置，与上面想同，读取views下第一层的HTMl文件放进数据
 */
exports.htmlPlugin = () => {
  let entryHtml = glob.sync(path.resolve(__dirname, '../src/views') + '/*.html');
  let arr = [];
  entryHtml.forEach((filePath) => {
    let filename = filePath.substring(filePath.lastIndexOf('/') + 1, filePath.lastIndexOf('.'));
    let conf = {
      // 模板来源
      template: filePath,
      // 文件名称
      filename: filename + '.html',
      // 页面模板需要加对应的js脚本，如果不加这行则每个页面都会引入所有的js脚本
      chunks: ['manifest', 'vendor', filename],
      hash: true, // 给script标签中的js文件增加一个随机数 防止缓存
      inject: true, // 注入选项 有四个值 true,body(script标签位于body底部),head,false(不插入js文件)
      // favicon: path.resolve(__dirname, '../src/assets/images/common/favicon.ico'),
      scriptLoading: 'defer',
    };
    if (process.env.NODE_ENV === 'production') {
      conf = merge(conf, {
        minify: {
          removeComments: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
        },
        chunksSortMode: 'auto',
      });
    }
    arr.push(new htmlWebpackPlugin(conf));
  });
  return arr;
};

exports.assetsPath = (_path) => {
  const assetsSubDirectory = process.env.NODE_ENV === 'production' ? 'static' : 'static';
  return path.posix.join(assetsSubDirectory, _path);
};

exports.rules = () => {
  return [
    {
      // 处理css、js中的图片等
      test: /\.(gif|png|jpg|woff|svg|eotttf|mp4)\??.*$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: exports.assetsPath('img/[name].[hash:7].[ext]'),
        },
      },
    },
    {
      // 处理html中的img src:''标签等（href、）
      test: /\.(html)$/,
      use: {
        loader: 'html-loader',
        options: {
          attributes: {
            list: [
              {
                tag: 'img',
                attribute: 'src',
                type: 'src',
              },
              {
                tag: 'video',
                attribute: 'src',
                type: 'src',
              },
              {
                attribute: 'data-src',
                type: 'src',
              },
              {
                attribute: 'data-phonesrc',
                type: 'src',
              },
            ],
          },
          minimize: true,
        },
      },
    },
  ];
};
