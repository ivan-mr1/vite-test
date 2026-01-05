/**
 * Универсальный компонент для управления модальными окнами (попапами)
 * Поддерживает YouTube видео, hash-навигацию, focus trap и accessibility
 */

import {
  getBodyLockStatus,
  bodyLock,
  bodyUnlock,
} from '../../js/function/bodyLock';

import PopupYoutube from './PopupYoutube';

export default class Popup {
  selectors = {
    root: '[data-popup]',
    openButton: '[data-popup-link]',
    closeButton: '[data-popup-close]',
    content: '[data-popup-body]',
  };

  stateAttrs = {
    popupActive: 'data-popup-active',
    bodyActive: 'data-popup-open',
  };

  stateClasses = {
    isVisible: 'is-visible',
  };

  config = {
    focusTrapDelay: 50, // мс - задержка для focus trap
  };

  constructor(options = {}) {
    const defaults = {
      youtubeAttr: 'data-youtube-link',
      autoplay: true,
      enableYoutube: true,
      focusCatch: true,
      closeEsc: true,
      bodyLock: true,
      hash: {
        use: true,
        navigate: true,
      },
    };

    this.options = {
      ...defaults,
      ...options,
      hash: { ...defaults.hash, ...options?.hash },
    };

    // Опциональная интеграция с PopupYoutube
    this.youtube = this.options.enableYoutube
      ? new PopupYoutube({
          youtubeAttr: this.options.youtubeAttr,
          autoplay: this.options.autoplay,
          standalone: false,
        })
      : null;

    this.isOpen = false;
    this.activePopup = null;
    this.lastFocusEl = null;
    this.youTubeCode = null;

    this._focusable = [
      'a[href]',
      'input:not([disabled]):not([type="hidden"]):not([aria-hidden])',
      'button:not([disabled]):not([aria-hidden])',
      'select:not([disabled]):not([aria-hidden])',
      'textarea:not([disabled]):not([aria-hidden])',
      '[tabindex]:not([tabindex^="-"])',
    ];

    this.bindEvents();

    if (this.options.hash.navigate && window.location.hash) {
      this.openFromHash();
    }
  }

  /**
   * Привязывает обработчики событий
   */
  bindEvents = () => {
    document.addEventListener('click', this.handleClick);
    document.addEventListener('keydown', this.handleKey);

    if (this.options.hash.navigate) {
      window.addEventListener('hashchange', this.handleHashChange);
    }
  };

  /**
   * Обработчик кликов для открытия/закрытия попапов
   */
  handleClick = (e) => {
    const openButton = e.target.closest(this.selectors.openButton);
    const closeButton = e.target.closest(this.selectors.closeButton);

    if (openButton) {
      e.preventDefault();

      // Извлекаем YouTube код если интеграция включена
      this.youTubeCode =
        this.youtube?.extractCodeFromElement(openButton) || null;
      this.lastFocusEl = openButton;

      const popupId = openButton.getAttribute('data-popup-link');
      this.open(popupId);
      return;
    }

    const isCloseButton = !!closeButton;
    const isOutsideClick =
      this.isOpen && !e.target.closest(this.selectors.content);

    if (isCloseButton || isOutsideClick) {
      e.preventDefault();
      this.close();
    }
  };

  /**
   * Обработчик нажатий клавиш (Escape, Tab)
   */
  handleKey = (e) => {
    if (!this.isOpen) {
      return;
    }

    if (this.options.closeEsc && e.key === 'Escape') {
      e.preventDefault();
      this.close();
    } else if (this.options.focusCatch && e.key === 'Tab') {
      this.focusCatch(e);
    }
  };

  /**
   * Обработчик изменения hash в URL
   */
  handleHashChange = () => {
    if (window.location.hash) {
      this.openFromHash();
    } else {
      this.close();
    }
  };

