// import path from 'path';
// const projectName = path.basename(path.resolve()).toLowerCase();

export default {
  // минимальная конфигурация, используемая плагинами postHTML
  lang: 'ua',
  // HTML beautify removed — formatting is handled by Prettier
  // алиасы для include/fetch/replaceAliases
  aliases: {
    '@components': 'src/components',
    '@includes': 'src/includes',
    '@js': 'src/js',
    '@styles': 'src/styles',
    '@fonts': 'src/assets/fonts',
    '@img': 'src/assets/img',
    '@video': 'src/assets/video',
    '@files': 'src/files',
    '@pug': 'src/pug',
  },
};
