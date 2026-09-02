const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// Serve static frontend files from 'Admin Login & Dashboard UI'
app.use(express.static(path.join(__dirname, '../Admin Login & Dashboard UI')));

// In-Memory Asset Storage
let assets = [
  {
    id: 1,
    assetName: 'Dell Latitude 3420',
    category: 'Hardware',
    status: 'In-Use',
    assignedTo: 'Mohammad Shakeel',
    userEmail: 'mdshakeel9696@gmail.com',
    date: new Date().toLocaleDateString()
  }
];

// Configure Nodemailer for mdshakeel9696@gmail.com
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mdshakeel9696@gmail.com',
    pass: process.env.GMAIL_APP_PASS || 'YOUR_GMAIL_APP_PASSWORD_HERE' // Add App Password here or set environment variable on Render
  }
});

// API: Get All Assets
app.get('/api/assets', (req, res) => {
  res.json(assets);
});

// API: Add Asset & Auto-Send Email
app.post('/api/assets', async (req, res) => {
  const { assetName, category, status, assignedTo, userEmail, senderEmail } = req.body;

  const newAsset = {
    id: Date.now(),
    assetName,
    category: category || 'Hardware',
    status: status || 'In-Use',
    assignedTo: assignedTo || 'Unassigned',
    userEmail: userEmail || 'mdshakeel9696@gmail.com',
    date: new Date().toLocaleDateString()
  };

  assets.push(newAsset);

  // Send Automatic Email
  if (userEmail) {
    const mailOptions = {
      from: `"Bonkers Corner IT Management" <${senderEmail || 'mdshakeel9696@gmail.com'}>`,
      to: userEmail,
      subject: `IT Asset Assigned: ${assetName}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h2 style="color: #1a73e8;">Bonkers Corner IT Asset Allocation</h2>
          <p>Hello <strong>${assignedTo}</strong>,</p>
          <p>A new IT asset has been assigned to you. Here are the details:</p>
          <ul>
            <li><strong>Asset Name:</strong> ${assetName}</li>
            <li><strong>Category:</strong> ${category}</li>
            <li><strong>Status:</strong> ${status}</li>
            <li><strong>Assigned Date:</strong> ${newAsset.date}</li>
          </ul>
          <p>Sender/Manager Email: <strong>${senderEmail || 'mdshakeel9696@gmail.com'}</strong></p>
          <hr />
          <p style="font-size: 12px; color: #777;">This is an automated notification from Bonkers Corner IT Asset Manager.</p>
        </div>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Auto-mail sent successfully to ${userEmail}`);
    } catch (err) {
      console.error('Failed to send email:', err.message);
    }
  }

  res.status(201).json({ success: true, message: 'Asset added & email processed!', asset: newAsset });
});

// Direct all requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../Admin Login & Dashboard UI/index.html'));
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});