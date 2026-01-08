import fs from 'fs';
import path from 'path';
import { parser } from 'posthtml-parser';
import { match } from 'posthtml/lib/api';
import replaceAliases from './aliases.js';
import utils from './utils.js';
import {
  DEFAULT_ENCODING,
  DEFAULT_EXPRESSIONS_DELIMITERS,
} from './constPostHtml.js';

export default (options = {}) => {
  const {
    root = './',
    encoding = DEFAULT_ENCODING,
    posthtmlExpressionsOptions = { locals: {} },
  } = options;

  return function posthtmlInclude(tree) {
    const currentParser = tree.parser || parser;
    const currentMatch = tree.match || match;
    // const logger = options.logger || console;

    currentMatch.call(tree, { tag: 'include' }, (node) => {
      // 1. Обработка атрибутов и получение пути
      const src = processAttributes(node.attrs, options.aliases);
      if (!src) {
        return node;
      }

      let resolvedSrc = src;

      const filePath = path.resolve(root, resolvedSrc);

      if (!fs.existsSync(filePath)) {
        console.warn(`[posthtml-include] File not found: ${filePath}`);
        return node;
      }

      let source = fs.readFileSync(filePath, encoding);

      // 2. Сбор locals (из атрибутов или тела тега)
      let locals = { ...posthtmlExpressionsOptions.locals };

      try {
        const rawLocals =
          node.attrs.locals ||
          (node.content
            ? node.content
                .filter((i) => typeof i === 'string')
                .join('')
                .trim()
            : '');

        if (rawLocals) {
          locals = { ...locals, ...JSON.parse(rawLocals) };
        }
      } catch {
        console.warn(
          `[posthtml-include] Failed to parse locals in ${resolvedSrc}`,
        );
      }

      // 3. Обработка выражений внутри инклюда — выполняем всегда, безопасно
      const exprOptions = {
        ...posthtmlExpressionsOptions,
        locals,
        delimiters:
          options.delimiters ||
          posthtmlExpressionsOptions.delimiters ||
          DEFAULT_EXPRESSIONS_DELIMITERS,
      };

      source = utils.applyExpressions(source, exprOptions, true);

      // 4. Формирование поддерева
      const subtree = currentParser(source);
      // Передаем системные свойства для рекурсии
      subtree.messages = tree.messages || [];

      // Рекурсивный вызов для вложенных include — проверяем AST
      const hasNested = utils.hasTag(subtree, 'include');
      const finalContent = hasNested ? posthtmlInclude(subtree) : subtree;

      // Регистрация зависимости для HMR
      utils.addDependency(tree, filePath);
      // показывает в терминале
      // logger.debug && logger.debug(`[posthtml-include] included ${filePath}`);

      return { tag: false, content: finalContent };
    });

    return tree;
  };
};

const processAttributes = (attrs, aliases) => {
  let src = false;
  if (!attrs) {
    return src;
  }

  for (const [attr, value] of Object.entries(attrs)) {
    if (typeof value === 'string') {
      const replaced = replaceAliases(value, aliases);
      attrs[attr] = replaced;
      if (['src', 'url'].includes(attr) && !replaced.startsWith('http')) {
        src = replaced;
      }
    }
  }
  return src;
};
