import { EVENTS, STATES, ATTRIBUTES } from '../constants.js';

export default class FavoriteDropdown {
  selectors = {
    root: ATTRIBUTES.FAVORITE.DROPDOWN.ROOT,
    button: ATTRIBUTES.FAVORITE.DROPDOWN.BUTTON,
    content: '.favorite__content',
  };

  stateClasses = {
    active: STATES.ACTIVE,
  };

  constructor() {
    this.root = document.querySelector(this.selectors.root);
    if (!this.root) {
      return;
    }

    this.button = this.root.querySelector(this.selectors.button);
    this.content = this.root.querySelector(this.selectors.content);

    this.init();
  }

  init() {
    this.button.addEventListener('click', this.handleToggle);
  }

  get isOpen() {
    return this.root.classList.contains(this.stateClasses.active);
  }

  handleToggle = (e) => {
    e.preventDefault();
    this.isOpen ? this.close() : this.open();
  };

  handleClickOutside = (e) => {
    if (!this.root.contains(e.target)) {
      this.close();
    }
  };

  handleEscClose = (e) => {
    if (e.key === 'Escape') {
      this.close();
    }
  };

  open() {
    this.root.classList.add(this.stateClasses.active);
    this.button.setAttribute('aria-expanded', 'true');

    // Вешаем глобальные слушатели ТОЛЬКО при открытии
    document.addEventListener('click', this.handleClickOutside);
    document.addEventListener('keydown', this.handleEscClose);

    this.root.dispatchEvent(new CustomEvent(EVENTS.FAVORITE_OPENED));
  }

  close() {
    this.root.classList.remove(this.stateClasses.active);
    this.button.setAttribute('aria-expanded', 'false');

    // Снимаем слушатели, чтобы не нагружать систему
    document.removeEventListener('click', this.handleClickOutside);
    document.removeEventListener('keydown', this.handleEscClose);
  }

  destroy() {
    this.close();
    this.button.removeEventListener('click', this.handleToggle);
  }
}
