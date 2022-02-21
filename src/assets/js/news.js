require('@/assets/css/news.less');
import header from '@/views/common/header.html';
import footer from '@/views/common/footer.html';
import sideTool from '@/views/common/sideTool.html';
import { LazyImage, LazyBgImage, throttle } from '@/utils';
$('#header').append(header);
$('#footer').append(footer);
$('body').append(sideTool);
new LazyImage('.lazy-image');
new LazyBgImage('.lazy-bgimage');
let loadingStart = false; // 加载开始
let isLoadingSuccess = true; // 是否加载结束
const _throttle = throttle(() => {
  if ($(window).width() >= 768) return;
  if (loadingStart) return;
  // 加载列表
  const rect = $('#footer')[0].getBoundingClientRect();
  if (rect.top < document.documentElement.clientHeight) {
    3;
    // 加载开始
    loadingStart = true;
    $('#loadingStatus').show();
    if (!isLoadingSuccess) return;
    // 可以加载
    if (isLoadingSuccess) {
      $('#loadingStatus').html('loading...');
    }
    // 加载结束
    setTimeout(() => {
      isLoadingSuccess = slider.next();
      loadingStart = false;
      // 已无更多
      if (!isLoadingSuccess) {
        $('#loadingStatus').html('已无更多');
        $('#loadingStatus').show();
      } else {
        $('#loadingStatus').hide();
      }
    }, 500);
  }
});
$(window).scroll(_throttle);
