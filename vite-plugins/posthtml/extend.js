import fs from 'fs';
import path from 'path';
import { format } from 'util';
import { parser as parseToPostHtml } from 'posthtml-parser';
import expressions from 'posthtml-expressions';
import { match } from 'posthtml/lib/api';
import merge from 'deepmerge';
import replaceAliases from './aliases.js';
import { DEFAULT_ENCODING, DEFAULT_EXTEND_TAG } from './constPostHtml.js';

const errors = {
  EXTENDS_NO_SRC: '<extends> has no "src"',
  BLOCK_NO_NAME: '<block> has no "name"',
  UNEXPECTED_BLOCK: 'Unexpected block "%s"',
};

// Вспомогательная функция: Применяет массив плагинов к дереву
const applyPluginsToTree = (tree, plugins) => {
  return plugins.reduce((currTree, plugin) => plugin(currTree), tree);
};

// Вспомогательная функция: Формирует объект ошибки
const getError = (...rest) => new Error('[posthtml-extend] ' + format(...rest));

// Определяет тип блока (replace, prepend, append)
const getBlockType = (blockNode) => {
  let blockType = (blockNode.attrs && blockNode.attrs.type) || 'replace';
  blockType = blockType.toLowerCase();
  return ['replace', 'prepend', 'append'].includes(blockType)
    ? blockType
    : 'replace';
};

// Добавляет блок в коллекцию
const appendBlockNode = (blockNodes, node) => {
  const { name } = node.attrs;
  if (!blockNodes[name]) {
    blockNodes[name] = [node];
  } else {
    blockNodes[name].push(node);
  }
};

// Получает все блоки из контента
const getBlockNodes = (tag, content = []) => {
  const blockNodes = {};
  match.call(content, { tag }, (node) => {
    if (!node.attrs || !node.attrs.name) {
      throw getError(errors.BLOCK_NO_NAME);
    }
    appendBlockNode(blockNodes, node);
    return node;
  });
  return blockNodes;
};

// Объединяет контент
const mergeContent = (
  extendBlockContent = [],
  layoutBlockContent = [],
  extendBlockType,
) => {
  switch (extendBlockType) {
    case 'replace':
      return extendBlockContent;
    case 'prepend':
      return [...extendBlockContent, ...layoutBlockContent];
    case 'append':
      return [...layoutBlockContent, ...extendBlockContent];
    default:
      return layoutBlockContent;
  }
};

const mergeExtendsAndLayout = (
  layoutTree,
  extendsNode,
  strictNames,
  slotTagName,
  fillTagName,
) => {
  const layoutBlockNodes = getBlockNodes(slotTagName, layoutTree);
  const extendsBlockNodes = getBlockNodes(fillTagName, extendsNode.content);

  for (const name of Object.keys(layoutBlockNodes)) {
    const extendsBlockList = extendsBlockNodes[name];
    if (!extendsBlockList) {
      continue;
    }

    const lastExtendsBlock = extendsBlockList[extendsBlockList.length - 1];
    if (!lastExtendsBlock) {
      continue;
    }

    for (const layoutBlock of layoutBlockNodes[name]) {
      layoutBlock.content = mergeContent(
        lastExtendsBlock.content,
        layoutBlock.content,
        getBlockType(lastExtendsBlock),
      );
    }
    delete extendsBlockNodes[name];
  }

  if (strictNames && Object.keys(extendsBlockNodes).length > 0) {
    throw getError(errors.UNEXPECTED_BLOCK, Object.keys(extendsBlockNodes)[0]);
  }

  return layoutTree;
};

function handleExtendsNodes(tree, options, messages) {
  return match.call(
    applyPluginsToTree(tree, options.plugins),
    { tag: options.tagName },
    (extendsNode) => {
      // Обработка атрибутов
      let src = false;
      for (const [attr, value] of Object.entries(extendsNode.attrs || {})) {
        if (typeof value === 'string') {
          extendsNode.attrs[attr] = replaceAliases(value, options.aliases);
          if (
            ['src', 'url'].includes(attr) &&
            !extendsNode.attrs[attr].startsWith('http')
          ) {
            src = extendsNode.attrs[attr];
          }
        }
      }

      if (!src) {
        throw getError(errors.EXTENDS_NO_SRC);
      }

      let locals = {};
      try {
        if (extendsNode.attrs.locals) {
          locals = JSON.parse(extendsNode.attrs.locals);
        }
      } catch {
        console.error(`[posthtml-extend] JSON error in ${src}`);
      }

      const plugins = [
        ...options.plugins,
        expressions({
          ...options.expressions,
          locals: merge(options.expressions.locals, locals),
        }),
      ];

      const layoutPath = path.resolve(options.root, src);
      const layoutHtml = fs.readFileSync(layoutPath, options.encoding);

      const layoutTree = handleExtendsNodes(
        applyPluginsToTree(parseToPostHtml(layoutHtml), plugins),
        options,
        messages,
      );

      extendsNode.tag = false;
      extendsNode.content = mergeExtendsAndLayout(
        layoutTree,
        extendsNode,
        options.strict,
        options.slotTagName,
        options.fillTagName,
      );

      messages.push({ type: 'dependency', file: layoutPath });
      return extendsNode;
    },
  );
}

const extend =
  (options = {}) =>
  (tree) => {
    const opts = {
      encoding: DEFAULT_ENCODING,
      root: './',
      plugins: [],
      strict: true,
      slotTagName: 'block',
      fillTagName: 'block',
      tagName: DEFAULT_EXTEND_TAG,
      expressions: { locals: {} },
      ...options,
    };

    const messages = tree.messages || [];
    const processedTree = handleExtendsNodes(tree, opts, messages);

    // Финальная очистка блочных тегов
    const finalBlocks = getBlockNodes(opts.slotTagName, processedTree);
    Object.values(finalBlocks)
      .flat()
      .forEach((node) => {
        node.tag = false;
      });

    processedTree.messages = messages;
    return processedTree;
  };

export default extend;
