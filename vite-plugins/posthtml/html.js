import posthtml from 'posthtml';
import posthtmBeautify from 'posthtml-beautify';
import prerenderHTML from './prerender.js';
import templateConfig from '../../template.config.js';
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
        if (
          templateConfig.images &&
          templateConfig.images.svgsprite &&
          content.includes('__spritemap')
        ) {
          content = content.replace(
            new RegExp('__spritemap', 'gi'),
            `${templateConfig.server.path}assets/img/spritemap.svg`,
          );
        }
        if (
          templateConfig.html &&
          templateConfig.html.beautify &&
          templateConfig.html.beautify.enable
        ) {
          const render = await new Promise((resolve) => {
            const output = {};
            const plugins = [
              posthtmBeautify({
                rules: {
                  indent: templateConfig.html.beautify.indent,
                  blankLines: '',
                  sortAttrs: true,
                },
              }),
            ];
            posthtml(plugins)
              .process(content)
              .catch((error) => {
                output.error = error;
                console.log(error);
                resolve(output);
              })
              .then((result) => {
                output.content = result?.html;
                resolve(output);
              });
          });
          content = render.content;
        }
        fs.writeFileSync(htmlFile, content, 'utf-8');
      });
    },
  },
];
