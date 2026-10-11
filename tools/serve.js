// Zero-dependency dev server for the Feast of Hymns site.
// Serves the project folder at http://localhost:5500
// Usage: npm run dev   (or: node tools/serve.js)
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PORT = process.env.PORT || 5500;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jsx': 'text/plain; charset=utf-8',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.md': 'text/plain; charset=utf-8'
};

http.createServer((req, res) => {
  let urlPath = decodeURIComponent(req.url.split('?')[0]);
  if (urlPath === '/') urlPath = '/index.html';

  const file = path.normalize(path.join(ROOT, urlPath));
  if (!file.startsWith(ROOT)) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  fs.readFile(file, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found: ' + urlPath);
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(data);
  });
}).on('error', err => {
  if (err.code === 'EADDRINUSE') {
    console.log('Port ' + PORT + ' is already in use — the site is most likely already running.');
    console.log('Open http://localhost:' + PORT + ' in your browser, or close the other instance first.');
  } else {
    console.error(err);
    process.exit(1);
  }
}).listen(PORT, () => {
  console.log('Feast of Hymns site serving at http://localhost:' + PORT);
});
