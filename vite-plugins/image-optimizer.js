import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

export const imageOptimizerPlugin = () =>
  ViteImageOptimizer({
    png: { quality: 70 },
    jpeg: { quality: 70 },
    jpg: { quality: 70 },
    webp: { quality: 85 },
    avif: { lossless: true },
    svg: false,
  });
