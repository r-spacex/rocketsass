#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const rocketsass = require('../');
const colors = require('colors');

let pathValue = './css/scss/';

program
  .version(pkg.version)
  .option('-i, --ignore [prefix]', 'Files starting with this string should be ignored for compilation. By default "_"')
  .option('-s, --style [style]', 'The CSS output should have this Sass output style. By default "nested".')
  .arguments('[path]')
  .action((path) => {
    pathValue = path;
  });

program.parse(process.argv);

try {
  rocketsass.compile(pathValue, {
    ignorePrefix: program.ignore || '_',
    style: program.style || rocketsass.OutputStyle.NESTED,
  });
} catch (error) {
  console.error(colors.red(error));
  process.exit(1);
}
