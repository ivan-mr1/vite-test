export default class VideoLazy {
  constructor(videoUrl, options = {}) {
    const defaultOptions = {
      isFile: false,
      container: null,
    };

    this.options = { ...defaultOptions, ...options };

    this.videoUrl = videoUrl;
    this.isFile = this.options.isFile;
    this.container = this.options.container;

    this.selectors = {
      preview: '.video__preview',
      playButton: '.video__play',
    };

    this.stateClasses = {
      loaded: 'video--loaded',
    };

    if (!this.validate()) {
      return;
    }

    this.getElements();
    if (!this.validateDom()) {
      return;
    }

    this.bindEvents();
  }

  validate() {
    if (!this.container) {
      console.error('VideoLazy: container is missing');
      return false;
    }
    if (!this.videoUrl) {
      console.error('VideoLazy: videoUrl is missing');
      return false;
    }
    return true;
  }

  validateDom() {
    if (!this.playButton) {
      console.error('VideoLazy: play button not found');
      return false;
    }
    return true;
  }

  getElements() {
    this.preview = this.container.querySelector(this.selectors.preview);
    this.playButton = this.container.querySelector(this.selectors.playButton);
  }

  bindEvents() {
    this.playButton.addEventListener('click', () => this.loadVideo(), {
      once: true,
    });
  }

  loadVideo() {
    this.preview?.remove();
    this.playButton?.remove();

    this.isFile ? this.insertFileVideo() : this.insertIframeVideo();

    this.container.classList.add(this.stateClasses.loaded);
  }

  insertFileVideo() {
    const video = document.createElement('video');
    video.src = this.videoUrl;
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    this.container.appendChild(video);
  }

  insertIframeVideo() {
    const iframe = document.createElement('iframe');
    iframe.src = `${this.videoUrl}?autoplay=1`;
    iframe.allow = 'autoplay; encrypted-media';
    iframe.allowFullscreen = true;
    iframe.setAttribute('frameborder', '0');
    this.container.appendChild(iframe);
  }
}
