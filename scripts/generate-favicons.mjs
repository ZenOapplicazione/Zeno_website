import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public');
const logoPath = join(publicDir, 'favicon-new.png');

async function generateFavicons() {
  console.log('Generating favicons from favicon-new.png...');

  // Generate favicon-16x16.png
  await sharp(logoPath)
    .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(publicDir, 'favicon-16x16.png'));
  console.log('Created favicon-16x16.png');

  // Generate favicon-32x32.png
  await sharp(logoPath)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(publicDir, 'favicon-32x32.png'));
  console.log('Created favicon-32x32.png');

  // Generate apple-touch-icon.png (180x180)
  await sharp(logoPath)
    .resize(180, 180, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(publicDir, 'apple-touch-icon.png'));
  console.log('Created apple-touch-icon.png');

  // Generate android-chrome icons
  await sharp(logoPath)
    .resize(192, 192, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(publicDir, 'android-chrome-192x192.png'));
  console.log('Created android-chrome-192x192.png');

  await sharp(logoPath)
    .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(publicDir, 'android-chrome-512x512.png'));
  console.log('Created android-chrome-512x512.png');

  // Generate favicon.ico (as PNG - browsers accept png)
  await sharp(logoPath)
    .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toFile(join(publicDir, 'favicon.ico'));
  console.log('Created favicon.ico');

  // Generate favicon.svg from PNG
  const pngBuffer = await sharp(logoPath)
    .resize(64, 64, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const base64 = pngBuffer.toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="64" height="64"><image width="64" height="64" xlink:href="data:image/png;base64,${base64}"/></svg>`;
  const { writeFileSync } = await import('fs');
  writeFileSync(join(publicDir, 'favicon.svg'), svg);
  console.log('Created favicon.svg');

  console.log('\nAll favicons generated successfully!');
}

generateFavicons().catch(console.error);