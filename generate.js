const pkg = require('./package');
const _ = require('./basic');
const utilities = require('./utilities');

module.exports = {
  "README.md"(pack = pkg) {
    return _.strip(`
    # ${pack.name}
    ${pack.description}
  `)
  }
};

if (!module.parent) {
  const [options, filename] = utilities.getOptions();
  if (_.isEmpty(filename)) {
    throw new Error('Filename is empty');
  }
  const fn = module.exports[filename];
  console.log(_.isFunction(fn) ? fn() : fn);
}
