import CartService from '../cart/CartService.js';
import FavoriteView from './FavoriteView.js';
import { EVENTS } from '../constants.js';

export default class FavoriteList {
  constructor(storage, allProducts, cartStorage) {
    this.storage = storage;
    this.cartStorage = cartStorage;

    this.service = new CartService(allProducts);
    this.view = new FavoriteView();

    if (this.view.container) {
      this.init();
    }
  }

  init() {
    this.refresh();
    this.initEventListeners();
    document.addEventListener(EVENTS.FAVORITE_UPDATED, () => this.refresh());
  }

  refresh() {
    const ids = this.storage.get();
    const products = this.service.getGroupedProducts(ids);
    const total = this.service.calculateTotal(products);

    this.view.render(products, total);
  }

  initEventListeners() {
    const { productId, btnRemove, btnBuy } = this.view.selectors;

    this.view.container.addEventListener('click', (e) => {
      const card = e.target.closest(`[${productId}]`);
      if (!card) {
        return;
      }

      const id = Number(card.getAttribute(productId));

      if (e.target.closest(`[${btnRemove}]`)) {
        e.stopPropagation();
        this.storage.remove(id);
      }

      if (e.target.closest(`[${btnBuy}]`) && this.cartStorage) {
        e.stopPropagation();
        this.cartStorage.add(id);
      }
    });
  }
}
