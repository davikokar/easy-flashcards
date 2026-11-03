import { categoryPalette, colors } from '../src/theme';
import {
  brightnessStops,
  CATEGORY_MIN_CONTRAST,
  contrastRatio,
  hexToHsv,
  hsvToHex,
  hueSpectrumStops,
  isHexColor,
  isPaletteColor,
  meetsCategoryContrast,
  saturationStops,
} from '../src/utils/color';

describe('isHexColor', () => {
  it('accepts #rrggbb in either case', () => {
    expect(isHexColor('#a1B2c3')).toBe(true);
  });

  it('rejects short, alpha, unprefixed and non-hex strings', () => {
    expect(isHexColor('#abc')).toBe(false);
    expect(isHexColor('#aabbccdd')).toBe(false);
    expect(isHexColor('aabbcc')).toBe(false);
    expect(isHexColor('#gggggg')).toBe(false);
    expect(isHexColor('')).toBe(false);
  });
});

describe('hsvToHex', () => {
  it('gives the primary and secondary colours at full saturation and brightness', () => {
    expect(hsvToHex({ h: 0, s: 1, v: 1 })).toBe('#ff0000');
    expect(hsvToHex({ h: 60, s: 1, v: 1 })).toBe('#ffff00');
    expect(hsvToHex({ h: 120, s: 1, v: 1 })).toBe('#00ff00');
    expect(hsvToHex({ h: 180, s: 1, v: 1 })).toBe('#00ffff');
    expect(hsvToHex({ h: 240, s: 1, v: 1 })).toBe('#0000ff');
    expect(hsvToHex({ h: 300, s: 1, v: 1 })).toBe('#ff00ff');
  });

  it('gives greys when saturation is 0, whatever the hue', () => {
    expect(hsvToHex({ h: 200, s: 0, v: 1 })).toBe('#ffffff');
    expect(hsvToHex({ h: 200, s: 0, v: 0.5 })).toBe('#808080');
  });

  it('gives black when brightness is 0, whatever the hue and saturation', () => {
    expect(hsvToHex({ h: 90, s: 1, v: 0 })).toBe('#000000');
  });

  it('returns lowercase, zero-padded hex', () => {
    expect(hsvToHex({ h: 0, s: 1, v: 0.01 })).toBe('#030000');
    expect(hsvToHex({ h: 210, s: 0.5, v: 1 })).toMatch(/^#[0-9a-f]{6}$/);
  });

  it('treats hue 360 as hue 0 and wraps a negative hue', () => {
    expect(hsvToHex({ h: 360, s: 1, v: 1 })).toBe('#ff0000');
    expect(hsvToHex({ h: -60, s: 1, v: 1 })).toBe('#ff00ff');
  });

  it('clamps saturation and brightness to 0..1', () => {
    expect(hsvToHex({ h: 0, s: 2, v: 2 })).toBe('#ff0000');
    expect(hsvToHex({ h: 0, s: -1, v: -1 })).toBe('#000000');
  });
});

describe('hexToHsv', () => {
  it('reads the primary colours', () => {
    expect(hexToHsv('#ff0000')).toEqual({ h: 0, s: 1, v: 1 });
    expect(hexToHsv('#00ff00')).toEqual({ h: 120, s: 1, v: 1 });
    expect(hexToHsv('#0000ff')).toEqual({ h: 240, s: 1, v: 1 });
  });

  it('reads greys as hue 0 and saturation 0', () => {
    expect(hexToHsv('#ffffff')).toEqual({ h: 0, s: 0, v: 1 });
    expect(hexToHsv('#000000')).toEqual({ h: 0, s: 0, v: 0 });
  });

  it('accepts uppercase hex', () => {
    expect(hexToHsv('#FF0000')).toEqual(hexToHsv('#ff0000'));
  });

  it('keeps hue in [0, 360) for a colour just short of red', () => {
    const { h } = hexToHsv('#ff0001');

    expect(h).toBeGreaterThanOrEqual(0);
    expect(h).toBeLessThan(360);
  });

  it('throws on a string that is not #rrggbb', () => {
    expect(() => hexToHsv('#abc')).toThrow(RangeError);
    expect(() => hexToHsv('red')).toThrow(RangeError);
  });
});

describe('hsvToHex and hexToHsv together', () => {
  it('round-trips every palette colour', () => {
    for (const color of categoryPalette) {
      expect(hsvToHex(hexToHsv(color))).toBe(color);
    }
  });

  it('round-trips a grid of colours across the whole RGB cube', () => {
    for (let r = 0; r <= 255; r += 17) {
      for (let g = 0; g <= 255; g += 17) {
        for (let b = 0; b <= 255; b += 17) {
          const hex = `#${[r, g, b].map(c => c.toString(16).padStart(2, '0')).join('')}`;

          expect(hsvToHex(hexToHsv(hex))).toBe(hex);
        }
      }
    }
  });

  it('round-trips a colour whose channels are not multiples of 17', () => {
    expect(hsvToHex(hexToHsv('#7b3fa9'))).toBe('#7b3fa9');
  });

  it('lowercases an uppercase colour', () => {
    expect(hsvToHex(hexToHsv('#7B3FA9'))).toBe('#7b3fa9');
  });
});

describe('contrastRatio', () => {
  it('is 21 for black on white', () => {
    expect(contrastRatio('#000000', '#ffffff')).toBeCloseTo(21, 5);
  });

  it('is 1 for a colour against itself', () => {
    expect(contrastRatio('#736df3', '#736df3')).toBeCloseTo(1, 5);
  });

  it('does not depend on argument order', () => {
    expect(contrastRatio('#736df3', colors.background)).toBeCloseTo(
      contrastRatio(colors.background, '#736df3'),
      10,
    );
  });

  it('matches the published ratio for #767676 on white', () => {
    expect(contrastRatio('#767676', '#ffffff')).toBeCloseTo(4.54, 2);
  });

  it('ignores the case of the hex digits', () => {
    expect(contrastRatio('#ABCDEF', '#000000')).toBeCloseTo(contrastRatio('#abcdef', '#000000'), 10);
  });

  it('throws on a string that is not #rrggbb', () => {
    expect(() => contrastRatio('#fff', '#000000')).toThrow(RangeError);
  });
});

describe('meetsCategoryContrast', () => {
  it('uses a 4.5:1 bar', () => {
    expect(CATEGORY_MIN_CONTRAST).toBe(4.5);
  });

  it('passes a colour just above 4.5:1', () => {
    expect(meetsCategoryContrast('#767676', '#ffffff')).toBe(true);
  });

  it('fails a colour just below 4.5:1', () => {
    expect(meetsCategoryContrast('#777777', '#ffffff')).toBe(false);
  });

  it('fails a dark colour on the app background', () => {
    expect(meetsCategoryContrast('#1a1d24', colors.background)).toBe(false);
  });

  it('fails, rather than throws, for a string that is not #rrggbb', () => {
    expect(meetsCategoryContrast('#fff', colors.background)).toBe(false);
    expect(meetsCategoryContrast('#ffffff', 'white')).toBe(false);
  });

  it('passes every category palette colour against colors.background', () => {
    for (const color of categoryPalette) {
      expect(meetsCategoryContrast(color, colors.background)).toBe(true);
    }
  });
});

describe('isPaletteColor', () => {
  it('finds a palette colour regardless of case', () => {
    expect(isPaletteColor('#ED6E6E', categoryPalette)).toBe(true);
    expect(isPaletteColor('#ed6e6e', categoryPalette)).toBe(true);
  });

  it('does not find a colour outside the palette', () => {
    expect(isPaletteColor('#ed6e6f', categoryPalette)).toBe(false);
  });

  it('compares against an upper-case palette entry too', () => {
    expect(isPaletteColor('#aabbcc', ['#AABBCC'])).toBe(true);
  });

  it('finds nothing in an empty palette', () => {
    expect(isPaletteColor('#aabbcc', [])).toBe(false);
  });
});

describe('hueSpectrumStops', () => {
  it('runs red, yellow, green, cyan, blue, magenta, red by default', () => {
    expect(hueSpectrumStops()).toEqual([
      '#ff0000',
      '#ffff00',
      '#00ff00',
      '#00ffff',
      '#0000ff',
      '#ff00ff',
      '#ff0000',
    ]);
  });

  it('returns steps + 1 stops', () => {
    expect(hueSpectrumStops(12)).toHaveLength(13);
  });

  it('treats a steps value below 1 as 1', () => {
    expect(hueSpectrumStops(0)).toHaveLength(2);
  });
});

describe('saturationStops', () => {
  it('runs from grey to the full colour at the given hue and brightness', () => {
    expect(saturationStops({ h: 0, v: 1 })).toEqual(['#ffffff', '#ff0000']);
    expect(saturationStops({ h: 0, v: 0.5 })).toEqual(['#808080', '#800000']);
  });

  it('returns steps + 1 stops, with the middle stop halfway', () => {
    expect(saturationStops({ h: 0, v: 1 }, 2)).toEqual(['#ffffff', '#ff8080', '#ff0000']);
  });
});

describe('brightnessStops', () => {
  it('runs from black to the full colour at the given hue and saturation', () => {
    expect(brightnessStops({ h: 240, s: 1 })).toEqual(['#000000', '#0000ff']);
    expect(brightnessStops({ h: 240, s: 0 })).toEqual(['#000000', '#ffffff']);
  });

  it('returns steps + 1 stops, with the middle stop halfway', () => {
    expect(brightnessStops({ h: 240, s: 1 }, 2)).toEqual(['#000000', '#000080', '#0000ff']);
  });
});
