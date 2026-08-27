const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// Serve static assets from the frontend folder
app.use(express.static(path.join(__dirname, '../Admin Login & Dashboard UI')));

// Send index.html when visitors access the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../Admin Login & Dashboard UI/index.html'));
});

// Fallback route for any unhandled requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Admin Login & Dashboard UI/index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});