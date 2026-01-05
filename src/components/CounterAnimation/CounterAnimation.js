/**
 * CounterAnimationCollection.js
 * Numeric counter animation module
 *
 * You can use any symbols after the number (suffixes): %, +, items, kg, °C, etc.
 * Decimal and negative numbers are supported,
 * but only when the sign or decimal part follows the number.
 *
 * Usage:
 * <span data-animation-counter></span>
 * <span data-animation-counter>1200+</span>
 * <span
 *    data-animation-counter="1500"
 *    data-start-value="500"
 *    data-easing="easeInOutCubic">3000</span>
 * <span data-animation-counter data-reset-on-exit="true">75%</span>
 *
 * Data attributes:
 * data-animation-counter="1000"  = animation duration (ms)
 * data-start-value="0"           = starting value
 * data-easing="easeOutQuad"      = easing function
 * data-reset-on-exit="true"      = reset animation when leaving the viewport
 */

const rootSelector = '[data-animation-counter]';

class CounterAnimation {
  defaults = {
    duration: 1000,
    startValue: 0,
    easing: 'easeOutQuad',
    resetOnExit: true,
  };

  selectors = {
    root: rootSelector,
  };

  easingFunctions = {
    linear: (t) => t,
    easeOutQuad: (t) => t * (2 - t),
    easeInOutCubic: (t) =>
      t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  };

  constructor(element, observer) {
    this.element = element;
    this.observer = observer;
    this.settings = this.getSettings();
    this.init();
  }

  getSettings() {
    const el = this.element;
    return {
      duration:
        parseInt(el.dataset.animationCounter, 10) || this.defaults.duration,
      startValue: parseFloat(el.dataset.startValue) || this.defaults.startValue,
      easing: el.dataset.easing || this.defaults.easing,
      resetOnExit:
        el.dataset.resetOnExit === 'true' || this.defaults.resetOnExit,
    };
  }

  init() {
    if (!this.element.dataset.originalText) {
      this.element.dataset.originalText = this.element.textContent;
    }

    this.observer.observe(this.element);

    if (this.isInViewport(this.element)) {
      requestAnimationFrame(() => this.animate());
    }
  }

  animate() {
    const { duration, startValue, easing } = this.settings;
    const easingFn =
      this.easingFunctions[easing] || this.easingFunctions.easeOutQuad;

    const rawText = this.element.textContent.replace(/−/g, '-').trim();
    const match = rawText.match(/^(-?\d+[.,]?\d*)(.*)$/);
    if (!match) {
      return;
    }

    const numericText = match[1].replace(/,/g, '.');
    const suffix = match[2].trim();
    const targetValue = parseFloat(numericText);
    if (isNaN(targetValue)) {
      return;
    }

    const decimals = (numericText.split('.')[1] || '').length;

    this.animateCounter({
      start: startValue,
      target: targetValue,
      duration,
      suffix,
      decimals,
      easing: easingFn,
    });
  }

  animateCounter({ start, target, duration, suffix, decimals, easing }) {
    let startTime = null;

    const update = (currentTime) => {
      if (!startTime) {
        startTime = currentTime;
      }

      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easing(progress);

      if (progress > 0) {
        const currentValue = start + (target - start) * easedProgress;
        this.element.textContent = currentValue.toFixed(decimals) + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };

    requestAnimationFrame(update);
  }

  reset() {
    if (this.element.dataset.originalText) {
      this.element.textContent = this.element.dataset.originalText;
    } else {
      this.element.textContent = this.settings.startValue;
    }
  }

  isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    );
  }
}

class CounterAnimationCollection {
  constructor() {
    this.observed = new WeakSet();
    this.instances = new Map();
    this.initObserver();
    this.init();
  }

  initObserver() {
    this.observer = new IntersectionObserver(this.handleIntersect, {
      threshold: 0.5,
    });
  }

  handleIntersect = (entries) => {
    entries.forEach((entry) => {
      const element = entry.target;
      const instance = this.instances.get(element);
      if (!instance) {
        return;
      }

      if (entry.isIntersecting && !this.observed.has(element)) {
        this.observed.add(element);
        instance.animate();
      } else if (!entry.isIntersecting && instance.settings.resetOnExit) {
        this.observed.delete(element);
        instance.reset();
      }
    });
  };

  init() {
    document.querySelectorAll(rootSelector).forEach((el) => {
      const instance = new CounterAnimation(el, this.observer);
      this.instances.set(el, instance);
    });
  }
}

export default CounterAnimationCollection;
