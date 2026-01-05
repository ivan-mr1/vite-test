class VideoLazy {
  constructor(videoUrl, options = {}) {
    let defaultOptions = {
      isFile: false,
    };

    this.options = Object.assign(defaultOptions, options);
    this.isFile = options.isFile;
    this.videoUrl = videoUrl;
    this.container = options.container;

    if (this.container) {
      this.preview = this.container.querySelector('.video__preview');
      this.playButton = this.container.querySelector('.video__play');
    } else {
      console.error('error: video lazy');
      return;
    }

    this.check();
    this.init();
  }

  check() {
    if (!this.videoUrl) {
      console.error('error video lazy');
      return;
    }

    if (!this.playButton) {
      console.error('error video lazy');
      return;
    }
  }

  init() {
    this.playButton?.addEventListener('click', () => this.loadVideo());
  }

  loadVideo() {
    this.preview.remove();
    this.playButton.remove();

    if (this.isFile) {
      const video = document.createElement('video');
      video.src = this.videoUrl;
      video.controls = true;
      video.autoplay = true;
      this.container.appendChild(video);
    } else {
      const iframe = document.createElement('iframe');
      iframe.src = `${this.videoUrl}?autoplay=1`;
      iframe.allow = 'autoplay; encrypted-media';
      iframe.allowfullscreen = true;
      this.container.appendChild(iframe);
    }
  }
}

export default VideoLazy;

/* 
const video1 = new VideoLazy(
  'https://www.youtube.com/embed/cZlGnb6gMJA?si=qcVZqxC0P9Qricu4',
  {
    container: document.getElementById('video-1'),
  },
);

const video2 = new VideoLazy('assets/video/1.mp4', {
  container: document.getElementById('video-2'),
  isFile: true,
});
//+++++++++++++++
<div id="video-1" class="video">
  <img
    src="assets/img/hero/1.webp"
    alt=""
    class="video__preview"
    width=""
    height=""
    loading="lazy"
  />
  <button
    type="button"
    class="video__play"
    aria-label="play video"
    title="play video"
  >
    <svg
      width="58"
      height="58"
      viewBox="0 0 58 58"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.5625 29C0.5625 13.2944 13.2944 0.5625 29 0.5625C44.7056 0.5625 57.4375 13.2944 57.4375 29C57.4375 44.7056 44.7056 57.4375 29 57.4375C13.2944 57.4375 0.5625 44.7056 0.5625 29ZM41.4663 26.1318C43.7167 27.382 43.7167 30.6183 41.4663 31.8685L25.1248 40.9471C22.9377 42.1621 20.25 40.5807 20.25 38.0788V19.9215C20.25 17.4196 22.9377 15.8381 25.1248 17.0531L41.4663 26.1318Z"
        fill="white"
      />
    </svg>
  </button>
</div>
*/
