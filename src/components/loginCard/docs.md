```
<div
  data-popup="popup-login"
  aria-hidden="true"
  class="popup popup-login"
>
  <div data-popup-wrapper class="popup__wrapper">
    <div data-popup-body class="popup__body">
      <button
        data-popup-close
        type="button"
        class="popup__close"
        aria-label="Close popup"
        title="Close popup"
      >
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M30 10L10 30"
            stroke="#181C29"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10 10L30 30"
            stroke="#181C29"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
      <div data-popup-content class="popup-login__content login">
        <div class="login__title">
          <span>Log In</span>
          <span>Join Now</span>
        </div>
        <div class="login__switcher" data-side="front">
          <button class="login__switcher-toggle" type="button"></button>
        </div>
        <div class="login__card">
          <div class="login__card-wrapper">
            <div class="login__card-side login__card-front">
              <div class="login__center-wrap">
                <form action="#" class="login__form">
                  <h3 class="login__card-title">Log In</h3>
                  <div class="field">
                    <label class="field__label" for="login">Login</label>
                    <input
                      class="field__input"
                      id="login"
                      name="login"
                      type="text"
                      placeholder=" "
                      autocomplete="username"
                      required
                      minlength="3"
                    />
                  </div>
                  <div class="field">
                    <label class="field__label" for="password"
                      >Password</label
                    >
                    <input
                      class="field__input"
                      id="password"
                      name="password"
                      type="password"
                      placeholder=" "
                      autocomplete="current-password"
                      required
                      minlength="6"
                    />
                  </div>
                  <button
                    type="submit"
                    class="login__button button button-min"
                  >
                    Log In
                  </button>
                </form>
                <a href="/" class="login__link">Forget password</a>
              </div>
            </div>
            <div class="login__card-side login__card-back">
              <div class="login__center-wrap">
                <form action="#" class="login__form">
                  <h3 class="login__card-title">Join Now</h3>
                  <div class="field">
                    <label class="field__label" for="name">Name</label>
                    <input
                      class="field__input"
                      id="name"
                      name="name"
                      type="text"
                      placeholder=" "
                      autocomplete="name"
                      required
                    />
                  </div>
                  <div class="field">
                    <label class="field__label" for="email">Email</label>
                    <input
                      class="field__input"
                      id="email"
                      name="email"
                      type="email"
                      placeholder=" "
                      autocomplete="email"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    class="login__button button button-min"
                  >
                    Join Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
```

---

```
@use '../../styles/helpers/' as *;

.login {
  &__title {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-wrap: wrap;
    font-size: fluid(24, 18);
    margin-bottom: rem(16);
  }

  &__switcher {
    position: relative;
    width: 60px;
    height: 16px;
    margin: 10px auto;
    background-color: #ffeba7;
    border-radius: 8px;
    cursor: pointer;

    &-toggle {
      position: absolute;
      top: -10px;
      left: -10px;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background-color: #1e3fa9;
      border: none;
      cursor: pointer;
      transition: transform 0.55s cubic-bezier(0.19, 1, 0.22, 1);
    }

    &[data-side='back'] &-toggle {
      transform: translateX(44px) rotate(-260deg);
    }
  }

  &:has(.login__switcher[data-side='back']) .login__card-wrapper {
    transform: rotateY(-180deg) rotateX(0.5deg);
  }

  &__card {
    width: 100%;
    max-width: 440px;
    height: 400px;
    margin: 16px auto 0;
    position: relative;
    perspective: 1200px;
  }

  &__card-wrapper {
    @extend %abs100;
    transform-style: preserve-3d;
    transition: transform 0.85s cubic-bezier(0.15, 0.85, 0.35, 1.2);
  }

  &__card-side {
    @extend %abs100;
    background-color: #2a2b38;
    border-radius: 12px;
    transform-style: preserve-3d;
    backface-visibility: hidden;
    box-shadow: 0 20px 45px rgba(0, 0, 0, 0.25);
    overflow: hidden;
  }

  &__card-front {
    transform: rotateY(0);
  }

  &__card-back {
    transform: rotateY(180deg);
  }

  &__center-wrap {
    padding: 10px fluid(15, 8);
  }

  &__form {
    display: flex;
    flex-direction: column;
    gap: 30px;
    margin-bottom: rem(16);
  }
}

.popup-login {
  [data-popup-body] {
    background-color: #343657;
  }

  &__content {
    padding: 15px fluid(15, 3);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
  }
}
```

---

```
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

  onPointerMove(e) {
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

```
