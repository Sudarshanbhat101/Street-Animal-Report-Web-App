require("dotenv").config(); // Load environment variables
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const nodemailer = require("nodemailer");
const path = require("path");
const axios = require("axios");
const session = require('express-session');
const bcrypt = require('bcrypt');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// Add session middleware before your routes
app.use(session({
  secret: 'your-secret-key',  // Change this to a secure random string
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // set to true in production with HTTPS
}));

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/streetAnimalsDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Could not connect to MongoDB:", err));

// Mongoose Schema and Model
const reportSchema = new mongoose.Schema({
  animalType: { type: String, required: true },
  location: { type: String, required: true },
  status: { type: String, required: true },
  image: { type: String }, // Store the base64 string of the image or URL
  email: { type: String, required: true }, // Add email field to schema
  reportedAt: { type: Date, default: Date.now },
  resolved: { type: Boolean, default: false }, // New field to track resolution
});

const Report = mongoose.model("Report", reportSchema);

// Create transporter for Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail", // Use your preferred email service
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Admin credentials (in a real app, these should be in a database)
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123'; // Change this to a secure password

// Middleware to check if user is admin
const requireAdmin = (req, res, next) => {
  if (req.session.isAdmin) {
    next();
  } else {
    res.redirect('/login');
  }
};

// Login page route
app.get('/login', (req, res) => {
  res.render('login');
});

// Login form submission
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }
  
  res.render('login', { error: 'Invalid credentials' });
});

// Logout route
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

// Routes
app.get("/", (req, res) => {
  res.render("home");
});

app.get("/report", (req, res) => {
  res.render("report");
});

app.post("/report", async (req, res) => {
  try {
    // Validate required fields
    const { animalType, location, status, image, email } = req.body;
    
    if (!animalType || !location || !status || !image || !email) {
      return res.status(400).json({ 
        error: "All fields are required including image and location" 
      });
    }

    // Validate email format
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: "Please enter a valid email address" 
      });
    }

    // Validate location format (should be "latitude, longitude")
    const locationRegex = /^-?\d+(\.\d+)?,\s*-?\d+(\.\d+)?$/;
    if (!locationRegex.test(location)) {
      return res.status(400).json({ 
        error: "Invalid location format" 
      });
    }

    // Validate image format (should be a base64 string)
    if (!image.startsWith('data:image/')) {
      return res.status(400).json({ 
        error: "Invalid image format" 
      });
    }

    // Get readable address from OpenStreetMap
    const [latitude, longitude] = location.split(',').map(coord => coord.trim());
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    const readableLocation = data.display_name || location;

    // Create and save the report
    const report = new Report({
      animalType,
      location,
      status,
      image,
      email,
      reportedAt: new Date(),
      resolved: false
    });

    await report.save();

    // Send confirmation email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Report Submitted Successfully",
      html: `
        <h2>Thank you for your report!</h2>
        <p>Your report has been submitted successfully. Here are the details:</p>
        <ul>
          <li>Animal Type: ${animalType}</li>
          <li>Condition: ${status}</li>
          <li>Location: ${readableLocation}</li>
          <li>Reported At: ${new Date().toLocaleString()}</li>
        </ul>
        <p>We will review your report and take necessary action.</p>
      `
    };

    await transporter.sendMail(mailOptions);

    // Prepare report data for success page
    const reportData = {
      animalType,
      status,
      email,
      reportedAt: new Date(),
      resolved: false,
      image,
      readableLocation
    };

    res.render("success", { report: reportData });
  } catch (error) {
    console.error("Error submitting report:", error);
    res.status(500).json({ 
      error: "An error occurred while submitting the report. Please try again." 
    });
  }
});

// Route to view all submitted reports
app.get("/view-reports", async (req, res) => {
  try {
    const reports = await Report.find(); // Fetch all reports from the database

    // Convert the location to a human-readable address
    for (const report of reports) {
      if (report.location && report.location.includes(",")) {
        const [lat, lng] = report.location.split(",");
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat.trim()}&lon=${lng.trim()}&format=json`
          );
          report.readableLocation = response.data.display_name || "Unknown Address";
        } catch (error) {
          report.readableLocation = "Unable to retrieve address";
        }
      } else {
        report.readableLocation = "No Location";
      }
    }

    res.render("view-reports", { reports });
  } catch (err) {
    res.status(500).send("Error fetching reports: " + err.message);
  }
});

// Route to view admin page with tick mark feature
app.get("/admin", requireAdmin, async (req, res) => {
  try {
    const reports = await Report.find(); // Fetch all reports from the database

    // Convert the location to a human-readable address
    for (const report of reports) {
      if (report.location && report.location.includes(",")) {
        const [lat, lng] = report.location.split(",");
        try {
          const response = await axios.get(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat.trim()}&lon=${lng.trim()}&format=json`
          );
          report.readableLocation = response.data.display_name || "Unknown Address";
        } catch (error) {
          report.readableLocation = "Unable to retrieve address";
        }
      } else {
        report.readableLocation = "No Location";
      }
    }

    res.render("admin-reports", { reports });
  } catch (err) {
    res.status(500).send("Error fetching reports: " + err.message);
  }
});

// Route to mark a report as resolved and send an email to the user
app.post("/admin/resolve/:id", async (req, res) => {
  const reportId = req.params.id;

  try {
    const report = await Report.findById(reportId);

    // Mark report as resolved
    report.resolved = true;
    await report.save();

    // Fetch readable address for location
    let readableLocation = "Unknown Address";
    if (report.location && report.location.includes(",")) {
      const [lat, lng] = report.location.split(",");
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?lat=${lat.trim()}&lon=${lng.trim()}&format=json`
        );
        readableLocation = response.data.display_name || "Unknown Address";
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    } else {
      readableLocation = "No Location Provided";
    }

    // Send email to the user notifying them of the resolution
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: report.email,
      subject: "Your Report Has Been Resolved",
      text: `Hello, \n\nYour reported animal case has been resolved.\n\nDetails:\nAnimal Type: ${report.animalType}\nLocation: ${readableLocation}\nStatus: ${report.status}\n\nThank you for reporting the issue. We appreciate your contribution to keeping the community safe.`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Resolution email sent: " + info.response);
      }
    });

    res.redirect("/admin"); // Redirect back to the admin page
  } catch (err) {
    res.status(500).send("Error updating report: " + err.message);
  }
});

// Start Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
