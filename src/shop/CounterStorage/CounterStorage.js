import { STATES } from '../constants.js';

export default class CounterStorage {
  constructor(counterSelector, storage, eventName) {
    this.counters = document.querySelectorAll(counterSelector);
    this.storage = storage;
    this.eventName = eventName;

    if (this.counters.length === 0 || !this.storage) {
      return;
    }

    this.init();
  }

  init() {
    this.update();

    document.addEventListener(this.eventName, () => {
      this.update();
    });
  }

  update() {
    const items = this.storage.get();
    const count = items.length;

    this.counters.forEach((counter) => {
      counter.textContent = count;

      if (count > 0) {
        counter.classList.remove(STATES.HIDDEN);
      } else {
        counter.classList.add(STATES.HIDDEN);
      }
    });
  }
}
