# postHTML — документация для проекта

Дата: 2026-01-06

Это файл документации по интеграции postHTML в проект `vite-test` — какие зависимости установлены, какие файлы были добавлены/изменены, и как пользоваться логикой postHTML (теги: `<include>`, `<fetch>`, `<extends>`, `expressions`).

---

## Краткий статус

- Я применил патчи в `src/includes/head.html` и `src/includes/footer.html` чтобы устранить ошибки резолвинга путей; затем перезапустил сборку.
- Сборка прошла (в логе оставались сообщения о попытках открыть `includes/includes/soc1al.html`, но итоговый `dist` сформирован).
- Файл `postHTML.md` создан в корне репозитория.

---

## Установленные зависимости (relevant для postHTML)

См. `package.json` — основные пакеты, задействованные для работы postHTML:

- `posthtml` 0.16.6
- `posthtml-parser` 0.12.1
- `posthtml-beautify` 0.7.0
- `posthtml-expressions` 1.11.4
- `posthtml-extend` 0.6.5
- `posthtml-fetch` 4.0.3
- `deepmerge`, `defu` — для слияния данных
- `is-url` — проверка url
- `glob`, `svgo` — вспомогательно для сборки/оптимизации
- Vite и плагины: `vite`, `@spiriit/vite-plugin-svg-spritemap`, `vite-plugin-image-optimizer`, `vite-plugin-sass-glob-import` и др.

(Полный список в `package.json`.)

---

## Файлы и папки, добавленные / изменённые

- Добавлены плагины postHTML (локально):
  - `vite-plugins/posthtml/prerender.js` — Vite plugin (transformIndexHtml handler).
  - `vite-plugins/posthtml/include.js` — реализация тега `<include>`.
  - `vite-plugins/posthtml/fetch.js` — реализация тега `<fetch>` (легкая обёртка `ofetch`).
  - `vite-plugins/posthtml/extend.js` — реализация extend/layout/block.
  - `vite-plugins/posthtml/aliases.js` — helper `replaceAliases`.
  - `vite-plugins/posthtml/html.js` — экспорт `htmlPlugins` (pre + post этапы, beautify в writeBundle).
  - `vite-plugins/posthtml/logger.js` — минимальный логгер.
- Конфигурация:
  - `template.config.js` — конфиг шаблона и алиасы.
  - `vite.config.js` — подключены `...htmlPlugins`.
  - `package.json` — devDependencies (см. выше).
- Структура includes:
  - `src/includes/head.html` — head-код (favicon, стили, скрипт).
  - `src/includes/header.html` — header (site header).
  - `src/includes/footer.html` — footer (с include соц-блока).
  - `src/includes/soc1al.html` — отдельный файл со списком соц-ссылок и SVG.
- Изменения в `src/index.html` — части (`head`, `header`, `footer`) заменены на `<include ...>`.

---

## Как встроена логика в Vite

- В `vite.config.js` происходит импорт `htmlPlugins` из `vite-plugins/posthtml/html.js` и они добавлены в массив `plugins`.

# postHTML — документация для проекта

Дата: 2026-01-06

Документация по интеграции postHTML в проект `vite-test`: что установлено, какие файлы созданы/изменены, и как пользоваться тегами/функциями postHTML (`<include>`, `<fetch>`, `<extends>`, `posthtml-expressions`).

---

## Краткий статус

- Упрощён `template.config.js` (остались `lang`, `html.beautify`, `aliases`).
- Добавлен алиас `@includes` (указывает на `src/includes`); все основные include-пути заменены на `@includes/...`.
- Нормализация резолвинга include-путей реализована в `vite-plugins/posthtml/include.js` (защита от `includes/includes/...`).
- Проведены проверки: несколько прогонов `npm run build` — успешны; `npm run dev` стартует и работает (Local: http://localhost:5173/).

---

## Ключевые зависимости (см. package.json)

- `posthtml` 0.16.6
- `posthtml-parser` 0.12.1
- `posthtml-beautify` 0.7.0
- `posthtml-expressions` 1.11.4
- `posthtml-extend` 0.6.5
- `posthtml-fetch` 4.0.3
- `deepmerge`, `defu`, `is-url`, `glob`, `svgo` и пр.

---

## Структура и изменённые файлы

- `vite-plugins/posthtml/*` — локальные postHTML плагины: `prerender.js`, `include.js`, `fetch.js`, `extend.js`, `aliases.js`, `html.js`, `logger.js`.
- `template.config.js` — упрощённый конфиг с алиасами (см. ниже).
- `vite.config.js` — подключены `...htmlPlugins`.
- `src/includes/*` — модули: `head.html`, `header.html`, `footer.html`, `soc1al.html`.
- `src/index.html` — использует `<include src="@includes/...">`.
- `postHTML.md` — этот файл (обновлён).

---

## Алиасы и рекомендации по путям

- Добавлен алиас `@includes` → `src/includes` в `template.config.js`.
- Рекомендуется в инклюдах и asset‑путях использовать алиасы (`@includes`, `@js`, `@styles`, `@img`) или root-absolute пути (`/...`).
- Это устраняет ошибки резолвинга, возникающие при обработке include из папки `src/includes`.

---

## Как пользоваться (примеры)

1. `<include>` с передачей локальных данных

В `src/index.html`:

```html
<include
  src="@includes/header.html"
  locals='{"cls":"is-home","title":"Оптика"}'
></include>
```

В `@includes/header.html` используйте `posthtml-expressions`:

```html
<header class="header [[ cls ]]">[[ title ]]</header>
```

2. `<fetch>` локального JSON

```html
<fetch url="data/products.json">
  <ul>
    [[ response.map(p => `
    <li>${p.name} — ${p.price}</li>
    `).join('') ]]
  </ul>
</fetch>
```

3. `<extends>` + `<block>` (layout)

```html
<extends src="@includes/layouts/default.html">
  <block name="content">Контент страницы</block>
</extends>
```

---

## Опции и где их менять

- Опции postHTML и plugins задаются в `vite-plugins/posthtml/prerender.js` (`defaultOptions`).
- Для глобальных настроек алиасов/beautify смотрите `template.config.js`.

---

## Частые ошибки и их решения

- ENOENT при include: проверьте, что используете `@includes/...` или корректный относительный путь; не смешивайте `includes/...` внутри файлов, которые уже находятся в `src/includes`.
- Asset paths в `head.html`: используйте алиасы (`@js`, `@styles`, `@img`) или root-absolute `/...`.

---

## Команды

```bash
npm install
npm run dev
npm run build
```

---

Если нужно, могу: автоматом заменить все include/asset пути на алиасы по всему проекту; добавить `npm run check:build` для CI; или добавить секцию в `README.md`.

Конец документации.
