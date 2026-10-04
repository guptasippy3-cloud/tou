import { mkdir, readFile, writeFile, cp, copyFile, rm } from 'node:fs/promises';
import { build } from 'esbuild';
await mkdir('www/public/fonts', { recursive: true });
let html = await readFile('index.html', 'utf8');
html = html.replace(/style\.css\?v=\d+/g, 'style.css').replace(/<script src="app\.js\?v=\d+"><\/script>/, '<script src="native.js"></script>');
await writeFile('www/index.html', html);
let css = await readFile('style.css', 'utf8');
css = css.replace(/^@import[^\n]*\n?/, '');
const fonts = [];
for (const [name, family, weights] of [['dm-sans','DM Sans',[400,500,600,700]],['manrope','Manrope',[400,500,600,700,800]]]) {
  for (const weight of weights) {
    const file = `${name}-latin-${weight}-normal.woff2`;
    await copyFile(`node_modules/@fontsource/${name}/files/${file}`, `www/public/fonts/${file}`);
    fonts.push(`@font-face{font-family:'${family}';font-style:normal;font-weight:${weight};font-display:swap;src:url('public/fonts/${file}') format('woff2')}`);
  }
}
await writeFile('www/style.css', fonts.join('\n') + '\n' + css);
for (const file of ['pip-voice.mp3','pip-voice-clean.wav']) await rm(`www/public/audio/${file}`, { force: true });
await cp('public', 'www/public', { recursive: true, filter: path => !/pip-voice(?:-clean)?\.(?:mp3|wav)$/.test(path) });
await copyFile('app.js','www/app.js');
await copyFile('manifest.webmanifest','www/manifest.webmanifest');
await build({entryPoints:['scripts/native-entry.js'],bundle:true,outfile:'www/native.js',format:'iife',target:'chrome110'});
console.log('Bundled Tou, local fonts, artwork and recordings for Android and iOS.');
