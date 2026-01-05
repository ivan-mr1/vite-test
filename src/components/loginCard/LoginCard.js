export default class LoginCard {
  selectors = {
    switcher: '.login__switcher',
    toggle: '.login__switcher-toggle',
    card: '.login__card',
    cardWrapper: '.login__card-wrapper',
  };

  swipeThreshold = 50;

  constructor(root) {
    this.root = root;
    if (!this.root) {
      return;
    }

    this.switcher = this.root.querySelector(this.selectors.switcher);
    this.toggle = this.root.querySelector(this.selectors.toggle);
    this.card = this.root.querySelector(this.selectors.card);
    this.cardWrapper = this.root.querySelector(this.selectors.cardWrapper);

    this.startX = 0;
    this.isSwiping = false;

    this.bindEvents();
  }

  bindEvents() {
    if (this.toggle) {
      this.toggle.addEventListener('click', () => this.toggleCard());
    }

    if (this.card) {
      this.card.addEventListener('pointerdown', this.onPointerDown.bind(this));
      this.card.addEventListener('pointermove', this.onPointerMove.bind(this));
      this.card.addEventListener('pointerup', this.onPointerUp.bind(this));
      this.card.addEventListener('pointerleave', this.onPointerUp.bind(this));
    }
  }

  toggleCard() {
    const isFront = this.switcher.dataset.side === 'front';
    this.switcher.dataset.side = isFront ? 'back' : 'front';

    if (this.cardWrapper) {
      this.cardWrapper.classList.toggle(this.stateClasses.flipped, !isFront);
    }
  }

  onPointerDown(e) {
    this.startX = e.clientX || e.touches?.[0]?.clientX || 0;
    this.isSwiping = true;
  }

  onPointerMove() {
    if (!this.isSwiping) {
      return;
    }
  }

  onPointerUp(e) {
    if (!this.isSwiping) {
      return;
    }

    const endX = e.clientX || e.changedTouches?.[0]?.clientX || 0;
    const diff = endX - this.startX;

    if (Math.abs(diff) > this.swipeThreshold) {
      this.toggleCard();
    }

    this.isSwiping = false;
  }
}

document.querySelectorAll('.login').forEach((root) => {
  new LoginCard(root);
});
