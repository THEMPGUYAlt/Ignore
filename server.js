// server.js
const { PeerServer } = require('peerjs');

// Use fixed port if process.env.PORT not set (local testing)
const PORT = process.env.PORT || 9000;

const server = PeerServer({
  port: PORT,
  path: '/',
  proxied: true,   // needed behind HTTPS reverse proxy like Render
  debug: true
});

console.log(`PeerJS server running on internal port ${PORT}`);
