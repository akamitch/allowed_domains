const http = require('http');
const url = require('url');
const fs = require('fs');

// Read allowed domains from file
function readAllowedDomains(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return new Set(data.split('\n').map(domain => domain.trim().toLowerCase()).filter(Boolean));
  } catch (err) {
    console.error('Error reading allowed domains file:', err);
    return new Set();
  }
}

// Path to the file containing allowed domains
const allowedDomainsFilePath = './domains100.txt';

// Read allowed domains
let allowedDomains = readAllowedDomains(allowedDomainsFilePath);

// Function to check if a domain is allowed
function isDomainAllowed(domain) {
  domain = domain.toLowerCase().replace(/^www\./, '');
  return allowedDomains.has(domain);
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  console.log(`parsedUrl: ${parsedUrl}`);  
  
  if (parsedUrl.pathname === '/check' && parsedUrl.query.domain) {
    const domain = parsedUrl.query.domain;
    
    if (isDomainAllowed(domain)) {
      console.log(`${domain} Domain is allowed`);  
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('Domain is allowed');
    } else {
      console.log(`${domain} Domain is NOT allowed`);  
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Domain is not allowed');
    }
  } else {
    console.log(`parsedUrl: ${parsedUrl} Bad Request!!!!!`);  
    res.writeHead(400, { 'Content-Type': 'text/plain' });
    res.end('Bad Request');
  }
});

const PORT = 5555;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// Optionally, you can add a file watcher to reload domains if the file changes
fs.watch(allowedDomainsFilePath, (eventType, filename) => {
  if (eventType === 'change') {
    console.log('Allowed domains file changed. Reloading...');
    allowedDomains = readAllowedDomains(allowedDomainsFilePath);
  }
});