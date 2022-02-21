const isPc = $(window).width() >= 768;
/**
 * @author sql
 * @description 图片懒加载 首先判断浏览器是否支持IntersectionObserver
 * @constructor {selector} '.className'
 */
export class LazyImage {
  constructor(selector) {
    // 懒记载图片列表，将伪数组转为数组，以便可以使用数组的api
    this.lazyImages = Array.prototype.slice.call(document.querySelectorAll(selector));
    this.init();
  }
  inViewShow() {
    let len = this.lazyImages.length;
    for (let i = 0; i < len; i++) {
      let imageElement = this.lazyImages[i];
      const rect = imageElement.getBoundingClientRect();
      // 出现在视野的时候加载图片
      if (rect.top < document.documentElement.clientHeight) {
        if (isPc) {
          $(imageElement).attr('src', $(imageElement).attr('data-src'));
        } else {
          $(imageElement).attr('src', $(imageElement).attr('data-phonesrc'));
        }
        // 移除掉已经显示的
        this.lazyImages.splice(i, 1);
        len--;
        i--;
        if (this.lazyImages.length === 0) {
          // 如果全部都加载完 则去掉滚动事件监听
          document.removeEventListener('scroll', this._throttleFn);
        }
      }
    }
  }
  init() {
    // 通过IntersectionObserver api判断图片是否出现在可视区域内，不需要监听Scroll来判断
    if ('IntersectionObserver' in window) {
      let lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
          // 如果元素可见
          if (entry.intersectionRatio && entry.intersectionRatio > 0) {
            let lazyImage = entry.target;
            if (isPc) {
              lazyImage.src = lazyImage.dataset.src;
            } else {
              lazyImage.src = lazyImage.dataset.phonesrc;
            }
            lazyImage.classList.remove('lazy-image');
            lazyImageObserver.unobserve(lazyImage);
          }
        });
      });
      this.lazyImages.forEach(function (lazyImage) {
        lazyImageObserver.observe(lazyImage);
      });
    } else {
      this.inViewShow();
      this._throttleFn = throttle(this.inViewShow.bind(this));
      document.addEventListener('scroll', this._throttleFn);
    }
  }
}
/**
 * @author sql
 * @description 背景图片懒加载 首先判断浏览器是否支持IntersectionObserver
 * @constructor {selector} '.className'
 */
export class LazyBgImage {
  constructor(selector) {
    // 懒记载图片列表，将伪数组转为数组，以便可以使用数组的api
    this.lazyImages = Array.prototype.slice.call(document.querySelectorAll(selector));
    this.initType = $(window).width() > 768 ? 'PC' : 'PHONE';
    this.init();
    $(window).resize(() => {
      const curType = $(window).width() > 768 ? 'PC' : 'PHONE';
      if (curType !== this.initType) {
        this.init();
        this.initType = curType;
      }
    });
  }
  inViewShow() {
    let len = this.lazyImages.length;
    for (let i = 0; i < len; i++) {
      let imageElement = this.lazyImages[i];
      const rect = imageElement.getBoundingClientRect();
      // 出现在视野的时候加载图片
      if (rect.top < document.documentElement.clientHeight) {
        if (isPc) {
          $(imageElement).css('background-image', `url(${$(imageElement).attr('data-src')})`);
        } else {
          $(imageElement).css('background-image', `url(${$(imageElement).attr('data-phonesrc')})`);
        }
        // 移除掉已经显示的
        this.lazyImages.splice(i, 1);
        len--;
        i--;
        if (this.lazyImages.length === 0) {
          // 如果全部都加载完 则去掉滚动事件监听
          document.removeEventListener('scroll', this._throttleFn);
        }
      }
    }
  }

  init() {
    // 通过IntersectionObserver api判断图片是否出现在可视区域内，不需要监听Scroll来判断
    if ('IntersectionObserver' in window) {
      let lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
          // 如果元素可见
          if (entry.intersectionRatio && entry.intersectionRatio > 0) {
            let lazyImage = entry.target;
            if (isPc) {
              $(lazyImage).css('background-image', `url(${lazyImage.dataset.src})`);
            } else {
              $(lazyImage).css('background-image', `url(${lazyImage.dataset.phonesrc})`);
            }
            lazyImage.classList.remove('lazy-image');
            lazyImageObserver.unobserve(lazyImage);
            // this.lazyImages.splice(index, 1)
          }
        });
      });
      this.lazyImages.forEach(function (lazyImage) {
        lazyImageObserver.observe(lazyImage);
      });
    } else {
      this.inViewShow();
      this._throttleFn = throttle(this.inViewShow.bind(this));
      document.addEventListener('scroll', this._throttleFn);
    }
  }
}
/**
 * @description 节流函数
 * @param {function} fn
 * @param {number} delay
 * @param {number} mustRun
 */
export function throttle(fn, delay = 15, mustRun = 30) {
  let t_start = null;
  let timer = null;
  let context = this;
  return function () {
    let t_current = +new Date();
    let args = Array.prototype.slice.call(arguments);
    clearTimeout(timer);
    if (!t_start) {
      t_start = t_current;
    }
    if (t_current - t_start > mustRun) {
      fn.apply(context, args);
      t_start = t_current;
    } else {
      timer = setTimeout(() => {
        fn.apply(context, args);
      }, delay);
    }
  };
}
/**
 * @author sql
 * @description 获取url中的参数
 * @param {String} url url地址，可以不传
 * @returns {Object}
 */
export function getUrlParmas(url) {
  const _url = url || window.location.href;
  const _urlParams = _url.match(/([?&])(.+?=[^&]+)/gim);
  return _urlParams
    ? _urlParams.reduce((a, b) => {
        const value = b.slice(1).split('=');
        a[value[0]] = value[1];
        return a;
      }, {})
    : {};
}

/**
 * @description url变化监听器
 * @param {Function} function
 */
export function urlHasChange(fn) {
  var lasturl = window.location.href;
  function isHashChanged() {
    var cururl = window.location.href;
    if (lasturl == cururl) {
      return false;
    }
    return true;
  }
  if ('onhashchange' in window && (typeof document.documentMode === 'undefined' || document.documentMode == 8)) {
    // 浏览器支持onhashchange事件
    window.onhashchange = fn;
  } else {
    // 不支持则用定时器检测的办法
    setInterval(function () {
      var ischanged = isHashChanged();
      if (ischanged) {
        fn();
      }
    }, 150);
  }
}
