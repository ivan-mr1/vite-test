const mapLazy = () => {
  const mapUrl =
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10499.212570619604!2d2.325642918775264!3d48.861964141318836!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66e25d0482b3d%3A0x1c0b82c6e1d85100!2zNzUwMDEg0J_QsNGA0LjQtiwg0KTRgNCw0L3RhtC40Y8!5e0!3m2!1sru!2sro!4v1752657985792!5m2!1sru!2sro'; //вставить адрес карты

  const mapContainer = document.querySelector('[data-map]');
  const mapTrigger = document.querySelector('[data-map-trigger]');

  if (mapContainer && mapTrigger) {
    mapTrigger.addEventListener('click', () => {
      mapTrigger.remove();

      const iframe = document.createElement('iframe');
      iframe.src = mapUrl;
      iframe.loading = 'lazy';
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = 'no-referrer-when-downgrade';

      mapContainer.appendChild(iframe);
    });
  }
};
export { mapLazy };
