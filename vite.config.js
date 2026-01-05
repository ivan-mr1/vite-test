import { defineConfig } from 'vite';
import SassGlob from 'vite-plugin-sass-glob-import';
import { imageOptimizerPlugin } from './vite-plugins/image-optimizer';
import { buildConfig } from './vite-plugins/build-config';
import { svgSpritePlugin } from './vite-plugins/svg-sprite';

export default defineConfig({
  root: 'src',
  base: '',
  plugins: [SassGlob(), imageOptimizerPlugin(), ...svgSpritePlugin()],
  build: buildConfig,
});
