import fs from 'node:fs';
import path from 'node:path';

/**
 * Reads a local SVG file from public/images/ and returns its content as an inline string.
 */
export function readLocalSvg(filename: string | null | undefined): string {
  if (!filename) return '';
  try {
    const filePath = path.join(process.cwd(), 'public', 'images', filename);
    const content = fs.readFileSync(filePath, 'utf-8');
    return content.includes('<svg') ? content : '';
  } catch {
    return '';
  }
}
