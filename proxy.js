/**
 * @author Taras Labiak <kissarat@gmail.com>
 */

const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const {promisify} = require('util');

const {
  origin = 'https://gist.githubusercontent.com',
  port = 3000,
  dir = null,
  prevent = 'text/plain',
  redirect = ''
} = process.argv
    .map(a => a.split('='))
    .filter(a => 2 === a.length && a[0].indexOf('--') === 0)
    .reduce((acc, a) => ({...acc, [a[0].slice(2)]: a[1]}), {});

const allowHeaders = ['content-type', 'content-length', 'cache-control', 'etag', 'date', 'last-modified', 'expires', 'location'];
const newHeaders = {
  'access-control-allow-origin': '*'
};

const extensions = {};

const server = http.createServer(function (req, res) {
  if (redirect && '/' === req.url) {
    res.writeHead(302, 'Found', {
      location: redirect
    });
    return void res.end();
  }
  const type = extensions[path.extname(req.url)];
  (0 === origin.indexOf('https:') ? https : http)
    .get(origin + req.url, async function (response) {
      const headers = {};
      for(const header of allowHeaders) {
        if (header in response.headers) {
          headers[header] = response.headers[header];
        }
      }
      Object.assign(headers, newHeaders);
      const oldType = headers['content-type'];
      if (!oldType || (type && oldType.indexOf(prevent) === 0)) {
        headers['content-type'] = type;
      }
      res.writeHead(response.statusCode, response.statusMessage, headers);
      if (dir) {
        const p = req.url.split('/');
        await promisify(fs.mkdir)(path.join(dir, ...p.slice(1, -1)), {recursive: true});
        response.pipe(fs.createWriteStream(path.join(dir, ...p.slice(1))));
      }
      response.pipe(res);
      console.log(req.url);
    });
});

`
text/html                             html htm shtml;
text/css                              css;
text/xml                              xml;
image/gif                             gif;
image/jpeg                            jpeg jpg;
application/javascript                js;
application/atom+xml                  atom;
application/rss+xml                   rss;

text/mathml                           mml;
text/plain                            txt;
text/vnd.sun.j2me.app-descriptor      jad;
text/vnd.wap.wml                      wml;
text/x-component                      htc;

image/png                             png;
image/tiff                            tif tiff;
image/vnd.wap.wbmp                    wbmp;
image/x-icon                          ico;
image/x-jng                           jng;
image/x-ms-bmp                        bmp;
image/svg+xml                         svg svgz;
image/webp                            webp;

application/font-woff                 woff;
application/java-archive              jar war ear;
application/json                      json;
application/mac-binhex40              hqx;
application/msword                    doc;
application/pdf                       pdf;
application/postscript                ps eps ai;
application/rtf                       rtf;
application/vnd.apple.mpegurl         m3u8;
application/vnd.ms-excel              xls;
application/vnd.ms-fontobject         eot;
application/vnd.ms-powerpoint         ppt;
application/vnd.wap.wmlc              wmlc;
application/vnd.google-earth.kml+xml  kml;
application/vnd.google-earth.kmz      kmz;
application/x-7z-compressed           7z;
application/x-cocoa                   cco;
application/x-java-archive-diff       jardiff;
application/x-java-jnlp-file          jnlp;
application/x-makeself                run;
application/x-perl                    pl pm;
application/x-pilot                   prc pdb;
application/x-rar-compressed          rar;
application/x-redhat-package-manager  rpm;
application/x-sea                     sea;
application/x-shockwave-flash         swf;
application/x-stuffit                 sit;
application/x-tcl                     tcl tk;
application/x-x509-ca-cert            der pem crt;
application/x-xpinstall               xpi;
application/xhtml+xml                 xhtml;
application/xspf+xml                  xspf;
application/zip                       zip;

application/octet-stream              bin exe dll;
application/octet-stream              deb;
application/octet-stream              dmg;
application/octet-stream              iso img;
application/octet-stream              msi msp msm;

application/vnd.openxmlformats-officedocument.wordprocessingml.document    docx;
application/vnd.openxmlformats-officedocument.spreadsheetml.sheet          xlsx;
application/vnd.openxmlformats-officedocument.presentationml.presentation  pptx;

audio/midi                            mid midi kar;
audio/mpeg                            mp3;
audio/ogg                             ogg;
audio/x-m4a                           m4a;
audio/x-realaudio                     ra;

video/3gpp                            3gpp 3gp;
video/mp2t                            ts;
video/mp4                             mp4;
video/mpeg                            mpeg mpg;
video/quicktime                       mov;
video/webm                            webm;
video/x-flv                           flv;
video/x-m4v                           m4v;
video/x-mng                           mng;
video/x-ms-asf                        asx asf;
video/x-ms-wmv                        wmv;
video/x-msvideo                       avi;
`
  .trim().split(/;\s*\n/)
  .map(s => s.trim().split(/\s+/))
  .forEach(([type, ...exts]) => exts.forEach(ext => extensions['.' + ext] = type));

server.listen(port);
