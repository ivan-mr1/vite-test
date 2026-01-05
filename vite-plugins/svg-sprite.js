import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path from 'path';
import process from 'node:process'; // Добавляем импорт для исправления ошибки

export const svgSpritePlugin = () =>
  createSvgIconsPlugin({
    // Путь к папке с иконками
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],

    // Формат ID: icon-monochrome-name или icon-colored-name
    symbolId: 'icon-[dir]-[name]',

    svgoOptions: {
      full: true,
      plugins: [
        {
          name: 'removeAttrs',
          params: { attrs: '(fill|stroke)' },
          // Логика: если файл в папке 'colored', отменяем удаление атрибутов
          fn: (item, params, info) => {
            if (info.path && info.path.includes('colored')) {
              return null;
            }
          },
        },
        'removeXMLNS',
        'removeDimensions',
        // Оставляем viewBox, чтобы иконки масштабировались корректно
        {
          name: 'removeViewBox',
          active: false,
        },
      ],
    },
  });
