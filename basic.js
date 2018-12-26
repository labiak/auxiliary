module.exports = {
  uniq(array) {
    return array.filter((item, i) => array.indexOf(item) === i);
  },

  isObject(obj) {
    return 'object' === typeof obj && null !== obj;
  },

  strip(s) {
    return s
        .trim()
        .split(/\s*\n+\s*/)
        .join("\n");
  }
};
