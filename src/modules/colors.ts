export function formatHex(input: string) {
  const color = input.replace('#', '');
  let hex = color;

  if (color.length === 3 || color.length === 4) {
    hex = '';

    [...color].forEach(d => {
      hex += `${d}${d}`;
    });
  }

  hex = `#${hex}`;

  return hex;
}

export function getTextColor(input: string) {
  return getYiq(input) > 135 ? '#000' : '#fff';
}

export function getYiq(color: string) {
  if (!isValidHex(color)) {
    return 0;
  }

  const { blue, green, red } = hexToRGB(color);

  return (red * 299 + green * 587 + blue * 114) / 1000;
}

export function hexToRGB(input: string) {
  if (!isValidHex(input)) {
    return {
      red: 0,
      green: 0,
      blue: 0,
    };
  }

  const hex = formatHex(input).replace('#', '');

  return {
    red: parseInt(String(hex.charAt(0)) + hex.charAt(1), 16),
    green: parseInt(String(hex.charAt(2)) + hex.charAt(3), 16),
    blue: parseInt(String(hex.charAt(4)) + hex.charAt(5), 16),
  };
}

export function hexToRGBA(input: string, alpha?: number) {
  const { blue, green, red } = hexToRGB(input);

  return `rgba(${red}, ${green}, ${blue}${alpha ? `, ${alpha}` : ''})`;
}

export function isValidHex(input: string) {
  return /^#([\dA-Fa-f]{6}|[\dA-Fa-f]{3})$/.test(input);
}
