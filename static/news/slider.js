function Slider2(el, options) {
  this.el = el ? $(el) : $('.news-warp');
  this.childItem = $('.news-module');
  this.windowWidth = $(window).width();
  this.showLength = options.showLength || 3;
  this.curPage = 1;
  this.totalPage = Math.ceil(window.newsList.length / 3);
  this.newsLength = window.newsList.length;
  this.init();
}
Slider2.prototype.init = function () {
  this.render();
  $('#total-page').html(this.totalPage);
  $('#news-pre').on('click', this.pre.bind(this));
  $('#news-next').on('click', this.next.bind(this));
  $(window).bind('resize', this.resizeWindow.bind(this));
};
Slider2.prototype.next = function () {
  // 最后一页
  if (this.curPage === this.totalPage) return false;
  this.curPage++;
  $('#cur-page').html(this.curPage);
  this.switchForbidden();
  if ($('.news-module').length !== this.newsLength) this.render();
  // 移动端是上滑加载,pc端是左右
  var isPc = $(window).width() >= 768;
  if (isPc) this.el.css('left', -(this.curPage - 1) * this.el[0].clientWidth);
  return true;
};
Slider2.prototype.pre = function () {
  // 第一页
  if (this.curPage === 1) return;
  this.curPage--;
  this.switchForbidden();
  this.el.css('left', -(this.curPage - 1) * this.el[0].clientWidth);
  $('#cur-page').html(this.curPage);
};
Slider2.prototype.render = function () {
  // 按照order从小到大顺序排序
  var renderList = window.newsList.sort(function (a, b) {
    return b.order - a.order;
  });
  // 分页,一页取this.showLength个
  var list = renderList.slice((this.curPage - 1) * this.showLength, this.curPage * this.showLength);
  // 渲染
  var items = list.reduce(function (pre, cur) {
    var postUrl = '';
    if (cur.postUrl === 'poster.jpg') {
      postUrl = "style='background-image: url(" + markdownDir + '/' + cur.id + '/' + cur.postUrl + ")'";
    } else if (cur.postUrl) {
      postUrl = cur.postUrl;
    } else {
      postUrl = '';
    }
    // 使用：1.poster.jpg 2.外链 3.无封面图默认使用css的backgroundImage
    var item =
      "<a class='news-module' href='news-detail.html?id=" +
      cur.id +
      "'>" +
      "<div class='img' " +
      postUrl +
      '></div>' +
      "<div class='wrap'>" +
      "<div class='title'>" +
      cur.title +
      '</div>' +
      "<div class='abstract'>" +
      cur.abstract +
      '</div>' +
      "<span class='time'>" +
      cur.publishTime +
      '</span>' +
      "<span class='arrow'></span>" +
      '</div>' +
      '</a>';
    pre += item;
    return pre;
  }, '');
  this.el.append(items);
};
Slider2.prototype.inRange = function () {
  return this.windowWidth && this.windowWidth <= 1200 && this.windowWidth >= 768;
};
Slider2.prototype.switchForbidden = function () {
  $('#news-next').removeClass('forbidden');
  $('#news-pre').removeClass('forbidden');
  // 最后一页
  if (this.curPage === this.totalPage) {
    $('#news-next').addClass('forbidden');
  }
  // 第一页
  if (this.curPage === 1) {
    $('#news-pre').addClass('forbidden');
  }
};
Slider2.prototype.resizeWindow = function () {
  this.windowWidth = $(window).width();
};

