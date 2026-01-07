// Общие константы для posthtml-плагинов
export const DEFAULT_ENCODING = 'utf8';

// Основные делимитеры для выражений (обычные handlebars-подобные)
export const DEFAULT_EXPRESSIONS_DELIMITERS = ['{{', '}}'];

// Альтернативные делимитеры, часто используемые в сборке (чтобы не конфликтовать)
export const ALTERNATE_EXPRESSIONS_DELIMITERS = ['[[', ']]'];

export const DEFAULT_EXTEND_TAG = 'extends';
export const DEFAULT_INCLUDE_TAG = 'include';

export const ATTR_SRC_NAMES = ['src', 'url'];

export default {
  DEFAULT_ENCODING,
  DEFAULT_EXPRESSIONS_DELIMITERS,
  ALTERNATE_EXPRESSIONS_DELIMITERS,
  DEFAULT_EXTEND_TAG,
  DEFAULT_INCLUDE_TAG,
  ATTR_SRC_NAMES,
};
