// import posthtml from 'posthtml';
import prerenderHTML from './prerender.js';
// import templateConfig from '../../template.config.js';
import fs from 'fs';
import { globSync } from 'glob';

export const htmlPlugins = [
  prerenderHTML({}),
  {
    name: 'add-posthtml',
    apply: 'build',
    enforce: 'post',
    writeBundle: async ({ dir }) => {
      const htmlFiles = globSync(`${dir}/*.html`);
      htmlFiles.forEach(async (htmlFile) => {
        let content = fs.readFileSync(htmlFile, 'utf-8');
        // if (
        //   templateConfig.images &&
        //   templateConfig.images.svgsprite &&
        //   content.includes('__spritemap')
        // ) {
        //   content = content.replace(
        //     new RegExp('__spritemap', 'gi'),
        //     `${templateConfig.server.path}assets/img/spritemap.svg`,
        //   );
        // }
        fs.writeFileSync(htmlFile, content, 'utf-8');
      });
    },
  },
];
