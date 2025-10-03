import named from 'colors-named';
import hex from 'colors-named-hex';
/**
 * Extended color keywords
 * https://www.w3.org/TR/css-color-3/#svg-color
 */
export var colorKeywords = named.reduce((obj, key, index) => {
  obj[key] = hex[index];
  return obj;
}, {});
export var baseNamed = ['aqua', 'black', 'blue', 'fuchsia', 'gray', 'green', 'lime', 'maroon', 'navy', 'olive', 'purple', 'red', 'silver', 'teal', 'white', 'yellow'];
export var colorKeywordsBase = baseNamed.reduce((obj, key) => {
  obj[key] = colorKeywords[key];
  return obj;
}, {});
export default function colorNameToHex(name) {
  return colorKeywords[name];
}