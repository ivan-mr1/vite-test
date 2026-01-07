(function () {
  const t = document.createElement('link').relList;
  if (t && t.supports && t.supports('modulepreload')) return;
  for (const i of document.querySelectorAll('link[rel="modulepreload"]')) s(i);
  new MutationObserver((i) => {
    for (const o of i)
      if (o.type === 'childList')
        for (const d of o.addedNodes)
          d.tagName === 'LINK' && d.rel === 'modulepreload' && s(d);
  }).observe(document, { childList: !0, subtree: !0 });
  function e(i) {
    const o = {};
    return (
      i.integrity && (o.integrity = i.integrity),
      i.referrerPolicy && (o.referrerPolicy = i.referrerPolicy),
      i.crossOrigin === 'use-credentials'
        ? (o.credentials = 'include')
        : i.crossOrigin === 'anonymous'
          ? (o.credentials = 'omit')
          : (o.credentials = 'same-origin'),
      o
    );
  }
  function s(i) {
    if (i.ep) return;
    i.ep = !0;
    const o = e(i);
    fetch(i.href, o);
  }
})();
function L() {
  const a = document.querySelector('header');
  document.addEventListener('click', (t) => {
    const e = t.target.closest('[data-goto]');
    if (!e) return;
    const s = e.dataset.goto,
      i = document.querySelector(s);
    if (i) {
      t.preventDefault();
      const o = a ? a.offsetHeight : 0,
        l = i.getBoundingClientRect().top + window.scrollY - o;
      window.scrollTo({ top: l, behavior: 'smooth' });
    }
  });
}
let w = !0;
const _ = (a) => {
    ((w = !1),
      setTimeout(() => {
        w = !0;
      }, a));
  },
  U = () => document.querySelectorAll('[data-right-padding]'),
  I = () => {
    const a = window.innerWidth - document.body.clientWidth,
      t = parseFloat(getComputedStyle(document.documentElement).fontSize);
    return a / t + 'rem';
  },
  A = (a = '') => {
    (U().forEach((e) => {
      e.style.paddingRight = a;
    }),
      (document.body.style.paddingRight = a));
  },
  P = (a) => {
    document.documentElement.style.setProperty('--scrollbar-width', a);
  },
  S = () => {
    document.documentElement.style.removeProperty('--scrollbar-width');
  },
  O = (a = 500) => {
    if (!w) return;
    const t = I();
    (A(t),
      P(t),
      document.documentElement.setAttribute('data-scroll-lock', ''),
      _(a));
  },
  $ = (a = 500) => {
    w &&
      (A(''),
      S(),
      document.documentElement.removeAttribute('data-scroll-lock'),
      _(a));
  };
