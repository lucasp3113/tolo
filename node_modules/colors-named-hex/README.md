colors-named-hex
===

[![Buy me a coffee](https://img.shields.io/badge/Buy%20me%20a%20coffee-048754?logo=buymeacoffee)](https://jaywcjlove.github.io/#/sponsor)
[![Build & Deploy](https://github.com/jaywcjlove/colors-named-hex/actions/workflows/ci.yml/badge.svg)](https://github.com/jaywcjlove/colors-named-hex/actions/workflows/ci.yml)
[![Open in unpkg](https://img.shields.io/badge/Open%20in-unpkg-blue)](https://uiwjs.github.io/npm-unpkg/#/pkg/colors-named-hex/file/README.md)
[![npm version](https://img.shields.io/npm/v/colors-named-hex.svg)](https://www.npmjs.com/package/colors-named-hex)
[![Coverage Status](https://jaywcjlove.github.io/colors-named-hex/badges.svg)](https://jaywcjlove.github.io/colors-named-hex/lcov-report/)

A array with color name -> Hex rgb. Based on https://www.w3.org/TR/css-color-4/#colors-named

## Installation

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c): Node 12+ is needed to use it and it must be import instead of require.

```bash
npm install colors-named-hex
```

If you still want to use in CommonJS, you can use dynamic `import()` to load.

```js
const named = await import('colors-named-hex');

// Fix compiling in typescript.
// https://github.com/microsoft/TypeScript/issues/43329#issuecomment-922544562
const named = await (Function('return import("colors-named-hex")')()) as Promise<typeof import("colors-named-hex")>;
```

## Usage

```js
import hexData from "colors-named-hex";

console.log(hexData)                       // => ["#F0F8FF", "#FAEBD7", "#00FFFF", "#7FFFD4", ... ]
console.log(hexData.includes('#87CEEB'))   // => true
console.log(hexData.length)                // => 148
console.log(names.indexOf('#9ACD32'))      // => 147
```

```js
'colors-named'                'colors-named-hex'          'colors-named-decimal'
===============              ===================         =====================
const named = [                const hexs = [             const hexs = [
  'aliceblue',         ->        '#F0F8FF',       ->        [240, 248, 255],
  'antiquewhite',      ->        '#FAEBD7',       ->        [250, 235, 215],
  'aqua',              ->        '#00FFFF',       ->        [0, 255, 255],
  'aquamarine',        ->        '#7FFFD4',       ->        [127, 255, 212],
  'azure',             ->        '#F0FFFF',       ->        [240, 255, 255],
  'beige',             ->        '#F5F5DC',       ->        [245, 245, 220],
  'bisque',            ->        '#FFE4C4',       ->        [255, 228, 196],
  'black',             ->        '#000000',       ->        [0, 0, 0],
  'blanchedalmond',    ->        '#FFEBCD',       ->        [255, 235, 205],
  'blue',              ->        '#0000FF',       ->        [0, 0, 255],
  'blueviolet',        ->        '#8A2BE2',       ->        [138, 43, 226],
  'brown',             ->        '#A52A2A',       ->        [165, 42, 42],
  ...                  ->        ...              ->        ...
];                             ];                         ];
```

```js
import hexs from "colors-named-hex";
import named from "colors-named";
import decimal from "colors-named-decimal";

decimal[named.indexOf('aliceblue')] // => [240, 248, 255]
decimal[named.indexOf('red')]       // => [255, 0, 0]
decimal[named.indexOf('black')]     // => [0, 0, 0]

hexs[named.indexOf('aliceblue')] // => #F0F8FF
hexs[named.indexOf('red')]       // => #FF0000
hexs[named.indexOf('black')]     // => #000000
```

## API

```ts
/**
 * A array with color names. Based on https://www.w3.org/TR/css-color-4/#named-colors
 */
declare const hexs: readonly ["#F0F8FF", "#FAEBD7", "#00FFFF", "#7FFFD4", "#F0FFFF", "#F5F5DC", "#FFE4C4","#000000",
"#FFEBCD", "#0000FF", "#8A2BE2", "#A52A2A", "#DEB887", "#5F9EA0", "#7FFF00", "#D2691E", "#FF7F50", "#6495ED",
"#FFF8DC", "#DC143C", "#00FFFF", "#00008B", "#008B8B", "#B8860B", "#A9A9A9", "#006400", "#A9A9A9", "#BDB76B",
"#8B008B", "#556B2F", "#FF8C00", "#9932CC", "#8B0000", "#E9967A", "#8FBC8F", "#483D8B", "#2F4F4F", "#2F4F4F",
"#00CED1", "#9400D3", "#FF1493", "#00BFFF", "#696969", "#696969", "#1E90FF", "#B22222", "#FFFAF0", "#228B22",
"#FF00FF", "#DCDCDC", "#F8F8FF", "#FFD700", "#DAA520", "#808080", "#008000", "#ADFF2F", "#808080", "#F0FFF0",
"#FF69B4", "#CD5C5C", "#4B0082", "#FFFFF0", "#F0E68C", "#E6E6FA", "#FFF0F5", "#7CFC00", "#FFFACD", "#ADD8E6",
"#F08080", "#E0FFFF", "#FAFAD2", "#D3D3D3", "#90EE90", "#D3D3D3", "#FFB6C1", "#FFA07A", "#20B2AA", "#87CEFA",
"#778899", "#778899", "#B0C4DE", "#FFFFE0", "#00FF00", "#32CD32", "#FAF0E6", "#FF00FF", "#800000", "#66CDAA",
"#0000CD", "#BA55D3", "#9370DB", "#3CB371", "#7B68EE", "#00FA9A", "#48D1CC", "#C71585", "#191970", "#F5FFFA",
"#FFE4E1", "#FFE4B5", "#FFDEAD", "#000080", "#FDF5E6", "#808000", "#6B8E23", "#FFA500", "#FF4500", "#DA70D6",
"#EEE8AA", "#98FB98", "#AFEEEE", "#DB7093", "#FFEFD5", "#FFDAB9", "#CD853F", "#FFC0CB", "#DDA0DD", "#B0E0E6",
"#800080", "#663399", "#FF0000", "#BC8F8F", "#4169E1", "#8B4513", "#FA8072", "#F4A460", "#2E8B57", "#FFF5EE",
"#A0522D", "#C0C0C0", "#87CEEB", "#6A5ACD", "#708090", "#708090", "#FFFAFA", "#00FF7F", "#4682B4", "#D2B48C",
"#008080", "#D8BFD8", "#FF6347", "#40E0D0", "#EE82EE", "#F5DEB3", "#FFFFFF", "#F5F5F5", "#FFFF00", "#9ACD32"];
export default hexs;
```

## Related

- [`colors-named`](https://github.com/jaywcjlove/colors-named) A array with color names.
- [`colors-named-decimal`](https://github.com/jaywcjlove/colors-named-decimal) A array with color name -> decimal rgb.

## Contributors

As always, thanks to our amazing contributors!

<a href="https://github.com/jaywcjlove/colors-named-hex/graphs/contributors">
  <img src="https://jaywcjlove.github.io/colors-named-hex/CONTRIBUTORS.svg" />
</a>

Made with [action-contributors](https://github.com/jaywcjlove/github-action-contributors).

## License

Licensed under the MIT License.
