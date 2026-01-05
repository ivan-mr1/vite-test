/**
 * ScrollUpButton.js
 * Scroll-to-top button module with circular progress indicator
 *
 * Usage
 * new ScrollUp({
 *   parent: document.querySelector('.wrapper'),
 *   offset: 300,
 *   maxWidth: 1600,
 * });
 */

class ScrollUpButton {
  defaults = {
    parent: document.body,
    offset: 300,
    maxWidth: 2000,
    scrollUpClass: 'scroll-up',
    scrollUpPathClass: 'scroll-up__path',
  };

  constructor(options = {}) {
    this.settings = { ...this.defaults, ...options };

    const { parent } = this.settings;
    if (!(parent instanceof Element)) {
      console.error('ScrollUpButton = Invalid parent element');
      return;
    }

    this.parent = parent;
    this.button = null;
    this.path = null;
    this.pathLength = 0;

    this.init();
  }

  init() {
    this.createButton();
    this.cacheElements();
    this.setInitialStyles();
    this.bindEvents();
    this.toggleVisibility();
  }

  createButton() {
    const { scrollUpClass, scrollUpPathClass, parent } = this.settings;

    this.button = document.createElement('button');
    this.button.classList.add(scrollUpClass);
    this.button.setAttribute('aria-label', 'scroll to top');
    this.button.setAttribute('title', 'scroll to top');

    this.button.innerHTML = `
      <svg class="${scrollUpClass}__svg" xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 52 52">
        <path class="${scrollUpPathClass}" d="M 24,0 a24,24 0 0,1 0,48 a24,24 0 0,1 0,-48" />
      </svg>
    `;

    parent.appendChild(this.button);
  }

  cacheElements() {
    const { scrollUpPathClass } = this.settings;
    this.path = this.button.querySelector(`.${scrollUpPathClass}`);
    this.pathLength = this.path.getTotalLength();
  }

  setInitialStyles() {
    this.path.style.strokeDasharray = `${this.pathLength} ${this.pathLength}`;
    this.path.style.transition = 'stroke-dashoffset 0.3s ease';
  }

  getScrollTop() {
    return window.scrollY || document.documentElement.scrollTop;
  }

  updateDashOffset() {
    const height = document.documentElement.scrollHeight - window.innerHeight;
    const dashOffset =
      this.pathLength - (this.getScrollTop() * this.pathLength) / height;
    this.path.style.strokeDashoffset = dashOffset;
  }

  toggleVisibility = () => {
    const { offset, maxWidth, scrollUpClass } = this.settings;
    const scrolled = this.getScrollTop();
    const width = window.innerWidth;

    this.updateDashOffset();

    if (scrolled > offset && width <= maxWidth) {
      this.button.classList.add(`${scrollUpClass}--active`);
    } else {
      this.button.classList.remove(`${scrollUpClass}--active`);
    }
  };

  scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  bindEvents() {
    window.addEventListener('scroll', this.toggleVisibility);
    window.addEventListener('resize', this.toggleVisibility);
    this.button.addEventListener('click', this.scrollToTop);
  }

  destroy() {
    window.removeEventListener('scroll', this.toggleVisibility);
    window.removeEventListener('resize', this.toggleVisibility);
    this.button.removeEventListener('click', this.scrollToTop);
    this.button.remove();
  }
}

export default ScrollUpButton;
