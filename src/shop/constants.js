export const EVENTS = {
  CART_UPDATED: 'cart:updated',
  FAVORITE_UPDATED: 'favorite:updated',
  FAVORITE_OPENED: 'favorite:opened',
};

export const STORAGE_KEYS = {
  CART: 'user_cart',
  FAVORITES: 'user_favorites',
};

export const STATES = {
  ACTIVE: 'is-active',
  HIDDEN: 'is-hidden',
  IN_CART: 'is-in-cart',
};

export const I18N = {
  CURRENCY: 'грн',
  ARTICLE: 'Артикул:',
  BUY: 'Купити',
  IN_CART: 'В кошику',
  ADD_TO_FAVORITES: 'Додати до обраного',
  REMOVE_FROM_FAVORITES: 'Видалити з обраного',
  ADD_TO_CART_ARIA: 'Додати у кошик товар',
  IN_CART_ARIA: 'Товар уже у кошику',
  PRODUCT_LINK_ARIA: 'Перейти до опису моделі',
  PRODUCT_NOT_FOUND: 'Товар не знайдено',
  PRODUCTS_NOT_FOUND: 'Товари не знайдено',
  EMPTY_CART: 'Ваш кошик порожній',
  DELETE_ITEM: 'Видалити товар',
  INCREASE_QUANTITY: 'Збільшити кількість',
  DECREASE_QUANTITY: 'Зменшити кількість',
  PREV_PAGE: 'Попередня сторінка',
  NEXT_PAGE: 'Наступна сторінка',
  PAGE: 'Сторінка',
  CURRENT_PAGE: 'Поточна сторінка',
  PAGINATION_LABEL: 'Пагінація товарів',
  EMPTY_LIST: 'Ваш список порожній',
  ART_SHORT: 'Art:',
  TITLE_REMOVE: 'Видалити',
  TITLE_BUY: 'В кошик',
  ARIA_REMOVE_FROM_LIST: 'Видалити товар зі списку обраного',
  ARIA_ADD_TO_CART: 'Додати товар у кошик',
  ARIA_PRODUCT_LINK: 'Перейти к товару',
  PRICE_LABEL: 'Ціна',
};

export const SELECTORS = {
  PRODUCT_DETAILS: '[data-product-details]',
  PRODUCT_CATALOG: '[data-products-catalog]',
  FAVORITE_COUNTER: '[data-favorite-counter]',
  CART_COUNTER: '[data-cart-counter]',
  CART_LIST: '[data-cart-list]',
  CART_TOTAL_PRICE: '[data-cart-total-price]',
  FAVORITE_LIST: '[data-favorite-list]',
};

export const ATTRIBUTES = {
  PRODUCT_ID: 'data-product-id',
  PRODUCT_CARD: {
    ROOT: 'data-product',
    PRICE: 'data-card-price',
    BUY_BTN: 'data-card-buy-btn',
    FAVORITE_BTN: 'data-card-favorite',
  },
  PRODUCT_DETAILS: {
    BUY_BTN: 'data-details-buy',
    FAVORITE_BTN: 'data-details-favorite',
    BREADCRUMB: 'data-product-breadcrumb',
  },
  CART: {
    MINUS: 'data-cart-minus',
    PLUS: 'data-cart-plus',
    REMOVE: 'data-cart-remove-btn',
  },
  FAVORITE: {
    REMOVE: 'data-favorite-remove-btn',
    BUY: 'data-favorite-buy-btn',
    DROPDOWN: {
      ROOT: '[data-favorite]',
      BUTTON: '[data-favorite-btn]',
    },
  },
  PAGINATION: {
    ROOT: '[data-pagination]',
    LIST: '[data-pagination-list]',
    PREV: '[data-pagination-btn-prev]',
    NEXT: '[data-pagination-btn-next]',
  },
};

export const BREAKPOINTS = {
  MOBILE_XS: 370,
  MOBILE: 768,
};

export const TIMEOUTS = {
  RESIZE_DEBOUNCE: 200,
};

export const LOCALE = {
  UA: 'uk-UA',
};

export const URL_PARAMS = {
  PRODUCT_ID: 'id',
};
