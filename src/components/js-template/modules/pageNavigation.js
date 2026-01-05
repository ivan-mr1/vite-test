export default function pageNavigation() {
  const menuLinks = document.querySelectorAll('[data-goto]');

  if (menuLinks.length > 0) {
    menuLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        const menuLink = e.target.closest('[data-goto]');
        if (
          menuLink.dataset.goto &&
          document.querySelector(menuLink.dataset.goto)
        ) {
          e.preventDefault();

          const goToBlock = document.querySelector(menuLink.dataset.goto);

          const goToBlockValue =
            goToBlock.getBoundingClientRect().top +
            window.pageYOffset -
            (document.querySelector('header')?.offsetHeight || 0);

          window.scrollTo({
            top: goToBlockValue,
            behavior: 'smooth',
          });
        }
      });
    });
  }
}
