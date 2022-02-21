window.host = '//127.0.0.1:3000/api/solutions';
// 排序----------------------------------------------
// 文章要求：按照时间排序
// 程序：默认按照数组顺序排序，手动修改order越大越靠前
// 排序----------------------------------------------

// md内图片处理
// 可以引用./static/news/*里的图片，也可以直接外链

// 封面图
// 使用：1.'poster.jpg'字符串，对应文件夹要有图片 2.外链(注意编辑给的图片是否过大) 3.无封面图默认使用css的backgroundImage

window.newsList = [
  {
    id: 1,
    title: '新闻资讯测试',
    abstract: '简介',
    order: 1,
    postUrl: 'poster.gif',
    publishTime: '2020-06-25',
  },
];
window.markdownDir = './static/news';
