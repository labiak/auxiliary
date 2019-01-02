const _ = require('../basic');

function arrayMerge(target, source) {
  if (target) {
    if (source) {
      target.push(...source);
      target = _.uniq(target);
    }
    return target;
  } else {
    return source;
  }
}

function merge(target, source, options = {}) {
  if (source instanceof Array) {
    if (target instanceof Array) {
      return (options.arrayMerge || arrayMerge)(target, source);
    }
    return source;
  } else if (source instanceof Array) {
    return target;
  }
  for (const key in source) {
    const s = source[key];
    const t = target[key];
    if (_.isObject(s) && _.isObject(t)) {
      target[key] = merge(t, s, options);
    } else {
      target[key] = s;
    }
  }
  return target;
}

merge.all = function([target, ...sources], options) {
  for (const source of sources) {
    target = merge(target, source, options);
  }
  return target;
};

module.exports = {merge, arrayMerge};
