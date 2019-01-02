function conveyor(...operations) {
  return function (object, ...args) {
    for(const operation of operations) {
      object = operation(object, ...args);
    }
    return object;
  }
}

module.exports = {conveyor};
