import { defineConfig } from 'vite';
import SassGlob from 'vite-plugin-sass-glob-import';
import { imageOptimizerPlugin } from './vite-plugins/image-optimizer';
import { buildConfig } from './vite-plugins/build-config';
import posthtml from '@vituum/vite-plugin-posthtml';

export default defineConfig({
  root: 'src',
  base: '',
  plugins: [posthtml(), SassGlob(), imageOptimizerPlugin()],
  build: buildConfig,
});
