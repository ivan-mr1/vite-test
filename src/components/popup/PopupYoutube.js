/**
 * Независимый модуль для работы с YouTube видео в попапах или любых контейнерах
 * Может использоваться как отдельно, так и в связке с Popup компонентом
 */

export default class PopupYoutube {
  selectors = {
    trigger: '[data-youtube-link]',
    container: '[data-youtube-container]',
    youtubePlace: '[data-youtube-place]',
  };

  config = {
    youtubeAttr: 'data-youtube-link',
    autoplay: true,
    rel: 0,
    showinfo: 0,
  };

  /**
   * @param {Object} options - Опции конфигурации
   * @param {string} options.youtubeAttr - Атрибут для хранения YouTube ID
   * @param {boolean} options.autoplay - Автовоспроизведение видео
   * @param {boolean} options.standalone - Работать как отдельный модуль (с event listeners)
   */
  constructor(options = {}) {
    this.config = { ...this.config, ...options };
    this.activeIframe = null;

    // Если модуль используется отдельно, инициализируем event listeners
    if (this.config.standalone) {
      this.bindEvents();
    }
  }

  /**
   * Привязывает обработчики событий (для standalone режима)
   */
  bindEvents = () => {
    document.addEventListener('click', this.handleClick);
  };

  /**
   * Обработчик кликов по триггерам YouTube
   */
  handleClick = (e) => {
    const trigger = e.target.closest(this.selectors.trigger);

    if (!trigger) {
      return;
    }

    e.preventDefault();

    const code = this.extractCodeFromElement(trigger);
    const containerId = trigger.getAttribute('data-youtube-container');

    if (!code) {
      console.warn('PopupYoutube: YouTube ID не найден');
      return;
    }

    const container = containerId
      ? document.querySelector(`[data-youtube-container="${containerId}"]`)
      : trigger.closest(this.selectors.container);

    if (!container) {
      console.warn('PopupYoutube: Контейнер для видео не найден');
      return;
    }

    this.setup(container, code);
  };

  /**
   * Извлекает YouTube ID из элемента
   * @param {HTMLElement} element - Элемент с атрибутом YouTube ID
   * @returns {string|null} YouTube ID или null
   */
  extractCodeFromElement = (element) => {
    return element?.getAttribute(this.config.youtubeAttr) || null;
  };

  /**
   * Создаёт и настраивает YouTube iframe
   * @param {HTMLElement} container - Контейнер для iframe
   * @param {string} code - YouTube video ID
   * @returns {HTMLIFrameElement|null} Созданный iframe или null
   */
  setup = (container, code) => {
    if (!container || !code) {
      console.warn('PopupYoutube: Отсутствует контейнер или YouTube ID');
      return null;
    }

    // Ищем существующий iframe
    let iframe = container.querySelector('iframe');

    // Если iframe нет, создаём новый
    if (!iframe) {
      iframe = this.createIframe();

      const place =
        container.querySelector(this.selectors.youtubePlace) || container;
      place.appendChild(iframe);
    }

    // Показываем iframe и устанавливаем src
    iframe.style.display = '';
    iframe.src = this.buildYoutubeUrl(code);

    this.activeIframe = iframe;
    return iframe;
  };

  /**
   * Создаёт новый YouTube iframe элемент
   * @private
   * @returns {HTMLIFrameElement}
   */
  createIframe = () => {
    const iframe = document.createElement('iframe');
    iframe.allowFullscreen = true;
    iframe.allow = this.config.autoplay
      ? 'autoplay; encrypted-media'
      : 'encrypted-media';

    return iframe;
  };

  /**
   * Строит URL для YouTube embed
   * @private
   * @param {string} code - YouTube video ID
   * @returns {string} URL для embed
   */
  buildYoutubeUrl = (code) => {
    const params = new URLSearchParams({
      rel: this.config.rel,
      showinfo: this.config.showinfo,
    });

    if (this.config.autoplay) {
      params.append('autoplay', '1');
    }

    return `https://www.youtube.com/embed/${code}?${params.toString()}`;
  };

  /**
   * Очищает iframe (останавливает видео)
   * @param {HTMLElement} container - Контейнер с iframe
   */
  clear = (container) => {
    if (!container) {
      return;
    }

    const iframe = container.querySelector('iframe');
    if (iframe) {
      iframe.style.display = 'none';
      iframe.src = '';
    }

    if (this.activeIframe === iframe) {
      this.activeIframe = null;
    }
  };

  /**
   * Останавливает активное видео
   */
  stop = () => {
    if (this.activeIframe) {
      this.activeIframe.src = '';
      this.activeIframe = null;
    }
  };

  /**
   * Очищает все обработчики событий
   * Вызывается при уничтожении компонента
   */
  destroy = () => {
    document.removeEventListener('click', this.handleClick);
    this.stop();
  };
}
