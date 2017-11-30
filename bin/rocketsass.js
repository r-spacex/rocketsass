#!/usr/bin/env node

const program = require('commander');
const pkg = require('../package.json');
const rocketsass = require('../');

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

let ignorePrefixVal = program.ignore || '_';
let styleVal = program.style || rocketsass.OutputStyle.NESTED;


rocketsass.compile(pathValue, {
  ignorePrefix: ignorePrefixVal,
  style: styleVal
});
