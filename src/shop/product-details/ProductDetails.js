import { EVENTS, STATES, I18N, ATTRIBUTES } from '../constants.js';
import { formatPrice } from '../utils.js';

export default class ProductDetails {
  defaultSettings = {
    imageWrapperClass: 'product-details__image ibg',
    infoWrapperClass: 'product-details__info',
  };

  defaultAttributes = {
    buyBtn: ATTRIBUTES.PRODUCT_DETAILS.BUY_BTN,
    favoriteBtn: ATTRIBUTES.PRODUCT_DETAILS.FAVORITE_BTN,
    breadcrumb: ATTRIBUTES.PRODUCT_DETAILS.BREADCRUMB,
  };

  defaultClasses = {
    title: 'product-details__title',
    price: 'product-details__price',
    description: 'product-details__description',
    article: 'product-details__article',
    actions: 'product-details__actions',
    buyBtn: 'product-details__btn button',
    favoriteBtn: 'product-details__favorite-btn',
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
    errorMessage: I18N.PRODUCT_NOT_FOUND,
    iconFavorite: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" aria-hidden="true"><path fill="currentColor" fill-rule="evenodd" d="M12 18.023c-4.64-2.635-7.236-5.26-8.493-7.55C2.224 8.138 2.33 6.156 3.052 4.74c1.478-2.9 5.684-3.828 8.242-.593l.705.893.707-.893c2.558-3.235 6.764-2.307 8.242.593.721 1.415.827 3.398-.456 5.735-1.257 2.289-3.852 4.914-8.492 7.549zm0-15.778C8.52-1.144 3.337.215 1.448 3.922.42 5.939.4 8.555 1.93 11.34c1.517 2.763 4.548 5.69 9.634 8.502l.436.24.435-.24c5.086-2.811 8.118-5.74 9.635-8.502 1.53-2.785 1.51-5.4.482-7.418C20.662.215 15.48-1.144 12 2.245" clip-rule="evenodd"/></svg>`,
  };

  constructor(containerSelector, products, storage, options = {}) {
    this.container = document.querySelector(containerSelector);
    this.products = products;
    this.cartStorage = storage.cart;
    this.favStorage = storage.favorite;
    this.product = null;

    this.settings = { ...this.defaultSettings, ...options.settings };
    this.attrs = { ...this.defaultAttributes, ...options.attributes };
    this.classes = { ...this.defaultClasses, ...options.classes };
    this.i18n = { ...this.defaultI18n, ...options.i18n };

    this.subElements = {};

    this.onFavoriteUpdate = this.syncFavoriteState.bind(this);
    this.onCartUpdate = this.syncCartState.bind(this);

    if (!this.container) {
      return;
    }

    this.init();
  }

  init() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    this.product =
      this.products.find((p) => p.id === productId) || this.products[0];

    if (!this.product) {
      this.container.innerHTML = `<p>${this.i18n.errorMessage}</p>`;
      return;
    }

    this.render();
    this.updateBreadcrumbs();
    this.initEventListeners();
  }

  getTemplate() {
    const { id, image, model, description, article, price } = this.product;
    const { attrs: a, classes: c, i18n: t } = this;

    const isFav = this.favStorage?.check(id);
    const isInCart = this.cartStorage?.check(id);

    return `
      <div class="${this.settings.imageWrapperClass}">
        <img src="${image}" alt="${model}" width="600" height="480">
      </div>
      <div class="${this.settings.infoWrapperClass}">
        <h1 class="${c.title}">${model}</h1>
        <div class="${c.price}">${formatPrice(price)} ${t.currency}</div>
        
        <div class="${c.description}">
          <p>${description}</p>
        </div>
        
        <div class="${c.article}">
            ${t.articlePrefix} ${article}
        </div>

        <div class="${c.actions}">
          <button type="button" 
            ${a.buyBtn} 
            class="${c.buyBtn} ${isInCart ? c.inCart : ''}"
            title="${isInCart ? t.ariaInCart : t.buy}">
            ${isInCart ? t.inCart : t.buy}
          </button>
          
          <button type="button" 
            ${a.favoriteBtn} 
            class="${c.favoriteBtn} ${isFav ? c.active : ''}"
            aria-label="${isFav ? t.titleFavoriteRemove : t.titleFavorite}"
            title="${isFav ? t.titleFavoriteRemove : t.titleFavorite}">
            ${t.iconFavorite}
          </button>
        </div>
      </div>
    `;
  }

  render() {
    this.container.innerHTML = this.getTemplate();
    this.initSubElements();
  }

  initSubElements() {
    this.subElements.buyBtn = this.container.querySelector(
      `[${this.attrs.buyBtn}]`,
    );
    this.subElements.favoriteBtn = this.container.querySelector(
      `[${this.attrs.favoriteBtn}]`,
    );
  }

  updateBreadcrumbs() {
    const breadcrumb = document.querySelector(`[${this.attrs.breadcrumb}]`);
    if (breadcrumb) {
      breadcrumb.textContent = this.product.model;
    }
  }

  initEventListeners() {
    this.container.addEventListener('click', (e) => {
      const buyBtn = e.target.closest(`[${this.attrs.buyBtn}]`);
      const favBtn = e.target.closest(`[${this.attrs.favoriteBtn}]`);

      if (buyBtn) {
        if (!this.cartStorage.check(this.product.id)) {
          this.cartStorage.add(this.product.id);
        }
      }

      if (favBtn) {
        this.favStorage.toggle(this.product.id);
      }
    });

    document.addEventListener(EVENTS.CART_UPDATED, this.onCartUpdate);
    document.addEventListener(EVENTS.FAVORITE_UPDATED, this.onFavoriteUpdate);
  }

  syncCartState() {
    const { buyBtn } = this.subElements;
    if (!buyBtn) {
      return;
    }

    const isInCart = this.cartStorage.check(this.product.id);
    const { classes: c, i18n: t } = this;

    if (isInCart) {
      buyBtn.classList.add(c.inCart);
      buyBtn.textContent = t.inCart;
      buyBtn.title = t.ariaInCart;
    } else {
      buyBtn.classList.remove(c.inCart);
      buyBtn.textContent = t.buy;
      buyBtn.title = t.buy;
    }
  }

  syncFavoriteState() {
    const { favoriteBtn } = this.subElements;
    if (!favoriteBtn) {
      return;
    }

    const isFav = this.favStorage.check(this.product.id);
    const { classes: c, i18n: t } = this;

    favoriteBtn.classList.toggle(c.active, isFav);
    favoriteBtn.setAttribute(
      'aria-label',
      isFav ? t.titleFavoriteRemove : t.titleFavorite,
    );
    favoriteBtn.title = isFav ? t.titleFavoriteRemove : t.titleFavorite;
  }

  destroy() {
    document.removeEventListener(EVENTS.CART_UPDATED, this.onCartUpdate);
    document.removeEventListener(
      EVENTS.FAVORITE_UPDATED,
      this.onFavoriteUpdate,
    );
    this.container.innerHTML = '';
    this.product = null;
    this.subElements = {};
  }
}
