import { bodyLock, bodyUnlock } from '../../js/function/bodyLock.js';

class Header {
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
    this.rootElement = document.querySelector(this.selectors.root);
    if (!this.rootElement) {
      return;
    }

    this.menuElement = this.rootElement.querySelector(this.selectors.menu);
    this.burgerButtonElement = this.rootElement.querySelector(
      this.selectors.burgerButton,
    );
    this.overlayElement = this.rootElement.querySelector(
      this.selectors.overlay,
    );

    this.isMenuOpen = false;
    this.lastScrollY = window.scrollY;
    this.ticking = false;

    this.init();
  }

  init() {
    this.setHeightProperty();
    this.handleScroll();
    this.bindEvents();

    this.resizeObserver = new ResizeObserver(() => this.setHeightProperty());
    this.resizeObserver.observe(this.rootElement);
  }

  setHeightProperty = () => {
    const height = this.rootElement.offsetHeight;
    document.documentElement.style.setProperty(
      '--header-height',
      `${height}px`,
    );
  };

  /**
   * Обработчик скролла страницы
   * Управляет видимостью и состоянием header при прокрутке
   */
  handleScroll = () => {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;
        const headerHeight = this.rootElement.offsetHeight;
        const isScrollingDown = currentScrollY > this.lastScrollY;
        const isScrolledPastHeader = currentScrollY > headerHeight;

        // Класс при любом скролле
        this.rootElement.classList.toggle(
          this.stateClasses.isScrolled,
          currentScrollY > 0,
        );

        // Скрываем/показываем header при скролле вниз
        const shouldHideHeader =
          !this.isMenuOpen && isScrolledPastHeader && isScrollingDown;
        this.rootElement.classList.toggle(
          this.stateClasses.isHidden,
          shouldHideHeader,
        );

        this.lastScrollY = currentScrollY;
        this.ticking = false;
      });

      this.ticking = true;
    }
  };

  /**
   * Переключает состояние мобильного меню
   */
  toggleMenu = () => this.setMenuState(!this.isMenuOpen);

  /**
   * Устанавливает состояние меню (открыто/закрыто)
   * @param {boolean} isOpen
   */
  setMenuState = (isOpen) => {
    this.isMenuOpen = isOpen;
    this.burgerButtonElement?.classList.toggle(
      this.stateClasses.isActive,
      isOpen,
    );
    this.menuElement?.classList.toggle(this.stateClasses.isActive, isOpen);
    this.burgerButtonElement?.setAttribute('aria-expanded', isOpen);

    isOpen ? bodyLock() : bodyUnlock();

    // При открытии всегда показываем header
    if (isOpen) {
      this.rootElement.classList.remove(this.stateClasses.isHidden);
    }

    isOpen
      ? document.addEventListener('keydown', this.onEscapePress)
      : document.removeEventListener('keydown', this.onEscapePress);
  };

  onMenuLinkClick = (event) => {
    if (event.target.closest('a')) {
      this.setMenuState(false);
    }
  };

  onEscapePress = (e) => {
    if (e.key === 'Escape') {
      this.setMenuState(false);
    }
  };

  onOverlayClick = (e) => {
    if (e.target === this.overlayElement) {
      this.setMenuState(false);
    }
  };

  bindEvents() {
    this.burgerButtonElement?.addEventListener('click', this.toggleMenu);
    this.menuElement?.addEventListener('click', this.onMenuLinkClick);
    this.overlayElement?.addEventListener('click', this.onOverlayClick);
    window.addEventListener('scroll', this.handleScroll, { passive: true });
  }

  destroy() {
    this.burgerButtonElement?.removeEventListener('click', this.toggleMenu);
    this.menuElement?.removeEventListener('click', this.onMenuLinkClick);
    this.overlayElement?.removeEventListener('click', this.onOverlayClick);
    window.removeEventListener('scroll', this.handleScroll);
    document.removeEventListener('keydown', this.onEscapePress);
    this.resizeObserver?.disconnect();
  }
}

export default Header;