class V {
  selectors = {
    root: '[data-header]',
    menu: '[data-header-menu]',
    burgerButton: '[data-header-burger-btn]',
    overlay: '[data-header-overlay]',
  };
  stateClasses = {
    isActive: 'is-active',
    isLock: 'lock',
    isScrolled: 'scroll',
    isHidden: 'is-hidden',
  };
  constructor() {
    ((this.rootElement = document.querySelector(this.selectors.root)),
      this.rootElement &&
        ((this.menuElement = this.rootElement.querySelector(
          this.selectors.menu,
        )),
        (this.burgerButtonElement = this.rootElement.querySelector(
          this.selectors.burgerButton,
        )),
        (this.overlayElement = this.rootElement.querySelector(
          this.selectors.overlay,
        )),
        (this.isMenuOpen = !1),
        (this.lastScrollY = window.scrollY),
        (this.ticking = !1),
        this.init()));
  }
  init() {
    (this.setHeightProperty(),
      this.handleScroll(),
      this.bindEvents(),
      (this.resizeObserver = new ResizeObserver(() =>
        this.setHeightProperty(),
      )),
      this.resizeObserver.observe(this.rootElement));
  }
  setHeightProperty = () => {
    const t = this.rootElement.offsetHeight;
    document.documentElement.style.setProperty('--header-height', `${t}px`);
  };
  handleScroll = () => {
    this.ticking ||
      (window.requestAnimationFrame(() => {
        const t = window.scrollY,
          e = this.rootElement.offsetHeight,
          s = t > this.lastScrollY,
          i = t > e;
        this.rootElement.classList.toggle(this.stateClasses.isScrolled, t > 0);
        const o = !this.isMenuOpen && i && s;
        (this.rootElement.classList.toggle(this.stateClasses.isHidden, o),
          (this.lastScrollY = t),
          (this.ticking = !1));
      }),
      (this.ticking = !0));
  };
  toggleMenu = () => this.setMenuState(!this.isMenuOpen);
  setMenuState = (t) => {
    ((this.isMenuOpen = t),
      this.burgerButtonElement?.classList.toggle(this.stateClasses.isActive, t),
      this.menuElement?.classList.toggle(this.stateClasses.isActive, t),
      this.burgerButtonElement?.setAttribute('aria-expanded', t),
      t ? O() : $(),
      t && this.rootElement.classList.remove(this.stateClasses.isHidden),
      t
        ? document.addEventListener('keydown', this.onEscapePress)
        : document.removeEventListener('keydown', this.onEscapePress));
  };
  onMenuLinkClick = (t) => {
    t.target.closest('a') && this.setMenuState(!1);
  };
  onEscapePress = (t) => {
    t.key === 'Escape' && this.setMenuState(!1);
  };
  onOverlayClick = (t) => {
    t.target === this.overlayElement && this.setMenuState(!1);
  };
  bindEvents() {
    (this.burgerButtonElement?.addEventListener('click', this.toggleMenu),
      this.menuElement?.addEventListener('click', this.onMenuLinkClick),
      this.overlayElement?.addEventListener('click', this.onOverlayClick),
      window.addEventListener('scroll', this.handleScroll, { passive: !0 }));
  }
  destroy() {
    (this.burgerButtonElement?.removeEventListener('click', this.toggleMenu),
      this.menuElement?.removeEventListener('click', this.onMenuLinkClick),
      this.overlayElement?.removeEventListener('click', this.onOverlayClick),
      window.removeEventListener('scroll', this.handleScroll),
      document.removeEventListener('keydown', this.onEscapePress),
      this.resizeObserver?.disconnect());
  }
}
class D {
  defaults = {
    parent: document.body,
    offset: 300,
    maxWidth: 2e3,
    scrollUpClass: 'scroll-up',
    scrollUpPathClass: 'scroll-up__path',
  };
  constructor(t = {}) {
    this.settings = { ...this.defaults, ...t };
    const { parent: e } = this.settings;
    if (!(e instanceof Element)) {
      console.error('ScrollUpButton = Invalid parent element');
      return;
    }
    ((this.parent = e),
      (this.button = null),
      (this.path = null),
      (this.pathLength = 0),
      this.init());
  }
  init() {
    (this.createButton(),
      this.cacheElements(),
      this.setInitialStyles(),
      this.bindEvents(),
      this.toggleVisibility());
  }
  createButton() {
    const { scrollUpClass: t, scrollUpPathClass: e, parent: s } = this.settings;
    ((this.button = document.createElement('button')),
      this.button.classList.add(t),
      this.button.setAttribute('aria-label', 'scroll to top'),
      this.button.setAttribute('title', 'scroll to top'),
      (this.button.innerHTML = `
      <svg class="${t}__svg" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 52 52">
        <path class="${e}" d="M 24,0 a24,24 0 0,1 0,48 a24,24 0 0,1 0,-48" />
      </svg>
    `),
      s.appendChild(this.button));
  }
  cacheElements() {
    const { scrollUpPathClass: t } = this.settings;
    ((this.path = this.button.querySelector(`.${t}`)),
      (this.pathLength = this.path.getTotalLength()));
  }
  setInitialStyles() {
    ((this.path.style.strokeDasharray = `${this.pathLength} ${this.pathLength}`),
      (this.path.style.transition = 'stroke-dashoffset 0.3s ease'));
  }
  getScrollTop() {
    return window.scrollY || document.documentElement.scrollTop;
  }
  updateDashOffset() {
    const t = document.documentElement.scrollHeight - window.innerHeight,
      e = this.pathLength - (this.getScrollTop() * this.pathLength) / t;
    this.path.style.strokeDashoffset = e;
  }
  toggleVisibility = () => {
    const { offset: t, maxWidth: e, scrollUpClass: s } = this.settings,
      i = this.getScrollTop(),
      o = window.innerWidth;
    (this.updateDashOffset(),
      i > t && o <= e
        ? this.button.classList.add(`${s}--active`)
        : this.button.classList.remove(`${s}--active`));
  };
  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  bindEvents() {
    (window.addEventListener('scroll', this.toggleVisibility),
      window.addEventListener('resize', this.toggleVisibility),
      this.button.addEventListener('click', this.scrollToTop));
  }
  destroy() {
    (window.removeEventListener('scroll', this.toggleVisibility),
      window.removeEventListener('resize', this.toggleVisibility),
      this.button.removeEventListener('click', this.scrollToTop),
      this.button.remove());
  }
}
function N() {
  const a = document.querySelectorAll('.scroller');
  window.matchMedia('(prefer-reduce-motion: reduce)').matches || t();
  function t() {
    a.forEach((e) => {
      e.setAttribute('data-animated', !0);
      const s = e.querySelector('.scroller__inner');
      Array.from(s.children).forEach((o) => {
        const d = o.cloneNode(!0);
        (d.setAttribute('aria-hidden', !0), s.appendChild(d));
      });
    });
  }
}
const E = JSON.parse(
    '[{"category":"glasses for vision","id":1,"image":"./img/products/glasses-for-vision/1.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-1","price":1200},{"category":"glasses for vision","id":2,"image":"./img/products/glasses-for-vision/2.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-2","price":1200},{"category":"glasses for vision","id":3,"image":"./img/products/glasses-for-vision/3.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-3","price":1200},{"category":"glasses for vision","id":4,"image":"./img/products/glasses-for-vision/4.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-4","price":1200},{"category":"glasses for vision","id":5,"image":"./img/products/glasses-for-vision/5.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-5","price":1200},{"category":"glasses for vision","id":6,"image":"./img/products/glasses-for-vision/6.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-6","price":1200},{"category":"glasses for vision","id":7,"image":"./img/products/glasses-for-vision/7.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-7","price":1200},{"category":"glasses for vision","id":8,"image":"./img/products/glasses-for-vision/8.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-8","price":1200},{"category":"glasses for vision","id":9,"image":"./img/products/glasses-for-vision/9.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-9","price":1200},{"category":"glasses for vision","id":10,"image":"./img/products/glasses-for-vision/10.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-10","price":1200},{"category":"glasses for vision","id":11,"image":"./img/products/glasses-for-vision/11.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-11","price":1200},{"category":"glasses for vision","id":12,"image":"./img/products/glasses-for-vision/12.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-12","price":1200},{"category":"glasses for vision","id":13,"image":"./img/products/glasses-for-vision/13.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-13","price":1200},{"category":"glasses for vision","id":14,"image":"./img/products/glasses-for-vision/14.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-14","price":1200},{"category":"glasses for vision","id":15,"image":"./img/products/glasses-for-vision/15.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-15","price":1200},{"category":"glasses for vision","id":16,"image":"./img/products/glasses-for-vision/16.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-16","price":1200},{"category":"glasses for vision","id":17,"image":"./img/products/glasses-for-vision/17.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-17","price":1200},{"category":"glasses for vision","id":18,"image":"./img/products/glasses-for-vision/18.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-18","price":1200},{"category":"glasses for vision","id":19,"image":"./img/products/glasses-for-vision/19.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-19","price":1200},{"category":"glasses for vision","id":20,"image":"./img/products/glasses-for-vision/20.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-20","price":1200},{"category":"glasses for vision","id":21,"image":"./img/products/glasses-for-vision/21.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-21","price":1200},{"category":"glasses for vision","id":22,"image":"./img/products/glasses-for-vision/22.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-22","price":1200},{"category":"glasses for vision","id":23,"image":"./img/products/glasses-for-vision/23.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-23","price":1200},{"category":"glasses for vision","id":24,"image":"./img/products/glasses-for-vision/24.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-24","price":1200},{"category":"glasses for vision","id":25,"image":"./img/products/glasses-for-vision/25.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-25","price":1200},{"category":"glasses for vision","id":26,"image":"./img/products/glasses-for-vision/26.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-26","price":1200},{"category":"glasses for vision","id":27,"image":"./img/products/glasses-for-vision/27.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-27","price":1200},{"category":"glasses for vision","id":28,"image":"./img/products/glasses-for-vision/28.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-28","price":1200},{"category":"glasses for vision","id":29,"image":"./img/products/glasses-for-vision/29.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-29","price":1200},{"category":"glasses for vision","id":30,"image":"./img/products/glasses-for-vision/30.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-30","price":1200},{"category":"glasses for vision","id":31,"image":"./img/products/glasses-for-vision/31.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-31","price":1200},{"category":"glasses for vision","id":32,"image":"./img/products/glasses-for-vision/32.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-32","price":1200},{"category":"glasses for vision","id":33,"image":"./img/products/glasses-for-vision/33.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-33","price":1200},{"category":"glasses for vision","id":34,"image":"./img/products/glasses-for-vision/34.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-34","price":1200},{"category":"glasses for vision","id":35,"image":"./img/products/glasses-for-vision/35.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-35","price":1200},{"category":"glasses for vision","id":36,"image":"./img/products/glasses-for-vision/36.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-36","price":1200},{"category":"glasses for vision","id":37,"image":"./img/products/glasses-for-vision/37.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-37","price":1200},{"category":"glasses for vision","id":38,"image":"./img/products/glasses-for-vision/38.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-38","price":1200},{"category":"glasses for vision","id":39,"image":"./img/products/glasses-for-vision/39.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-39","price":1200},{"category":"glasses for vision","id":40,"image":"./img/products/glasses-for-vision/40.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-40","price":1200},{"category":"glasses for vision","id":41,"image":"./img/products/glasses-for-vision/41.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-41","price":1200},{"category":"glasses for vision","id":42,"image":"./img/products/glasses-for-vision/42.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-42","price":1200},{"category":"glasses for vision","id":43,"image":"./img/products/glasses-for-vision/43.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-43","price":1200},{"category":"glasses for vision","id":44,"image":"./img/products/glasses-for-vision/44.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-44","price":1200},{"category":"glasses for vision","id":45,"image":"./img/products/glasses-for-vision/45.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-45","price":1200},{"category":"glasses for vision","id":46,"image":"./img/products/glasses-for-vision/46.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-46","price":1200},{"category":"glasses for vision","id":47,"image":"./img/products/glasses-for-vision/47.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-47","price":1200},{"category":"glasses for vision","id":48,"image":"./img/products/glasses-for-vision/48.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-48","price":1200},{"category":"glasses for vision","id":49,"image":"./img/products/glasses-for-vision/49.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-49","price":1200},{"category":"glasses for vision","id":50,"image":"./img/products/glasses-for-vision/50.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-50","price":1200},{"category":"glasses for vision","id":51,"image":"./img/products/glasses-for-vision/51.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-51","price":1200},{"category":"glasses for vision","id":52,"image":"./img/products/glasses-for-vision/52.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-52","price":1200},{"category":"glasses for vision","id":53,"image":"./img/products/glasses-for-vision/53.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-53","price":1200},{"category":"glasses for vision","id":54,"image":"./img/products/glasses-for-vision/54.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-54","price":1200},{"category":"glasses for vision","id":55,"image":"./img/products/glasses-for-vision/55.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-55","price":1200},{"category":"glasses for vision","id":56,"image":"./img/products/glasses-for-vision/56.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-56","price":1200},{"category":"glasses for vision","id":57,"image":"./img/products/glasses-for-vision/57.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-57","price":1200},{"category":"glasses for vision","id":58,"image":"./img/products/glasses-for-vision/58.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-58","price":1200},{"category":"glasses for vision","id":59,"image":"./img/products/glasses-for-vision/59.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-59","price":1200},{"category":"glasses for vision","id":60,"image":"./img/products/glasses-for-vision/60.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-60","price":1200},{"category":"glasses for vision","id":61,"image":"./img/products/glasses-for-vision/61.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-61","price":1200},{"category":"glasses for vision","id":62,"image":"./img/products/glasses-for-vision/62.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-62","price":1200},{"category":"glasses for vision","id":63,"image":"./img/products/glasses-for-vision/63.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-63","price":1200},{"category":"glasses for vision","id":64,"image":"./img/products/glasses-for-vision/64.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-64","price":1200},{"category":"glasses for vision","id":65,"image":"./img/products/glasses-for-vision/65.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-65","price":1200},{"category":"glasses for vision","id":66,"image":"./img/products/glasses-for-vision/66.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-66","price":1200},{"category":"glasses for vision","id":67,"image":"./img/products/glasses-for-vision/67.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-67","price":1200},{"category":"glasses for vision","id":68,"image":"./img/products/glasses-for-vision/68.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-68","price":1200},{"category":"glasses for vision","id":69,"image":"./img/products/glasses-for-vision/69.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-69","price":1200},{"category":"glasses for vision","id":70,"image":"./img/products/glasses-for-vision/70.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-70","price":1200},{"category":"glasses for vision","id":71,"image":"./img/products/glasses-for-vision/71.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-71","price":1200},{"category":"glasses for vision","id":72,"image":"./img/products/glasses-for-vision/72.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-72","price":1200},{"category":"glasses for vision","id":73,"image":"./img/products/glasses-for-vision/73.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-73","price":1200},{"category":"glasses for vision","id":74,"image":"./img/products/glasses-for-vision/74.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-74","price":1200},{"category":"glasses for vision","id":75,"image":"./img/products/glasses-for-vision/75.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-75","price":1200},{"category":"glasses for vision","id":76,"image":"./img/products/glasses-for-vision/76.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-76","price":1200},{"category":"glasses for vision","id":77,"image":"./img/products/glasses-for-vision/77.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-77","price":1200},{"category":"glasses for vision","id":78,"image":"./img/products/glasses-for-vision/78.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-78","price":1200},{"category":"glasses for vision","id":79,"image":"./img/products/glasses-for-vision/79.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-79","price":1200},{"category":"glasses for vision","id":80,"image":"./img/products/glasses-for-vision/80.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-80","price":1200},{"category":"glasses for vision","id":81,"image":"./img/products/glasses-for-vision/81.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-81","price":1200},{"category":"glasses for vision","id":82,"image":"./img/products/glasses-for-vision/82.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-82","price":1200},{"category":"glasses for vision","id":83,"image":"./img/products/glasses-for-vision/83.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-83","price":1200},{"category":"glasses for vision","id":84,"image":"./img/products/glasses-for-vision/84.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-84","price":1200},{"category":"glasses for vision","id":85,"image":"./img/products/glasses-for-vision/85.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-85","price":1200},{"category":"glasses for vision","id":86,"image":"./img/products/glasses-for-vision/86.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-86","price":1200},{"category":"glasses for vision","id":87,"image":"./img/products/glasses-for-vision/87.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-87","price":1200},{"category":"glasses for vision","id":88,"image":"./img/products/glasses-for-vision/88.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-88","price":1200},{"category":"glasses for vision","id":89,"image":"./img/products/glasses-for-vision/89.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-89","price":1200},{"category":"glasses for vision","id":90,"image":"./img/products/glasses-for-vision/90.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-90","price":1200},{"category":"glasses for vision","id":91,"image":"./img/products/glasses-for-vision/91.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-91","price":1200},{"category":"glasses for vision","id":92,"image":"./img/products/glasses-for-vision/92.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-92","price":1200},{"category":"glasses for vision","id":93,"image":"./img/products/glasses-for-vision/93.webp","description":"description model glasses for vision","model":"glasses for vision with UV protection 1","article":"01-93","price":1200}]',
  ),
  u = {
    CART_UPDATED: 'cart:updated',
    FAVORITE_UPDATED: 'favorite:updated',
    FAVORITE_OPENED: 'favorite:opened',
  },
  y = { CART: 'user_cart', FAVORITES: 'user_favorites' },
  f = { ACTIVE: 'is-active', HIDDEN: 'is-hidden', IN_CART: 'is-in-cart' },
  c = {
    CURRENCY: 'грн',
    ARTICLE: 'Артикул:',
    BUY: 'Купити',
    IN_CART: 'В кошику',
    ADD_TO_FAVORITES: 'Додати до обраного',
    REMOVE_FROM_FAVORITES: 'Видалити з обраного',
    ADD_TO_CART_ARIA: 'Додати у кошик товар',
    IN_CART_ARIA: 'Товар уже у кошику',
    PRODUCT_LINK_ARIA: 'Перейти до опису моделі',
    PRODUCT_NOT_FOUND: 'Товар не знайдено',
    PRODUCTS_NOT_FOUND: 'Товари не знайдено',
    EMPTY_CART: 'Ваш кошик порожній',
    DELETE_ITEM: 'Видалити товар',
    INCREASE_QUANTITY: 'Збільшити кількість',
    DECREASE_QUANTITY: 'Зменшити кількість',
    PREV_PAGE: 'Попередня сторінка',
    NEXT_PAGE: 'Наступна сторінка',
    PAGE: 'Сторінка',
    CURRENT_PAGE: 'Поточна сторінка',
    PAGINATION_LABEL: 'Пагінація товарів',
    EMPTY_LIST: 'Ваш список порожній',
    ART_SHORT: 'Art:',
    TITLE_REMOVE: 'Видалити',
    TITLE_BUY: 'В кошик',
    ARIA_REMOVE_FROM_LIST: 'Видалити товар зі списку обраного',
    ARIA_ADD_TO_CART: 'Додати товар у кошик',
    ARIA_PRODUCT_LINK: 'Перейти к товару',
    PRICE_LABEL: 'Ціна',
  },
  v = {
    PRODUCT_DETAILS: '[data-product-details]',
    PRODUCT_CATALOG: '[data-products-catalog]',
    FAVORITE_COUNTER: '[data-favorite-counter]',
    CART_COUNTER: '[data-cart-counter]',
    CART_LIST: '[data-cart-list]',
    CART_TOTAL_PRICE: '[data-cart-total-price]',
    FAVORITE_LIST: '[data-favorite-list]',
  },
  p = {
    PRODUCT_ID: 'data-product-id',
    PRODUCT_CARD: {
      ROOT: 'data-product',
      PRICE: 'data-card-price',
      BUY_BTN: 'data-card-buy-btn',
      FAVORITE_BTN: 'data-card-favorite',
    },
    PRODUCT_DETAILS: {
      BUY_BTN: 'data-details-buy',
      FAVORITE_BTN: 'data-details-favorite',
      BREADCRUMB: 'data-product-breadcrumb',
    },
    CART: {
      MINUS: 'data-cart-minus',
      PLUS: 'data-cart-plus',
      REMOVE: 'data-cart-remove-btn',
    },
    FAVORITE: {
      REMOVE: 'data-favorite-remove-btn',
      BUY: 'data-favorite-buy-btn',
      DROPDOWN: { ROOT: '[data-favorite]', BUTTON: '[data-favorite-btn]' },
    },
    PAGINATION: {
      ROOT: '[data-pagination]',
      LIST: '[data-pagination-list]',
      PREV: '[data-pagination-btn-prev]',
      NEXT: '[data-pagination-btn-next]',
    },
  },
  B = { UA: 'uk-UA' },
  k = new Intl.NumberFormat(B.UA),
  b = (a) => k.format(a);
