import templateCfg from '../../template.config.js';

// Функция заменяет алиасы вида @components/... на реальные пути в строке, массиве или объекте
const replaceAliases = (
  data,
  {
    prependDot = false, // добавлять ли точку перед путём
    normalizePath = true, // нормализовать слэши в пути
    sortAliases = true, // сортировать алиасы по длине (длинные сначала)
    preserveOriginal = true, // если нет алиасов, возвращать исходные данные
    transformReplacement, // функция для дополнительной трансформации подставляемого пути
  } = {},
) => {
  const aliases = templateCfg.aliases || {}; // получаем алиасы из конфигурации

  // если нет алиасов и preserveOriginal=true, возвращаем исходные данные
  if (preserveOriginal && Object.keys(aliases).length === 0) {
    return data;
  }

  // вспомогательная функция для экранирования спецсимволов в регулярках
  const escapeRegExp = (string) =>
    string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  if (typeof data === 'string') {
    let result = data;

    // сортируем алиасы по длине, чтобы более длинные совпадения заменялись раньше
    const sortedAliases = sortAliases
      ? Object.keys(aliases).sort((a, b) => b.length - a.length)
      : Object.keys(aliases);

    // заменяем алиасы на реальные пути
    sortedAliases.forEach((alias) => {
      const regex = new RegExp(escapeRegExp(alias), 'g');
      if (result.match(regex)) {
        let replacement = aliases[alias];
        if (prependDot) {
          replacement = `.${replacement}`; // добавляем точку, если нужно
        }
        if (typeof transformReplacement === 'function') {
          replacement = transformReplacement(replacement, alias); // кастомная трансформация пути
        }
        result = result.replace(regex, replacement);
      }
    });

    // нормализуем слэши, если нужно
    if (normalizePath && !result.startsWith('http')) {
      result = result.replace(/\/+/g, '/');
    }

    // удаляем "src/" из пути, если он есть
    const src = new RegExp('src/', 'g');
    result = result.includes('src/') ? result.replace(src, '') : result;

    return result;
  }

  // если data — массив, рекурсивно обрабатываем каждый элемент
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

  // если data — объект, рекурсивно обрабатываем значения
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

  // если data — ни строка, ни массив, ни объект, возвращаем как есть
  return data;
};

export default replaceAliases;
