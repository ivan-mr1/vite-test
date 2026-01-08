import isUrl from 'is-url';
import { resolve as resolvePath } from 'node:path';
import defu from 'defu';
import replaceAliases from './aliases.js';
import utils from './utils.js';

const ofetch = async (url, opts = {}) => {
  const res = await fetch(url, opts);
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`);
  }
  const ct = res.headers.get('content-type') || '';
  return ct.includes('application/json') ? res.json() : res.text();
};

export default (options = {}) =>
  async (tree) => {
    const opts = {
      attribute: 'url',
      tags: ['fetch', 'remote'],
      preserveTag: false,
      expressions: {},
      ...options,
    };

    const logger = opts.logger || console;
    const fileCache = new Map();

    const processNode = async (node) => {
      let rawUrl = node.attrs?.[opts.attribute];
      if (!rawUrl) {
        return node;
      }

      // Применяем алиасы к URL
      rawUrl = replaceAliases(rawUrl, opts.aliases);

      let data;
      let filePath = null;

      try {
        if (isUrl(rawUrl)) {
          data = await ofetch(rawUrl, opts.ofetch);
        } else {
          // Локальный файл (учитываем корень src)
          const normalizedPath = rawUrl.startsWith('src/')
            ? rawUrl
            : `src/${rawUrl}`;
          filePath = resolvePath(normalizedPath);
          if (fileCache.has(filePath)) {
            data = fileCache.get(filePath);
          } else {
            data = await utils.readJsonOrText(filePath, 'utf8');
            fileCache.set(filePath, data);
          }
          utils.addDependency(tree, filePath);
          logger.debug && logger.debug(`[posthtml-fetch] read ${filePath}`);
        }

        // Обработка данных через алиасы (если это объект/массив)
        const locals = { response: data };

        // Рендерим внутренности тега с новыми данными
        if (node.content) {
          const merged = defu(opts.expressions, { locals });
          const inner = utils.renderNodeContent(node.content);
          const rendered = await utils.applyExpressions(inner, merged, false);
          node.content = rendered;
        }
      } catch (error) {
        console.error(`[posthtml-fetch] Error: ${error.message}`);
      }

      if (!opts.preserveTag) {
        node.tag = false;
      }
      return node;
    };

    const promises = [];
    tree.match({ tag: /^(fetch|remote)$/ }, (node) => {
      promises.push(processNode(node));
      return node;
    });

    await Promise.all(promises);
    return tree;
  };
