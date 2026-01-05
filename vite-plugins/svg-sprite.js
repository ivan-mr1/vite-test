import path from 'path';
import VitePluginSvgSpritemap from '@spiriit/vite-plugin-svg-spritemap';

export const svgSpritePlugin = () => {
  const iconsPath = path
    .resolve(process.cwd(), 'src/assets/icons/monochrome/*.svg')
    .replace(/\\/g, '/');

  console.log('\n--- SVG SPRITE DEBUG ---');
  console.log('Searching for icons in:', iconsPath);
  console.log('------------------------\n');

  return [
    VitePluginSvgSpritemap(iconsPath, {
      output: {
        filename: 'spritemap.svg',
      },
      prefix: 'sprite-',
      injectSvgOnDev: true,
      svgo: {
        plugins: [
          {
            name: 'removeAttrs',
            params: {
              attrs: '(fill|stroke)',
            },
          },
        ],
      },
    }),
  ];
};
