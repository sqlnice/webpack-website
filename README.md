# website

- 项目使用 webpack 构建，多入口页面。

# 代码仓库

- 仓库地址：[地址](https://github.com/sqlnice/webpack-website)
- 分支：dev

# 开发

- `build/`下区分 webpack 开发和打包配置
- 页面开发都在`src/views/`下，创建 HTML 的同时要在`src/assets/js`下创建对应的`js`文件，可参考其他页面。
- `Src/views/common`中包含公用的`header`、`footer`和`form`。
- 技术中心的文件放在`static/file`中。

# 发布新闻及打包

- 由运营那边编写新闻文件（`markdown`格式）和封面图片（如果是外网的图需要下载下来）。
- 在`static/config/index.js`中增加新闻列表（注意`id`、`publishTime`）。
- 在`static/news`中根据上一步的`id`增加文件夹，和文件夹里面的文件以及封面图。
- 运行`npm run build` ，生成文件，打包之后发给部署人员。
