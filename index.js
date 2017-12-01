const fs = require('fs');
const eol = require('os').EOL;
const { exec } = require('child_process');
require('colors');


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
      const firstComment = data.toString().split('*/')[0].slice(2);
      if (firstComment.startsWith('/*')) {
        // First line is a comment
        const configString = firstComment.replace(eol, '').trim(); // Slice out comment markers
        console.log(configString);
        const configItems = configString.split(','); // Split into array of items, denotated by commas

        // Convert config comment to configuration object
        const config = {};
        config.target = filepath;
        configItems.forEach((item) => {
          const pair = item.trim().split('=');
          if (pair.length === 2) {
            const key = pair[0].trim();
            const value = pair[1].trim();
            if (!isNaN(value)) {
              config[key] = Number(value);
            } else {
              config[key] = value;
            }
          }
        });
        callback(null, config);
        return;
      }
      callback(new Error('First line is not a block-style comment'), null);
    });
  },

  /**
   * Takes a list of files and compiles them
   * @param {string} path The path where the files to read configs from are stored
   * @param {string[]} files The list of file names to compile
   * @param {function} callback Callback called with error and array of configs
   * @returns {object[]} An array of all the configurations for each file.
   */
  getAllConfigs(path, files, callback) {
    const configs = [];
    files.forEach((filename, index) => {
      this.readConfig(path + filename, (err, config) => {
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
   */

  /**
   * Compiles sass files from a directory to targets using config headers
   * @param {string} path The path to the directory where Sass files are stored
   * @param {CompileOptions} options Compilation options
   */
  compile(path, options) {
    const defaultStyle = options.style || 'nested';
    fs.readdir(path, (err, files) => {
      if (err) throw err;
      const fileList = [];
      files.forEach((filename) => {
        if (!filename.startsWith(options.ignorePrefix || '_') &&
        (filename.endsWith('.scss') || filename.endsWith('.sass'))) fileList.push(filename);
      });

      this.getAllConfigs(path, fileList, (configs) => {
        console.log(`Compiling sass with ${options.style} style...`);
        configs.forEach((config) => {
          // Skip files without compileDest
          if (typeof config.compileDest === 'undefined') {
            console.error(`File '${config.target}' does not include compileDest, skipping...`.red);
            return;
          }

          const outputStyle = config.style || defaultStyle;
          exec(`sass ${config.target} ${config.compileDest} --style ${outputStyle}`, (execErr) => {
            if (execErr) throw execErr;
            const styleClause = (outputStyle === defaultStyle) ? '' : ` with ${outputStyle} style`;
            console.log(`${config.target} -> ${config.compileDest}${styleClause}`);
          });
        });
      });
    });
  },
};
