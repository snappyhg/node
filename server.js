const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8080;

// Version lives in its own file (VERSION) and is injected into the page's {{VERSION}} placeholder.
// APP_VERSION env overrides the file if set. Bumping the version = edit VERSION only.
function readVersion() {
  if (process.env.APP_VERSION) return process.env.APP_VERSION.trim();
  try {
    return fs.readFileSync(path.join(__dirname, 'VERSION'), 'utf8').trim();
  } catch {
    return 'dev';
  }
}

// A second, runtime-injected value. Unlike VERSION (baked into the image), this comes from an
// env var supplied at deploy time via the app's Kubernetes Secret (envFrom). Lets us prove a
// secret change reaches the running container without a source change.
function readSecretMessage() {
  return (process.env.SECRET_MESSAGE || 'no secret set').trim();
}

function render() {
  const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  return html
    .replace(/\{\{VERSION\}\}/g, readVersion())
    .replace(/\{\{SECRET_MESSAGE\}\}/g, readSecretMessage());
}

const HTML = render();

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(HTML);
});

server.listen(PORT, () => {
  console.log(`listening on port ${PORT} (version ${readVersion()})`);
});
