```
<section class="page__hero hero parent-video-fon">
  <div class="hero__container">
  </div>
  <video class="video-fon" autoplay muted loop>
    <source type="video/mp4" src="assets/video/1.mp4">
  </video>
</section>

.parent-video-fon {
  position: relative; // задать секции, на которой висит видео
  overflow: hidden;

  // background-color: #000000; // надо задать если есть радиусы у самой секции
  // .hero__container {
  //   position: relative;
  //   z-index: 2;
  // }
}

.video-fon {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  opacity: 0.5;
}
```

pexels.com = download video
