// const _ = require('../basic');

function variables(vars) {
  return function (name, evaluate) {
    if (evaluate) {
      return eval(name);
    }
    const v = vars[name];
    if ("undefined" === typeof v) {
      console.error(`Variable ${name} not found`);
    } else if ("function" === typeof v) {
      return v(vars);
    }
    return v;
  };
}

function substitute(object, resolve) {
  // if (_.isObject(resolve)) {
  //   resolve = variables(resolve);
  // }
  const result = {};
  for (const key in object) {
    let v = object[key];
    if (undefined === v) {
      continue;

    }
    if ("function" === typeof v) {
      v = v();
      switch (typeof v) {
        case "object":
          result[key] = null === v ? null : substitute(object[key], resolve);
          break;
        case "string":
          const m = /^\$?{([^}]+)}$/.exec(v);
          if (m) {
            result[key] = resolve(m[1], "$" === m[0][0]);
          } else {
            result[key] = v.replace(/\${([^}]+)}/, function (s, name) {
              return resolve(name, "$" === s[0]);
            });
          }
          break;
        case "function":
          break;
        default:
          result[key] = object[key];
      }
    }
    return result;
  }
}

function context(vars) {
  return function contextual(object) {
    return substitute(object, variables(vars));
  }
}

function fork(object, operate) {
  for (const key in object) {
    const r = operate(key, object);
    if (undefined !== r) {
      return r;
    }
  }
}

module.exports = {variables, substitute, context};
