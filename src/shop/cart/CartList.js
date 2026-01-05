import CartService from './CartService.js';
import CartView from './CartView.js';
import { EVENTS, SELECTORS } from '../constants.js';

export default class CartList {
  settings = { minQuantity: 1, maxQuantity: 15 };

  selectors = {
    list: SELECTORS.CART_LIST,
    totalPrice: SELECTORS.CART_TOTAL_PRICE,
  };

  constructor(storage, allProducts) {
    this.storage = storage;

    this.service = new CartService(allProducts);

    this.view = new CartView({ selectors: this.selectors }, this.settings);

    if (this.view.container) {
      this.init();
    }
  }

  init() {
    this.refresh();
    this.initEventListeners();
    document.addEventListener(EVENTS.CART_UPDATED, () => this.refresh());
  }

  refresh() {
    const cartIds = this.storage.get();
    const products = this.service.getGroupedProducts(cartIds);
    const total = this.service.calculateTotal(products);

    this.view.render(products, total);
  }

  initEventListeners() {
    const { productId, btnPlus, btnMinus, btnRemove } = this.view.selectors;

    this.view.container.addEventListener('click', (e) => {
      const card = e.target.closest(`[${productId}]`);
      if (!card) {
        return;
      }

      const id = Number(card.getAttribute(productId));

      const isPlus = e.target.closest(`[${btnPlus}]`);
      const isMinus = e.target.closest(`[${btnMinus}]`);
      const isRemove = e.target.closest(`[${btnRemove}]`);

      if (!isPlus && !isMinus && !isRemove) {
        return;
      }

      const currentCount = this.storage
        .get()
        .filter((pId) => pId === id).length;

      if (isPlus && currentCount < this.settings.maxQuantity) {
        this.storage.add(id);
      } else if (isMinus && currentCount > this.settings.minQuantity) {
        this.storage.removeOne(id);
      } else if (isRemove) {
        this.storage.remove(id);
      }
    });
  }
}
