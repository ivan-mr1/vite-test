import { formatPrice } from '../utils.js';
import { I18N, ATTRIBUTES, SELECTORS } from '../constants.js';

export default class CartView {
  defaultSelectors = {
    list: SELECTORS.CART_LIST,
    totalPrice: SELECTORS.CART_TOTAL_PRICE,
    productId: ATTRIBUTES.PRODUCT_ID,
    btnMinus: ATTRIBUTES.CART.MINUS,
    btnPlus: ATTRIBUTES.CART.PLUS,
    btnRemove: ATTRIBUTES.CART.REMOVE,
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
    emptyCart: I18N.EMPTY_CART,
    currency: I18N.CURRENCY,
    articleLabel: I18N.ARTICLE,
    deleteLabel: I18N.DELETE_ITEM,
    minusLabel: I18N.DECREASE_QUANTITY,
    plusLabel: I18N.INCREASE_QUANTITY,
    iconTrash: `
      <svg class="svg svg--20 icon-orange" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
        <path fill="#ffa501" d="M18.572 2.857h-5v-.714C13.572.959 12.612 0 11.429 0H8.572C7.388 0 6.429.96 6.429 2.143v.714h-5a.714.714 0 1 0 0 1.429h.776L3.572 19.35c.033.369.343.65.714.649h11.428c.37.002.681-.28.715-.65l1.366-15.064h.776a.714.714 0 1 0 0-1.429M7.857 2.143c0-.395.32-.714.715-.714h2.857c.394 0 .714.32.714.714v.714H7.857zm7.205 16.428H4.938L3.643 4.286H16.36z"/>
        <path fill="#ffa501" d="M7.857 16.381v-.003l-.714-10a.716.716 0 0 0-1.429.101l.715 10a.714.714 0 0 0 .714.664h.051a.714.714 0 0 0 .663-.762M10 5.714a.714.714 0 0 0-.714.715v10a.714.714 0 1 0 1.428 0v-10A.714.714 0 0 0 10 5.714M13.622 5.714a.716.716 0 0 0-.765.664l-.714 10a.714.714 0 0 0 .66.764h.053c.376.002.688-.288.715-.663l.715-10a.716.716 0 0 0-.664-.765"/>
      </svg>
    `,
  };

  constructor(options = {}, settings = {}) {
    this.selectors = { ...this.defaultSelectors, ...options.selectors };
    this.classes = { ...this.defaultClasses, ...options.classes };
    this.i18n = { ...this.defaultI18n, ...options.i18n };

    this.settings = settings;

    this.container = document.querySelector(this.selectors.list);
    this.totalPriceElements = document.querySelectorAll(
      this.selectors.totalPrice,
    );
  }

  render(products, total) {
    if (!this.container) {
      return;
    }

    if (products.length === 0) {
      this.container.innerHTML = `
        <li class="${this.classes.emptyMessage}">${this.i18n.emptyCart}</li>
      `;
    } else {
      this.container.innerHTML = products
        .map((product) => this.getItemTemplate(product))
        .join('');
    }

    this.updateTotalDisplay(total);
  }

  updateTotalDisplay(total) {
    const formatted = formatPrice(total);
    this.totalPriceElements.forEach((el) => {
      el.innerHTML = `${formatted}&nbsp;${this.i18n.currency}`;
    });
  }

  getItemTemplate(product) {
    const { id, image, model, price, article, count } = product;

    const isMin = count <= (this.settings.minQuantity || 1);
    const isMax = count >= (this.settings.maxQuantity || 99);

    const s = this.selectors;
    const c = this.classes;
    const t = this.i18n;

    return `
      <li class="${c.item}" ${s.productId}="${id}">
        <a href="/card.html?id=${id}" class="${c.itemImage}">
          <img
            class="${c.itemImg}"
            src="${image}"
            alt="${model}"
            width="160"
            height="110"
            loading="lazy"
          />
        </a>
        <div class="${c.itemInfo}">
          <h3 class="${c.itemName}">${model}</h3>
          <div class="${c.itemArticle}">${t.articleLabel} ${article}</div>
        </div>
        <div class="${c.itemActions}">
          <div class="${c.priceBlock}">
            <span class="${c.price}">${formatPrice(price * count)}&nbsp;${t.currency}</span>
          </div>
          <div class="${c.quantity} quantity">
            <button
              type="button"
              ${s.btnMinus}
              class="${c.quantityBtn}"
              ${isMin ? 'disabled' : ''}
              aria-label="${t.minusLabel}"
              title="${t.minusLabel}"
            >
              −
            </button>
            <input
              type="number"
              class="${c.quantityInput}"
              value="${count}"
              readonly
            />
            <button
              type="button"
              ${s.btnPlus}
              class="${c.quantityBtn}"
              ${isMax ? 'disabled' : ''}
              aria-label="${t.plusLabel}"
              title="${t.plusLabel}"
            >
              +
            </button>
          </div>
          <button
            type="button"
            ${s.btnRemove}
            class="${c.deleteBtn}"
            aria-label="${t.deleteLabel}"
            title="${t.deleteLabel}"
          >
            ${t.iconTrash}
          </button>
        </div>
      </li>`;
  }
}
