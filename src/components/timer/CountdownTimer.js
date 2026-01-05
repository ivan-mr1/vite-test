import { locales } from '../locates/locales';

class CountdownTimer {
  /**
   * @param {string} parentSelector - CSS селектор контейнера таймера
   * @param {string|number} to - конечная дата в строке или количество секунд от текущего момента
   * @param {string} endMessage - сообщение при окончании таймера
   * @param {string} lang - язык локализации (по умолчанию берётся из document.documentElement.lang)
   */
  constructor(
    parentSelector,
    to,
    endMessage,
    lang = document.documentElement.lang || 'en',
  ) {
    this.parentSelector = parentSelector;
    this.to = to;
    this.endMessage = endMessage;
    this.lang = lang;

    this.locale = locales[this.lang] || locales.en;
    this.timerWords = this.locale.timer;

    this.decCache = [];
    this.decCases = [2, 0, 1, 1, 1, 2];

    this.interval = null;

    this.init();
  }

  /**
   * Добавляет ведущий ноль к числу, если оно меньше 10
   * @param {number} num
   * @returns {string}
   */
  addLeadingZero(num) {
    return num < 10 ? '0' + num : String(num);
  }

  /**
   * Склонение числительных, например: 1 день, 2 дня, 5 дней
   * @param {number} number
   * @param {Array<string>} titles
   * @returns {string}
   */
  declOfNum(number, titles) {
    if (!this.decCache[number]) {
      this.decCache[number] =
        number % 100 > 4 && number % 100 < 20
          ? 2
          : this.decCases[Math.min(number % 10, 5)];
    }
    return titles[this.decCache[number]];
  }

  /**
   * Получение конечной даты таймера в формате Date
   * @throws Ошибка, если передан некорректный параметр `to`
   * @returns {Date}
   */
  getTargetDate() {
    if (typeof this.to === 'string') {
      return new Date(this.to);
    } else if (typeof this.to === 'number') {
      return new Date(Date.now() + this.to * 1000);
    }
    throw new Error(
      'CountdownTimer: Invalid "to" argument. Must be string or number.',
    );
  }

  /**
   * Обновляет значения таймера на странице
   */
  updateCountdown() {
    const now = new Date();
    const totalSeconds = Math.floor((this.toDate - now) / 1000);

    // Если таймер уже закончился — остановим и выведем сообщение
    if (totalSeconds <= 0) {
      this.stop();
      this.renderEndMessage();
      return;
    }

    const seconds = totalSeconds % 60;
    const minutes = Math.floor((totalSeconds / 60) % 60);
    const hours = Math.floor((totalSeconds / 3600) % 24);
    const days = Math.floor(totalSeconds / 86400);

    const elements = document.querySelectorAll(this.parentSelector);

    if (elements.length === 0) {
      console.error(
        `CountdownTimer: No elements found with selector "${this.parentSelector}"`,
      );
      this.stop();
      return;
    }

    elements.forEach((root) => {
      this.updateUnitBlock(root, 'days', days, this.timerWords.day);
      this.updateUnitBlock(root, 'hours', hours, this.timerWords.hour);
      this.updateUnitBlock(root, 'minutes', minutes, this.timerWords.minute);
      this.updateUnitBlock(root, 'seconds', seconds, this.timerWords.second);
    });
  }

  /**
   * Обновляет отдельный блок таймера (дни, часы, минуты, секунды)
   * @param {Element} root - корневой элемент таймера
   * @param {string} unitClass - класс блока (например, 'days')
   * @param {number} value - числовое значение
   * @param {Array<string>} titles - варианты склонения
   */
  updateUnitBlock(root, unitClass, value, titles) {
    const block = root.querySelector(`.${unitClass}`);
    if (!block) {
      return;
    }

    // Скрываем блок дней, если значение 0, иначе показываем и обновляем текст
    if (unitClass === 'days' && value <= 0) {
      block.style.display = 'none';
      return;
    }
    block.style.display = '';

    const numEl = block.querySelector('.num');
    const nameEl = block.querySelector('.name');
    if (numEl) {
      numEl.textContent = this.addLeadingZero(value);
    }
    if (nameEl) {
      nameEl.textContent = this.declOfNum(value, titles);
    }
  }

  /**
   * Выводит сообщение о завершении таймера
   */
  renderEndMessage() {
    const elements = document.querySelectorAll(this.parentSelector);
    elements.forEach((root) => {
      root.textContent = this.endMessage;
    });
  }

  /**
   * Инициализация таймера: проверка параметров, запуск обновления и интервала
   */
  init() {
    // Проверяем обязательные параметры перед запуском
    if (!this.parentSelector) {
      console.error('CountdownTimer: Missing "parentSelector" parameter');
      return;
    }
    if (!this.to) {
      console.error('CountdownTimer: Missing "to" parameter');
      return;
    }

    try {
      this.toDate = this.getTargetDate();
    } catch (e) {
      console.error(e.message);
      return;
    }

    // Запускаем первое обновление и создаём интервал
    this.updateCountdown();
    this.interval = setInterval(() => this.updateCountdown(), 1000);
  }

  /**
   * Останавливает таймер
   */
  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}

export default CountdownTimer;

// Запуск таймера, который считает до 29 июня 2026 17:28
// const countdown = new CountdownTimer(
//   '.countdown', // CSS селектор таймера
//   '29 Jun 2026 17:28', // Конечная дата
//   'The timer is over!', // Сообщение по окончании
//   'en', // Язык (по умолчанию берётся из html lang)
// );

// const oneHourTimer = new CountdownTimer(
//   '.countdown',
//   3600, // секунды от текущего времени
//   'Time is up!',
//   'ru', // переключаем локаль на русский
// );
