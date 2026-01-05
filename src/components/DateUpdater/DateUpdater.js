import { locales } from '../locates/locales';

class DateUpdater {
  constructor(selector = '.date', options = {}) {
    this.selector = selector;
    this.lang = options.lang || document.documentElement.lang || 'en';
    this.locale = options.locale || navigator.language || 'en-US';
    this.useIntl = options.useIntl || false;

    this.locales = locales;

    if (this.useIntl) {
      try {
        this.formatter = new Intl.DateTimeFormat(this.locale, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
      } catch {
        this.formatter = new Intl.DateTimeFormat('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        });
      }
    }

    this.start();
  }

  addLeadingZero(num) {
    return String(num).padStart(2, '0');
  }

  formatCustomDate(date) {
    const localeData = this.locales[this.lang] || this.locales.en;

    const dayName = localeData.days[date.getDay()];
    const monthName = localeData.months[date.getMonth()];
    const day = this.addLeadingZero(date.getDate());
    const year = date.getFullYear();
    const hours = this.addLeadingZero(date.getHours());
    const minutes = this.addLeadingZero(date.getMinutes());
    const seconds = this.addLeadingZero(date.getSeconds());

    return `${localeData.label}: ${day} ${monthName} ${year} ${hours}:${minutes}:${seconds} ${dayName}`;
  }

  formatDate(date) {
    return this.useIntl
      ? this.formatter.format(date)
      : this.formatCustomDate(date);
  }

  updateDate() {
    const element = document.querySelector(this.selector);
    if (!element) {
      return;
    }

    const now = new Date();
    element.innerHTML = this.formatDate(now);
  }

  start() {
    this.updateDate();
    this.intervalId = setInterval(() => this.updateDate(), 1000);
  }

  stop() {
    clearInterval(this.intervalId);
  }
}

export { DateUpdater };

// Если в <html lang="ru">,
// Выведет: "Дата: 03 Сентября 2025 17:35:12 Среда"
// const updater = new DateUpdater();

// const updater = new DateUpdater('.date', {
//   useIntl: true,
//   locale: 'ru-RU',
// });
// Выведет: "среда, 03 сентября 2025 г., 17:35:12"

// const updater = new DateUpdater('.date', {
//   useIntl: true,
//   locale: 'en-US',
// });
// Выведет: "Wednesday, September 03, 2025, 17:35:12"

// const updater = new DateUpdater('.date', {
//   useIntl: true,
//   locale: 'uk-UA',
// });
// Выведет: "середа, 03 вересня 2025 р., 17:35:12"

// Через 10 секунд останавливаем обновление
// const updater = new DateUpdater('.date');
// setTimeout(() => {
//   updater.stop();
//   console.log('Обновление даты остановлено');
// }, 10000);