class M {
  defaultSettings = {
    rootAttribute: p.PRODUCT_CARD.ROOT,
    rootClass: 'products__item',
    imageWrapperClass: 'product__image ibg',
    bottomWrapperClass: 'product__bottom',
  };
  defaultAttributes = {
    buyBtn: p.PRODUCT_CARD.BUY_BTN,
    favoriteBtn: p.PRODUCT_CARD.FAVORITE_BTN,
    price: p.PRODUCT_CARD.PRICE,
    productId: p.PRODUCT_ID,
  };
  defaultClasses = {
    productCard: 'product',
    favoriteLink: 'product__link product__link-favorite',
    title: 'product__title',
    descr: 'product__descr',
    article: 'product__article',
    priceWrapper: 'product__price product-price',
    priceCurrent: 'product__price-current',
    buyBtn: 'button button--card product__btn',
    active: f.ACTIVE,
    inCart: f.IN_CART,
  };
  defaultI18n = {
    buy: c.BUY,
    inCart: c.IN_CART,
    currency: c.CURRENCY,
    articlePrefix: c.ARTICLE,
    titleFavorite: c.ADD_TO_FAVORITES,
    titleFavoriteRemove: c.REMOVE_FROM_FAVORITES,
    ariaBuy: c.ADD_TO_CART_ARIA,
    ariaInCart: c.IN_CART_ARIA,
    ariaProductLink: c.PRODUCT_LINK_ARIA,
    iconFavorite:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M12 18.023c-4.64-2.635-7.236-5.26-8.493-7.55C2.224 8.138 2.33 6.156 3.052 4.74c1.478-2.9 5.684-3.828 8.242-.593l.705.893.707-.893c2.558-3.235 6.764-2.307 8.242.593.721 1.415.827 3.398-.456 5.735-1.257 2.289-3.852 4.914-8.492 7.549zm0-15.778C8.52-1.144 3.337.215 1.448 3.922.42 5.939.4 8.555 1.93 11.34c1.517 2.763 4.548 5.69 9.634 8.502l.436.24.435-.24c5.086-2.811 8.118-5.74 9.635-8.502 1.53-2.785 1.51-5.4.482-7.418C20.662.215 15.48-1.144 12 2.245" clip-rule="evenodd"/></svg>',
  };
  constructor(t = {}, e = {}, s = {}) {
    ((this.product = t),
      (this.cartStorage = e.cart),
      (this.favStorage = e.favorite),
      (this.settings = { ...this.defaultSettings, ...s.settings }),
      (this.attrs = { ...this.defaultAttributes, ...s.attributes }),
      (this.classes = { ...this.defaultClasses, ...s.classes }),
      (this.i18n = { ...this.defaultI18n, ...s.i18n }),
      (this.element = null),
      (this.subElements = {}),
      (this.onFavoriteUpdate = this.syncFavoriteState.bind(this)),
      (this.onCartUpdate = this.syncCartState.bind(this)));
  }
  getTemplate() {
    const {
        id: t,
        image: e,
        model: s,
        description: i,
        article: o,
        price: d,
      } = this.product,
      { attrs: l, classes: n, i18n: r } = this,
      h = this.favStorage?.check(t),
      g = this.cartStorage?.check(t);
    return `
      <article class="${n.productCard}" ${l.productId}="${t}">
        <a href="/card.html?id=${t}" 
           target="_blank" 
           class="${this.settings.imageWrapperClass}" 
           aria-label="${r.ariaProductLink}: ${s}"
           title="${s}">
          <img src="${e}" alt="" width="285" height="215" loading="lazy" aria-hidden="true" />
        </a>
        <div class="${this.settings.bottomWrapperClass}">
          <div class="product__actions">
            <button type="button" 
                    ${l.favoriteBtn} 
                    class="${n.favoriteLink} ${h ? n.active : ''}" 
                    title="${h ? r.titleFavoriteRemove : r.titleFavorite}" 
                    aria-label="${r.titleFavorite}: ${s}"
                    aria-pressed="${h}">
              ${r.iconFavorite}
            </button>
          </div>
          <a href="/card.html?id=${t}" target="_blank" class="${n.title}">${s}</a>
          <div class="${n.descr}"><p>${i}</p></div>
          <div class="${n.article}">${r.articlePrefix} ${o}</div>
          <div class="${n.priceWrapper}">
            <div ${l.price} class="${n.priceCurrent}">
              ${b(d)} ${r.currency}
            </div>
          </div>
          <button type="button" 
                  ${l.buyBtn} 
                  class="${n.buyBtn} ${g ? n.inCart : ''}" 
                  title="${g ? r.ariaInCart : r.buy}"
                  aria-label="${g ? r.ariaInCart : r.ariaBuy}: ${s}">
            ${g ? r.inCart : r.buy}
          </button>
        </div>
      </article>
    `;
  }
  render() {
    const t = document.createElement('div');
    return (
      (t.innerHTML = this.getTemplate()),
      (this.element = document.createElement('li')),
      (this.element.className = this.settings.rootClass),
      this.element.setAttribute(this.settings.rootAttribute, this.product.id),
      this.element.append(t.firstElementChild),
      this.#t(),
      this.#e(),
      this.element
    );
  }
  #t() {
    const t = Object.values(this.attrs)
      .map((s) => `[${s}]`)
      .join(',');
    this.element.querySelectorAll(t).forEach((s) => {
      const i = Object.keys(this.attrs).find((o) =>
        s.hasAttribute(this.attrs[o]),
      );
      i && (this.subElements[i] = s);
    });
  }
  syncFavoriteState() {
    if (!this.favStorage) return;
    const t = this.favStorage.check(this.product.id),
      e = this.subElements.favoriteBtn;
    e &&
      (e.classList.toggle(this.classes.active, t),
      e.setAttribute('aria-pressed', t),
      (e.title = t ? this.i18n.titleFavoriteRemove : this.i18n.titleFavorite));
  }
  syncCartState() {
    if (!this.cartStorage) return;
    const t = this.cartStorage.check(this.product.id);
    this.#s(t);
  }
  #e() {
    (this.subElements.favoriteBtn?.addEventListener('click', (t) => {
      (t.preventDefault(), this.favStorage?.toggle(this.product.id));
    }),
      this.subElements.buyBtn?.addEventListener('click', (t) => {
        (t.preventDefault(),
          this.cartStorage?.check(this.product.id) ||
            this.cartStorage?.add(this.product.id));
      }),
      document.addEventListener(u.FAVORITE_UPDATED, this.onFavoriteUpdate),
      document.addEventListener(u.CART_UPDATED, this.onCartUpdate));
  }
  #s(t) {
    const e = this.subElements.buyBtn;
    e &&
      ((e.textContent = t ? this.i18n.inCart : this.i18n.buy),
      e.classList.toggle(this.classes.inCart, t),
      (e.title = t ? this.i18n.ariaInCart : this.i18n.buy),
      e.setAttribute(
        'aria-label',
        `${t ? this.i18n.ariaInCart : this.i18n.ariaBuy}: ${this.product.model}`,
      ));
  }
  destroy() {
    (this.element &&
      (document.removeEventListener(u.FAVORITE_UPDATED, this.onFavoriteUpdate),
      document.removeEventListener(u.CART_UPDATED, this.onCartUpdate),
      this.element.remove()),
      (this.element = null),
      (this.subElements = {}));
  }
}
class F {
  defaultSettings = { emptyClass: 'products__empty' };
  defaultI18n = { emptyMessage: c.PRODUCTS_NOT_FOUND };
  constructor(t, e = [], s = {}, i = {}) {
    ((this.container = document.querySelector(t)),
      (this.products = e),
      (this.cards = []),
      (this.storage = s),
      (this.settings = { ...this.defaultSettings, ...i.settings }),
      (this.i18n = { ...this.defaultI18n, ...i.i18n }));
  }
  render(t = this.products) {
    if (!this.container) {
      console.warn('Container for ProductList not found');
      return;
    }
    if ((this.clear(), t.length === 0)) {
      const s = document.createElement('li');
      ((s.className = this.settings.emptyClass),
        (s.textContent = this.i18n.emptyMessage),
        this.container.append(s));
      return;
    }
    const e = document.createDocumentFragment();
    (t.forEach((s) => {
      const i = new M(s, this.storage);
      (this.cards.push(i), e.append(i.render()));
    }),
      this.container.append(e));
  }
  updateProducts(t) {
    this.products = t || [];
  }
  clear() {
    this.container &&
      (this.cards.forEach((t) => t.destroy()),
      (this.container.innerHTML = ''),
      (this.cards = []));
  }
}
class x {
  defaultSelectors = {
    pagination: p.PAGINATION.ROOT,
    paginationList: p.PAGINATION.LIST,
    btnPrev: p.PAGINATION.PREV,
    btnNext: p.PAGINATION.NEXT,
    pageItem: '.pagination__item',
  };
  defaultClasses = {
    active: f.ACTIVE,
    hidden: f.HIDDEN,
    item: 'pagination__item',
    separator: 'pagination__separator',
  };
  defaultI18n = {
    prev: c.PREV_PAGE,
    next: c.NEXT_PAGE,
    page: c.PAGE,
    current: c.CURRENT_PAGE,
    paginationLabel: c.PAGINATION_LABEL,
  };
  constructor(t, e = [], s = {}) {
    ((this.renderList = t),
      (this.products = e),
      (this.selectors = { ...this.defaultSelectors, ...s.selectors }),
      (this.classes = { ...this.defaultClasses, ...s.classes }),
      (this.i18n = { ...this.defaultI18n, ...s.i18n }),
      (this.state = {
        currentPage: 1,
        productsPerPage: s.productsPerPage || 12,
        visibleRange: 2,
      }),
      (this.pagination = document.querySelector(this.selectors.pagination)),
      (this.paginationList = document.querySelector(
        this.selectors.paginationList,
      )),
      (this.btnPrev = document.querySelector(this.selectors.btnPrev)),
      (this.btnNext = document.querySelector(this.selectors.btnNext)),
      this.paginationList && this.init());
  }
  init() {
    (this.#e(), this.render(), this.bindEvents(), this.#t());
  }
  #t() {
    (this.btnPrev && this.btnPrev.setAttribute('aria-label', this.i18n.prev),
      this.btnNext && this.btnNext.setAttribute('aria-label', this.i18n.next),
      this.pagination?.setAttribute('role', 'navigation'),
      this.pagination?.setAttribute('aria-label', this.i18n.paginationLabel));
  }
  #e() {
    const t = () => {
      const s = window.innerWidth;
      let i = 2;
      (s < 370 ? (i = 0) : s < 768 && (i = 1),
        this.state.visibleRange !== i &&
          ((this.state.visibleRange = i), this.renderPagination()));
    };
    t();
    let e;
    window.addEventListener('resize', () => {
      (clearTimeout(e), (e = setTimeout(t, 200)));
    });
  }
  getPagesCount() {
    return Math.ceil(this.products.length / this.state.productsPerPage);
  }
  render() {
    (this.#s(), this.renderPagination(), this.#r());
  }
  #s() {
    const { currentPage: t, productsPerPage: e } = this.state,
      s = (t - 1) * e,
      i = this.products.slice(s, s + e);
    if ((this.renderList.render(i), t > 1)) {
      const l =
        (this.renderList.container?.getBoundingClientRect().top || 0) +
        window.pageYOffset +
        -100;
      window.scrollTo({ top: l, behavior: 'smooth' });
    }
  }
  renderPagination() {
    const t = this.getPagesCount();
    if (t <= 1) {
      this.pagination?.classList.add(this.classes.hidden);
      return;
    }
    this.paginationList.innerHTML = '';
    const e = document.createDocumentFragment(),
      { currentPage: s, visibleRange: i } = this.state,
      o = s - i,
      d = s + i;
    for (let l = 1; l <= t; l++) {
      const n = l === 1 || l === t,
        r = l >= o && l <= d;
      n || r
        ? e.append(this.#o(l))
        : l === o - 1 && l > 1
          ? e.append(this.#i())
          : l === d + 1 && l < t && e.append(this.#i());
    }
    (this.paginationList.append(e),
      this.pagination?.classList.remove(this.classes.hidden));
  }
  #o(t) {
    const e = t === this.state.currentPage,
      s = document.createElement('li');
    return (
      (s.className = this.classes.item),
      e && s.classList.add(this.classes.active),
      (s.dataset.page = t),
      (s.textContent = t),
      s.setAttribute('role', 'button'),
      s.setAttribute('tabindex', '0'),
      s.setAttribute(
        'aria-label',
        `${e ? this.i18n.current : this.i18n.page} ${t}`,
      ),
      e && s.setAttribute('aria-current', 'page'),
      s
    );
  }
  #i() {
    const t = document.createElement('li');
    return (
      (t.className = this.classes.separator),
      (t.textContent = '...'),
      t.setAttribute('aria-hidden', 'true'),
      t
    );
  }
  #r() {
    const t = this.getPagesCount(),
      { currentPage: e } = this.state;
    if (this.btnPrev) {
      const s = e === 1;
      ((this.btnPrev.disabled = s),
        this.btnPrev.setAttribute('aria-disabled', s));
    }
    if (this.btnNext) {
      const s = e === t;
      ((this.btnNext.disabled = s),
        this.btnNext.setAttribute('aria-disabled', s));
    }
  }
  bindEvents() {
    (this.paginationList.addEventListener('click', this.onPageClick),
      this.btnNext?.addEventListener('click', this.onNextClick),
      this.btnPrev?.addEventListener('click', this.onPrevClick),
      this.paginationList.addEventListener('keydown', (t) => {
        t.key === 'Enter' && this.onPageClick(t);
      }));
  }
  onPageClick = (t) => {
    const e = t.target.closest(this.selectors.pageItem);
    !e ||
      e.classList.contains(this.classes.active) ||
      ((this.state.currentPage = Number(e.dataset.page)), this.render());
  };
  onNextClick = () => {
    this.state.currentPage < this.getPagesCount() &&
      (this.state.currentPage++, this.render());
  };
  onPrevClick = () => {
    this.state.currentPage > 1 && (this.state.currentPage--, this.render());
  };
  updateProducts(t) {
    ((this.products = t || []), (this.state.currentPage = 1), this.render());
  }
}
class T {
  constructor(t, e, s = !0) {
    ((this.STORAGE_KEY = t),
      (this.EVENT_NAME = e),
      (this.useNumbers = s),
      this.initTabSync());
  }
  initTabSync() {
    window.addEventListener('storage', (t) => {
      t.key === this.STORAGE_KEY && this.EVENT_NAME && this.#t();
    });
  }
  #t() {
    this.EVENT_NAME && document.dispatchEvent(new CustomEvent(this.EVENT_NAME));
  }
  #e(t) {
    return this.useNumbers ? Number(t) : t;
  }
  get() {
    try {
      const t = localStorage.getItem(this.STORAGE_KEY);
      return t ? this.safeParse(t) : [];
    } catch (t) {
      return (console.error('LocalStorage Get Error:', t), []);
    }
  }
  set(t = []) {
    try {
      (localStorage.setItem(this.STORAGE_KEY, JSON.stringify(t)), this.#t());
    } catch (e) {
      console.error(`Storage Error: Cannot save ${this.STORAGE_KEY}`, e);
    }
  }
  check(t) {
    const e = this.#e(t);
    return this.get().includes(e);
  }
  add(t) {
    const e = this.get();
    (e.push(this.#e(t)), this.set(e));
  }
  removeOne(t) {
    const e = this.#e(t),
      s = this.get(),
      i = s.indexOf(e);
    i !== -1 && (s.splice(i, 1), this.set(s));
  }
  remove(t) {
    const e = this.#e(t),
      s = this.get().filter((i) => i !== e);
    this.set(s);
  }
  toggle(t) {
    const e = this.#e(t),
      s = this.get(),
      i = s.indexOf(e);
    return (i === -1 ? s.push(e) : s.splice(i, 1), this.set(s), s);
  }
  clear() {
    (localStorage.removeItem(this.STORAGE_KEY), this.#t());
  }
  safeParse(t) {
    try {
      const e = JSON.parse(t);
      return Array.isArray(e) ? e : [];
    } catch {
      return [];
    }
  }
}
class H {
  selectors = {
    root: p.FAVORITE.DROPDOWN.ROOT,
    button: p.FAVORITE.DROPDOWN.BUTTON,
    content: '.favorite__content',
  };
  stateClasses = { active: f.ACTIVE };
  constructor() {
    ((this.root = document.querySelector(this.selectors.root)),
      this.root &&
        ((this.button = this.root.querySelector(this.selectors.button)),
        (this.content = this.root.querySelector(this.selectors.content)),
        this.init()));
  }
  init() {
    this.button.addEventListener('click', this.handleToggle);
  }
  get isOpen() {
    return this.root.classList.contains(this.stateClasses.active);
  }
  handleToggle = (t) => {
    (t.preventDefault(), this.isOpen ? this.close() : this.open());
  };
  handleClickOutside = (t) => {
    this.root.contains(t.target) || this.close();
  };
  handleEscClose = (t) => {
    t.key === 'Escape' && this.close();
  };
  open() {
    (this.root.classList.add(this.stateClasses.active),
      this.button.setAttribute('aria-expanded', 'true'),
      document.addEventListener('click', this.handleClickOutside),
      document.addEventListener('keydown', this.handleEscClose),
      this.root.dispatchEvent(new CustomEvent(u.FAVORITE_OPENED)));
  }
  close() {
    (this.root.classList.remove(this.stateClasses.active),
      this.button.setAttribute('aria-expanded', 'false'),
      document.removeEventListener('click', this.handleClickOutside),
      document.removeEventListener('keydown', this.handleEscClose));
  }
  destroy() {
    (this.close(), this.button.removeEventListener('click', this.handleToggle));
  }
}
class R {
  defaultOptions = { keys: { id: 'id', price: 'price' } };
  constructor(t = [], e = {}) {
    ((this.options = { keys: { ...this.defaultOptions.keys, ...e.keys } }),
      (this.productsMap = this.#t(t)));
  }
  #t(t) {
    const { id: e } = this.options.keys;
    return new Map(t.map((s) => [s[e], s]));
  }
  getGroupedProducts(t) {
    const { price: e } = this.options.keys,
      s = t.reduce((i, o) => ((i[o] = (i[o] || 0) + 1), i), {});
    return Object.entries(s)
      .map(([i, o]) => {
        const d = this.productsMap.get(Number(i));
        return d ? { ...d, count: o, totalItemPrice: d[e] * o } : null;
      })
      .filter(Boolean);
  }
  calculateTotal(t) {
    return t.reduce((e, s) => e + s.totalItemPrice, 0);
  }
}
class q {
  defaultSelectors = {
    list: v.FAVORITE_LIST,
    totalPrice: '.favorite__fullprice',
    productId: p.PRODUCT_ID,
    btnRemove: p.FAVORITE.REMOVE,
    btnBuy: p.FAVORITE.BUY,
  };
  defaultClasses = {
    item: 'favorite__item',
    product: 'favorite-product',
    emptyMessage: 'favorite__empty',
  };
  defaultI18n = {
    emptyList: c.EMPTY_LIST,
    currency: c.CURRENCY,
    art: c.ART_SHORT,
    titleRemove: c.TITLE_REMOVE,
    titleBuy: c.TITLE_BUY,
    ariaRemove: c.ARIA_REMOVE_FROM_LIST,
    ariaBuy: c.ARIA_ADD_TO_CART,
    ariaProductLink: c.ARIA_PRODUCT_LINK,
    priceLabel: c.PRICE_LABEL,
    iconTrash: `
      <svg class="svg svg--20 icon-orange" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
        <path fill="#ffa501" d="M18.572 2.857h-5v-.714C13.572.959 12.612 0 11.429 0H8.572C7.388 0 6.429.96 6.429 2.143v.714h-5a.714.714 0 1 0 0 1.429h.776L3.572 19.35c.033.369.343.65.714.649h11.428c.37.002.681-.28.715-.65l1.366-15.064h.776a.714.714 0 1 0 0-1.429M7.857 2.143c0-.395.32-.714.715-.714h2.857c.394 0 .714.32.714.714v.714H7.857zm7.205 16.428H4.938L3.643 4.286H16.36z"/>
        <path fill="#ffa501" d="M7.857 16.381v-.003l-.714-10a.716.716 0 0 0-1.429.101l.715 10a.714.714 0 0 0 .714.664h.051a.714.714 0 0 0 .663-.762M10 5.714a.714.714 0 0 0-.714.715v10a.714.714 0 1 0 1.428 0v-10A.714.714 0 0 0 10 5.714M13.622 5.714a.716.716 0 0 0-.765.664l-.714 10a.714.714 0 0 0 .66.764h.053c.376.002.688-.288.715-.663l.715-10a.716.716 0 0 0-.664-.765"/>
      </svg>
    `,
    iconCart: `
      <svg class="svg svg--20 icon-orange" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 35 29">
        <path d="M26.1 19.9H7.9C5.3 19.9 3.7 18.1 3.3 16.3C3 15.2 0.7 7.1 0 4.9C-0.1 4.6 0.1 4.3 0.4 4.3H30V6.3H2.5C3.3 8.9 5 14.8 5.2 15.9C5.4 16.8 6.3 17.9 7.9 17.9H26.1V19.9Z" fill="#FFA501"/>
        <path d="M24.6 24.8L23 23.7C23.2 23.4 23.4 23.1 23.5 22.7C24 21.2 27.5 8.8 29 3.5C29.5 1.4 31.3 0 33.5 0H34.7C34.8 0 35 0.2 35 0.3V1.6C35 1.8 34.8 2 34.7 2H33.5C32.3 2 31.2 2.8 30.9 4C29.4 9.3 25.9 21.8 25.4 23.4C25.2 23.9 24.9 24.4 24.6 24.8Z" fill="#FFA501"/>
        <path d="M20.5 25H8.4V27H20.5V25Z" fill="#FFA501"/>
        <path d="M6 29C4.3 29 3 27.6 3 26C3 24.3 4.4 23 6 23C7.7 23 9 24.4 9 26C9 27.6 7.7 29 6 29Z" fill="#FFA501"/>
        <path d="M22.6 29C20.9 29 19.6 27.6 19.6 26C19.6 24.3 21 23 22.6 23C24.3 23 25.6 24.4 25.6 26C25.6 27.6 24.3 29 22.6 29Z" fill="#FFA501"/>
      </svg>
    `,
  };
  constructor(t = {}) {
    ((this.selectors = { ...this.defaultSelectors, ...t.selectors }),
      (this.classes = { ...this.defaultClasses, ...t.classes }),
      (this.i18n = { ...this.defaultI18n, ...t.i18n }),
      (this.container = document.querySelector(this.selectors.list)),
      (this.totalPriceElement = document.querySelector(
        this.selectors.totalPrice,
      )));
  }
  render(t, e) {
    this.container &&
      (t.length === 0
        ? (this.container.innerHTML = `<li class="${this.classes.emptyMessage}">${this.i18n.emptyList}</li>`)
        : (this.container.innerHTML = t
            .map((s) => this.getItemTemplate(s))
            .join('')),
      this.updateTotal(e));
  }
  updateTotal(t) {
    this.totalPriceElement &&
      (this.totalPriceElement.textContent = `${b(t)} ${this.i18n.currency}`);
  }
  getItemTemplate(t) {
    const { id: e, image: s, model: i, price: o, article: d } = t,
      l = this.selectors,
      n = this.classes,
      r = this.i18n;
    return `
      <li class="${n.item}">
        <article class="${n.product}" ${l.productId}="${e}">
          <a href="/card.html?id=${e}" 
             target="_blank" 
             class="${n.product}__image" 
             aria-label="${r.ariaProductLink} ${i}">
            <img src="${s}" alt="" width="80" height="80" loading="lazy" aria-hidden="true" />
          </a>
          <div class="${n.product}__wrapper">
            <a href="/card.html?id=${e}" 
               target="_blank" 
               class="${n.product}__title"
               aria-label="${i}">${i}</a>
            <div class="${n.product}__inner">
              <div class="${n.product}__article" aria-label="${r.art}">${r.art} ${d}</div>
              <div class="${n.product}__price" aria-label="${r.priceLabel}">${b(o)} ${r.currency}</div>
            </div>
          </div>
          <div class="${n.product}__buttons">
            <button type="button" 
                    ${l.btnRemove} 
                    class="${n.product}__btn" 
                    title="${r.titleRemove}" 
                    aria-label="${r.ariaRemove}: ${i}">
              ${r.iconTrash}
            </button>
            <button type="button" 
                    ${l.btnBuy} 
                    class="${n.product}__btn" 
                    title="${r.titleBuy}" 
                    aria-label="${r.ariaBuy}: ${i}">
              ${r.iconCart}
            </button>
          </div>
        </article>
      </li>`;
  }
}
class Y {
  constructor(t, e, s) {
    ((this.storage = t),
      (this.cartStorage = s),
      (this.service = new R(e)),
      (this.view = new q()),
      this.view.container && this.init());
  }
  init() {
    (this.refresh(),
      this.initEventListeners(),
      document.addEventListener(u.FAVORITE_UPDATED, () => this.refresh()));
  }
  refresh() {
    const t = this.storage.get(),
      e = this.service.getGroupedProducts(t),
      s = this.service.calculateTotal(e);
    this.view.render(e, s);
  }
  initEventListeners() {
    const { productId: t, btnRemove: e, btnBuy: s } = this.view.selectors;
    this.view.container.addEventListener('click', (i) => {
      const o = i.target.closest(`[${t}]`);
      if (!o) return;
      const d = Number(o.getAttribute(t));
      (i.target.closest(`[${e}]`) &&
        (i.stopPropagation(), this.storage.remove(d)),
        i.target.closest(`[${s}]`) &&
          this.cartStorage &&
          (i.stopPropagation(), this.cartStorage.add(d)));
    });
  }
}
class C {
  constructor(t, e, s) {
    ((this.counters = document.querySelectorAll(t)),
      (this.storage = e),
      (this.eventName = s),
      !(this.counters.length === 0 || !this.storage) && this.init());
  }
  init() {
    (this.update(),
      document.addEventListener(this.eventName, () => {
        this.update();
      }));
  }
  update() {
    const e = this.storage.get().length;
    this.counters.forEach((s) => {
      ((s.textContent = e),
        e > 0 ? s.classList.remove(f.HIDDEN) : s.classList.add(f.HIDDEN));
    });
  }
}
class G {
  defaultSelectors = {
    list: v.CART_LIST,
    totalPrice: v.CART_TOTAL_PRICE,
    productId: p.PRODUCT_ID,
    btnMinus: p.CART.MINUS,
    btnPlus: p.CART.PLUS,
    btnRemove: p.CART.REMOVE,
  };
  defaultClasses = {
    item: 'cart-item',
    itemImage: 'cart-item__image',
    itemImg: 'cart-item__img',
    itemInfo: 'cart-item__info',
    itemName: 'cart-item__title',
    itemArticle: 'cart-item__article',
    itemActions: 'cart-item__actions',
    quantity: 'cart-item__quantity',
    quantityBtn: 'quantity__button',
    quantityInput: 'quantity__input',
    priceBlock: 'cart-item__price-block',
    price: 'cart-item__price',
    deleteBtn: 'cart-item__delete',
    emptyMessage: 'cart__empty',
  };
  defaultI18n = {
    emptyCart: c.EMPTY_CART,
    currency: c.CURRENCY,
    articleLabel: c.ARTICLE,
    deleteLabel: c.DELETE_ITEM,
    minusLabel: c.DECREASE_QUANTITY,
    plusLabel: c.INCREASE_QUANTITY,
    iconTrash: `
      <svg class="svg svg--20 icon-orange" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
        <path fill="#ffa501" d="M18.572 2.857h-5v-.714C13.572.959 12.612 0 11.429 0H8.572C7.388 0 6.429.96 6.429 2.143v.714h-5a.714.714 0 1 0 0 1.429h.776L3.572 19.35c.033.369.343.65.714.649h11.428c.37.002.681-.28.715-.65l1.366-15.064h.776a.714.714 0 1 0 0-1.429M7.857 2.143c0-.395.32-.714.715-.714h2.857c.394 0 .714.32.714.714v.714H7.857zm7.205 16.428H4.938L3.643 4.286H16.36z"/>
        <path fill="#ffa501" d="M7.857 16.381v-.003l-.714-10a.716.716 0 0 0-1.429.101l.715 10a.714.714 0 0 0 .714.664h.051a.714.714 0 0 0 .663-.762M10 5.714a.714.714 0 0 0-.714.715v10a.714.714 0 1 0 1.428 0v-10A.714.714 0 0 0 10 5.714M13.622 5.714a.716.716 0 0 0-.765.664l-.714 10a.714.714 0 0 0 .66.764h.053c.376.002.688-.288.715-.663l.715-10a.716.716 0 0 0-.664-.765"/>
      </svg>
    `,
  };
  constructor(t = {}, e = {}) {
    ((this.selectors = { ...this.defaultSelectors, ...t.selectors }),
      (this.classes = { ...this.defaultClasses, ...t.classes }),
      (this.i18n = { ...this.defaultI18n, ...t.i18n }),
      (this.settings = e),
      (this.container = document.querySelector(this.selectors.list)),
      (this.totalPriceElements = document.querySelectorAll(
        this.selectors.totalPrice,
      )));
  }
  render(t, e) {
    this.container &&
      (t.length === 0
        ? (this.container.innerHTML = `
        <li class="${this.classes.emptyMessage}">${this.i18n.emptyCart}</li>
      `)
        : (this.container.innerHTML = t
            .map((s) => this.getItemTemplate(s))
            .join('')),
      this.updateTotalDisplay(e));
  }
  updateTotalDisplay(t) {
    const e = b(t);
    this.totalPriceElements.forEach((s) => {
      s.innerHTML = `${e}&nbsp;${this.i18n.currency}`;
    });
  }
  getItemTemplate(t) {
    const { id: e, image: s, model: i, price: o, article: d, count: l } = t,
      n = l <= (this.settings.minQuantity || 1),
      r = l >= (this.settings.maxQuantity || 99),
      h = this.selectors,
      g = this.classes,
      m = this.i18n;
    return `
      <li class="${g.item}" ${h.productId}="${e}">
        <a href="/card.html?id=${e}" class="${g.itemImage}">
          <img
            class="${g.itemImg}"
            src="${s}"
            alt="${i}"
            width="160"
            height="110"
            loading="lazy"
          />
        </a>
        <div class="${g.itemInfo}">
          <h3 class="${g.itemName}">${i}</h3>
          <div class="${g.itemArticle}">${m.articleLabel} ${d}</div>
        </div>
        <div class="${g.itemActions}">
          <div class="${g.priceBlock}">
            <span class="${g.price}">${b(o * l)}&nbsp;${m.currency}</span>
          </div>
          <div class="${g.quantity} quantity">
            <button
              type="button"
              ${h.btnMinus}
              class="${g.quantityBtn}"
              ${n ? 'disabled' : ''}
              aria-label="${m.minusLabel}"
              title="${m.minusLabel}"
            >
              −
            </button>
            <input
              type="number"
              class="${g.quantityInput}"
              value="${l}"
              readonly
            />
            <button
              type="button"
              ${h.btnPlus}
              class="${g.quantityBtn}"
              ${r ? 'disabled' : ''}
              aria-label="${m.plusLabel}"
              title="${m.plusLabel}"
            >
              +
            </button>
          </div>
          <button
            type="button"
            ${h.btnRemove}
            class="${g.deleteBtn}"
            aria-label="${m.deleteLabel}"
            title="${m.deleteLabel}"
          >
            ${m.iconTrash}
          </button>
        </div>
      </li>`;
  }
}
class W {
  settings = { minQuantity: 1, maxQuantity: 15 };
  selectors = { list: v.CART_LIST, totalPrice: v.CART_TOTAL_PRICE };
  constructor(t, e) {
    ((this.storage = t),
      (this.service = new R(e)),
      (this.view = new G({ selectors: this.selectors }, this.settings)),
      this.view.container && this.init());
  }
  init() {
    (this.refresh(),
      this.initEventListeners(),
      document.addEventListener(u.CART_UPDATED, () => this.refresh()));
  }
  refresh() {
    const t = this.storage.get(),
      e = this.service.getGroupedProducts(t),
      s = this.service.calculateTotal(e);
    this.view.render(e, s);
  }
  initEventListeners() {
    const {
      productId: t,
      btnPlus: e,
      btnMinus: s,
      btnRemove: i,
    } = this.view.selectors;
    this.view.container.addEventListener('click', (o) => {
      const d = o.target.closest(`[${t}]`);
      if (!d) return;
      const l = Number(d.getAttribute(t)),
        n = o.target.closest(`[${e}]`),
        r = o.target.closest(`[${s}]`),
        h = o.target.closest(`[${i}]`);
      if (!n && !r && !h) return;
      const g = this.storage.get().filter((m) => m === l).length;
      n && g < this.settings.maxQuantity
        ? this.storage.add(l)
        : r && g > this.settings.minQuantity
          ? this.storage.removeOne(l)
          : h && this.storage.remove(l);
    });
  }
}
class z {
  defaultSettings = {
    imageWrapperClass: 'product-details__image ibg',
    infoWrapperClass: 'product-details__info',
  };
  defaultAttributes = {
    buyBtn: p.PRODUCT_DETAILS.BUY_BTN,
    favoriteBtn: p.PRODUCT_DETAILS.FAVORITE_BTN,
    breadcrumb: p.PRODUCT_DETAILS.BREADCRUMB,
  };
  defaultClasses = {
    title: 'product-details__title',
    price: 'product-details__price',
    description: 'product-details__description',
    article: 'product-details__article',
    actions: 'product-details__actions',
    buyBtn: 'product-details__btn button',
    favoriteBtn: 'product-details__favorite-btn',
    active: f.ACTIVE,
    inCart: f.IN_CART,
  };
  defaultI18n = {
    buy: c.BUY,
    inCart: c.IN_CART,
    currency: c.CURRENCY,
    articlePrefix: c.ARTICLE,
    titleFavorite: c.ADD_TO_FAVORITES,
    titleFavoriteRemove: c.REMOVE_FROM_FAVORITES,
    ariaBuy: c.ADD_TO_CART_ARIA,
    ariaInCart: c.IN_CART_ARIA,
    errorMessage: c.PRODUCT_NOT_FOUND,
    iconFavorite:
      '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M12 18.023c-4.64-2.635-7.236-5.26-8.493-7.55C2.224 8.138 2.33 6.156 3.052 4.74c1.478-2.9 5.684-3.828 8.242-.593l.705.893.707-.893c2.558-3.235 6.764-2.307 8.242.593.721 1.415.827 3.398-.456 5.735-1.257 2.289-3.852 4.914-8.492 7.549zm0-15.778C8.52-1.144 3.337.215 1.448 3.922.42 5.939.4 8.555 1.93 11.34c1.517 2.763 4.548 5.69 9.634 8.502l.436.24.435-.24c5.086-2.811 8.118-5.74 9.635-8.502 1.53-2.785 1.51-5.4.482-7.418C20.662.215 15.48-1.144 12 2.245" clip-rule="evenodd"/></svg>',
  };
  constructor(t, e, s, i = {}) {
    ((this.container = document.querySelector(t)),
      (this.products = e),
      (this.cartStorage = s.cart),
      (this.favStorage = s.favorite),
      (this.product = null),
      (this.settings = { ...this.defaultSettings, ...i.settings }),
      (this.attrs = { ...this.defaultAttributes, ...i.attributes }),
      (this.classes = { ...this.defaultClasses, ...i.classes }),
      (this.i18n = { ...this.defaultI18n, ...i.i18n }),
      (this.subElements = {}),
      (this.onFavoriteUpdate = this.syncFavoriteState.bind(this)),
      (this.onCartUpdate = this.syncCartState.bind(this)),
      this.container && this.init());
  }
  init() {
    const e = new URLSearchParams(window.location.search).get('id');
    if (
      ((this.product =
        this.products.find((s) => s.id === e) || this.products[0]),
      !this.product)
    ) {
      this.container.innerHTML = `<p>${this.i18n.errorMessage}</p>`;
      return;
    }
    (this.render(), this.updateBreadcrumbs(), this.initEventListeners());
  }
  getTemplate() {
    const {
        id: t,
        image: e,
        model: s,
        description: i,
        article: o,
        price: d,
      } = this.product,
      { attrs: l, classes: n, i18n: r } = this,
      h = this.favStorage?.check(t),
      g = this.cartStorage?.check(t);
    return `
      <div class="${this.settings.imageWrapperClass}">
        <img src="${e}" alt="${s}" width="600" height="480">
      </div>
      <div class="${this.settings.infoWrapperClass}">
        <h1 class="${n.title}">${s}</h1>
        <div class="${n.price}">${b(d)} ${r.currency}</div>
        
        <div class="${n.description}">
          <p>${i}</p>
        </div>
        
        <div class="${n.article}">
            ${r.articlePrefix} ${o}
        </div>

        <div class="${n.actions}">
          <button type="button" 
            ${l.buyBtn} 
            class="${n.buyBtn} ${g ? n.inCart : ''}"
            title="${g ? r.ariaInCart : r.buy}">
            ${g ? r.inCart : r.buy}
          </button>
          
          <button type="button" 
            ${l.favoriteBtn} 
            class="${n.favoriteBtn} ${h ? n.active : ''}"
            aria-label="${h ? r.titleFavoriteRemove : r.titleFavorite}"
            title="${h ? r.titleFavoriteRemove : r.titleFavorite}">
            ${r.iconFavorite}
          </button>
        </div>
      </div>
    `;
  }
  render() {
    ((this.container.innerHTML = this.getTemplate()), this.initSubElements());
  }
  initSubElements() {
    ((this.subElements.buyBtn = this.container.querySelector(
      `[${this.attrs.buyBtn}]`,
    )),
      (this.subElements.favoriteBtn = this.container.querySelector(
        `[${this.attrs.favoriteBtn}]`,
      )));
  }
  updateBreadcrumbs() {
    const t = document.querySelector(`[${this.attrs.breadcrumb}]`);
    t && (t.textContent = this.product.model);
  }
  initEventListeners() {
    (this.container.addEventListener('click', (t) => {
      const e = t.target.closest(`[${this.attrs.buyBtn}]`),
        s = t.target.closest(`[${this.attrs.favoriteBtn}]`);
      (e &&
        (this.cartStorage.check(this.product.id) ||
          this.cartStorage.add(this.product.id)),
        s && this.favStorage.toggle(this.product.id));
    }),
      document.addEventListener(u.CART_UPDATED, this.onCartUpdate),
      document.addEventListener(u.FAVORITE_UPDATED, this.onFavoriteUpdate));
  }
  syncCartState() {
    const { buyBtn: t } = this.subElements;
    if (!t) return;
    const e = this.cartStorage.check(this.product.id),
      { classes: s, i18n: i } = this;
    e
      ? (t.classList.add(s.inCart),
        (t.textContent = i.inCart),
        (t.title = i.ariaInCart))
      : (t.classList.remove(s.inCart),
        (t.textContent = i.buy),
        (t.title = i.buy));
  }
  syncFavoriteState() {
    const { favoriteBtn: t } = this.subElements;
    if (!t) return;
    const e = this.favStorage.check(this.product.id),
      { classes: s, i18n: i } = this;
    (t.classList.toggle(s.active, e),
      t.setAttribute('aria-label', e ? i.titleFavoriteRemove : i.titleFavorite),
      (t.title = e ? i.titleFavoriteRemove : i.titleFavorite));
  }
  destroy() {
    (document.removeEventListener(u.CART_UPDATED, this.onCartUpdate),
      document.removeEventListener(u.FAVORITE_UPDATED, this.onFavoriteUpdate),
      (this.container.innerHTML = ''),
      (this.product = null),
      (this.subElements = {}));
  }
}
function K() {
  const a = new T(y.FAVORITES, u.FAVORITE_UPDATED),
    t = new T(y.CART, u.CART_UPDATED);
  new z(v.PRODUCT_DETAILS, E, { cart: t, favorite: a });
  const e = new F(v.PRODUCT_CATALOG, E, { favorite: a, cart: t });
  (new x(e, E, { productsPerPage: 12, visibleRange: 2 }),
    new H(),
    new Y(a, E, t),
    new W(t, E),
    new C(v.FAVORITE_COUNTER, a, u.FAVORITE_UPDATED),
    new C(v.CART_COUNTER, t, u.CART_UPDATED));
}
window.addEventListener('DOMContentLoaded', () => {
  (L(), new V(), new D(), N(), K());
});
