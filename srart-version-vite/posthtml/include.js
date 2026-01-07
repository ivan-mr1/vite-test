import fs from 'fs';
import path from 'path';
import posthtml from 'posthtml';
import { parser } from 'posthtml-parser';
import { match } from 'posthtml/lib/api';
import expressions from 'posthtml-expressions';
import replaceAliases from './aliases.js';

export default (options = {}) => {
  let {
    root = './',
    encoding = 'utf-8',
    posthtmlExpressionsOptions = { locals: false },
  } = options;

  return function posthtmlInclude(tree) {
    tree.parser = tree.parser || parser;
    tree.match = tree.match || match;

    tree.match({ attrs: true }, (node) => {
      if (!node.attrs) {
        return node;
      }

      const prependDot = false;
      const src = processAttributes(node.attrs, prependDot);

      if (node.tag === 'include' && src) {
        let resolvedSrc = src;
        try {
          const rootBase = path.basename(root || '');
          if (
            typeof resolvedSrc === 'string' &&
            resolvedSrc.startsWith('includes/') &&
            rootBase === 'includes'
          ) {
            resolvedSrc = resolvedSrc.replace(/^includes\//, '');
          }
        } catch {
          console.log('error include');
        }

        const filePath = path.resolve(root, resolvedSrc);

        let source = fs.readFileSync(filePath, encoding);

        const exprOptions = {
          ...posthtmlExpressionsOptions,
          ...(options.delimiters && { delimiters: options.delimiters }),
        };
        try {
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
          console.log('error include 2');
        }

        if (exprOptions.locals) {
          source = posthtml()
            .use(expressions(exprOptions))
            .process(source, { sync: true }).html;
        }

        const subtree = tree.parser(source);
        Object.assign(subtree, {
          match: tree.match,
          parser: tree.parser,
          messages: tree.messages,
        });
        const content = source.includes('include')
          ? posthtmlInclude(subtree)
          : subtree;

        tree.messages.push({ type: 'dependency', file: filePath });
        return { tag: false, content };
      }

      return node;
    });

    return tree;
  };
};

const processAttributes = (attrs, prependDot) => {
  let src = false;
  for (const [attr, value] of Object.entries(attrs || {})) {
    if (typeof value === 'string') {
      attrs[attr] = replaceAliases(value, { prependDot });
      if (['src', 'url'].includes(attr) && !attrs[attr].startsWith('http')) {
        src = attrs[attr];
      }
    }
  }
  return src;
};
