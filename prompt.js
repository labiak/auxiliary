const { exec } = require('child_process');
const qs = require('querystring');
const _ = require('basic');

module.exports = function prompt(name, ...args) {
  const strings = [];
  exec(name + args.map(a => _.fork(a, {
    object() {
      return qs.stringify(a, ' --').trim();
    },

    string: _.identity,
    default: '$string'
  })))
};
