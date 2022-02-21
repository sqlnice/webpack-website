require('@/assets/css/technique-center.less');
import header from '@/views/common/header.html';
import footer from '@/views/common/footer.html';
import sideTool from '@/views/common/sideTool.html';
import { LazyBgImage } from '@/utils';
$('#header').append(header);
$('#footer').append(footer);
$('body').append(sideTool);
new LazyBgImage('.lazy-bgimage');
$(window).scroll(function () {
  const catalog = $('#catalog');
  const scrollTop = $(window).scrollTop();
  const techniqueBannerHeight = $('.technique-banner').height();
  if (scrollTop > techniqueBannerHeight) {
    if (catalog.hasClass('fixed-left-top')) return;
    catalog.addClass('fixed-left-top');
    // catalog.css('max-height', 'calc(100vh - scrollTop)');
  }
  if (scrollTop <= techniqueBannerHeight) {
    if (!catalog.hasClass('fixed-left-top')) return;
    catalog.removeClass('fixed-left-top');
    // catalog.css('max-height', `calc(100vh - 360px)`);
  }
});

const qa = [
  {
    q: '<p>问题</p>',
    a: `<p>回答</p>
<code>vi /root/seis/conf/mgt_server_project.conf</code>
`,
  },
];
qa.forEach((item, index) => {
  const questionItem = document.createElement('div');
  questionItem.className = 'question-item';
  const questionQ = document.createElement('div');
  questionQ.className = 'question-q';
  const questionA = document.createElement('div');
  questionA.className = 'question-a';
  questionQ.innerHTML = item.q;
  questionA.innerHTML = item.a;
  $(questionItem).append(questionQ, questionA);
  $('#question').append(questionItem);
});

// 手风琴问答
class CatalogAccordion {
  constructor(el) {
    this.el = el || {};
    this.types = this.el.find('.question-q');
  }
  init() {
    this.types.on('click', this.dropdown);
  }
  dropdown(e) {
    const curli = $(e.currentTarget).parent();
    curli.find('.question-a').toggle(200);
  }
}
new CatalogAccordion($('#question')).init();

// 更多数据按钮
$('.more-btn').click(function () {
  if ($('.more-btn').html().indexOf('+') > 0) {
    $('.more-test').show(200);
    $('.more-btn').html('收起 -');
  } else {
    $('.more-test').hide(200);
    $('.more-btn').html('更多详细数据 +');
  }
});
