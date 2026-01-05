export let bodyLockStatus = true;

const setBodyLockStatus = (delay) => {
  bodyLockStatus = false;
  setTimeout(() => {
    bodyLockStatus = true;
  }, delay);
};

const getLockPaddingElements = () =>
  document.querySelectorAll('[data-right-padding]');

const getScrollbarWidthRem = () => {
  const scrollbarWidthPx = window.innerWidth - document.body.clientWidth;
  return scrollbarWidthPx / 16 + 'rem';
};

const setPadding = (value = '') => {
  const lockPaddingElements = getLockPaddingElements();
  lockPaddingElements.forEach((el) => {
    el.style.paddingRight = value;
  });
  document.body.style.paddingRight = value;
};

const setScrollbarWidthVariable = (value) => {
  document.documentElement.style.setProperty('--scrollbar-width', value);
};

const clearScrollbarWidthVariable = () => {
  document.documentElement.style.removeProperty('--scrollbar-width');
};

export const bodyLock = (delay = 500) => {
  if (!bodyLockStatus) {
    return;
  }

  const scrollbarWidthRem = getScrollbarWidthRem();
  setPadding(scrollbarWidthRem);
  setScrollbarWidthVariable(scrollbarWidthRem);

  document.documentElement.setAttribute('data-scroll-lock', '');
  setBodyLockStatus(delay);
};

export const bodyUnlock = (delay = 500) => {
  if (!bodyLockStatus) {
    return;
  }

  setTimeout(() => {
    setPadding('');
    clearScrollbarWidthVariable();
    document.documentElement.removeAttribute('data-scroll-lock');
  }, delay);

  setBodyLockStatus(delay);
};

export const bodyLockToggle = (delay = 500) => {
  const isLocked = document.documentElement.hasAttribute('data-scroll-lock');
  isLocked ? bodyUnlock(delay) : bodyLock(delay);
};
