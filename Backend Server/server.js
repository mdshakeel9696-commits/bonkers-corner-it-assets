const express = require('express');
const path = require('path');
const app = express();

// Middleware
app.use(express.json());

// Serve static files from root directory
app.use(express.static(__dirname));

// Direct root route to index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Dynamic port for Render deployment
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`IT Asset Server running on port ${PORT}`);
});