import { EVENTS, STATES, I18N, ATTRIBUTES } from '../constants.js';
import { formatPrice } from '../utils.js';

export default class ProductCard {
  defaultSettings = {
    rootAttribute: ATTRIBUTES.PRODUCT_CARD.ROOT,
    rootClass: 'products__item',
    imageWrapperClass: 'product__image ibg',
    bottomWrapperClass: 'product__bottom',
  };

  defaultAttributes = {
    buyBtn: ATTRIBUTES.PRODUCT_CARD.BUY_BTN,
    favoriteBtn: ATTRIBUTES.PRODUCT_CARD.FAVORITE_BTN,
    price: ATTRIBUTES.PRODUCT_CARD.PRICE,
    productId: ATTRIBUTES.PRODUCT_ID,
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
    active: STATES.ACTIVE,
    inCart: STATES.IN_CART,
  };

  defaultI18n = {
    buy: I18N.BUY,
    inCart: I18N.IN_CART,
    currency: I18N.CURRENCY,
    articlePrefix: I18N.ARTICLE,
    titleFavorite: I18N.ADD_TO_FAVORITES,
    titleFavoriteRemove: I18N.REMOVE_FROM_FAVORITES,
    ariaBuy: I18N.ADD_TO_CART_ARIA,
    ariaInCart: I18N.IN_CART_ARIA,
    ariaProductLink: I18N.PRODUCT_LINK_ARIA,
    iconFavorite: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M12 18.023c-4.64-2.635-7.236-5.26-8.493-7.55C2.224 8.138 2.33 6.156 3.052 4.74c1.478-2.9 5.684-3.828 8.242-.593l.705.893.707-.893c2.558-3.235 6.764-2.307 8.242.593.721 1.415.827 3.398-.456 5.735-1.257 2.289-3.852 4.914-8.492 7.549zm0-15.778C8.52-1.144 3.337.215 1.448 3.922.42 5.939.4 8.555 1.93 11.34c1.517 2.763 4.548 5.69 9.634 8.502l.436.24.435-.24c5.086-2.811 8.118-5.74 9.635-8.502 1.53-2.785 1.51-5.4.482-7.418C20.662.215 15.48-1.144 12 2.245" clip-rule="evenodd"/></svg>`,
  };

  constructor(product = {}, storage = {}, options = {}) {
    this.product = product;
    this.cartStorage = storage.cart;
    this.favStorage = storage.favorite;

    this.settings = { ...this.defaultSettings, ...options.settings };
    this.attrs = { ...this.defaultAttributes, ...options.attributes };
    this.classes = { ...this.defaultClasses, ...options.classes };
    this.i18n = { ...this.defaultI18n, ...options.i18n };

    this.element = null;
    this.subElements = {};

    this.onFavoriteUpdate = this.syncFavoriteState.bind(this);
    this.onCartUpdate = this.syncCartState.bind(this);
  }

  getTemplate() {
    const { id, image, model, description, article, price } = this.product;
    const { attrs: a, classes: c, i18n: t } = this;

    const isActive = this.favStorage?.check(id);
    const isInCart = this.cartStorage?.check(id);

    return `
      <article class="${c.productCard}" ${a.productId}="${id}">
        <a href="/card.html?id=${id}" 
           target="_blank" 
           class="${this.settings.imageWrapperClass}" 
           aria-label="${t.ariaProductLink}: ${model}"
           title="${model}">
          <img src="${image}" alt="" width="285" height="215" loading="lazy" aria-hidden="true" />
        </a>
        <div class="${this.settings.bottomWrapperClass}">
          <div class="product__actions">
            <button type="button" 
                    ${a.favoriteBtn} 
                    class="${c.favoriteLink} ${isActive ? c.active : ''}" 
                    title="${isActive ? t.titleFavoriteRemove : t.titleFavorite}" 
                    aria-label="${t.titleFavorite}: ${model}"
                    aria-pressed="${isActive}">
              ${t.iconFavorite}
            </button>
          </div>
          <a href="/card.html?id=${id}" target="_blank" class="${c.title}">${model}</a>
          <div class="${c.descr}"><p>${description}</p></div>
          <div class="${c.article}">${t.articlePrefix} ${article}</div>
          <div class="${c.priceWrapper}">
            <div ${a.price} class="${c.priceCurrent}">
              ${formatPrice(price)} ${t.currency}
            </div>
          </div>
          <button type="button" 
                  ${a.buyBtn} 
                  class="${c.buyBtn} ${isInCart ? c.inCart : ''}" 
                  title="${isInCart ? t.ariaInCart : t.buy}"
                  aria-label="${isInCart ? t.ariaInCart : t.ariaBuy}: ${model}">
            ${isInCart ? t.inCart : t.buy}
          </button>
        </div>
      </article>
    `;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.getTemplate();

    this.element = document.createElement('li');
    this.element.className = this.settings.rootClass;
    this.element.setAttribute(this.settings.rootAttribute, this.product.id);
    this.element.append(wrapper.firstElementChild);

    this.#initSubElements();
    this.#initEventListeners();

    return this.element;
  }

  #initSubElements() {
    const selector = Object.values(this.attrs)
      .map((attr) => `[${attr}]`)
      .join(',');
    const elements = this.element.querySelectorAll(selector);

    elements.forEach((el) => {
      const attrName = Object.keys(this.attrs).find((key) =>
        el.hasAttribute(this.attrs[key]),
      );
      if (attrName) {
        this.subElements[attrName] = el;
      }
    });
  }

  syncFavoriteState() {
    if (!this.favStorage) {
      return;
    }
    const isActive = this.favStorage.check(this.product.id);
    const btn = this.subElements.favoriteBtn;

    if (btn) {
      btn.classList.toggle(this.classes.active, isActive);
      btn.setAttribute('aria-pressed', isActive);
      btn.title = isActive
        ? this.i18n.titleFavoriteRemove
        : this.i18n.titleFavorite;
    }
  }

  syncCartState() {
    if (!this.cartStorage) {
      return;
    }
    const isInCart = this.cartStorage.check(this.product.id);
    this.#updateBuyButton(isInCart);
  }

  #initEventListeners() {
    this.subElements.favoriteBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      this.favStorage?.toggle(this.product.id);
    });

    this.subElements.buyBtn?.addEventListener('click', (e) => {
      e.preventDefault();
      if (!this.cartStorage?.check(this.product.id)) {
        this.cartStorage?.add(this.product.id);
      }
    });

    document.addEventListener(EVENTS.FAVORITE_UPDATED, this.onFavoriteUpdate);
    document.addEventListener(EVENTS.CART_UPDATED, this.onCartUpdate);
  }

  #updateBuyButton(isInCart) {
    const btn = this.subElements.buyBtn;
    if (!btn) {
      return;
    }

    btn.textContent = isInCart ? this.i18n.inCart : this.i18n.buy;
    btn.classList.toggle(this.classes.inCart, isInCart);
    btn.title = isInCart ? this.i18n.ariaInCart : this.i18n.buy;
    btn.setAttribute(
      'aria-label',
      `${isInCart ? this.i18n.ariaInCart : this.i18n.ariaBuy}: ${this.product.model}`,
    );
  }

  destroy() {
    if (this.element) {
      document.removeEventListener(
        EVENTS.FAVORITE_UPDATED,
        this.onFavoriteUpdate,
      );
      document.removeEventListener(EVENTS.CART_UPDATED, this.onCartUpdate);
      this.element.remove();
    }
    this.element = null;
    this.subElements = {};
  }
}
