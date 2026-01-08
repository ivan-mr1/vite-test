import fs from 'node:fs/promises';
import posthtml from 'posthtml';
import expressions from 'posthtml-expressions';

// Небольшая утилита для нормализации путей/строк
export const normalizePath = (value, opts = {}) => {
  const { stripSrcPrefix = true } = opts;
  if (typeof value !== 'string') {
    return value;
  }
  let v = value.replace(/\\+/g, '/');
  v = v.replace(/\/\/+/g, '/');
  if (stripSrcPrefix && v.startsWith('src/')) {
    v = v.slice(4);
  }
  return v;
};

export const addDependency = (tree, filePath) => {
  if (!tree || !filePath) {
    return;
  }
  tree.messages = tree.messages || [];
  tree.messages.push({ type: 'dependency', file: filePath });
};

// Простой рендер AST->HTML для node.content
const renderTag = (node) => {
  if (typeof node === 'string') {
    return node;
  }
  if (!node || typeof node !== 'object') {
    return '';
  }
  const attrs = node.attrs
    ? ' ' +
      Object.entries(node.attrs)
        .map(([k, v]) => (v === '' ? k : `${k}="${v}"`))
        .join(' ')
    : '';
  const content = Array.isArray(node.content)
    ? node.content.map((c) => renderTag(c)).join('')
    : node.content || '';
  if (node.tag === false) {
    return content;
  }
  return `<${node.tag}${attrs}>${content}</${node.tag}>`;
};

export const renderNodeContent = (nodeContent) => {
  if (!nodeContent) {
    return '';
  }
  if (typeof nodeContent === 'string') {
    return nodeContent;
  }
  if (Array.isArray(nodeContent)) {
    return nodeContent.map((n) => renderTag(n)).join('');
  }
  return String(nodeContent);
};

export const applyExpressions = (source, exprOptions = {}, sync = true) => {
  try {
    const proc = posthtml([expressions(exprOptions)]).process(source, { sync });
    if (sync) {
      // синхронный путь возвращает объект с .html
      return proc.html || '';
    }
    // асинхронный путь — возвращаем Promise<string>
    return proc.then((r) => r.html || '');
  } catch {
    // fallback: вернуть исходник
    return sync ? source : Promise.resolve(source);
  }
};

export const readJsonOrText = async (filePath, encoding = 'utf8') => {
  const txt = await fs.readFile(filePath, encoding);
  try {
    return JSON.parse(txt);
  } catch {
    return txt;
  }
};

export const hasTag = (treeOrContent, tagName) => {
  if (!treeOrContent) {
    return false;
  }
  let found = false;
  try {
    // treeOrContent may be an array (parser result) or a tree-like object
    const match = (node, cb) => {
      if (Array.isArray(node)) {
        node.forEach((n) => match(n, cb));
        return;
      }
      if (!node || typeof node !== 'object') {
        return;
      }
      if (node.tag === tagName) {
        found = true;
        cb(node);
      }
      if (Array.isArray(node.content)) {
        match(node.content, cb);
      }
    };
    match(treeOrContent, () => {});
  } catch {
    return false;
  }
  return found;
};

export default {
  normalizePath,
  addDependency,
  renderNodeContent,
  applyExpressions,
  readJsonOrText,
  hasTag,
};
