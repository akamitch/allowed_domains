const http = require('http');
const url = require('url');

const allowedDomains = [
  'testudo.top',
  'www.testudo.top',
  'testingzone.top',
  'www.testingzone.top'
];

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  if (parsedUrl.pathname === '/check' && parsedUrl.query.domain) {
    const domain = parsedUrl.query.domain;
    
    if (allowedDomains.includes(domain)) {
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Domain is allowed');
    } else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Domain is not allowed');
    }
  } else {
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
  }
});

const PORT = 5555;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});