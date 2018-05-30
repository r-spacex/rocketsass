module.exports = {
  /**
   * Converts a config comment key-value map into a config object
   * @param {string[]} configItems
   * @param {string} filepath the path to the file being compiled
   */
  mapConfig(configItems, filepath) {
    const config = {};
    config.target = filepath;
    configItems.forEach((item) => {
      const pair = item.trim().split('=');
      if (pair.length === 2) {
        const key = pair[0].trim();
        const value = pair[1].trim();
        if (!Number.isNaN(Number(value))) {
          config[key] = Number(value);
        } else {
          // Resolve booleans
          config[key] = value === 'true' || (value === 'false' ? false : value);
        }
      }
    });
    return config;
  },

  /**
   * Truncates or pads a string to a fixed length
   * @param {string} str
   * @param {number} length
   */
  fixedLengthString(str, length) {
    if (str.length > length) return `${str.substring(0, length - 2)}...`;
    return str.padEnd(length);
  },
};
