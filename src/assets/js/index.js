require('@/assets/css/index.less');
import header from '@/views/common/header.html';
import footer from '@/views/common/footer.html';
import sideTool from '@/views/common/sideTool.html';
import { LazyImage, LazyBgImage } from '@/utils';
$('#header').append(header);
$('#footer').append(footer);
$('body').append(sideTool);
new LazyImage('.lazy-image');
new LazyBgImage('.lazy-bgimage');

$(window).bind('scroll', () => {
  if ($(window).width() < 768) return;
  // transformModule();
});
$(window).bind('resize', function () {
  // 重新计算位置
  if ($(window).width() < 768) return;
  // initUpLineStyle();
  // initModule();
});
// 底座服务三张图片加载结束再初始化
const bigImgs = $('.transform-img');
bigImgs.each(function (index) {
  // TODO promise模式
  $(this)[0].onload = function () {
    if ($(window).width() < 768) return;
    if (index === bigImgs.length - 1) initUpLine();
    initModule();
  };
});

// 初始化**数字底座整体服务div宽高设置
function initModule() {
  // 动态计算service-wrap的高度
  const saasHeight = getHeight('.saas-module');
  const paasHeight = getHeight('.paas-module');
  const daasHeight = getHeight('.daas-module');
  const serviceWrapHeight = saasHeight + paasHeight + daasHeight;
  $('.service-wrap').css('height', serviceWrapHeight);
  $('.saas-module').css('transform', `translateZ(1px) translateY(${paasHeight / 3}px)`);
  $('.daas-module').css('transform', `translateZ(-1px) translateY(-${paasHeight / 3}px)`);
}

function transformModule() {
  const percent = isRransformRange();
  if (!percent) return;
  const saasModule = {
    el: $('.saas-module'),
    translateY: Number,
    minTop: 1,
    maxTop: 90,
    result: Number,
    changeSpeed: percent * 4,
  };
  const daasModule = {
    el: $('.daas-module'),
    translateY: Number,
    minTop: -100,
    maxTop: 1,
    result: Number,
    changeSpeed: percent * 3,
  };
  // 目前模块的translateY值
  saasModule.translateY = saasModule.el
    .css('transform')
    .replace(/[^0-9\-\.,]/g, '')
    .split(',')[13];
  daasModule.translateY = daasModule.el
    .css('transform')
    .replace(/[^0-9\-\.,]/g, '')
    .split(',')[13];
  // 展开
  if ($('.scrollDown').length > 0) {
    saasModule.result = saasModule.translateY * 1 - saasModule.changeSpeed;
    daasModule.result = daasModule.translateY * 1 + daasModule.changeSpeed;
  }
  // 合拢
  if ($('.scrollUp').length > 0) {
    saasModule.result = saasModule.translateY * 1 + saasModule.changeSpeed;
    daasModule.result = daasModule.translateY * 1 - daasModule.changeSpeed;
  }
  saasModule.result =
    saasModule.result < saasModule.minTop
      ? saasModule.minTop
      : saasModule.result > saasModule.maxTop
      ? saasModule.maxTop
      : saasModule.result;
  daasModule.result =
    daasModule.result < daasModule.minTop
      ? daasModule.minTop
      : daasModule.result > daasModule.maxTop
      ? daasModule.maxTop
      : daasModule.result;
  saasModule.el.css('transform', `translateZ(1px) translateY(${saasModule.result}px)`);
  daasModule.el.css('transform', `translateZ(-1px) translateY(${daasModule.result}px)`);
}
function isRransformRange() {
  var elementTop = $('.paas-module').offset().top; // 固定值，绑定元素上边框相对于文档顶端的偏移量
  var scrollTop = $(window).scrollTop(); // 滚动条偏移量
  const percent = (elementTop - scrollTop) / $(window).height();
  if (percent < 0.9 && percent > 0.4) return percent;
  return null;
}

function initUpLineStyle() {
  const paasHeight = getHeight('.paas-module');
  const daasHeight = getHeight('.daas-module');
  const width = $('.content-wrap').width();
  const height = paasHeight + daasHeight / 2;
  const bottom = daasHeight / 2;
  const upDiv = $('.up-lines-wrap');
  upDiv.css({ height, width, bottom });
  const upDivChilds = $('.up-lines-wrap *');
  for (let i = 0; i < upDivChilds.length; i++) {
    const item = upDivChilds[i];
    const left = Math.random() * 90 + '%';
    const bottom = Math.random() * 80 + '%';
    const animationDelay = Math.random() * 10 + 's';
    $(item).css({ left, bottom, animationDelay });
  }
}
function initUpLine() {
  const upDiv = $('.up-lines-wrap');
  let i = 0;
  while (i < 40) {
    const tag = Math.random() < 0.7 ? 1 : 2;
    const div = ` <div class="up-line${tag}"></div>`;
    upDiv.append(div);
    i++;
  }
  initUpLineStyle();
}
function getHeight(className) {
  const height = $(className).outerHeight();
  if (!height) height = 150;
  return height;
}
