function sliderComparisonImages() {
  function slide() {
    let slideValue = document.querySelector('.slider-comparison__input').value;
    const imgBefore = document.querySelector('.slider-comparison__img--before');
    const circle = document.querySelector('.slider-comparison__circle');
    const lineBottom = document.querySelector(
      '.slider-comparison__line-bottom',
    );
    const lineTop = document.querySelector('.slider-comparison__line-top');

    imgBefore.style.clipPath =
      'polygon(0 0,' + slideValue + '% 0,' + slideValue + '% 100%, 0 100%)';

    circle.style.left = `${slideValue}%`;
    lineBottom.style.left = `${slideValue}%`;
    lineTop.style.left = `${slideValue}%`;
  }

  document
    .querySelector('.slider-comparison__input')
    .addEventListener('input', slide);
}

export default sliderComparisonImages;
