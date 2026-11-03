// Colour maths for the Custom colour dialog (ADR-0012 Amendment 3). Every colour string
// produced here is an opaque, lowercase `#rrggbb`.

// h is in degrees [0, 360); s and v are in [0, 1].
export type Hsv = { h: number; s: number; v: number };

// WCAG 2 contrast ratio a category's colour must reach against the icon drawn on it.
export const CATEGORY_MIN_CONTRAST = 4.5;

const HEX_COLOR = /^#[0-9a-fA-F]{6}$/;

export function isHexColor(value: string): boolean {
  return HEX_COLOR.test(value);
}

function parseRgb(hex: string): [number, number, number] {
  if (!isHexColor(hex)) {
    throw new RangeError(`Not a #rrggbb colour: ${hex}`);
  }
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function channelToHex(channel: number): string {
  return Math.round(channel * 255)
    .toString(16)
    .padStart(2, '0');
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}

// Hue wraps (360 is 0, -60 is 300); saturation and brightness are clamped.
export function hsvToHex({ h, s, v }: Hsv): string {
  const hue = (((h % 360) + 360) % 360) / 60;
  const sat = clamp01(s);
  const val = clamp01(v);
  const chroma = val * sat;
  const second = chroma * (1 - Math.abs((hue % 2) - 1));
  const base = val - chroma;

  const sector = Math.floor(hue);
  const [r, g, b] = [
    [chroma, second, 0],
    [second, chroma, 0],
    [0, chroma, second],
    [0, second, chroma],
    [second, 0, chroma],
    [chroma, 0, second],
  ][sector];

  return `#${channelToHex(r + base)}${channelToHex(g + base)}${channelToHex(b + base)}`;
}

// Greys have no hue: they read as h 0. Throws RangeError for anything but `#rrggbb`.
export function hexToHsv(hex: string): Hsv {
  const [r, g, b] = parseRgb(hex).map(channel => channel / 255);
  const max = Math.max(r, g, b);
  const delta = max - Math.min(r, g, b);

  let h = 0;
  if (delta !== 0) {
    if (max === r) {
      h = ((g - b) / delta) % 6;
    } else if (max === g) {
      h = (b - r) / delta + 2;
    } else {
      h = (r - g) / delta + 4;
    }
    h = (h * 60 + 360) % 360;
  }

  return { h, s: max === 0 ? 0 : delta / max, v: max };
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = parseRgb(hex).map(channel => {
    const c = channel / 255;
    return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// WCAG 2 contrast ratio, 1 to 21, symmetric in its arguments. Throws RangeError for a non-`#rrggbb`.
export function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

// False for a string that is not `#rrggbb`, so a half-typed colour never passes.
export function meetsCategoryContrast(color: string, background: string): boolean {
  if (!isHexColor(color) || !isHexColor(background)) {
    return false;
  }
  return contrastRatio(color, background) >= CATEGORY_MIN_CONTRAST;
}

export function isPaletteColor(color: string, palette: readonly string[]): boolean {
  const wanted = color.toLowerCase();
  return palette.some(entry => entry.toLowerCase() === wanted);
}

// The gradient helpers return `steps + 1` evenly spaced stops, first to last.
function stops(steps: number, at: (fraction: number) => string): string[] {
  const count = Math.max(1, Math.floor(steps));
  return Array.from({ length: count + 1 }, (_, i) => at(i / count));
}

// Full hue circle at full saturation and brightness; the last stop repeats the first (red).
export function hueSpectrumStops(steps = 6): string[] {
  return stops(steps, fraction => hsvToHex({ h: fraction * 360, s: 1, v: 1 }));
}

// Grey to the fully saturated colour, at the given hue and brightness.
export function saturationStops({ h, v }: Pick<Hsv, 'h' | 'v'>, steps = 1): string[] {
  return stops(steps, fraction => hsvToHex({ h, s: fraction, v }));
}

// Black to the full-brightness colour, at the given hue and saturation.
export function brightnessStops({ h, s }: Pick<Hsv, 'h' | 's'>, steps = 1): string[] {
  return stops(steps, fraction => hsvToHex({ h, s, v: fraction }));
}
