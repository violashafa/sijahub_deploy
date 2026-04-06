const https = require('https');
const fs = require('fs');
const path = require('path');
const app = require('./src/app');

// Konfigurasi SSL/TLS
const sslOptions = {
  // Pastikan nama file sesuai dengan hasil npx mkcert tadi
  key: fs.readFileSync(path.join(__dirname, 'cert.key')), 
  cert: fs.readFileSync(path.join(__dirname, 'cert.crt'))
};

const PORT = process.env.PORT || 5000;

// Menjalankan server HTTPS (Bukan app.listen biasa)
https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`   SIJAHUB SECURE SERVER IS RUNNING      `);
  console.log(`   URL: https://localhost:${PORT}            `);
  console.log(`=============================================`);
});