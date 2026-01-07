import prerenderHTML from './prerender.js';
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
        fs.writeFileSync(htmlFile, content, 'utf-8');
      });
    },
  },
];
