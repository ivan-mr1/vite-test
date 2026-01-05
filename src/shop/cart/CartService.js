export default class CartService {
  defaultOptions = {
    keys: {
      id: 'id',
      price: 'price',
    },
  };

  constructor(allProducts = [], options = {}) {
    this.options = {
      keys: { ...this.defaultOptions.keys, ...options.keys },
    };

    this.productsMap = this.#createProductsMap(allProducts);
  }

  #createProductsMap(products) {
    const { id: idKey } = this.options.keys;
    return new Map(products.map((p) => [p[idKey], p]));
  }

  getGroupedProducts(cartIds) {
    const { price: priceKey } = this.options.keys;

    const counts = cartIds.reduce((acc, id) => {
      acc[id] = (acc[id] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts)
      .map(([id, count]) => {
        // Ищем в Map по ключу. Если в Map ключи-числа, используем Number(id)
        const product = this.productsMap.get(Number(id));

        if (!product) {
          return null;
        }

        return {
          ...product,
          count,
          totalItemPrice: product[priceKey] * count,
        };
      })
      .filter(Boolean);
  }

  calculateTotal(groupedProducts) {
    return groupedProducts.reduce((sum, p) => sum + p.totalItemPrice, 0);
  }
}
