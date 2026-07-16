const http = require('http');
const os = require('os');

const PORT = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  const body = {
    message: 'hello world v6',
    hostname: os.hostname(),
    time: new Date().toISOString(),
    path: req.url,
  };
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body, null, 2));
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
