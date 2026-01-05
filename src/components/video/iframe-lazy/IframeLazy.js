function iframeLazy(targetElement, videoCode, options = {}) {
  if (!targetElement || !videoCode) {
    return;
  }

  const {
    youtubePlaceAttribute = 'data-popup-youtube-place',
    setAutoplayYoutube = true,
  } = options;

  const urlVideo = `https://www.youtube.com/embed/${videoCode}?rel=0&showinfo=0&autoplay=1`;
  const iframe = document.createElement('iframe');

  const autoplay = setAutoplayYoutube ? 'autoplay;' : '';
  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', `${autoplay} encrypted-media`);
  iframe.setAttribute('src', urlVideo);
  iframe.setAttribute('title', 'YouTube video');
  iframe.setAttribute('loading', 'lazy');

  let place = targetElement.querySelector(`[${youtubePlaceAttribute}]`);

  if (!place) {
    const content = targetElement.querySelector('[data-popup-content]');
    if (!content) {
      return;
    } // нет места для вставки видео
    place = document.createElement('div');
    place.setAttribute(youtubePlaceAttribute, '');
    content.appendChild(place);
  }

  place.innerHTML = ''; // очищаем перед вставкой
  place.appendChild(iframe);
}

export { iframeLazy };
