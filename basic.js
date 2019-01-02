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
  },

  isFunction(fun) {
    return 'function' === typeof fun;
  },

  isEmpty(obj) {
    if (!obj) {
      return true;
    }
    if ('string' === typeof obj) {
      return !obj.trim();
    }
    for(const key in obj) {
      return false;
    }
    return true;
  },

  freeze() {

  }
};
