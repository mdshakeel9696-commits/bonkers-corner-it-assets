const express = require('express');
const path = require('path');
const app = express();

// Enable JSON body parsing for API requests
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../Admin Login & Dashboard UI')));

// --- IN-MEMORY DATABASE STORAGE ---
let assets = [
  { id: 1, name: "Dell Latitude Laptop", type: "Laptop", serial: "DL12345", assignedTo: "Admin" }
];
let employees = [
  { id: 1, name: "System Admin", email: "admin@bonkerscorner.com" }
];

// --- API ENDPOINTS ---

// 1. Admin Login API
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'Password123') {
    return res.json({ success: true, message: 'Login successful' });
  }
  return res.status(401).json({ success: false, message: 'Invalid credentials' });
});

// 2. Fetch Assets API
app.get('/api/assets', (req, res) => {
  res.json(assets);
});

// 3. Add New Asset API
app.post('/api/assets', (req, res) => {
  const newAsset = { id: Date.now(), ...req.body };
  assets.push(newAsset);
  res.status(201).json({ success: true, asset: newAsset });
});

// 4. Fetch Employees API
app.get('/api/employees', (req, res) => {
  res.json(employees);
});

// 5. Add New Employee API
app.post('/api/employees', (req, res) => {
  const newEmployee = { id: Date.now(), ...req.body };
  employees.push(newEmployee);
  res.status(201).json({ success: true, employee: newEmployee });
});

// Fallback route to serve index.html for root requests
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Admin Login & Dashboard UI/index.html'));
});

// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Bonkers IT Asset Manager running on port ${PORT}`);
});