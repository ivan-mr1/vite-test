import prerenderHTML from './prerender.js'; // импорт плагина для предварительной обработки HTML
import fs from 'fs'; // модуль файловой системы для чтения/записи файлов
import { globSync } from 'glob'; // поиск файлов по шаблону

export const htmlPlugins = [
  prerenderHTML({}), // плагин prerenderHTML для обработки HTML перед сборкой
  {
    name: 'add-posthtml', // имя плагина
    apply: 'build', // плагин применяется только при сборке
    enforce: 'post', // выполняется после всех основных плагинов Vite
    writeBundle: async ({ dir }) => {
      // функция, которая вызывается после генерации бандла
      const htmlFiles = globSync(`${dir}/*.html`); // ищем все HTML файлы в директории сборки
      htmlFiles.forEach(async (htmlFile) => {
        let content = fs.readFileSync(htmlFile, 'utf-8'); // читаем содержимое файла
        fs.writeFileSync(htmlFile, content, 'utf-8'); // перезаписываем тот же файл (можно использовать для постобработки)
      });
    },
  },
];
