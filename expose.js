const http = require('http');
const {getOptions, pretty} = require('./utilities');

const [{port = 1989, help = false, color = false}] = getOptions();

function report(...args) {
  console.log('// ', ...args);
}

if (help) {
  console.log('script expose --color --port=8080');
  process.exit();
}

const server = http.createServer(function(req, res) {
  data = [];
  req.on('data', c => data.push(c));
  req.on('end', function() {
    res.writeHead(200, 'Accepted', {
      'content-type': 'application/json'
    });
    const r = {
      url: req.url,
      method: req.method,
      ip: req.connection.remoteAddress,
      headers: req.headers
    };
    if (data.length > 0) {
      r.body = JSON.parse(data.join(''));
    }
    console.log(color ? r : pretty(r));
    res.end(JSON.stringify(r));
  });
});

server.listen(+port, function() {
  report(`Listen at http://localhost:${port}/`);
});
