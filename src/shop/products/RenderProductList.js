import ProductCard from '../product-card/ProductCard';
import { I18N } from '../constants.js';

export default class RenderProductList {
  defaultSettings = {
    emptyClass: 'products__empty',
  };

  defaultI18n = {
    emptyMessage: I18N.PRODUCTS_NOT_FOUND,
  };

  constructor(containerSelector, products = [], storage = {}, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.products = products;
    this.cards = [];
    this.storage = storage;
    this.settings = { ...this.defaultSettings, ...options.settings };
    this.i18n = { ...this.defaultI18n, ...options.i18n };
  }

  /**
   * Рендерит список карточек
   * @param {Array} productsSlice - массив продуктов
   */
  render(productsSlice = this.products) {
    if (!this.container) {
      console.warn('Container for ProductList not found');
      return;
    }

    this.clear();

    if (productsSlice.length === 0) {
      const emptyEl = document.createElement('li');
      emptyEl.className = this.settings.emptyClass;
      emptyEl.textContent = this.i18n.emptyMessage;
      this.container.append(emptyEl);
      return;
    }

    const fragment = document.createDocumentFragment();

    productsSlice.forEach((product) => {
      const card = new ProductCard(product, this.storage);

      this.cards.push(card);
      fragment.append(card.render());
    });

    this.container.append(fragment);
  }

  updateProducts(products) {
    this.products = products || [];
  }

  clear() {
    if (!this.container) {
      return;
    }

    this.cards.forEach((card) => card.destroy());
    this.container.innerHTML = '';
    this.cards = [];
  }
}
