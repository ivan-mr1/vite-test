import fs from 'fs'; // работа с файловой системой
import path from 'path'; // работа с путями файлов
import posthtml from 'posthtml'; // PostHTML для обработки HTML
import { parser } from 'posthtml-parser'; // парсер HTML в дерево PostHTML
import { match } from 'posthtml/lib/api'; // функция для поиска узлов в дереве
import expressions from 'posthtml-expressions'; // плагин для выражений в HTML
import replaceAliases from './aliases.js'; // функция замены алиасов в путях

// Плагин для обработки <include> тегов
export default (options = {}) => {
  let {
    root = './', // корневая директория для include
    encoding = 'utf-8', // кодировка файлов
    posthtmlExpressionsOptions = { locals: false }, // опции для posthtml-expressions
  } = options;

  return function posthtmlInclude(tree) {
    tree.parser = tree.parser || parser; // назначаем парсер
    tree.match = tree.match || match; // назначаем match

    // Проходим по всем узлам с атрибутами
    tree.match({ attrs: true }, (node) => {
      if (!node.attrs) {
        return node;
      } // если нет атрибутов, ничего не делаем

      const prependDot = false;
      const src = processAttributes(node.attrs, prependDot); // заменяем алиасы в атрибутах

      if (node.tag === 'include' && src) {
        let resolvedSrc = src;
        try {
          const rootBase = path.basename(root || '');
          // если include внутри папки includes, убираем префикс
          if (
            typeof resolvedSrc === 'string' &&
            resolvedSrc.startsWith('includes/') &&
            rootBase === 'includes'
          ) {
            resolvedSrc = resolvedSrc.replace(/^includes\//, '');
          }
        } catch {
          console.log('error include'); // ошибка обработки пути
        }

        const filePath = path.resolve(root, resolvedSrc); // абсолютный путь к файлу
        let source = fs.readFileSync(filePath, encoding); // читаем файл

        const exprOptions = {
          ...posthtmlExpressionsOptions,
          ...(options.delimiters && { delimiters: options.delimiters }), // задаем кастомные delimiters
        };

        try {
          // Если есть locals в атрибутах или в контенте узла, парсим их
          const localsRaw =
            node.attrs.locals ||
            (node.content ? node.content.join('').replace(/\n/g, '') : false);
          if (localsRaw) {
            const localsJson = JSON.parse(localsRaw);
            exprOptions.locals = exprOptions.locals
              ? { ...exprOptions.locals, ...localsJson }
              : localsJson;
          }
        } catch {
          console.log('error include 2'); // ошибка парсинга locals
        }

        // Если есть locals, обрабатываем контент через expressions
        if (exprOptions.locals) {
          source = posthtml()
            .use(expressions(exprOptions))
            .process(source, { sync: true }).html;
        }

        const subtree = tree.parser(source); // парсим содержимое файла в дерево
        Object.assign(subtree, {
          match: tree.match,
          parser: tree.parser,
          messages: tree.messages,
        });

        // Рекурсивно обрабатываем include внутри include
        const content = source.includes('include')
          ? posthtmlInclude(subtree)
          : subtree;

        // Отмечаем зависимость файла
        tree.messages.push({ type: 'dependency', file: filePath });

        return { tag: false, content }; // возвращаем содержимое вместо тега
      }

      return node;
    });

    return tree;
  };
};

// Обрабатывает атрибуты узла, заменяет алиасы и возвращает src
const processAttributes = (attrs, prependDot) => {
  let src = false;
  for (const [attr, value] of Object.entries(attrs || {})) {
    if (typeof value === 'string') {
      attrs[attr] = replaceAliases(value, { prependDot }); // заменяем алиасы
      if (['src', 'url'].includes(attr) && !attrs[attr].startsWith('http')) {
        src = attrs[attr]; // возвращаем путь к локальному файлу
      }
    }
  }
  return src;
};
