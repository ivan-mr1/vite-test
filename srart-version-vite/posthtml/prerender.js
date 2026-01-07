import posthtml from 'posthtml';
import posthtmExpressions from 'posthtml-expressions';
import posthtmlExtend from './extend.js';
import posthtmlInclude from './include.js';
import posthtmlFetch from './fetch.js';
import { dirname } from 'path';

const name = 'PostHTMLPreUse';
const defaultOptions = {
  root: null,
  include: {
    posthtmlExpressionsOptions: {
      strictMode: true,
      delimiters: ['[[', ']]'],
    },
  },
  fetch: {
    expressions: {
      strictMode: true,
      delimiters: ['[[', ']]'],
    },
  },
  expressions: {
    strictMode: true,
    delimiters: ['[[', ']]'],
  },
  extend: {
    tagName: 'template',
    expressions: {
      strictMode: true,
      delimiters: ['[[', ']]'],
    },
  },
  plugins: [],
  options: {},
};
const plugin = (pluginOptions = {}) => {
  pluginOptions = { ...defaultOptions, ...pluginOptions };
  return {
    name,
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler: async (html, { filename }) => {
        if (
          filename.replace('.html', '').endsWith('.json') &&
          html.startsWith('{')
        ) {
          return html;
        }
        const plugins = [];
        if (pluginOptions.extend) {
          plugins.push(
            posthtmlExtend({
              root: pluginOptions.root ? pluginOptions.root : dirname(filename),
              ...pluginOptions.extend,
            }),
          );
        }
        if (pluginOptions.include) {
          plugins.push(
            posthtmlInclude({
              root: pluginOptions.root ? pluginOptions.root : dirname(filename),
              ...pluginOptions.include,
            }),
          );
        }
        if (pluginOptions.fetch) {
          plugins.push(
            posthtmlFetch({
              root: pluginOptions.root ? pluginOptions.root : dirname(filename),
              ...pluginOptions.fetch,
            }),
          );
        }
        if (pluginOptions.expressions) {
          plugins.push(
            posthtmExpressions({
              root: pluginOptions.root ? pluginOptions.root : dirname(filename),
              ...pluginOptions.expressions,
            }),
          );
        }
        const render = await new Promise((resolve) => {
          const output = {};
          posthtml(plugins.concat(...pluginOptions.plugins))
            .process(html, pluginOptions.options)
            .catch((error) => {
              output.error = error;
              console.error(`(!!)${error}`);
              resolve(output);
            })
            .then((result) => {
              output.content = result?.html;
              resolve(output);
            });
        });
        return render.content;
      },
    },
  };
};
export default plugin;
