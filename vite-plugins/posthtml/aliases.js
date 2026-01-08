import utils from './utils.js';

const replaceAliases = (data, aliases = {}, options = {}) => {
  const {
    prependDot = false,
    normalizePath = true,
    stripSrcPrefix = true,
    sortAliases = true,
    preserveOriginal = true,
    transformReplacement,
  } = options;

  if (preserveOriginal && Object.keys(aliases).length === 0) {
    return data;
  }

  const escapeRegExp = (string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Обработка строк
  if (typeof data === 'string') {
    let result = data;

    const sortedAliases = sortAliases
      ? Object.keys(aliases).sort((a, b) => b.length - a.length)
      : Object.keys(aliases);

    sortedAliases.forEach((alias) => {
      if (result.includes(alias)) {
        let replacement = aliases[alias];

        if (prependDot) {
          replacement = `.${replacement}`;
        }
        if (typeof transformReplacement === 'function') {
          replacement = transformReplacement(replacement, alias);
        }

        const regex = new RegExp(escapeRegExp(alias), 'g');
        result = result.replace(regex, replacement);
      }
    });

    if (normalizePath && !result.startsWith('http')) {
      result = utils.normalizePath(result, { stripSrcPrefix });
    }

    return result;
  }

  // Рекурсия для массивов
  if (Array.isArray(data)) {
    return data.map((item) => replaceAliases(item, aliases, options));
  }

  // Рекурсия для объектов
  if (data !== null && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        replaceAliases(value, aliases, options),
      ]),
    );
  }

  return data;
};

export default replaceAliases;
