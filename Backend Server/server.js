const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simulated Admin Credential Database & Password Reset Store
let adminCredentials = {
    username: "admin",
    password: "Password123",
    email: "admin@bonkerscorner.com"
};

// Configure Nodemailer for Automated Asset Assignment Emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-admin-email@gmail.com',
        pass: process.env.EMAIL_PASS || 'your-email-app-password'
    }
});

// Admin Login Endpoint
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (username === adminCredentials.username && password === adminCredentials.password) {
        res.json({ success: true, message: "Authentication successful" });
    } else {
        res.status(401).json({ success: false, message: "Invalid username or password" });
    }
});

// Password Reset Endpoint
app.post('/api/reset-password', (req, res) => {
    const { email, newPassword } = req.body;
    if (email === adminCredentials.email) {
        adminCredentials.password = newPassword;
        res.json({ success: true, message: "Password updated successfully" });
    } else {
        res.status(404).json({ success: false, message: "Admin email not found" });
    }
});

// Asset Creation & Automated Email Notification Endpoint
app.post('/api/assets', (req, res) => {
    const { name, assetTag, category, status, userEmail, location } = req.body;

    // If asset is assigned and user email is provided, send automatic notification
    if (status === 'in-use' && userEmail) {
        const mailOptions = {
            from: 'Bonkers Corner IT <no-reply@bonkerscorner.com>',
            to: userEmail,
            subject: `IT Asset Assigned: ${name} (${assetTag})`,
            text: `Hello,\n\nA new IT asset has been assigned to your profile under Bonkers Corner IT Assets.\n\nAsset Name: ${name}\nAsset Tag: ${assetTag}\nCategory: ${category}\nLocation: ${location}\n\nPlease reach out to IT support if you have any questions.\n\nRegards,\nBonkers Corner IT Team`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error('Error sending automated email:', error);
            } else {
                console.log('Automated asset assignment email sent:', info.response);
            }
        });
    }

    res.status(201).json({ success: true, message: 'Asset created and processed successfully' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Bonkers Corner IT server running on port ${PORT}`);
});