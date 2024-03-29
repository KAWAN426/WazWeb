import { namedColor } from "../components/design/defaultStyle";
import { IColor } from "../types/design";

function colorToHex(color: number) {
  var hexadecimal = color.toString(16);
  return hexadecimal.length == 1 ? "0" + hexadecimal : hexadecimal;
}

export function rgbToHex(color: IColor | string | null | undefined) {
  if (typeof color === "string") {
    if (color in namedColor) return namedColor[color]
    if (!/^rgba?\([\d\s,]+\)$/.test(color)) {
      return "None";
    }

    let hex = "#";
    color
      .replace(/[^\d,]/g, "")
      .split(",")
      .slice(0, 3)
      .forEach((c) => {
        hex += ("0" + parseInt(c).toString(16)).slice(-2);
      });
    return hex.toUpperCase();
  } else if (color) {
    const { r, g, b } = color
    return ("#" + colorToHex(r) + colorToHex(g) + colorToHex(b)).toUpperCase();
  }
  return "None"
}

export function rgbToRgbStr(color: IColor) {
  const { r, g, b, a } = color
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (r, g, b) => (r + r + g + g + b + b));
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

export function rgbStrToRgb(colorString: string | undefined): IColor | null {
  let match = colorString?.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/i);
  if (!match) {
    if (colorString && colorString in namedColor) return hexToRgb(namedColor[colorString])
    else return null;
  }
  let rgba: { r: number, g: number, b: number, a?: number } = {
    r: parseInt(match[1]),
    g: parseInt(match[2]),
    b: parseInt(match[3])
  };
  if (match[4]) {
    rgba.a = parseFloat(match[4]);
  }
  return rgba;
}