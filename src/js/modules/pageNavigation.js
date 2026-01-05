export default function pageNavigation() {
  const header = document.querySelector('header');

  document.addEventListener('click', (e) => {
    const menuLink = e.target.closest('[data-goto]');

    if (!menuLink) {
      return;
    }

    const targetSelector = menuLink.dataset.goto;
    const targetBlock = document.querySelector(targetSelector);

    if (targetBlock) {
      e.preventDefault();

      const headerHeight = header ? header.offsetHeight : 0;

      const targetPosition =
        targetBlock.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = targetPosition - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  });
}
