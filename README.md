# smartsass
A smart Sass compiler that compiles each file to a specific target destination.

## Usage
In each Sass/SCSS file, add a comment header that looks like this:

```scss
/* compileDest = ./out/css/style.css */
```

**It must be on the first line.**

Then, simply run `smartsass` from the command line:

```bash
$ smartsass [path]
```

where `[path]` is the path to your sass directory, eg. `./scss/`. The default path is `./css/scss/`.

## Options
By default, `smartsass` ignores Sass/SCSS files starting with '\_'. You can override that by passing the option `-i`.

| Files to include  | Command           |
| ----------------- | ----------------- |
| Include all files | `smartsass [path] -i ''` |
| Ignore files starting with "exclude_"  | `smartsass [path] -i exclude_` |
| Ignore dotfiles:  | `smartsass [path] -i '.'`|