  /**
   * Открывает попап по селектору
   * @param {string} selector - ID попапа
   */
  open = (selector) => {
    if (!getBodyLockStatus()) {
      return;
    }

    const popup = document.querySelector(`[data-popup="${selector}"]`);

    if (!popup) {
      console.warn(`Popup: Попап с селектором "${selector}" не найден`);
      return;
    }

    if (this.activePopup && this.activePopup !== popup) {
      this.close(this.activePopup);
    }

    this.activePopup = popup;
    this.isOpen = true;

    // Настройка YouTube если интеграция включена
    if (this.youtube) {
      const code =
        this.youTubeCode || this.youtube.extractCodeFromElement(popup);
      if (code) {
        this.youtube.setup(popup, code);
      }
    }

    if (this.options.hash.use) {
      this.updateHash(selector);
    }

    popup.setAttribute(this.stateAttrs.popupActive, '');
    popup.classList.add(this.stateClasses.isVisible);
    popup.setAttribute('aria-hidden', 'false');
    document.documentElement.setAttribute(this.stateAttrs.bodyActive, '');

    if (this.options.bodyLock) {
      bodyLock();
    }

    setTimeout(() => this.focusTrap(), this.config.focusTrapDelay);
  };

  /**
   * Закрывает активный попап
   * @param {HTMLElement} target - Элемент попапа для закрытия
   */
  close = (target = this.activePopup) => {
    if (!target || !this.isOpen) {
      return;
    }

    target.removeAttribute(this.stateAttrs.popupActive);
    target.classList.remove(this.stateClasses.isVisible);
    target.setAttribute('aria-hidden', 'true');

    this.isOpen = false;
    this.activePopup = null;

    // Очистка YouTube если интеграция включена
    if (this.youtube) {
      this.youtube.clear(target);
    }

    document.documentElement.removeAttribute(this.stateAttrs.bodyActive);
    if (this.options.bodyLock) {
      bodyUnlock();
    }

    if (this.options.hash.use) {
      this.clearHash();
    }

    this.lastFocusEl?.focus();
  };

  /**
   * Ловушка фокуса - удерживает фокус внутри попапа при нажатии Tab
   * @private
   */
  focusCatch = (e) => {
    const focusable = this.activePopup?.querySelectorAll(this._focusable);
    if (!focusable?.length) {
      return;
    }

    const arr = Array.from(focusable);
    const idx = arr.indexOf(document.activeElement);

    if (e.shiftKey && idx === 0) {
      arr[arr.length - 1].focus();
      e.preventDefault();
    } else if (!e.shiftKey && idx === arr.length - 1) {
      arr[0].focus();
      e.preventDefault();
    }
  };

  /**
   * Устанавливает фокус на первый элемент в попапе
   * @private
   */
  focusTrap = () => {
    const focusable = this.activePopup?.querySelectorAll(this._focusable);
    if (!focusable?.length) {
      return;
    }

    (this.isOpen ? focusable[0] : this.lastFocusEl)?.focus();
  };

  /**
   * Обновляет hash в URL
   * @private
   */
  updateHash = (selector) => {
    history.replaceState(null, '', `#${selector}`);
  };

  /**
   * Очищает hash из URL
   * @private
   */
  clearHash = () => {
    history.replaceState(null, '', window.location.pathname);
  };

  /**
   * Открывает попап из hash в URL
   * @private
   */
  openFromHash = () => {
    const hash = window.location.hash.replace('#', '');
    if (!hash) {
      return;
    }

    const btn = document.querySelector(`[data-popup-link="${hash}"]`);

    // Извлекаем YouTube код если интеграция включена
    this.youTubeCode = this.youtube?.extractCodeFromElement(btn) || null;
    this.open(hash);
  };

  /**
   * Очищает все обработчики событий
   * Вызывается при уничтожении компонента
   */
  destroy = () => {
    document.removeEventListener('click', this.handleClick);
    document.removeEventListener('keydown', this.handleKey);

    if (this.options.hash.navigate) {
      window.removeEventListener('hashchange', this.handleHashChange);
    }

    if (this.isOpen) {
      this.close();
    }
  };
}
