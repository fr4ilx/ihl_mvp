// Builds dist/index.html: one file with React, the app, fonts and images inlined. Works offline.
// dist/v1.html is the same file opening on V1 (the app without the seeker round). index.html opens on V2.
//   npm run build        one build
//   npm run dev          rebuild on every change
import * as esbuild from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';

const watch = process.argv.includes('--watch');
const font = (p) => fs.readFileSync(p).toString('base64');
const fontCSS = `
@font-face { font-family: 'Tenor Sans'; font-style: normal; font-weight: 400; font-display: block; src: url(data:font/woff2;base64,${font('node_modules/@fontsource/tenor-sans/files/tenor-sans-latin-400-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'PT Sans'; font-style: normal; font-weight: 400; font-display: block; src: url(data:font/woff2;base64,${font('node_modules/@fontsource/pt-sans/files/pt-sans-latin-400-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'PT Sans'; font-style: normal; font-weight: 700; font-display: block; src: url(data:font/woff2;base64,${font('node_modules/@fontsource/pt-sans/files/pt-sans-latin-700-normal.woff2')}) format('woff2'); }
@font-face { font-family: 'Mrs Saint Delafield'; font-style: normal; font-weight: 400; font-display: block; src: url(data:font/woff2;base64,${font('node_modules/@fontsource/mrs-saint-delafield/files/mrs-saint-delafield-latin-400-normal.woff2')}) format('woff2'); }
`;

async function build() {
  const result = await esbuild.build({
    entryPoints: ['src/main.jsx'],
    bundle: true,
    minify: true,
    write: false,
    format: 'iife',
    target: ['chrome110', 'safari16', 'firefox115'],
    jsx: 'automatic',
    loader: { '.jpg': 'dataurl', '.png': 'dataurl', '.webp': 'dataurl', '.js': 'jsx' },
    define: { 'process.env.NODE_ENV': '"production"' },
    logLevel: 'warning',
  });
  const js = result.outputFiles[0].text;
  const css = fs.readFileSync('src/styles.css', 'utf8');
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Indy Holistic Living · Prototype</title>
<meta name="description" content="Interactive iOS prototype for Indy Holistic Living. Built from the Figma tokens and components.">
<style>${fontCSS}${css}</style>
</head>
<body>
<div id="root"></div>
<script>${js.replace(/<\/script/g, '<\\/script')}</script>
</body>
</html>`;
  fs.mkdirSync('dist', { recursive: true });
  fs.writeFileSync('dist/index.html', html);
  const v1 = html
    .replace('<title>Indy Holistic Living · Prototype</title>', '<title>Indy Holistic Living · Prototype V1</title>')
    .replace('<div id="root"></div>', '<div id="root"></div>\n<script>window.IHL_VERSION = 1</script>');
  fs.writeFileSync('dist/v1.html', v1);
  console.log(`dist/index.html and dist/v1.html  ${(html.length / 1024 / 1024).toFixed(2)} MB each`);
}

await build();
if (watch) {
  console.log('Watching src/ ...');
  let t;
  fs.watch('src', { recursive: true }, () => { clearTimeout(t); t = setTimeout(() => build().catch((e) => console.error(e.message)), 120); });
}
