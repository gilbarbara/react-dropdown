import { formatHex, getTextColor, getYiq, hexToRGB, hexToRGBA } from '~/modules/colors';

describe('formatHex', () => {
  it('should format a 3 digit hex', () => {
    expect(formatHex('#f04')).toBe('#ff0044');
  });
});

describe('getTextColor', () => {
  it('should return white for dark colors', () => {
    expect(getTextColor('#000')).toBe('#fff');
  });

  it('should return black for light colors', () => {
    expect(getTextColor('#fff')).toBe('#000');
  });
});

describe('getYiq', () => {
  it('should return a number', () => {
    expect(getYiq('#000')).toBe(0);
    expect(getYiq('#fff')).toBe(255);
  });

  it('should return 0 for invalid colors', () => {
    expect(getYiq('invalid')).toBe(0);
  });
});

describe('hexToRGB', () => {
  it('should return a rgb object', () => {
    expect(hexToRGB('#f04')).toEqual({
      blue: 68,
      green: 0,
      red: 255,
    });
  });

  it('should return a rgb object for invalid colors', () => {
    expect(hexToRGB('invalid')).toEqual({
      blue: 0,
      green: 0,
      red: 0,
    });
  });
});

describe('hexToRGBA', () => {
  it('should return a rgba string', () => {
    expect(hexToRGBA('#f04')).toBe('rgba(255, 0, 68)');
  });

  it('should return a rgba string with alpha', () => {
    expect(hexToRGBA('#f04', 0.5)).toBe('rgba(255, 0, 68, 0.5)');
  });
});
