const app = require('./src/app');
const PORT = process.env.PORT || 5000;

// Pakai app.listen biasa (HTTP Mode)
app.listen(PORT, () => {
  console.log(`=============================================`);
  console.log(`   SIJAHUB SERVER IS RUNNING (HTTP MODE)     `);
  console.log(`   PORT: ${PORT}                             `);
  console.log(`=============================================`);
});