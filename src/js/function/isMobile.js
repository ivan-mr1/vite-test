/**
 * Определение типа устройства
 * Использует современные подходы: Feature Detection и User-Agent Client Hints API
 */
export const isMobile = {
  /**
   * Проверка Android устройств
   * @returns {boolean}
   */
  Android: function () {
    return /Android/i.test(navigator.userAgent);
  },

  /**
   * Проверка iOS устройств (iPhone, iPad, iPod)
   * @returns {boolean}
   */
  iOS: function () {
    return (
      /iPhone|iPad|iPod/i.test(navigator.userAgent) ||
      // Проверка для iPad на iOS 13+ (определяется как Mac)
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    );
  },

  /**
   * Проверка любого мобильного устройства
   * Использует Feature Detection
   * @returns {boolean}
   */
  any: function () {
    // Проверка поддержки touch-событий и количества точек касания
    const hasTouchScreen =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0;

    // Дополнительная проверка через User-Agent для старых браузеров
    const isMobileUA =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    return hasTouchScreen || isMobileUA;
  },

  /**
   * Проверка планшета
   * @returns {boolean}
   */
  tablet: function () {
    const isTabletUA = /iPad|Android(?!.*Mobile)/i.test(navigator.userAgent);
    const isLargeTouch =
      navigator.maxTouchPoints > 0 &&
      window.matchMedia('(min-width: 768px)').matches;

    return isTabletUA || isLargeTouch;
  },
};
