import { formatPrice } from '../utils.js';
import { I18N, ATTRIBUTES, SELECTORS } from '../constants.js';

export default class FavoriteView {
  defaultSelectors = {
    list: SELECTORS.FAVORITE_LIST,
    totalPrice: '.favorite__fullprice',
    productId: ATTRIBUTES.PRODUCT_ID,
    btnRemove: ATTRIBUTES.FAVORITE.REMOVE,
    btnBuy: ATTRIBUTES.FAVORITE.BUY,
  };

  defaultClasses = {
    item: 'favorite__item',
    product: 'favorite-product',
    emptyMessage: 'favorite__empty',
  };

  defaultI18n = {
    emptyList: I18N.EMPTY_LIST,
    currency: I18N.CURRENCY,
    art: I18N.ART_SHORT,
    titleRemove: I18N.TITLE_REMOVE,
    titleBuy: I18N.TITLE_BUY,
    ariaRemove: I18N.ARIA_REMOVE_FROM_LIST,
    ariaBuy: I18N.ARIA_ADD_TO_CART,
    ariaProductLink: I18N.ARIA_PRODUCT_LINK,
    priceLabel: I18N.PRICE_LABEL,
    iconTrash: `<svg class="svg svg--20" aria-hidden="true"><use xlink:href="#icon-monochrome-trash"></use></svg>`,
    iconCart: `<svg class="svg svg--20" aria-hidden="true"><use xlink:href="#icon-monochrome-cart"></use></svg>`,
  };

  constructor(options = {}) {
    this.selectors = { ...this.defaultSelectors, ...options.selectors };
    this.classes = { ...this.defaultClasses, ...options.classes };
    this.i18n = { ...this.defaultI18n, ...options.i18n };

    this.container = document.querySelector(this.selectors.list);
    this.totalPriceElement = document.querySelector(this.selectors.totalPrice);
  }

  render(products, total) {
    if (!this.container) {
      return;
    }

    if (products.length === 0) {
      this.container.innerHTML = `<li class="${this.classes.emptyMessage}">${this.i18n.emptyList}</li>`;
    } else {
      this.container.innerHTML = products
        .map((product) => this.getItemTemplate(product))
        .join('');
    }

    this.updateTotal(total);
  }

  updateTotal(total) {
    if (this.totalPriceElement) {
      this.totalPriceElement.textContent = `${formatPrice(total)} ${this.i18n.currency}`;
    }
  }

  getItemTemplate(product) {
    const { id, image, model, price, article } = product;
    const s = this.selectors;
    const c = this.classes;
    const t = this.i18n;

    return `
      <li class="${c.item}">
        <article class="${c.product}" ${s.productId}="${id}">
          <a href="/card.html?id=${id}" 
             target="_blank" 
             class="${c.product}__image" 
             aria-label="${t.ariaProductLink} ${model}">
            <img src="${image}" alt="" width="80" height="80" loading="lazy" aria-hidden="true" />
          </a>
          <div class="${c.product}__wrapper">
            <a href="/card.html?id=${id}" 
               target="_blank" 
               class="${c.product}__title"
               aria-label="${model}">${model}</a>
            <div class="${c.product}__inner">
              <div class="${c.product}__article" aria-label="${t.art}">${t.art} ${article}</div>
              <div class="${c.product}__price" aria-label="${t.priceLabel}">${formatPrice(price)} ${t.currency}</div>
            </div>
          </div>
          <div class="${c.product}__buttons">
            <button type="button" 
                    ${s.btnRemove} 
                    class="${c.product}__btn" 
                    title="${t.titleRemove}" 
                    aria-label="${t.ariaRemove}: ${model}">
              ${t.iconTrash}
            </button>
            <button type="button" 
                    ${s.btnBuy} 
                    class="${c.product}__btn" 
                    title="${t.titleBuy}" 
                    aria-label="${t.ariaBuy}: ${model}">
              ${t.iconCart}
            </button>
          </div>
        </article>
      </li>`;
  }
}