// 懒加载封面图
if ('IntersectionObserver' in window) {
  var lazyImageObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      // 如果元素可见
      if (entry.intersectionRatio && entry.intersectionRatio > 0) {
        init();
      }
    });
  });
  lazyImageObserver.observe($('.news-container')[0]);
} else {
  if (!setIntervalObserver) {
    setIntervalObserver = setInterval(function () {
      var element = $('.news-container')[0];
      var rect = element.getBoundingClientRect();
      // 出现在视野的时候加载图片
      if (rect.top < document.documentElement.clientHeight) {
        init();
      }
    }, 300);
  }
}
var slider2 = null;
var setIntervalObserver = null;
function init() {
  if (!slider2) {
    slider2 = new Slider2('.news-warp', {
      showLength: 3
    });
  } else {
    if (setIntervalObserver) {
      clearInterval(setIntervalObserver);
    }
    return;
  }
}

// 不兼容ie10
// class Slider {
//   varructor(el, options = {}) {
//     this.el = el ? $(el) : $('.news-warp');
//     this.childItem = $('.news-module');
//     this.windowWidth = $(window).width();
//     this.showLength = options.showLength || 3;
//     this.curPage = 1;
//     this.totalPage = Math.ceil(window.newsList.length / 3);
//     this.newsLength = window.newsList.length;
//     this.init();
//   }
//   init() {
//     this.render();
//     $('#total-page').html(this.totalPage);
//     $('#news-pre').on('click', this.pre.bind(this));
//     $('#news-next').on('click', this.next.bind(this));
//     $(window).bind('resize', this.resizeWindow.bind(this));
//   }
//   // 点击下一页
//   next() {
//     // 最后一页
//     if (this.curPage === this.totalPage) return false;
//     this.curPage++;
//     $('#cur-page').html(this.curPage);
//     this.switchForbidden();
//     if ($('.news-module').length !== this.newsLength) this.render();
//     // 移动端是上滑加载,pc端是左右
//     var isPc = $(window).width() >= 768;
//     if (isPc) this.el.css('left', -(this.curPage - 1) * this.el[0].clientWidth);
//     return true;
//   }
//   // 点击上一页
//   pre() {
//     // 第一页
//     if (this.curPage === 1) return;
//     this.curPage--;
//     this.switchForbidden();
//     this.el.css('left', -(this.curPage - 1) * this.el[0].clientWidth);
//     $('#cur-page').html(this.curPage);
//   }
//   // 渲染每一页资讯列表
//   render() {
//     // 按照order从小到大顺序排序
//     var renderList = window.newsList.sort((a, b) => {
//       return b.order - a.order;
//     });
//     // 分页,一页取this.showLength个
//     var list = renderList.slice((this.curPage - 1) * this.showLength, this.curPage * this.showLength);
//     // 渲染
//     var items = list.reduce((pre, cur) => {
//       var postUrl =
//         cur.postUrl === 'poster.jpg'
//           ? `style="background-image: url(${markdownDir}/${cur.id}/${cur.postUrl});" `
//           : cur.postUrl
//           ? `${cur.postUrl}`
//           : '';
//       // 使用：1.poster.jpg 2.外链 3.无封面图默认使用css的backgroundImage
//       var item = `
//       <a class="news-module" href="news-detail.html?id=${cur.id}">
//       <div class="img" ${postUrl}></div>
//       <div class="wrap">
//         <div class="title">${cur.title}</div>
//         <div class="abstract">${cur.abstract}</div>
//         <span class="time">${cur.publishTime}</span>
//         <span class="arrow"></span>
//       </div>
//       </a>`;
//       pre += item;
//       return pre;
//     }, '');
//     this.el.append(items);
//   }

//   inRange() {
//     return this.windowWidth && this.windowWidth <= 1200 && this.windowWidth >= 768;
//   }
//   switchForbidden() {
//     $('#news-next').removeClass('forbidden');
//     $('#news-pre').removeClass('forbidden');
//     // 最后一页
//     if (this.curPage === this.totalPage) {
//       $('#news-next').addClass('forbidden');
//     }
//     // 第一页
//     if (this.curPage === 1) {
//       $('#news-pre').addClass('forbidden');
//     }
//   }
//   resizeWindow() {
//     this.windowWidth = $(window).width();
//   }
// }
