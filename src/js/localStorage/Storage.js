export default class Storage {
  constructor(key, eventName, useNumbers = true) {
    this.STORAGE_KEY = key;
    this.EVENT_NAME = eventName;
    this.useNumbers = useNumbers;
    this.initTabSync();
  }

  // Следит за изменениями из других вкладок
  initTabSync() {
    window.addEventListener('storage', (e) => {
      if (e.key === this.STORAGE_KEY && this.EVENT_NAME) {
        this.#notify();
      }
    });
  }

  #notify() {
    if (this.EVENT_NAME) {
      document.dispatchEvent(new CustomEvent(this.EVENT_NAME));
    }
  }

  // подготовка ID
  #prepareId(id) {
    return this.useNumbers ? Number(id) : id;
  }

  get() {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? this.safeParse(data) : [];
    } catch (e) {
      console.error('LocalStorage Get Error:', e);
      return [];
    }
  }

  set(value = []) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(value));
      this.#notify();
    } catch (error) {
      console.error(`Storage Error: Cannot save ${this.STORAGE_KEY}`, error);
    }
  }

  check(id) {
    const numericId = this.#prepareId(id);
    return this.get().includes(numericId);
  }

  add(id) {
    const data = this.get();
    data.push(this.#prepareId(id));
    this.set(data);
  }

  removeOne(id) {
    const targetId = this.#prepareId(id);
    const data = this.get();
    const index = data.indexOf(targetId);

    if (index !== -1) {
      data.splice(index, 1);
      this.set(data);
    }
  }

  remove(id) {
    const targetId = this.#prepareId(id);
    const data = this.get().filter((item) => item !== targetId);
    this.set(data);
  }

  toggle(id) {
    const targetId = this.#prepareId(id);
    const data = this.get();
    const index = data.indexOf(targetId);

    if (index === -1) {
      data.push(targetId);
    } else {
      data.splice(index, 1);
    }

    this.set(data);
    return data;
  }

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.#notify();
  }

  safeParse(value) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}
