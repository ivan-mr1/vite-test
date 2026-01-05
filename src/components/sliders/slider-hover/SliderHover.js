const sliderHover = () => {
  const slider = document.querySelector('.slider__wrapper');
  const leftZone = document.querySelector('.slider__scroll-zone--left');
  const rightZone = document.querySelector('.slider__scroll-zone--right');

  if (!slider || !leftZone || !rightZone) {
    return;
  }

  const maxSpeed = 15;
  const acceleration = 0.5;
  const deceleration = 0.6;
  let currentSpeed = 0;
  let direction = 0;
  let isHovered = false;

  function animate() {
    if (isHovered && currentSpeed < maxSpeed) {
      currentSpeed += acceleration;
    } else if (!isHovered && currentSpeed > 0) {
      currentSpeed -= deceleration;
    } else if (currentSpeed < 0) {
      currentSpeed = 0;
    }

    if (currentSpeed > 0) {
      const maxScroll = slider.scrollWidth - slider.clientWidth;
      const nextPos = slider.scrollLeft + direction * currentSpeed;

      if (
        (direction < 0 && nextPos <= 0) ||
        (direction > 0 && nextPos >= maxScroll)
      ) {
        stopScrolling();
      } else {
        slider.scrollLeft = nextPos;
      }
    }

    requestAnimationFrame(animate);
  }

  function startScrolling(dir) {
    direction = dir;
    isHovered = true;
  }

  function stopScrolling() {
    isHovered = false;
  }

  leftZone.addEventListener('mouseenter', () => startScrolling(-1));
  rightZone.addEventListener('mouseenter', () => startScrolling(1));
  leftZone.addEventListener('mouseleave', stopScrolling);
  rightZone.addEventListener('mouseleave', stopScrolling);
  slider.addEventListener('mouseleave', stopScrolling);
  window.addEventListener('blur', stopScrolling);

  const middleScroll = (slider.scrollWidth - slider.clientWidth) / 2;
  slider.scrollLeft = middleScroll;

  requestAnimationFrame(animate);
};

export default sliderHover;
