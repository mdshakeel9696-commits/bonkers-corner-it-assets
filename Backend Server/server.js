const path = require('path');

// Point to index.html in the 'Admin Login & Dashboard UI' directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Admin Login & Dashboard UI/index.html'));
});

// Serve all static assets (CSS, JS, images) from that folder as well
app.use(express.static(path.join(__dirname, '../Admin Login & Dashboard UI')));