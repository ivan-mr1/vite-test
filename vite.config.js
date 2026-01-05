import { defineConfig } from 'vite';
import SassGlob from 'vite-plugin-sass-glob-import';
import { svgSpritePlugin } from './vite-plugins/svg-sprite';
import { imageOptimizerPlugin } from './vite-plugins/image-optimizer';
import { buildConfig } from './vite-plugins/build-config';

export default defineConfig({
  root: 'src',
  base: '',
  plugins: [SassGlob(), svgSpritePlugin(), imageOptimizerPlugin()],
  build: buildConfig,
});
