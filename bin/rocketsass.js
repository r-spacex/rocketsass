#!/usr/bin/env node
/* eslint no-console: off */
const program = require('commander');
const pkg = require('../package.json');
const rocketsass = require('../');
const colors = require('colors');
const findUp = require('find-up');
const syspath = require('path');
const yaml = require('read-yaml');

let pathValue = ['./css/scss/'];
let rcOptions = {};

const rcPath = findUp.sync('.rocketsass.yml');
if (rcPath != null) {
  rcOptions = yaml.sync(rcPath);
  console.log(pathValue);
  pathValue = rcOptions.paths.map((x) => {
    if (syspath.isAbsolute(x)) {
      return x;
    }
    return syspath.resolve(syspath.dirname(rcPath), x);
  });
  console.log(pathValue);
}

program
  .version(pkg.version)
  .option('-i, --ignore [prefix]', 'Files starting with this string should be ignored for compilation. By default "_"')
  .option('-s, --style [style]', 'The CSS output should have this Sass output style. By default "nested".')
  .option('-q, --silent', "Don't output anything. By default `false`.")
  .arguments('[path...]')
  .action((path) => {
    pathValue = path || pathValue;
  });

program.parse(process.argv);

try {
  rocketsass.compile(pathValue, {
    ignorePrefix: program.ignore || rcOptions.ignore || '_',
    style: program.style || rcOptions.style || rocketsass.OutputStyle.NESTED,
    silent: program.silent || false,
  }, console);
} catch (error) {
  console.error(colors.red(error));
  process.exit(1);
}
