const rocketsass = require('../');
const colors = require('colors');

try {
  rocketsass.compile(`${__dirname.replace(/\\/g, '/')}/cases/`, {
    ignorePrefix: '_',
    style: 'compact',
  });
} catch (error) {
  console.error(colors.red(error));
  process.exit(1);
}
