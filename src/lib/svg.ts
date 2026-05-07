/**
 * Fetches an SVG from a URL and returns its content as an inline string.
 * This allows CSS to style the SVG (stroke, fill, etc).
 */
export async function fetchSvgInline(url: string | undefined | null): Promise<string> {
  if (!url) return '';
  try {
    const res = await fetch(url);
    if (!res.ok) return '';
    const text = await res.text();
    // Only return if it's actually SVG content
    if (text.includes('<svg')) return text;
    return '';
  } catch {
    return '';
  }
}
