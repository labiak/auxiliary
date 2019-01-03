const fs = require('fs');
const path = require('path');

module.exports = {
    *walk(dir) {
        for(const name of fs.readdirSync(dir)) {
            yield path.join(dir, name);
        }
    }
}
