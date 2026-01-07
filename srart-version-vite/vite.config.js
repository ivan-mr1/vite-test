import { defineConfig } from 'vite';
import SassGlob from 'vite-plugin-sass-glob-import';
import { imageOptimizerPlugin } from './vite-plugins/image-optimizer';
import { buildConfig } from './vite-plugins/build-config';
import { htmlPlugins } from './vite-plugins/posthtml/html.js';

export default defineConfig({
  root: 'src',
  base: '',
  plugins: [...htmlPlugins, SassGlob(), imageOptimizerPlugin()],
  build: buildConfig,
});
