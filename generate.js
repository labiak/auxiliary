const pkg = require('./package');
const _ = require('./basic');
const utilities = require('./utilities');

module.exports = {
  "README.md": _.strip(`
    # ${pkg.name}
    ${pkg.description}
  `)
};

if (!module.parent) {
  const [options, filename] = utilities.getOptions();
  console.log(module.exports[filename]);
}
