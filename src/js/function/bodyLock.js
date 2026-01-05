/**
 * Внутреннее состояние для защиты от спама
 * @private
 */
let _bodyLockStatus = true;

/**
 * Получить текущий статус блокировки
 * @returns {boolean} true - можно блокировать/разблокировать, false - операция в процессе
 */
export const getBodyLockStatus = () => _bodyLockStatus;

/**
 * Устанавливает статус блокировки на время delay
 * @private
 * @param {number} delay - Время блокировки в мс
 */
const setBodyLockStatus = (delay) => {
  _bodyLockStatus = false;
  setTimeout(() => {
    _bodyLockStatus = true;
  }, delay);
};

/**
 * Получает все элементы с data-right-padding
 * @private
 * @returns {NodeListOf<Element>}
 */
const getLockPaddingElements = () =>
  document.querySelectorAll('[data-right-padding]');

/**
 * Вычисляет ширину скроллбара в rem
 * @private
 * @returns {string} Ширина скроллбара в rem
 */
const getScrollbarWidthRem = () => {
  const scrollbarWidthPx = window.innerWidth - document.body.clientWidth;
  const rootFontSize = parseFloat(
    getComputedStyle(document.documentElement).fontSize,
  );
  return scrollbarWidthPx / rootFontSize + 'rem';
};

/**
 * Устанавливает padding-right для компенсации скроллбара
 * @private
 * @param {string} value - Значение padding
 */
const setPadding = (value = '') => {
  const lockPaddingElements = getLockPaddingElements();
  lockPaddingElements.forEach((el) => {
    el.style.paddingRight = value;
  });
  document.body.style.paddingRight = value;
};

/**
 * Устанавливает CSS переменную с шириной скроллбара
 * @private
 * @param {string} value - Значение ширины скроллбара
 */
const setScrollbarWidthVariable = (value) => {
  document.documentElement.style.setProperty('--scrollbar-width', value);
};

/**
 * Удаляет CSS переменную с шириной скроллбара
 * @private
 */
const clearScrollbarWidthVariable = () => {
  document.documentElement.style.removeProperty('--scrollbar-width');
};

/**
 * Блокирует скролл страницы и компенсирует ширину скроллбара
 * Добавляет padding-right к body и элементам с [data-right-padding]
 * Устанавливает CSS переменную --scrollbar-width
 *
 * @param {number} delay - Задержка перед возможностью повторного вызова (защита от спама), мс
 * @example
 * bodyLock(); // Блокирует скролл с задержкой 500мс
 * bodyLock(300); // Блокирует скролл с задержкой 300мс
 */
export const bodyLock = (delay = 500) => {
  if (!_bodyLockStatus) {
    return;
  }

  const scrollbarWidthRem = getScrollbarWidthRem();
  setPadding(scrollbarWidthRem);
  setScrollbarWidthVariable(scrollbarWidthRem);

  document.documentElement.setAttribute('data-scroll-lock', '');
  setBodyLockStatus(delay);
};

/**
 * Разблокирует скролл страницы
 * Удаляет padding-right и CSS переменную --scrollbar-width
 *
 * @param {number} delay - Задержка перед возможностью повторного вызова (защита от спама), мс
 * @example
 * bodyUnlock(); // Разблокирует скролл с задержкой 500мс
 * bodyUnlock(300); // Разблокирует скролл с задержкой 300мс
 */
export const bodyUnlock = (delay = 500) => {
  if (!_bodyLockStatus) {
    return;
  }

  setPadding('');
  clearScrollbarWidthVariable();
  document.documentElement.removeAttribute('data-scroll-lock');

  setBodyLockStatus(delay);
};

/**
 * Переключает состояние блокировки скролла
 * Если скролл заблокирован - разблокирует, если разблокирован - блокирует
 *
 * @param {number} delay - Задержка перед возможностью повторного вызова (защита от спама), мс
 * @example
 * bodyLockToggle(); // Переключает состояние
 */
export const bodyLockToggle = (delay = 500) => {
  const isLocked = document.documentElement.hasAttribute('data-scroll-lock');
  isLocked ? bodyUnlock(delay) : bodyLock(delay);
};
