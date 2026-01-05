import products from './products.json';
import RenderProductList from './products/RenderProductList';
import Pagination from './pagination/Pagination';
import Storage from '../js/localStorage/Storage';
import FavoriteDropdown from './favorite/FavoriteDropdown';
import FavoriteList from './favorite/FavoriteList';
import CounterStorage from './CounterStorage/CounterStorage';
import CartList from './cart/CartList';
import ProductDetails from './product-details/ProductDetails';
import { EVENTS, STORAGE_KEYS, SELECTORS } from './constants';

export default function shop() {
  const favStorage = new Storage(
    STORAGE_KEYS.FAVORITES,
    EVENTS.FAVORITE_UPDATED,
  );
  const cartStorage = new Storage(STORAGE_KEYS.CART, EVENTS.CART_UPDATED);

  new ProductDetails(SELECTORS.PRODUCT_DETAILS, products, {
    cart: cartStorage,
    favorite: favStorage,
  });

  const productList = new RenderProductList(
    SELECTORS.PRODUCT_CATALOG,
    products,
    { favorite: favStorage, cart: cartStorage },
  );

  new Pagination(productList, products, {
    productsPerPage: 12,
    visibleRange: 2,
  });

  new FavoriteDropdown();
  new FavoriteList(favStorage, products, cartStorage);

  new CartList(cartStorage, products);

  new CounterStorage(
    SELECTORS.FAVORITE_COUNTER,
    favStorage,
    EVENTS.FAVORITE_UPDATED,
  );
  new CounterStorage(SELECTORS.CART_COUNTER, cartStorage, EVENTS.CART_UPDATED);
}
