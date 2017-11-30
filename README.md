# RocketSass
A smart Sass compiler that compiles each file to a specific target destination.

## Installation
For installing for use as a command line utility, install globally:

```bash
$ npm install -g rocketsass
```

To install for use in node scripts, install locally as a development dependency:

```bash
$ npm install --save-dev rocketsass
```

Or as a standard dependency:
```bash
$ npm install --save rocketsass
```

## Usage
In each Sass/SCSS file, add a comment header that looks like this:

```scss
/* compileDest = ./out/css/style.css */
```

You can also add options separated by commas:

```scss
/* compileDest = ./out/css/style.css, style = compressed */
```

**It must all be on the first line.**

Then, simply run `rocketsass` from the command line:

```bash
$ rocketsass [path]
```

where `[path]` is the path to your sass directory, eg. `./scss/`. The default path is `./css/scss/`.

### Usage from scripts

```js
// Import RocketSass
const rocketsass = require('rocketsass');

// Compile all sass files in a directory
rocketsass.compile('./scss/', {
  // Ignore files starting with this string, optional
  ignore: '_',
  // CSS output style (see below), optional
  style: 'nested'
});

```

## Options
By default, RocketSass ignores Sass/SCSS files starting with '\_'. You can override that by passing the option `-i` or `--include`.

```bash
$ rocketsass [path] -i ''           # Include all files
$ rocketsass [path] -i exclude_     # Ignore all files starting with 'exclude_'
$ rocketsass [path] -i '.'          # Ignore dotfiles
```

Passing `rocketsass` the option `-s` or `--style` can also set the output style of the CSS which takes one of the standard Sass output styles. This value overridden by the style set in a file's header. By default, the style is `nested`.
