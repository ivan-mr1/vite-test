import posthtml from 'posthtml';
import defu from 'defu';
import posthtmExpressions from 'posthtml-expressions';
import posthtmlExtend from './extend.js';
import posthtmlInclude from './include.js';
import posthtmlFetch from './fetch.js';
import { ALTERNATE_EXPRESSIONS_DELIMITERS } from './constPostHtml.js';
import { dirname } from 'path';

const name = 'PostHTMLPreUse';

const defaultOptions = {
  root: null,
  include: {
    posthtmlExpressionsOptions: {
      strictMode: true,
      delimiters: ALTERNATE_EXPRESSIONS_DELIMITERS,
    },
  },
  fetch: {
    expressions: {
      strictMode: true,
      delimiters: ALTERNATE_EXPRESSIONS_DELIMITERS,
    },
  },
  expressions: {
    strictMode: true,
    delimiters: ALTERNATE_EXPRESSIONS_DELIMITERS,
  },
  extend: {
    tagName: 'extends',
    expressions: {
      strictMode: true,
      delimiters: ALTERNATE_EXPRESSIONS_DELIMITERS,
    },
  },
  plugins: [],
  options: {},
};

export default (pluginOptions = {}) => {
  const opts = defu(pluginOptions, defaultOptions);

  return {
    name,
    enforce: 'pre',
    transformIndexHtml: {
      order: 'pre',
      handler: async (html, { filename }) => {
        // Пропускаем JSON файлы
        if (
          filename.endsWith('.json') ||
          (filename.includes('.json') && html.startsWith('{'))
        ) {
          return html;
        }

        const root = opts.root || dirname(filename);
        const logger = opts.logger || console;
        const plugins = [];

        // Собираем стек плагинов
        if (opts.extend) {
          plugins.push(posthtmlExtend({ root, logger, ...opts.extend }));
        }
        if (opts.include) {
          plugins.push(posthtmlInclude({ root, logger, ...opts.include }));
        }
        if (opts.fetch) {
          plugins.push(posthtmlFetch({ root, logger, ...opts.fetch }));
        }
        if (opts.expressions) {
          plugins.push(posthtmExpressions({ root, ...opts.expressions }));
        }

        // Добавляем внешние плагины
        plugins.push(...opts.plugins);

        try {
          // Использование встроенного Promise от posthtml
          const result = await posthtml(plugins).process(html, opts.options);
          return result.html;
        } catch (error) {
          logger.error &&
            logger.error(`[${name}] Error in ${filename}:`, error.message);
          // Возвращаем исходный HTML, чтобы не "вешать" сервер разработки
          return html;
        }
      },
    },
  };
};
