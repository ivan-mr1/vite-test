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
      <svg class="svg svg--20">
        <use xlink:href="#icon-monochrome-trash"></use>
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
