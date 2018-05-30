const fs = require('fs');
const eol = require('os').EOL;
const syspath = require('path');
const sass = require('node-sass');
const util = require('./src/util');
require('colors');

function relativePath(path) {
  return syspath.relative(process.cwd(), path);
}

/**
 * A smart sass compiler
 * @module r-spacex/rocketsass
 */
module.exports = {
  /**
   * Enum for Sass compilation output styles.
   * @readonly
   * @enum {OutputStyle}
   */
  OutputStyle: {
    /** Sass's nested output style (the default) */
    NESTED: 'nested',
    /** Sass's expanded output style */
    EXPANDED: 'expanded',
    /** Sass's compact output style */
    COMPACT: 'compact',
    /** Sass's compressed output style */
    COMPRESSED: 'compressed',
  },

  /**
   * Reads a configuration from the header of a CSS file.
   * @param {string} filepath The path to the file to be read from.
   * @param {configCallback} callback - The callback that handles the read configuration.
   */
  readConfig(filepath, callback) {
    fs.readFile(filepath, (err, data) => {
      if (err) { callback(err, null); return; }

      // Read comment
      const firstComment = data.toString().split('*/')[0];
      if (firstComment.startsWith('/*')) {
        // First line is a comment
        const configString = firstComment.slice(2).replace(eol, '').trim(); // Slice out comment marker
        const configItems = configString.split(','); // Split into array of items, denotated by commas

        callback(null, util.mapConfig(configItems, filepath));
        return;
      }
      callback(new Error(`First line in ${filepath} is not a block-style comment`), null);
    });
  },

  /**
   * Takes a list of files and reads configs from them
   * @param {string} path The path where the files to read configs from are stored
   * @param {string[]} files The list of file names to compile
   * @param {function} callback Callback called with error and array of configs
   * @returns {object[]} An array of all the configurations for each file.
   */
  getAllConfigs(path, files, callback) {
    const configs = [];
    files.forEach((filename, index) => {
      this.readConfig(syspath.join(path, filename), (err, config) => {
        if (err) throw err;
        configs.push(config);
        if (index === (files.length - 1)) { callback(configs); }
      });
    });
  },

  /**
   * @callback configCallback
   * @param {Error} err - The error thrown, if any.
   * @param {Object} config - The config object if read succesfully
   */

  /**
   * @typedef CompileOptions
   * @property {string} ignorePrefix - If the filename starts with this, do not compile.
   * @property {OutputStyle} style - The default style for the CSS output
   * @property {string} projectDir - The project root directory
   */

  /**
   * Compiles sass files from a directory to targets using config headers
   * @param {string[]} paths An array of paths to the directory where Sass files are stored
   * @param {CompileOptions} options Compilation options
   * @param {Console} logger The output to log items, e.g. `console`
   */
  compile(paths, options, logger) {
    const logCondition = (logger != null && !options.silent);
    const defaultStyle = options.style || 'nested';
    paths.forEach((path) => {
      fs.readdir(path, (err, files) => {
        if (err) throw err;
        const fileList = [];
        files.forEach((filename) => {
          if (!filename.startsWith(options.ignorePrefix || '_') &&
          (filename.endsWith('.scss') || filename.endsWith('.sass'))) fileList.push(filename);
        });

        this.getAllConfigs(path, fileList, (configs) => {
          if (logCondition) logger.log(`Compiling Sass from ${path} with ${options.style.green} style...`);
          configs.forEach((config) => {
            // Skip files without compileDest
            if (typeof config.compileDest === 'undefined') {
              if (logCondition) logger.error(`File '${config.target}' does not include compileDest, skipping...`.red);
              return;
            }

            let destination =
              (options.projectDir != null ?
                relativePath(syspath.resolve(options.projectDir, config.compileDest))
                : config.compileDest);
            if (config.relativePath) {
              destination = syspath.resolve(syspath.dirname(config.target), config.compileDest);
            }

            const outputStyle = config.style || defaultStyle;
            sass.render({
              file: config.target,
              outFile: destination,
              outputStyle,
              sourceMap: true,
            }, (sassErr, result) => {
              if (sassErr) throw sassErr;
              const styleClause = (outputStyle === defaultStyle) ? '' : ` with ${outputStyle} style`.green;
              if (logCondition) {
                logger.log(`${util.fixedLengthString(relativePath(config.target), 40)} ${'->'.cyan}  ${relativePath(destination)}${styleClause}`);
              }
              if (!sassErr) {
                fs.writeFile(destination, result.css, (writeErr) => {
                  if (writeErr) {
                    if (logCondition) {
                      logger.error(`Write failed to ${destination}`, writeErr);
                    }
                    throw writeErr;
                  }
                });
              }
            });
          });
        });
      });
    });
  },
};
