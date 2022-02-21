require('@/assets/css/news.less');
import header from '@/views/common/header.html';
import footer from '@/views/common/footer.html';
import sideTool from '@/views/common/sideTool.html';
import { getUrlParmas, urlHasChange, LazyBgImage } from '@/utils';
$('#header').append(header);
$('#footer').append(footer);
$('body').append(sideTool);
new LazyBgImage('.lazy-bgimage');
function init() {
  const id = getUrlParmas().id;
  // 如果有需要可进行二次手动更改规则
  //   const md = `
  //   <img src="./static/news/1/poster.jpg" alt="封面图/首图" />
  // `;
  //   const tokens = marked.lexer(md);
  //   console.log(tokens);
  //   const html = marked.parser(tokens);
  //   console.log(html);
  // 设置所有链接的前缀
  // marked.setOptions({ baseUrl: `../static/news/${id}/` });
  if (id) {
    $.get(`${markdownDir}/${id}/index.md`)
      .then((res) => {
        $('#content')[0].innerHTML = marked(res);
      })
      .catch((err) => {
        $('#content')[0].innerHTML = marked(`## 暂无内容`);
      });
  }
  let nextChapter = {};
  let curChapter = {};
  window.newsList.reduce((pre, cur) => {
    if (cur.id === id * 1) {
      curChapter = cur;
    }
    if (pre.id === id * 1 - 1) {
      nextChapter = pre;
      return cur;
    }
    return cur;
  }, {});
  $('#cur-chapter').html(curChapter.title);
  nextChapter.title = nextChapter.title ? nextChapter.title : '已经是最后一篇啦~';
  $('#next-chapter').html(nextChapter.title);
  if (!nextChapter.id) return;
  $('#next-chapter').click(() => {
    window.location.href = `news-detail.html#?id=${nextChapter.id}`;
    $('html,body').animate({ scrollTop: 0 }, 100);
  });
}
urlHasChange(init);
init();
