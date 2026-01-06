import templateCfg from '../../template.config.js';

const replaceAliases = (
  data,
  {
    prependDot = false,
    normalizePath = true,
    sortAliases = true,
    preserveOriginal = true,
    transformReplacement,
  } = {},
) => {
  const aliases = templateCfg.aliases || {};

  if (preserveOriginal && Object.keys(aliases).length === 0) {
    return data;
  }
  const escapeRegExp = (string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  if (typeof data === 'string') {
    let result = data;
    const sortedAliases = sortAliases
      ? Object.keys(aliases).sort((a, b) => b.length - a.length)
      : Object.keys(aliases);

    sortedAliases.forEach((alias) => {
      const regex = new RegExp(escapeRegExp(alias), 'g');
      if (result.match(regex)) {
        let replacement = aliases[alias];
        if (prependDot) {
          replacement = `.${replacement}`;
        }
        if (typeof transformReplacement === 'function') {
          replacement = transformReplacement(replacement, alias);
        }
        result = result.replace(regex, replacement);
      }
    });
    if (normalizePath && !result.startsWith('http')) {
      result = result.replace(/\/+/g, '/');
    }
    const src = new RegExp('src/', 'g');
    result = result.includes('src/') ? result.replace(src, '') : result;

    return result;
  }

  if (Array.isArray(data)) {
    return data.map((item) =>
      replaceAliases(item, {
        prependDot,
        normalizePath,
        sortAliases,
        preserveOriginal,
        transformReplacement,
      }),
    );
  }

  if (data && typeof data === 'object') {
    return Object.fromEntries(
      Object.entries(data).map(([key, value]) => [
        key,
        replaceAliases(value, {
          prependDot,
          normalizePath,
          sortAliases,
          preserveOriginal,
          transformReplacement,
        }),
      ]),
    );
  }

  return data;
};

export default replaceAliases;
