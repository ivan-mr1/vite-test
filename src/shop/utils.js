import { LOCALE } from './constants.js';

export const priceFormatter = new Intl.NumberFormat(LOCALE.UA);

export const formatPrice = (price) => priceFormatter.format(price);
